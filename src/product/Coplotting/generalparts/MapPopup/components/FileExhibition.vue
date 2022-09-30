<template>
  <div :class="$style.FileExhibition">
    <!-- 文件展示 -->
    <div
      v-show="renderData.image && renderData.image.length !== 0"
      :class="$style.imgFile"
    >
      <img :src="renderData.image ? renderData.image[0].src : ''" alt="" />
      <!-- <ImgVis :data="[renderData.image ? renderData.image[0].src : '']" /> -->
      <div />
      <button @click="seeMore">查看更多</button>
    </div>
    <!-- 标签 -->
    <div :class="$style.label">
      <ul>
        <li @click="seeMore('img')">
          图片 {{ renderData.image ? renderData.image.length : 0 }}
        </li>
        <li @click="seeMore('video')">
          视频 {{ renderData.video ? renderData.video.length : 0 }}
        </li>
        <li @click="seeMore('enclosure')">
          附件 {{ renderData.word ? renderData.word.length : 0 }}
        </li>
        <!-- <li>挂载 {{ renderData.netLink ? renderData.netLink.length : 0 }}</li> -->
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref } from 'vue';
// import ImgVis from '@/product/CommandBrain3.0/FunModule/LeftModule/components/info/ImgVis.vue';

export default defineComponent({
  components: {
    // ImgVis,
  },
  props: {
    renderData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const store = useStore(); // 使用vuex
    // 查看更多
    function seeMore(params?: any) {
      console.log(props.renderData);
      const obj = {
        data: props.renderData,
        active: params,
        openFlag: true, // 打开更多的弹窗
      };
      store.commit('coplotting/SET_SeeMoreObj', obj);
    }
    return {
      // 查看更多
      seeMore,
    };
  },
});
</script>

<style lang="scss" module>
.FileExhibition {
  width: 100%;
  height: 100%;
}
.imgFile {
  margin: 0 auto;
  width: 305px;
  height: 166px;
  position: relative;
  margin-bottom: 14px;
  &:hover div,
  &:hover button {
    display: block;
  }
  & > img {
    width: 100%;
    height: 100%;
  }
  & > div {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
  & > button {
    display: none;
    outline: none;
    background: #0091ff;
    border-radius: 1px;
    border: 1px solid #0091ff;
    font-size: 17px;
    font-weight: 400;
    color: #ffffff;
    cursor: pointer;
    position: absolute;
    height: 34px;
    width: 90px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 3;
  }
}
.label {
  ul {
    margin: 0;
    list-style: none;
    display: flex;
    padding: 0 4px;
    // justify-content: space-between;
    li {
      width: 74px;
      height: 27px;
      border-radius: 13px;
      font-size: 17px;
      font-weight: 400;
      margin-right: 10px;
      text-align: center;
      cursor: pointer;
      &:nth-child(1) {
        color: #0091ff;
        background: #e6efff;
      }
      &:nth-child(2) {
        color: #ff8171;
        background: #ffbb96;
      }
      &:nth-child(3) {
        color: #685fcf;
        background: #e9edff;
      }
      &:nth-child(4) {
        color: #1ac28e;
        background: #daf8ef;
      }
    }
  }
}
</style>
