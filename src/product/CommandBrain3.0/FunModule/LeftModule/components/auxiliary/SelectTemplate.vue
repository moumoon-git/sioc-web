<template>
  <div :class="$style.SelectTemplate">
    <div @click="slideFun('left')">
      <span :class="$style.left" />
    </div>
    <main ref="mainViews">
      <ul ref="slideEl">
        <li
          v-for="(item, index) in listData"
          :key="index"
          :class="item.active ? $style.active : ''"
          @click.stop="selects($event, item)"
        >
          {{ item.templateName }}
        </li>
      </ul>
    </main>
    <div @click="slideFun('right')">
      <span :class="$style.right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';

export default defineComponent({
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    // 视口元素
    const mainViews: any = ref(null);
    // 滑动元素
    const slideEl: any = ref(null);
    // 视口宽度
    const visWd = ref(0);
    // 滑动元素宽度
    const slideWd = ref(0);
    // 初始化
    function init() {
      console.log('777777777');
      if (slideEl.value) {
        slideEl.value.style.left = '0px';
      }
    }
    // 选择
    function selects(e: any, params: any) {
      const { listData } = props;
      const eW = e.target.offsetWidth;
      const eL = e.target.offsetLeft;
      const eVisW = eW + eL;
      const ulMoveStr = slideEl.value.style.left || 0;
      const ulMove = parseInt(ulMoveStr);
      let move = 0;
      //   console.log(eVisW + ulMove);
      //   console.log(eVisW, eL);
      //   console.log(visWd.value);
      if (slideWd.value > visWd.value) {
        if (eVisW + ulMove < visWd.value) {
          move = eW - (eVisW + ulMove) + eW / 2;
          const m = ulMove + move >= 0 ? 0 : ulMove + move;
          slideEl.value.style.left = `${m}px`;
          // console.log(move);
        } else if (eVisW >= visWd.value) {
          move = eVisW - visWd.value + eW / 2;
          if (Math.abs(ulMove) < move) {
            const n = ulMove + move * -1 >= 0 ? 0 : ulMove + move * -1;
            slideEl.value.style.left = `${n}px`;
          }
        }
      }
      listData.forEach((x: any) => {
        const ele: any = x;
        ele.active = false;
      });
      params.active = true;
      //   console.log(listData);
      //   console.log(params);
      context.emit('sendMsg', params);
    }
    // 获取当前元素的宽度
    function getElNodeWd() {
      setTimeout(() => {
        visWd.value = mainViews.value.offsetWidth;
        slideWd.value = slideEl.value.offsetWidth;
      }, 80);
    }
    // 点击进行滑动
    function slideFun(params: string) {
      // 滑动的原生宽度要大于视口宽度
      if (slideWd.value > visWd.value) {
        // 获取滑动元素单前的 滑动值 left
        const leftStr = slideEl.value.style.left || 0;
        const left = parseInt(leftStr);
        // 移动的值
        const moveVal = visWd.value / 2;
        // 没有进行过滑动
        if (!left && params !== 'right') {
          // 向左滑动了一次
          slideEl.value.style.left = `-${moveVal}px`;
          return;
        }
        // 向左滑
        if (params === 'left') {
          // 还可以继续滑动
          if (left + slideWd.value > visWd.value) {
            slideEl.value.style.left = `${left - moveVal}px`;
          }
        } else if (params === 'right') {
          // 向右滑
          if (Math.abs(left) > 0 && Math.abs(left + moveVal) >= moveVal) {
            slideEl.value.style.left = `${left + moveVal}px`;
          } else {
            slideEl.value.style.left = '0px';
          }
        }
      }
    }
    onMounted(() => {
      getElNodeWd();
    });
    watch(
      () => props.listData,
      (newTitle) => {
        // 数据发生变化的时候从新获取元素的宽度
        getElNodeWd();
      },
    );
    return {
      init,
      mainViews,
      slideEl,
      selects,
      slideFun,
      getElNodeWd,
    };
  },
});
</script>

<style lang="scss" module>
.SelectTemplate {
  width: 100%;
  display: flex;
  height: 32px;
  min-height: 32px;
  background: linear-gradient(
    90deg,
    rgba(0, 193, 222, 0.35) 0%,
    rgba(24, 38, 50, 0) 100%
  );
  main {
    flex: 1;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }
  ul {
    position: absolute;
    top: 0;
    left: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    transition: all 0.3s;
    display: flex;
    li {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: #a6adb4;
      padding: 0 4px;
      cursor: pointer;
      position: relative;
      margin: 0 10px;
      white-space: nowrap;
      &::after {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(
          90deg,
          #00c1de 0%,
          rgba(24, 38, 50, 0) 100%
        );
        display: none;
      }
      &:hover {
        color: #56e9ff;
      }
      &:hover::after {
        display: block;
      }
    }
    .active {
      color: #56e9ff;
      &::after {
        display: block;
      }
    }
  }
  div {
    width: 28px;
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      width: 11px;
      height: 18px;
    }
  }
}
.right {
  background: url('./assets/auxiliary/right.svg') no-repeat;
  background-size: 100% 100%;
}
.left {
  background: url('./assets/auxiliary/left.svg') no-repeat;
  background-size: 100% 100%;
}
</style>
