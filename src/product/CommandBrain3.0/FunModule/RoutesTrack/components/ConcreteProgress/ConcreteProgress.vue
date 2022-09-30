<template>
  <div
    :class="$style.container"
  >
    <template v-if="startTime && endTime">
      <!-- 1. 起点时间 -->
      <span :class="$style.time">{{ startTime.split(' ')[1] }}</span>
      <!-- 2. 进度条 -->
      <div
        ref="progressRef"
        :class="$style.progress"
        @click="moveSlider"
        @mouseover="handleHover"
        @mousemove="handleHover"
        @mouseleave="hoverPopupTime = ''"
      >
        <!-- 2-A. 滑块 -->
        <button
          :class="$style.slider"
          :style="{
            left: sliderPositionLeft,
          }"
          @click.stop
          @mousedown="beginDragging"
        >
          <!-- 滑块气泡 -->
          <div :class="$style.popup">
            {{ currentRecord?.reportTime.split(' ')[1] }}
          </div>
        </button>
        <!-- 2-B. 预览气泡 -->
        <div
          v-if="hoverPopupTime"
          :class="$style.hoverPopup"
          :style="{
            left: hoverPopupLeft,
          }"
        >
          <div :class="$style.popup">
            {{ hoverPopupTime }}
          </div>
        </div>
        <div :class="$style.fragWrapper">
          <!-- 2-C. 关键点 -->
          <div
            v-for="(point, pointIndex) in keyPoints"
            :key="`keypoint_${pointIndex}`"
            :style="point"
            :class="$style.keyPoint"
          />
          <!-- 2-D. 离线片段 -->
          <div
            v-for="(frag, fragIndex) in offlineFrags"
            :key="`frag_${fragIndex}`"
            :style="frag"
            :class="$style.offlineFrag"
          />
        </div>
      </div>
      <!-- 3. 终点时间 -->
      <span :class="$style.time">{{ endTime.split(' ')[1] }}</span>
    </template>
    <div
      v-else
      style="text-align: center; width: 100%;"
    >
      暂无数据
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  watch,
} from 'vue';
import { RoutesRecordItem } from '../../scripts/useRoutesRecord';

