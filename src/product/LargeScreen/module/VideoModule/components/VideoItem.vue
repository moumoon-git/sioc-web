// Video
<template>
  <div
    ref="videoRef"
    :class="[$style.videoItem, { [$style.videoItemNine]: type === 9 }]"
  >
    <!-- <video
      :id="`myVideo${domId}`"
      class="video-js"
    >
      <source
        :src="playUrl"
        type="application/x-mpegURL"
      >
    </video>-->
    <div :class="$style.videoItem__title">
      <div :class="$style.videoItem__title__index">
        {{ domId }}
      </div>
      <div :class="$style.videoItem__title__name">
        {{ videoName }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, onMounted, nextTick, onUnmounted, watch,
} from 'vue';
import useCreateVideo from '../scripts/useCreateVideo';

export default defineComponent({
  components: {
  },
  props: {
    // 播放器宽度
    width: {
      type: String,
      default: '',
    },
    // 播放器高度
    height: {
      type: String,
      default: '',
    },
    //  挂载点id
    domId: {
      type: Number,
    },
    // 视频名称
    videoName: {
      type: String,
      default: '暂无视频名称',
    },
    // 视频编码
    code: {
      type: String,
      default: '暂无视频编码',
    },
    // 当前是几路视频
    type: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    // src="https://wowza.peer5.com/live/smil:clock.smil/playlist.m3u8"
    const instance = getCurrentInstance();
    const { $http, $video }: any = instance?.appContext.config.globalProperties;
    const { createVideo, getVideoStreamSrc } = useCreateVideo($video); // 创建标签
    const player: any = ref('');
    const playUrl: any = ref(''); // 视频流地址
    const videoRef = ref<null>(null);
    const showTitle = ref(false); // 是否显示标题
    /**
    * @desc 初始化播放器
    * @param {} params
    * @returns {} returns
    */
    async function initVideo() {
      const option = {
        // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: false,
        // 自动播放属性,muted:静音播放
        autoplay: 'muted',
        // 建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: 'auto',
        // 设置视频播放器的显示宽度（以像素为单位）
        width: props.width,
        // 设置视频播放器的显示高度（以像素为单位）
        height: props.height,
      };
      console.log('当前返回的视频流播放地址');
      playUrl.value = await getVideoStreamSrc(props.code);
      nextTick(() => {
        // 动态创建video标签
        const video = document.createElement('video');
        video.setAttribute('id', `myVideo${props.domId}`);
        video.className = 'video-js';
        video.setAttribute('ebkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('controls', 'true');
        video.setAttribute('preload', 'auto');
        const source = document.createElement('source');
        source.setAttribute('type', 'application/x-mpegURL');
        source.setAttribute('src', playUrl.value);// 后台返回的mp4路径
        video.appendChild(source);
        // 插入video标签
        (videoRef.value as any).appendChild(video);
        createVideo(`myVideo${props.domId}`, option).then((res: any) => {
          player.value = res;
        });
      });
    }

    /**
    * @desc 获取视频监控的视频流
    * @param {} params
    * @returns {} returns
    */

    onMounted(() => {
      nextTick(() => {
        initVideo();
      });
    });
    // 这里需要做销毁播放器的操作，不然会有冲突
    onUnmounted(() => {
    });
    watch(() => props.videoName, (val, old) => {
      nextTick(() => {
        initVideo();
      });
    },
      {
        immediate: false,
      });
    return {
      playUrl,
      initVideo,
      videoRef,
      showTitle,
    };
  },
});
</script>
<style module lang="scss">
.videoItem {
  // margin: 0 10px;
  position: relative;
  &__title {
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    display: flex;
    bottom: 0;
    z-index: 1;
    &__index {
      width: 60px;
      height: 60px;
      background: #f2b626;
      color: #333333;
      font-size: 35px;
      text-align: center;
      line-height: 60px;
      font-weight: bold;
    }
    &__name {
      color: #ffffff;
      font-size: 28px;
      line-height: 60px;
      margin-left: 20px;
    }
  }
}
.videoItemNine {
  margin: 9px;
}
</style>
