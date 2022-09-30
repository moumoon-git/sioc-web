<template>
  <div :class="$style.videoLoad">
    <video ref="videos" :src="visObjs.src" />
    <div>{{ visObjs.duration }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  props: {
    visObj: {
      type: Object,
      default: () => {},
    },
  },
  setup(props: any) {
    const videos = ref<any>(null);
    const visObjs = ref<any>(props.visObj);
    onMounted(() => {
      videos.value.onloadedmetadata = function (e: any) {
        const num: number = Math.floor(this.duration);
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
        this.currentTime = 1;
        visObjs.value.duration = timeStr;
      };
    });
    return {
      visObjs,
      videos,
    };
  },
});
</script>

<style lang="scss" module>
.videoLoad {
  width: 100%;
  height: 100%;
  position: relative;
  & > video {
    width: 100%;
    height: 100%;
  }
  & > div {
    position: absolute;
    right: 14px;
    bottom: 8px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
    padding: 2px 4px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
