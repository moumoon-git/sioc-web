<template>
  <div :class="$style.GeneralTools">
    <ul>
      <li v-for="(x, i) in tools" :key="i" @click="selectCoplotting(x)">
        <div v-if="x.active" :class="$style[`icon-${x.type}Active`]" />
        <div v-else :class="$style[`icon-${x.type}`]" />
        <div v-if="x.active" :class="$style.edge" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { connect } from 'node_modules/echarts/core';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: ['sendMsg'],
  setup(porps, context) {
    const tools = ref([
      {
        // 点
        type: 'spot',
      },
      {
        // 线
        type: 'line',
      },
      {
        // 圆
        type: 'circleEx',
      },
      {
        // 矩形
        type: 'rectangle',
      },
      {
        // 面
        type: 'polygonEx',
      },
      {
        // 单箭头
        type: 'arrow',
      },
      {
        // 双箭头
        type: 'doubleArrow',
      },
    ]);
    function selectCoplotting(params: any) {
      tools.value.map((x: any) => {
        x.active = false;
      });
      params.active = true;
      context.emit('sendMsg', params);
    }
    return {
      tools,
      selectCoplotting,
    };
  },
});
</script>

<style lang="scss" module>
.GeneralTools {
  width: 100%;
  ul {
    display: flex;
    height: 100px;
    align-items: center;
    li {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      cursor: pointer;
      position: relative;
      div {
        width: 30px;
        height: 30px;
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        height: 100%;
        width: 1px;
        background: url('./assets/auxiliary/edge.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
.edge {
  position: absolute;
  background: url('./assets/auxiliary/triangle.svg') no-repeat;
  background-size: 100% 100%;
  width: 20px !important;
  height: 15px !important;
  bottom: -6px;
  right: 0;
  left: 0;
  margin: auto;
}

@each $animal in spot, line, circleEx, rectangle, polygonEx, arrow, doubleArrow
{
  .icon-#{$animal} {
    background: url('./assets/auxiliary/#{$animal}.svg') no-repeat;
    background-size: 100% 100%;
  }
  .icon-#{$animal}Active {
    background: url('./assets/auxiliary/#{$animal}_Active.svg') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
