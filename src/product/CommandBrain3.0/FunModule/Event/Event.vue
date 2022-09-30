<template>
  <div :class="$style.Event">
    <!-- 容器 -->
    <ul
      ref="EventWrap"
      :class="$style.EventUl"
    >
      <li />
      <li />
      <li />
      <li />
      <li />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  setup() {
    const { $mapDialog } = useGlobal();
    // 记录弹窗id
    const popupId = ref<any>('');
    // 事件容器
    const EventWrap = ref<HTMLElement | null>(null);
    // 设置事件点
    function setEventPoint(obj: object) {
      const data = {
        wd: 30,
        hg: 30,
        src: require('./assets/event.svg'),
        offsetY: 2,
        ...obj,
      };

      const eventObj = {
        click: (e: any) => {
          // 注释是因为解决14276bug
          // if (popupId.value) {
          //   (window as any).map.closeClearPopup(popupId.value);
          // }
          console.log($mapDialog);
          const mapDialogInstance = $mapDialog({
            modle: 'event',
          });

          e.object.data.info = JSON.parse(JSON.stringify(e.object.data));
          console.log(e.object.data.info, '123123123');
          e.object.data.info.handleType = 'event';
          mapDialogInstance.open({
           responseData: e.object.data,

          }).then((uid:any) => {
            popupId.value = uid;
          });
        },
      };
      (window as any).map
        .setOneMarker((window as any).mapCoverageName.event, data, eventObj)
        .then((e: any) => {
          const el = e.icon.imageDiv;
          el.getElementsByTagName('img')[0].style.display = 'none';
          el.appendChild(EventWrap.value);
          // console.log(el);
        });
    }
    return {
      setEventPoint,
      EventWrap,
    };
  },
});
</script>

<style lang="scss" module>
.Event {
  display: none;
}
.EventUl {
  width: 100%;
  height: 100%;
  position: relative;
  li {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    pointer-events: none;
    &:first-child {
      width: 43px;
      height: 43px;
      left: -6px;
      z-index: 5;
      background: url('./assets/icon.svg') no-repeat;
      background-size: 100% 100%;
      pointer-events: auto;
    }
    &:nth-child(2) {
      width: 43px;
      height: 43px;
      left: -6px;
      z-index: 4;
      background: url('./assets/within.svg') no-repeat;
      background-size: 100% 100%;
      animation: Event_wave infinite 2s linear 0s;
    }
    &:nth-child(3) {
      width: 63px;
      height: 63px;
      left: -16px;
      z-index: 3;
      background: url('./assets/within.svg') no-repeat;
      background-size: 100% 100%;
      animation: Event_wave2 infinite 2s linear 0s;
    }
    &:nth-child(4) {
      width: 96px;
      height: 96px;
      left: -33px;
      z-index: 2;
      background: url('./assets/in.svg') no-repeat;
      background-size: 100% 100%;
      animation: Event_wave3 infinite 2s linear 0s;
    }
    &:nth-child(5) {
      width: 110px;
      height: 110px;
      left: -40px;
      z-index: 1;
      background: url('./assets/Outside.svg') no-repeat;
      background-size: 100% 100%;
      animation: Event_wave4 infinite 2s linear 0s;
    }
  }
  @keyframes Event_wave {
    0% {
      // width: 43px;
      // height: 43px;
      transform: scale(1);
    }
    100% {
      // width: 63px;
      // height: 63px;
      transform: scale(1.46);
    }
  }
  @keyframes Event_wave2 {
    0% {
      // width: 63px;
      // height: 63px;
      transform: scale(1);
    }
    100% {
      // width: 104px;
      // height: 104px;
      transform: scale(1.65);
      opacity: 0.5;
    }
  }
  @keyframes Event_wave3 {
    0% {
      // width: 96px;
      // height: 96px;
      transform: scale(1);
    }
    100% {
      // width: 138px;
      // height: 138px;
      opacity: 0.5;
      transform: scale(1.44);
    }
  }
  @keyframes Event_wave4 {
    0% {
      // width: 110px;
      // height: 110px;
      transform: scale(1);
    }
    100% {
      // width: 100%;
      // height: 100%;
      transform: scale(1.5);
      opacity: 0.5;
    }
  }
}
</style>
