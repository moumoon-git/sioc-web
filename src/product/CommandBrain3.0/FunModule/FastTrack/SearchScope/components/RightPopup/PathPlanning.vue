<template>
  <div :class="$style.PathPlanning">
    <ul>
      <li
        v-for="(x, i) in listData"
        :key="i"
        @mouseenter="enter(x)"
        @click="select(x)"
      >
        <!-- @mouseleave="" -->
        <span>{{ x.strategy }}</span>
        <div>
          <p>
            <span>{{ (Number(x.duration) / 60).toFixed(1) }}</span>
            <span>min</span>
          </p>
          <p>
            <span>{{ (Number(x.distance) / 1000).toFixed(2) }}</span>
            <span>km</span>
          </p>
          <p>
            <span>{{ x.traffic_lights }}</span>
            <span>红绿灯</span>
          </p>
        </div>
        <!-- <p>途径：珠江西路、猎德大桥、新港东路</p> -->
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    // 渲染线颜色
    function renderLane(covName: string, color: string, flag = false) {
      (window as any).map.getCoverageData(covName).then((r: any) => {
        if (r.length !== 0) {
          let st = {
            strokeColor: color,
            strokeWidth: 5,
            fillColor: 'skyblue',
            fillOpacity: 0,
            fontColor: 'pink',
            fontSize: '20px',
          };
          (window as any).map.setSingleStyle(r[0], st);
        }
      });
      (window as any).map.reductionMapZindex(covName);
      if (flag) {
        (window as any).map.setMapCovzIndex(covName);
      }
    }
    // 鼠标移入
    function enter(x: any) {
      props.listData.forEach((e: any) => {
        // 灰色
        renderLane(e.covName, '#97a09e');
      });
      // 绿色
      renderLane(x.covName, '#08c189', true);
    }
    // 选择了当前路线
    function select(x: any) {
      // console.log(x);
      context.emit('selectPath', x);
    }
    return {
      enter,
      select,
    };
  },
});
</script>

<style lang="scss" module>
.PathPlanning {
  ul,
  p {
    margin: 0;
    padding: 0;
  }
  & > ul {
    list-style: none;
    & > li {
      margin-bottom: 10px;
      width: 100%;
      height: 84px;
      background: linear-gradient(
        90deg,
        rgba(0, 193, 222, 0.3) 0%,
        rgba(24, 38, 50, 0) 100%
      );
      position: relative;
      cursor: pointer;
      padding: 20px 10px 10px;
      box-sizing: border-box;
      & > span {
        position: absolute;
        padding-left: 12px;
        top: 0;
        box-sizing: border-box;
        right: 0;
        width: 64px;
        height: 20px;
        border-radius: 0 0 0 20px;
        background: linear-gradient(45deg, #5abbe0 0%, #7f9fff 100%);
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
      }
      & > div {
        display: flex;
        width: 100%;
        margin-bottom: 8px;
        p {
          user-select: none;
          flex: 1;
          border-right: 1px solid rgba(255, 255, 255, 0.15);
          text-align: center;
          & > span {
            &:first-child {
              line-height: 1;
              font-size: 30px;
              font-weight: 500;
              color: #ffffff;
            }
            &:last-child {
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
            }
          }
          &:last-child {
            border-right: none;
          }
        }
      }
      & > p {
        font-size: 14px;
        font-weight: 400;
        color: #a6adb4;
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 100%;
        background: #56e9ff;
        display: none;
      }
      &:hover {
        background: linear-gradient(
          90deg,
          rgba(0, 193, 222, 0.7) 0%,
          rgba(24, 38, 50, 0) 100%
        );
        &::before {
          display: block;
        }
      }
    }
  }
}
</style>