export default defineComponent({
  name: 'ConcreteProgress',
  props: {
    // 轨迹记录
    routesRecord: {
      type: Array as PropType<RoutesRecordItem[]>,
      default: () => [],
    },
    // 播放速率
    speedRatio: {
      type: Number,
      default: 1,
    },
    // 是否正在播放
    isPlaying: {
      type: Boolean,
      default: true,
    },
    // 当前记录的数组索引
    modelValue: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'update:modelValue',
    'update:isPlaying',
  ],
  setup(props, { emit }) {
    const progressRef = ref<HTMLDivElement>();
    const startTime = computed(() => props.routesRecord[0]?.reportTime);
    const endTime = computed(() => props.routesRecord[props.routesRecord.length - 1]?.reportTime);
    const timeRange = computed(() => new Date(endTime.value).getTime() - new Date(startTime.value).getTime());
    const getPercentage = (time: string) => (100 * (new Date(time).getTime() - new Date(startTime.value).getTime())) / timeRange.value;

    // 滑块位置
    const sliderPositionLeft = ref('0%');

    // 当前的记录项
    const currentRecord = computed(() => props.routesRecord?.[props.modelValue]);

    // 记录项变化，移动滑块
    watch(currentRecord, (newVal) => {
      sliderPositionLeft.value = `${getPercentage(newVal.reportTime)}%`;
    });

    // 移动间隔
    let deltaTime = 0;
    // 循环执行滑块移动
    (function doRun() {
      let prevTime = 0;
      const runner = (curTime: number) => {
        if (props.isPlaying) {
          if (curTime - prevTime >= deltaTime) {
            prevTime = curTime;
            const nextIndex = props.routesRecord.findIndex((item, index) => index > props.modelValue && item.type !== -1);
            emit('update:modelValue', nextIndex === -1 ? props.routesRecord?.length - 1 : nextIndex);
            deltaTime = props.routesRecord?.[props.modelValue]?.type === 2
              // 任务上报固定停留3秒
              ? 3 * 1000
              : Math.floor(1000 / props.speedRatio);
          }
        }
        requestAnimationFrame(runner);
      };
      requestAnimationFrame(runner);
    }());

    // 鼠标点击、移动事件时触发滑块跳转
    const moveSlider = (e: MouseEvent) => {
      // 1. 计算点击位置相对整个进度条的百分比，并计算该位置对应的时间
      const progressRect = progressRef.value!.getBoundingClientRect();
      const percentage = (e.clientX - progressRect.x) / progressRect.width;
      const approximatelyDateTime = new Date(percentage * timeRange.value + new Date(startTime.value).getTime()).getTime();

      // 2. 找出与对应时间最相近的一条数据
      let newIndex = props.routesRecord.findIndex((item) => new Date(item.reportTime).getTime() >= approximatelyDateTime && item.type !== -1);
      if (newIndex !== -1) {
        const curDateTime = new Date(props.routesRecord[newIndex]?.reportTime).getTime();
        let prevDateTime = new Date(props.routesRecord[0]?.reportTime).getTime();
        let prevIndex = 0;
        for (let i = newIndex - 1; i >= 0; i -= 1) {
          if (props.routesRecord[i].type !== -1) {
            prevIndex = i;
            prevDateTime = new Date(props.routesRecord[i].reportTime).getTime();
          }
          break;
        }
        // 比较前后两条数据，取最近的一条数据
        if (curDateTime - approximatelyDateTime > approximatelyDateTime - prevDateTime) {
          newIndex = prevIndex;
        }
        emit('update:modelValue', newIndex);
        deltaTime = props.routesRecord[newIndex].type === 2
          // 任务上报固定停留3秒
          ? 3 * 1000
          : Math.floor(1000 / props.speedRatio);
      } else {
        emit('update:modelValue', props.routesRecord.length - 1);
      }
    };

    // 滑块停止拖动
    const mouseupHandler = () => {
      document.removeEventListener('mousemove', moveSlider, false);
      document.removeEventListener('mouseup', mouseupHandler, false);
    };

    // 滑块开始拖动
    const beginDragging = () => {
      emit('update:isPlaying', false);
      document.addEventListener('mousemove', moveSlider, false);
      document.addEventListener('mouseup', mouseupHandler, false);
    };

    // 悬浮预览气泡
    const hoverPopupTime = ref('');
    const hoverPopupLeft = ref('');
    const handleHover = (e: MouseEvent) => {
      const progressRect = progressRef.value!.getBoundingClientRect();
      const percentage = (e.clientX - progressRect.x) / progressRect.width;
      const hoverPopupDateTime = new Date(percentage * timeRange.value + new Date(startTime.value).getTime());
      hoverPopupLeft.value = `${percentage * 100}%`;
      hoverPopupTime.value = `${
        String(hoverPopupDateTime.getHours()).padStart(2, '0')
      }:${
        String(hoverPopupDateTime.getMinutes()).padStart(2, '0')
      }:${
        String(hoverPopupDateTime.getSeconds()).padStart(2, '0')
      }`;
    };

    // 关键点列表
    const keyPoints = computed(() => props.routesRecord
      // 任务上报关键点
      .filter((item) => item.type === 2)
      .map((item) => ({
        backgroundColor: '#FF7A45',
        left: `${getPercentage(item.reportTime)}%`,
      })));

    // 离线片段
    const offlineFrags = computed(() => props.routesRecord
      .filter((item) => item.type === -1)
      .map((item) => ({
        width: `${getPercentage(props.routesRecord[props.routesRecord.indexOf(item) + 1]?.reportTime) - getPercentage(item.reportTime)}%`,
        left: `${getPercentage(item.reportTime)}%`,
      })));

    return {
      progressRef,
      startTime,
      endTime,
      currentRecord,
      sliderPositionLeft,
      moveSlider,
      beginDragging,
      hoverPopupTime,
      hoverPopupLeft,
      handleHover,
      keyPoints,
      offlineFrags,
    };
  },
});
</script>

<style lang="scss" module src="./styles/ConcreteProgress.scss" />
