<template>
  <div :class="$style.leftBottomFloat">
    <!-- 图层 -->
    <div>
      <div :class="$style.layer" @click="tabCove"></div>
    </div>
    <!-- 定位 -->
    <div>
      <div @click="setCentent" :class="$style.coordinate"></div>
    </div>
    <!-- 放大缩小 -->
    <aside>
      <div :class="zoomInFlag ? $style.btnNotHandle : ''" @click="zoomIn">
        +
      </div>
      <div :class="zoomOutFlag ? $style.btnNotHandle : ''" @click="zoomOut">
        -
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const currentCov = ref('矢量');
    const zoomInFlag = ref(false);
    const zoomOutFlag = ref(false);
    // 放大一级
    function zoomIn() {
      (window as any).map.zoomIn();
      (window as any).map.getMapMaxZoom().then((res: any) => {
        (window as any).map.getMapZoom().then((r: any) => {
          if (r < res) {
            zoomInFlag.value = false;
          } else {
            zoomInFlag.value = true;
          }
          zoomOutFlag.value = false;
        });
      });
    }
    // 缩小一级
    function zoomOut() {
      (window as any).map.zoomOut();
      (window as any).map.getMapMinZoom().then((res: any) => {
        (window as any).map.getMapZoom().then((r: any) => {
          if (r > res) {
            zoomOutFlag.value = false;
          } else {
            zoomOutFlag.value = true;
          }
          zoomInFlag.value = false;
        });
      });
    }
    // 回到中心点
    function setCentent() {
      let longitude = document.cookie.match(/longitude=([^;]*)/)?.[1];
      let latitude = document.cookie.match(/latitude=([^;]*)/)?.[1];
      let data = {
        longitude,
        latitude,
      };
      (window as any).map.setCentent(data, 14);
    }
    // 切换图层
    function tabCove() {
      if (currentCov.value === '矢量') {
        (window as any).map.tabCoverage('影像');
        window.map.setCoverTextColor('#fff');
        currentCov.value = '影像';
      } else {
        (window as any).map.tabCoverage('矢量');
        window.map.setCoverTextColor('#000');
        currentCov.value = '矢量';
      }
    }
    return {
      zoomIn,
      zoomOut,
      setCentent,
      tabCove,
      zoomInFlag,
      zoomOutFlag,
    };
  },
});
</script>

<style lang="scss" module>
.leftBottomFloat {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-direction: column;
  & > div,
  & > aside {
    margin-top: 15px;
  }
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    margin-right: 20px;
    cursor: pointer;
    & > div {
      width: 30px;
      height: 30px;
    }
    &:first-child {
      margin-top: 0;
    }
  }
  & > aside {
    cursor: pointer;
    width: 50px;
    height: 110px;
    background: linear-gradient(270deg, #2b80ff 0%, #65bcff 100%);
    box-shadow: 0px 0px 3px 0px #d1d1d1;
    border-radius: 60px;
    position: relative;
    & > div {
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 25px;
      font-weight: 400;
      color: #ffffff;
      &:first-child {
        border-bottom: 1px solid #7dc3fc;
      }
    }
  }
}
.coordinate {
  background: url('./assets/coordinate.svg');
  background-size: 100% 100%;
}
.layer {
  background: url('./assets/layer.svg');
  background-size: 100% 100%;
}
.btnNotHandle {
  cursor: default;
  opacity: 0.5;
}
</style>