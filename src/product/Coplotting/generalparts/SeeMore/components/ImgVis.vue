<template>
  <div :class="enter ? $style.commandBrainImgVis : $style.ImgVis">
    <!-- 侧边栏 -->
    <aside>
      <div v-if="visModle === 'IMG' && visData.length !== 0">
        <img
          v-for="(x, i) in visData"
          :key="i"
          :src="x.src"
          alt=""
          @click="checkImg(x)"
        />
      </div>
      <div v-else-if="visData.length !== 0">
        <div v-for="(x, i) in visData" :key="i" @click="checkVideo(x)">
          <VideoLoad :visObj="x" />
        </div>
      </div>
    </aside>
    <!-- 主视口 -->
    <main>
      <img
        v-if="visModle === 'IMG' && visData.length !== 0"
        :src="imgVisSrc.src"
        alt=""
      />
      <div v-else-if="visData.length !== 0">
        <VideoPlay :src="videoVisSrc.src" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { isArray } from 'lodash';
import { defineComponent, ref } from 'vue';
// 小视频加载
import VideoLoad from './VideoLoad.vue';
// 播放视频
import VideoPlay from './VideoPlay.vue';
export default defineComponent({
  components: {
    VideoLoad,
    VideoPlay,
  },
  props: {
    visModle: {
      type: String,
      default: 'IMG', // IMG VIDEO
    },
    visData: {
      type: Array,
      default: () => [
        // {
        //   src: 'https://img0.baidu.com/it/u=3101694723,748884042&fm=26&fmt=auto&gp=0.jpg',
        // },
        // {
        //   src: 'https://img0.baidu.com/it/u=3870964477,3746012709&fm=26&fmt=auto&gp=0.jpg',
        // },
        // {
        //   src: 'https://img1.baidu.com/it/u=1361135963,570304265&fm=26&fmt=auto&gp=0.jpg',
        // },
        // {
        //   src: 'https://img0.baidu.com/it/u=3101694723,748884042&fm=26&fmt=auto&gp=0.jpg',
        // },
        // {
        //   src: 'https://img0.baidu.com/it/u=3101694723,748884042&fm=26&fmt=auto&gp=0.jpg',
        // },
        // {
        //   src: 'https://img0.baidu.com/it/u=3101694723,748884042&fm=26&fmt=auto&gp=0.jpg',
        // },
        // {
        //   src: 'https://video19.ifeng.com/video09/2021/06/18/p6811652621716164995-102-220924.mp4?reqtype=tsl&vid=b7785574-cf56-4244-8f37-272ea99283ec&uid=0MSsEY&from=v_Free&pver=vHTML5Player_v2.0.0&sver=&se=&cat=&ptype=&platform=pc&sourceType=h5&dt=1624585652796&gid=cZwO0XpA2co8&sign=2934d213db12bc06165abe309cd77b9c&tm=1624585652796&vkey=L7mqEGf2TEDnKzGXjwCoqBKuUdgIkPMEGnp8ivUWucHWvmyeDBt8PVWrc9quyycpHgzrR%2Flh1%2FYVuslByKEQSCM2Uy5jWlAv%2FMyrVZJkaLGewxzOx5BEU8GOvEozcZvkaZ%2F4byF%2FBwJw9yz5L4fvYvszD8mt1YaKtcbRE5kXyOCpV9d5JS5xuaoXTvRoEHmrLHMbeE7cQblTLn00BFNjb2YLmBWHGTEDZKXiiKiRTOcNA6So7GFuzAyzJUdT0eMxmzypKHab08d7%2BPf0rl4mM59Epi8D9AV1WL75Q0KwoQQ%3D',
        // },
        // {
        //   src: 'https://video19.ifeng.com/video09/2020/06/26/p36342687-102-9987636-173137.mp4?reqtype=tsl&vid=8caaaa67-9869-42c0-8b88-a7102d1bc896&uid=X2XSj6&from=v_Free&pver=vHTML5Player_v2.0.0&sver=&se=&cat=&ptype=&platform=pc&sourceType=h5&dt=1624587068614&gid=aqwQUXpA72TG&sign=ed15b68b5a540e7cf9f3068c7927bace&tm=1624587068614&vkey=L7mqEGf2TEDnKzGXjwCoqBKuUdgIkPMEGnp8ivUWucHWvmyeDBt8PVWrc9quyycpSO54uNqnanqyM%2FbzlstxR4NzWj7VYXZ673d5bR6mDRcZiDjZDi1T8KdEPO4wkw4iySB6XB62SjQs66NwQLlGGADVodNK165qKcSIApad1KQXqGPdoKAj%2F0ddKh5ydHIeg7GH25PsP%2FsI4a6ASMX8ov3rCujeXfRATSMq8z4eN8YX4W6PNQi06lwT8qOJJtJwNVYvMcG3y0elnhFmwEyJEL6nheYIL8xoqLl%2FRS36nz8%3D',
        // },
        // {
        //   src: 'https://video19.ifeng.com/video09/2020/06/26/p36342687-102-9987636-173137.mp4?reqtype=tsl&vid=8caaaa67-9869-42c0-8b88-a7102d1bc896&uid=X2XSj6&from=v_Free&pver=vHTML5Player_v2.0.0&sver=&se=&cat=&ptype=&platform=pc&sourceType=h5&dt=1624587068614&gid=aqwQUXpA72TG&sign=ed15b68b5a540e7cf9f3068c7927bace&tm=1624587068614&vkey=L7mqEGf2TEDnKzGXjwCoqBKuUdgIkPMEGnp8ivUWucHWvmyeDBt8PVWrc9quyycpSO54uNqnanqyM%2FbzlstxR4NzWj7VYXZ673d5bR6mDRcZiDjZDi1T8KdEPO4wkw4iySB6XB62SjQs66NwQLlGGADVodNK165qKcSIApad1KQXqGPdoKAj%2F0ddKh5ydHIeg7GH25PsP%2FsI4a6ASMX8ov3rCujeXfRATSMq8z4eN8YX4W6PNQi06lwT8qOJJtJwNVYvMcG3y0elnhFmwEyJEL6nheYIL8xoqLl%2FRS36nz8%3D',
        // },
      ],
    },
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
  },
  setup(props) {
    // 图片的显示路径
    const imgVisSrc = ref<any>({});
    // 视频显示路径
    const videoVisSrc = ref<any>({});
    if (
      props.visData &&
      Array.isArray(props.visData) &&
      props.visData.length !== 0
    ) {
      imgVisSrc.value = props.visData[0];
      videoVisSrc.value = JSON.parse(JSON.stringify(props.visData[0]));
    }
    // 选择图片
    function checkImg(x: any) {
      imgVisSrc.value = x;
    }
    // 选择视频
    function checkVideo(x: any) {
      videoVisSrc.value.src = x.src;
    }
    return {
      // 图片的显示路径
      imgVisSrc,
      // 视频显示路径
      videoVisSrc,
      // 选择图片
      checkImg,
      // 选择视频
      checkVideo,
    };
  },
});
</script>

<style lang="scss" module>
.ImgVis {
  width: 100%;
  height: 100%;
  display: flex;
  & > aside {
    width: 282px;
    height: 100%;
    max-height: 672px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 14px 14px 0px;
    box-sizing: border-box;
    border-right: 1px solid #f2f2f2;
    & > div {
      & > img,
      & > div {
        width: 253px;
        height: 142px;
        margin-bottom: 14px;
        cursor: pointer;
      }
    }
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
  & > main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    & > img,
    & > div {
      max-height: 670px;
      max-width: 814px;
    }
  }
}
.commandBrainImgVis {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  & > aside {
    width: 200px;
    height: 536px;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid #00c1de;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 10px;
    box-sizing: border-box;
    margin-right: 20px;
    & > div {
      & > img,
      & > div {
        width: 180px;
        height: 102px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
  & > main {
    width: 640px;
    height: 536px;
    background: rgba(0, 0, 0, 0.29);
    flex: 1;
    border: 1px solid #00c1de;
    display: flex;
    justify-content: center;
    align-items: center;
    & > img,
    & > div {
      max-width: 640px;
      max-height: 536px;
    }
  }
}
</style>