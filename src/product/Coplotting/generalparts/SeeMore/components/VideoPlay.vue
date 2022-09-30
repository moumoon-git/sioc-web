<template>
  <div :class="$style.VideoPlay">
    <video
      ref="mainVideo"
      :src="src"
      @mouseenter="moveFlag = true"
      @mousemove="moveFlag = true"
      @mouseleave="leave"
    ></video>
    <div
      v-show="!controlsPlayFlag"
      :class="$style.playBtn"
      @click="playVideo"
    ></div>
    <!-- 视频底下的操作 -->
    <div
      :class="$style.controls"
      :style="{ bottom: `${moveFlag ? 8 : -38}px` }"
    >
      <!-- 播放和停止 -->
      <div :class="$style.controlsPlay">
        <div v-show="!controlsPlayFlag" @click="playVideo"></div>
        <div v-show="controlsPlayFlag" @click="pauseVideo"></div>
      </div>
      <!-- 控制进度 -->
      <el-slider
        v-model="sliderVal"
        :min="0"
        :max="totalLegSecond"
        :format-tooltip="formatTooltip"
        @input="changeProgress"
      ></el-slider>
      <!-- 显示时长 -->
      <div :class="$style.visDuration">{{ playDuration }}/{{ totalLeg }}</div>
      <!-- 控制静音 -->
      <div :class="$style.controlsVoice">
        <div v-show="controlsVoiceFlag" @click="controlsMute"></div>
        <div v-show="!controlsVoiceFlag" @click="controlsVoice"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
export default defineComponent({
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    // 播放视频的元素
    const mainVideo = ref<any>(null);
    // 控制进度的值
    const sliderVal = ref<number | any>(0);
    // 控制播放按钮的显示和隐藏
    const controlsPlayFlag = ref(false);
    // 控制声音图标的开启和显示
    const controlsVoiceFlag = ref(true);
    // 实际进度的值
    const actualVal = ref<number | any>(0);
    // 视频时间总长秒数
    const totalLegSecond = ref<number | any>(0);
    // 视频时间总长显示
    const totalLeg = ref<string | any>('00:00');
    // 移入移出
    const moveFlag = ref<boolean | any>(true);
    function calculationTime(val: number) {
      const num: number = Math.floor(val);
      // 秒
      const second: number = num % 60;
      // 分
      const branch: number = Math.floor(num / 60);
      // 时
      const hour: number = Math.floor(num / 3600);
      const hourStr = `${
        hour !== 0 ? (hour < 10 ? `0${hour}` : hour) + ':' : ''
      }`;
      const timeStr = `${hourStr + (branch < 10 ? `0${branch}` : branch)}:${
        second < 10 ? `0${second}` : second
      }`;
      return timeStr;
    }
    // 显示的值
    const playDuration = computed(() => {
      const timeStr = calculationTime(Math.round(actualVal.value));
      return timeStr;
    });
    // 开启播放
    function playVideo() {
      if (mainVideo.value) {
        mainVideo.value.play();
        controlsPlayFlag.value = true;
      }
    }
    // 暂停播放
    function pauseVideo() {
      if (mainVideo.value) {
        mainVideo.value.pause();
        controlsPlayFlag.value = false;
      }
    }
    // 进度改变时
    function changeProgress(val: any) {
      if (val !== actualVal.value) {
        mainVideo.value.currentTime = val;
      }
    }
    // 拖动的进度
    function formatTooltip(val: number) {
      const timeStrs = calculationTime(val);
      return timeStrs;
    }
    // 给video元素绑定事件
    function videoAddEventlist() {
      if (mainVideo.value) {
        mainVideo.value.onloadedmetadata = function (e: any) {
          const timeStr = calculationTime(this.duration);
          this.currentTime = 1;
          totalLegSecond.value = parseInt(this.duration);
          totalLeg.value = timeStr;
        };
        mainVideo.value.ontimeupdate = function (e: any) {
          if (totalLegSecond.value === parseInt(this.currentTime)) {
            pauseVideo();
            this.currentTime = 1;
          }
          actualVal.value = this.currentTime;
          sliderVal.value = this.currentTime;
        };
      }
    }
    // 初始化
    function init() {
      // 恢复初始值
      if (controlsPlayFlag.value) {
        controlsPlayFlag.value = false;
      }
      if (mainVideo.value) {
        mainVideo.value.volume = 1;
      }
      controlsVoiceFlag.value = true;
      totalLeg.value = '00:00';
      // 恢复初始值
      sliderVal.value = 0;
      videoAddEventlist();
    }
    // 打开声音
    function controlsVoice() {
      if (mainVideo.value) {
        mainVideo.value.volume = 1;
        controlsVoiceFlag.value = true;
      }
    }
    // 关闭声音
    function controlsMute() {
      if (mainVideo.value) {
        mainVideo.value.volume = 0;
        controlsVoiceFlag.value = false;
      }
    }
    // 鼠标移出
    function leave() {
      //   console.log('移出');
      setTimeout(() => {
        moveFlag.value = false;
      }, 2000);
    }
    // 当前播放
    onMounted(() => {
      init();
    });

    watch(
      () => props.src,
      () => {
        init();
      },
    );

    return {
      // 播放视频的元素
      mainVideo,
      // 控制进度的值
      sliderVal,
      // 控制播放按钮的显示和隐藏
      controlsPlayFlag,
      // 控制声音图标的开启和显示
      controlsVoiceFlag,
      // 显示的值
      playDuration,
      // 视频时间总长秒数
      totalLegSecond,
      // 视频时间总长
      totalLeg,
      // 移入移出
      moveFlag,
      // 开启播放
      playVideo,
      // 暂停播放
      pauseVideo,
      // 进度改变时
      changeProgress,
      // 拖动的进度
      formatTooltip,
      // 打开声音
      controlsVoice,
      // 关闭声音
      controlsMute,
      // 鼠标移出
      leave,
    };
  },
});
</script>

<style lang="scss" module>
.VideoPlay {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  & > video {
    max-width: 640px;
    max-height: 536px;
    width: 100%;
    height: 100%;
  }
  .playBtn {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
    width: 80px;
    height: 80px;
    background: url('../assets/play.svg') no-repeat;
    background-size: 100% 100%;
  }
}
.controls {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 25px;
  box-sizing: border-box;
  transition: all 0.3s;
  :global(.el-slider) {
    flex: 1;
  }
}
.controlsPlay {
  margin-right: 17px;
  & > div {
    cursor: pointer;
    width: 20px;
    height: 20px;
    &:first-child {
      background: url('../assets/small_play.svg') no-repeat;
      background-size: 100% 100%;
    }
    &:last-child {
      background: url('../assets/stop.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
}
.visDuration {
  font-size: 17px;
  font-weight: 400;
  color: #ffffff;
  margin-left: 10px;
  margin-right: 15px;
}
.controlsVoice {
  & > div {
    cursor: pointer;
    width: 25px;
    height: 25px;
    &:first-child {
      background: url('../assets/voice.svg') no-repeat;
      background-size: 100% 100%;
    }
    &:last-child {
      background: url('../assets/mute.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
}
:global(.el-slider__button) {
  border: 2px solid #fff;
}
</style>