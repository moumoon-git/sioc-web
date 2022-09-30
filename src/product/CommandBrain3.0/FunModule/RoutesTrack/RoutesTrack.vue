<template>
  <teleport to="body">
    <div :class="$style.container">
      <!-- 顶部日期 -->
      <header :class="$style.header">
        <DateSwitcher
          :class="$style.dateSwitcher"
          @change="changeDate"
        />
        <button
          :class="$style.closeBtn"
          @click="closeRoutesTrack"
        />
      </header>
      <!-- 标签类型列表 -->
      <div :class="$style.labelTypeList">
        <!-- <span style="color: #7F6AFF;">事件上报</span> -->
        <span style="color: #FF7A45;">任务反馈</span>
        <!-- <span style="color: #0BD295;">打卡签到</span> -->
        <!-- <span style="color: #F66E6E;">类型4</span> -->
        <!-- <span style="color: #56E9FF;">类型5</span> -->
      </div>
      <!-- 进度条 -->
      <ConcreteProgress
        v-model="currentRecordIndex"
        v-model:is-playing="isPlaying"
        :routes-record="routesRecord"
        :speed-ratio="speedRatio"
      />
      <!-- 控制按钮 -->
      <footer :class="$style.footer">
        <!-- 开始/暂停 -->
        <button
          :class="isPlaying ? $style.pause : $style.play"
          @click="togglePlay"
        />
        <div :class="$style.whiteLine" />
        <!-- 跳转起始点 -->
        <button
          :class="$style.start"
          @click="currentRecordIndex = 0;"
        />
        <!-- 跳转终点 -->
        <button
          :class="$style.end"
          @click="currentRecordIndex = Math.max(0, routesRecord.length - 1);"
        />
        <!-- 播放速度 -->
        <div style="margin-left: auto;">
          <span>播放速度：</span>
          <button
            :class="$style.textBtn"
            :style="{
              'margin-right': '20px',
              color: speedRatio === 1 ? '#56E9FF' : '',
            }"
            @click="speedRatio = 1;"
          >
            X1
          </button>
          <button
            :class="$style.textBtn"
            :style="{
              color: speedRatio === 4 ? '#56E9FF' : '',
            }"
            @click="speedRatio = 4;"
          >
            X4
          </button>
        </div>
      </footer>
    </div>
  </teleport>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
} from 'vue';
// 日期切换
import DateSwitcher from '@/product/CommandBrain3.0/Generalparts/left/DateSwitcher/DateSwitcher.vue';
// 进度条
import ConcreteProgress from './components/ConcreteProgress/ConcreteProgress.vue';
import { closeRoutesTrack } from './scripts/useRoutesTrack';
import useRoutesRecord, { today } from './scripts/useRoutesRecord';
import useDrawRoutes from './scripts/useDrawRoutes';

export default defineComponent({
  // 轨迹跟踪
  name: 'RoutesTrack',
  components: {
    DateSwitcher,
    ConcreteProgress,
  },
  setup() {
    // 正在播放
    const isPlaying = ref(true);
    // 暂停/播放
    const togglePlay = () => {
      isPlaying.value = !isPlaying.value;
    };
    // 播放速度
    const speedRatio = ref(1);

    const [
      // 轨迹记录
      routesRecord,
      // 获取轨迹记录
      getRoutesRecord,
    ] = useRoutesRecord();
    const {
      // 绘制轨迹、关键点
      drawLine,
      // 绘制人、设备落点
      drawMarker,
    } = useDrawRoutes();

    // 轨迹记录列表变更，更新路径
    watch(routesRecord, (newVal) => {
      drawLine(newVal);
    }, {
      deep: true,
      immediate: true,
    });

    // 当前的记录项索引
    const currentRecordIndex = ref(0);

    // 绘制当前记录项的标注
    watch(currentRecordIndex, (newVal) => {
      drawMarker(routesRecord.value[newVal]);
    }, { immediate: true });

    // 刷新今天数据的定时器
    let refreshTodayTimer: number;
    /**
     * 切换日期，获取数据，进度设置到100%
     *
     * @param newDate yyyy-MM-dd 的字符串
     */
    function changeDate(newDate: string) {
      clearTimeout(refreshTodayTimer);
      // 获取数据
      getRoutesRecord({
        date: newDate,
      });

      // 如果时间是今天，每 10s 刷新一次数据
      if (newDate === today) {
        refreshTodayTimer = window.setTimeout(() => {
          getRoutesRecord({
            date: newDate,
          });
        }, 10 * 1000);
      } else {
        // 否则，重置为第一条数据
        currentRecordIndex.value = 0;
      }
    }
    // 初始化数据
    changeDate(today);

    return {
      currentRecordIndex,
      isPlaying,
      togglePlay,
      speedRatio,
      closeRoutesTrack,
      getRoutesRecord,
      routesRecord,
      changeDate,
    };
  },
});
</script>

<style lang="scss" module src="./styles/RoutesTrack.scss" />
