// 实时视频外层容器
<template>
  <div :class="$style.videoIndex">
    <div :class="$style.videoIndex__header">
      <div :class="$style.videoIndex__header__title">
        重点视频区域
      </div>
      <div :class="$style.videoIndex__header__buttons">
        <div
          :class="$style.videoIndex__header__buttons__item"
          @click="openSelectGroupPop"
        >
          {{ selectBtn }}:{{ groupName }} ({{ videoNum }})
        </div>
        <div :class="$style.videoIndex__header__buttons__item">
          <div :class="$style.videoIndex__header__buttons__item__title">
            单画面巡查时间
          </div>
          <div :class="$style.videoIndex__header__buttons__item__list">
            <div
              :class="$style.videoIndex__header__buttons__item__list__select"
              @click="openSelectTimePop"
            >
              {{ timeBtn }}
            </div>
          </div>
          <div
            :class="$style.videoIndex__header__buttons__item__stop"
            @click="stopTimer"
          >
            {{ pollingButton }}
          </div>
        </div>
        <div :class="$style.videoIndex__header__buttons__item">
          <div
            v-for="(item,index) in allModes"
            :key="index"
            :class="[$style.modeSquare,{ [$style[`modeActive--${item}`]]: item === modeIsActive }]"
            @click="changeModeNew(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div
      ref="videoIndexRef"
      :class="$style.videoIndex__content"
    >
      <div
        v-if="selectMode === 1"
        :class="$style.videoIndex__content__1"
      >
        <VideoItem
          v-for="(item,index) in displayVideos"
          :key="index"
          :dom-id="index"
          :width="`2060px`"
          :height="`910px`"
          :video-name="item.name"
        />
      </div>
      <div
        v-if="selectMode === 4"
        :class="$style.videoIndex__content__4"
      >
        <VideoItem
          v-for="(item,index) in displayVideos"
          :key="index"
          :dom-id="index"
          :width="`1020px`"
          :height="`465px`"
          :video-name="item.name"
          :code="item.code"
        />
      </div>
      <div
        v-if="selectMode === 6 && displayVideos.length !== 0"
        :class="$style.videoIndex__content__6"
      >
        <div :class="$style.top">
          <div :class="$style.topLeft">
            <VideoItem
              :key="0"
              :dom-id="0"
              :width="`1387px`"
              :height="`600px`"
              :video-name="displayVideos[0].name"
              :code="displayVideos[0].code"
            />
          </div>
          <div :class="$style.topRight">
            <div :class="$style.topRightItem">
              <VideoItem
                :key="1"
                :dom-id="1"
                :width="`688px`"
                :height="`295px`"
                :video-name="displayVideos[1].name"
                :code="displayVideos[1].code"
              />
            </div>
            <div :class="$style.topRightItem">
              <template v-if="displayVideos.length > 2">
                <VideoItem
                  :key="2"
                  :dom-id="2"
                  :width="`688px`"
                  :height="`295px`"
                  :video-name="displayVideos[2].name"
                  :code="displayVideos[2].code"
                />
              </template>
            </div>
          </div>
        </div>
        <div :class="$style.bottom">
          <div :class="$style.bottomL">
            <template v-if="displayVideos.length > 3">
              <VideoItem
                :key="3"
                :dom-id="3"
                :width="`688px`"
                :height="`350px`"
                :video-name="displayVideos[3].name"
                :code="displayVideos[3].code"
              />
            </template>
          </div>
          <div :class="$style.bottomL">
            <template v-if="displayVideos.length > 4">
              <VideoItem
                :key="4"
                :dom-id="4"
                :width="`688px`"
                :height="`350px`"
                :video-name="displayVideos[4].name"
                :code="displayVideos[4].code"
              />
            </template>
          </div>
          <div :class="$style.bottomL">
            <template v-if="displayVideos.length > 5">
              <VideoItem
                :key="5"
                :dom-id="5"
                :width="`688px`"
                :height="`350px`"
                :video-name="displayVideos[5].name"
                :code="displayVideos[5].code"
              />
            </template>
          </div>
        </div>
      </div>
      <div
        v-if="selectMode === 8 && displayVideos.length !== 0"
        :class="$style.videoIndex__content__8"
      >
        <div :class="$style.top">
          <div :class="$style.topL">
            <VideoItem
              :key="0"
              :dom-id="0"
              :width="`1570px`"
              :height="`670px`"
              :video-name="returnArrayItemByIndex(displayVideos, 0).name"
              :code="returnArrayItemByIndex(displayVideos, 0).code"
            />
          </div>
          <div :class="$style.topR">
            <div :class="$style.topRItem">
              <VideoItem
                :key="1"
                :dom-id="1"
                :width="`514px`"
                :height="`219px`"
                :video-name="returnArrayItemByIndex(displayVideos, 1).name"
                :code="returnArrayItemByIndex(displayVideos, 1).code"
              />
            </div>
            <div :class="$style.topRItem">
              <VideoItem
                :key="2"
                :dom-id="2"
                :width="`514px`"
                :height="`219px`"
                :video-name="returnArrayItemByIndex(displayVideos, 2).name"
                :code="returnArrayItemByIndex(displayVideos, 2).code"
              />
            </div>
            <div :class="$style.topRItem">
              <VideoItem
                :key="3"
                :dom-id="3"
                :width="`514px`"
                :height="`219px`"
                :video-name="returnArrayItemByIndex(displayVideos, 3).name"
                :code="returnArrayItemByIndex(displayVideos, 3).code"
              />
            </div>
          </div>
        </div>
        <div :class="$style.bottom">
          <div :class="$style.bottomItem">
            <VideoItem
              :key="4"
              :dom-id="4"
              :width="`514px`"
              :height="`290px`"
              :video-name="returnArrayItemByIndex(displayVideos, 4).name"
              :code="returnArrayItemByIndex(displayVideos, 4).code"
            />
          </div>
          <div :class="$style.bottomItem">
            <VideoItem
              :key="5"
              :dom-id="5"
              :width="`514px`"
              :height="`290px`"
              :video-name="returnArrayItemByIndex(displayVideos, 5).name"
              :code="returnArrayItemByIndex(displayVideos, 5).code"
            />
          </div>
          <div :class="$style.bottomItem">
            <VideoItem
              :key="6"
              :dom-id="6"
              :width="`514px`"
              :height="`290px`"
              :video-name="returnArrayItemByIndex(displayVideos, 6).name"
              :code="returnArrayItemByIndex(displayVideos, 6).code"
            />
          </div>
          <div :class="$style.bottomItem">
            <VideoItem
              :key="7"
              :dom-id="7"
              :width="`514px`"
              :height="`290px`"
              :video-name="returnArrayItemByIndex(displayVideos, 7).name"
              :code="returnArrayItemByIndex(displayVideos, 7).code"
            />
          </div>
        </div>
      </div>
      <div
        v-if="selectMode === 9"
        :class="$style.videoIndex__content__9"
      >
        <VideoItem
          v-for="(item,index) in displayVideos"
          :key="index"
          :dom-id="index"
          :type="9"
          :width="`674px`"
          :height="`323px`"
          :video-name="item.name"
        />
      </div>
    </div>
  </div>
  <!-- 选择视频分组弹窗 -->
  <SelectVideo ref="SelectVideoRef" />
  <!-- 选择时间弹窗 -->
  <SelectTime
    ref="SelectTimeRef"
    :list="options"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  watch,
  onMounted,
  nextTick,
} from 'vue';
import { useStore } from 'vuex';
import VideoItem from './components/VideoItem.vue'; // 视频组件
import SelectVideo from './components/SelectVideo.vue'; // 选择视频分组弹窗
import SelectTime from './components/SelectTime.vue'; // 选择时间弹窗
import Select from '../EmergencyAdmin/OverallRun/components/Select/Select.vue'; // 下拉列表组件
import useVideoIndexFun from './scripts/videoIndex';
import {
  queryMeetingStatus
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS'; // 链接uds发送方法

export default defineComponent({
  components: {
    VideoItem, // 视频组件
    SelectVideo, // 选择监控分组弹窗
    // Select, // 时间选择
    SelectTime, // 选择时间弹窗
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http, $video }: any = instance?.appContext.config.globalProperties;
    const store = useStore();
    const {
      allModes, // 所有的模式
      options, // 轮询时间
      selectMode, // 所选模式
      timeValue, // 所选择的时间
      displayVideos, // 当前定时循环正在显示的数据
      pollingButton, // 巡查按钮
      changeModeEmitFun,
      startPolling, // 启动轮询
      returnArrayItemByIndex, // 返回对应数组元素
      stopTimer, // 暂停定时器
      changeTime, // 切换轮询时间
      videoIndexRef, // 右侧视频模块dom
      initUdsVideoWall, // 初始化视频墙
      restartVideoFromStorage, // 读取缓存数据设置新的轮询数据并开始轮询
    } = useVideoIndexFun($video); // 首页
    const timeBtn: any = ref('30秒');
    const SelectVideoRef = ref<null>(null); // 选择视频分组弹窗
    /**
     * @desc 打开选择分组弹窗
     * @param {}
     * @returns {} returns
     */
    const openSelectGroupPop = () => {
      (SelectVideoRef.value as any).open();
      (SelectVideoRef.value as any).getVideoGroups();
    };
    /**
     * @desc 打开选择时间弹窗
     * @param {} params
     * @returns {} returns
     */
    const SelectTimeRef = ref<null>(null); // 选择时间弹窗
    const openSelectTimePop = () => {
      (SelectTimeRef.value as any).open();
    };
    /**
     * @desc 改变模式
     * @param {} params
     * @returns {} returns
     */
    const modeIsActive = ref(10);
    const changeModeNew = (mode: number) => {
      console.log(mode);
      modeIsActive.value = mode;
      changeModeEmitFun(mode);
    };
    async function startUdsWall() {
      await initUdsVideoWall();
      // restartVideoFromStorage();
    }
    /**
     * @desc 返回时间按钮的内容
     * @param {} params
     * @returns {} returns
     */
    const tempObj = new Map();
    tempObj.set(30000, '30秒');
    tempObj.set(60000, '1分钟');
    tempObj.set(180000, '3分钟');
    tempObj.set(300000, '5分钟');
    tempObj.set(420000, '7分钟');
    tempObj.set(540000, '9分钟');
    const returnTimeBtn = (num: number) => tempObj.get(num);
    const groupName = ref('暂未选择'); // 所选分组的分组名
    const videoNum = ref(0); // 所选分组的总视频数
    const selectBtn = ref('选择监控'); // 选择按钮文字
    const optionArr = [60000, 180000, 300000, 420000, 540000]; // 轮询时间
    // 监听所选择的分组
    watch(
      () => store.state.selectGroupName,
      (val, old) => {
        if (val) {
          groupName.value = store.state.selectGroupName;
          videoNum.value = store.state.selectedVideoArr.length;
          startPolling();
        } else {
          stopTimer();
          groupName.value = '暂未选择';
          selectBtn.value = '选择监控';
          videoNum.value = 0;
          console.log(val, '大屏选择的分组名');
        }
      },
      {
        immediate: false,
      },
    );
    // 监听所选择的模式
    watch(
      () => store.state.selectPollingMode,
      (val, old) => {
        modeIsActive.value = store.state.selectPollingMode;
      },
      {
        immediate: false,
      },
    );
    // 监听时间切换
    watch(
      () => store.state.selectPollingTime,
      (val, old) => {
        timeBtn.value = returnTimeBtn(store.state.selectPollingTime);
          stopTimer();
          startPolling();
      },
      {
        immediate: false,
      },
    );
    // 监听摄像头数
    watch(
      () => store.state.selectedVideoArr,
      (val, old) => {
        if (store.state.selectedVideoArr?.length > 0) {
          selectBtn.value = '已选择监控';
        }
      },
      {
        immediate: true,
      },
    );
    onMounted(() => {
      if ((window as any).config.isStartUdsVideoWall) {
        // 当开启了uds视频墙配置才进行初始化
        startUdsWall();
      } else {
        nextTick(() => {
          restartVideoFromStorage();
        });
      }
    });
    return {
      allModes,
      selectMode,
      options,
      timeValue,
      displayVideos, // 当前定时循环正在显示的数据
      SelectVideoRef,
      groupName,
      videoNum,
      pollingButton, // 巡查按钮
      selectBtn,
      changeTime, // 改变轮询时间
      changeModeEmitFun,
      openSelectGroupPop, // 打开选择分组弹窗
      returnArrayItemByIndex, // 返回对应元素
      stopTimer, // 暂停轮询
      videoIndexRef,
      changeModeNew,
      modeIsActive,
      openSelectTimePop,
      SelectTimeRef,
      timeBtn,
    };
  },
});
</script>
<style module lang="scss" src="./style/VideoIndex.scss"></style>
