<template>
  <div :class="$style.LeftModuleBtnView">
    <ul>
      <li
        v-for="(item, index) in listData"
        :key="index"
        :class="{
          [$style.activeTab]: item?.id === currentTabID,
          [$style.mapScreenshot]: capturing && item?.id === 5
        }"
        @click="clickTh(item)"
      >
        <div :class="$style[`${item.icon}-icon`]" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <!-- 出图进行下载的div -->
    <div v-if="imgURL" @click="downloadMapShoot" :class="$style.downloadImg" >
      <div>
        <span>点击下载</span>
        <i @click.stop="imgURL = ''"></i>
      </div>
      <img :src="imgURL" alt>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useCaptureMapShoot from '@/product/CommandBrain3.0/Generalparts/right/MapTools/scripts/useCaptureMapShoot';

export default defineComponent({
  setup(props, context) {
    const { captureMapShoot, downloadMapShoot, imgURL } = useCaptureMapShoot();
    const currentTabID = ref(-1);
    // 出图
    const capturing = ref(false);
    const listData = ref([
      // { name: '数据导入', id: 0, icon: 'data_import' },
      { name: '协同标绘', id: 1, icon: 'plotting' },
      // { name: '数据管理', id: 2, icon: 'management' },
      { name: '模板管理', id: 3, icon: 'template' },
      { name: '图层分享', id: 4, icon: 'sharing' },
      { name: '出图', id: 5, icon: 'drawing' },
      { name: '数据统计', id: 6, icon: 'statistic' },
    ]);
    const handleCapture = () => {
      capturing.value = true;
      captureMapShoot().then(() => {
        capturing.value = false;
      });
    };
    function clickTh(item: any) {
      console.log(item);
      if (item.id === 5) {
        // 截图时候进行load加砸动画
        handleCapture();
      }
      context.emit('selectModule', item);
      currentTabID.value = item.id;
    }
    return {
      listData,
      clickTh,
      currentTabID,
      capturing,
      imgURL,
      downloadMapShoot,
    };
  },
});
</script>

<style lang="scss" module>
.LeftModuleBtnView {
  width: 100%;
  position: relative;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      height: 95px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      font-weight: 400;
      color: #666666;
      flex-direction: column;
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 80%;
        height: 1px;
        background: rgba(230, 230, 230, 1);
      }
      & > span {
        margin-top: 6px;
        font-size: 17px;
        font-weight: 400;
        color: #666666;
      }
      &.activeTab::before,
      &:hover::before {
        content: '';
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 90%;
        border-radius: 3px;
        background: rgba(0, 145, 255, .15);
      }
    }
  }
}

@each $animal in data_import, plotting, management, template, sharing, drawing,
  statistic
{
  .#{$animal}-icon {
    width: 25px;
    height: 25px;
    background-size: 100% 100%;
    background-image: url('./assets/#{$animal}.svg');
  }
}
.downloadImg{
  position: absolute;
  right: -180px;
  top: 294px;
  width: 160px;
  height: 140px;
  background: #fff;
  padding: 8px;
  box-sizing: border-box;
  &>div{
    position: relative;
    cursor: pointer;
    text-align: center;
    margin-bottom: 3px;
    &>span{
      color: #666666;
    }
    &>i{
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 12px;
      height: 12px;
      background: url('./assets/close.svg') no-repeat;
      background-size: 100% 100%;
      display: none;
    }
    &:hover span{
      color: #0091ff;
    }
    &:hover i{
      display: block;
    }
  }
  &>img{
    width: 100%;
    height: 100px;
  }
}
.mapScreenshot{
  position: relative;
  &>div {
      width: 25px;
      height: 25px;
      background: url('./assets/loading.svg') no-repeat;
      background-size: 100% 100%;
      animation: loading 2.5s linear 0s infinite;
  }
}
@keyframes loading {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
