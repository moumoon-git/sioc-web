<template>
  <div :class="enter ? $style.commandBrainSeeMore : $style.SeeMore">
    <div>
      <!-- 头部 -->
      <header>
        <span>查看更多</span>
        <i @click="close"></i>
      </header>
      <!-- 切换的容器 -->
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="图片" name="img">
            <ImgVis
              visModle="IMG"
              :visData="seeMoreData.image"
              :enter="enter"
            />
          </el-tab-pane>
          <el-tab-pane label="视频" name="video">
            <ImgVis
              visModle="VIDEO"
              :visData="seeMoreData.video"
              :enter="enter"
            />
          </el-tab-pane>
          <el-tab-pane label="附件" name="enclosure">
            <Enclosure :visData="seeMoreData.word" :enter="enter" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 显示的容器 -->
      <aside></aside>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref } from 'vue';
import ImgVis from './components/ImgVis.vue';
import Enclosure from './components/Enclosure.vue';
export default defineComponent({
  components: {
    ImgVis,
    Enclosure,
  },
  props: {
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
    activeName: {
      type: String,
      default: 'img',
    },
  },
  setup(props) {
    const store = useStore(); // 使用vuex
    const activeName = ref<string>(props.activeName);
    const seeMoreData = store.state.coplotting.seeMoreObj.data;
    console.log(seeMoreData);
    function handleClick(tab: any, event: any) {
      // console.log(tab, event);
    }
    function close() {
      let obj = {
        data: {},
        openFlag: false, // 打开更多的弹窗
      };
      store.commit('coplotting/SET_SeeMoreObj', obj);
    }
    return {
      activeName,
      handleClick,
      seeMoreData,
      close,
    };
  },
});
</script>

<style lang="scss" module>
.SeeMore {
  top: 0;
  left: 0;
  position: fixed;
  z-index: 20001;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  & > div {
    width: 1116px;
    height: 808px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    & > header {
      height: 56px;
      background: #f1f4f6;
      border-radius: 7px 7px 0px 0px;
      padding: 0 12px 0 28px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > span {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
      }
      & > i {
        width: 20px;
        height: 20px;
        cursor: pointer;
        background: url('./assets/close.svg') no-repeat;
        background-size: 100% 100%;
      }
    }
    & > div {
      flex: 1;
    }
    :global(.el-tabs) {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    :global(.el-tab-pane) {
      width: 100%;
      height: 100%;
    }
    :global(.el-tabs__content) {
      flex: 1;
    }
    :global(.el-tabs__header) {
      margin: 0;
    }
    :global(.el-tabs__header .el-tabs__item) {
      height: 63px;
      color: #999999;
      line-height: 63px;
      font-size: 20px;
      font-weight: 400;
    }
    :global(.el-tabs__header .is-active) {
      color: #333333;
    }
    :global(.el-tabs__nav-wrap::after) {
      height: 1px;
    }
    :global(.el-tabs__active-bar) {
      height: 3px;
    }
    :global(.el-tabs__header .el-tabs__nav-scroll) {
      padding-left: 20px;
      box-sizing: border-box;
    }
  }
}

.commandBrainSeeMore {
  top: 0;
  left: 0;
  position: fixed;
  z-index: 20001;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  & > div {
    width: 900px;
    height: 675px;
    background: rgba(20, 29, 31, 0.94);
    border: 1px solid #00c1de;
    & > header {
      height: 50px;
      background: transparent;
      padding: 0 15px 0 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      & > span {
        font-size: 18px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
      & > i {
        width: 16px;
        height: 16px;
        cursor: pointer;
        background: url('./assets/close.svg') no-repeat;
        background-size: 100% 100%;
      }
    }
    & > div {
      flex: 1;
    }
    :global(.el-tabs) {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    :global(.el-tab-pane) {
      width: 100%;
      height: 100%;
    }
    :global(.el-tabs__content) {
      flex: 1;
    }
    :global(.el-tabs__header) {
      margin: 0;
    }
    :global(.el-tabs__header .el-tabs__item) {
      height: 46px;
      color: #ffffff;
      line-height: 46px;
      font-size: 20px;
      font-weight: 400;
    }
    :global(.el-tabs__header .is-active) {
      color: rgba(86, 233, 255, 1);
    }
    :global(.el-tabs__nav-wrap::after) {
      background: rgba(255, 255, 255, 0.15);
    }
    :global(.el-tabs__active-bar) {
      height: 2px;
      background: #00ecff;
    }
    :global(.el-tabs__header .el-tabs__nav-scroll) {
      padding-left: 20px;
      box-sizing: border-box;
    }
  }
}
</style>