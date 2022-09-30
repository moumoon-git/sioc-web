<template>
  <div :class="$style.HeaderTitle">
    <h1>可视化数据实时监控</h1>
    <span :class="$style.shadow"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({});
</script>

<style lang="scss" module>
.HeaderTitle {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: relative;
  background: url('./assets/header_title_bgr.png') no-repeat;
  background-size: 112% 100%;
  background-position-x: -48px;
  text-align: center;
  & > h1 {
    font-size: 50px;
    font-family: PHT;
    color: #ffffff;
    line-height: 90px;
    letter-spacing: 12px;
    margin: 0;
    font-weight: 500;
  }
  .shadow {
    width: 67%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  &::before,
  &::after,
  .shadow {
    box-shadow: 0px 0px 24px 6px #5ba1ca;
  }
  &::before,
  &::after {
    content: '';
    position: absolute;
    height: 100%;
  }
  &::before {
    top: 10px;
    left: 110px;
    transform: rotate(-40deg);
  }
  &::after {
    top: 6px;
    right: 105px;
    transform: rotate(40deg);
  }
}
</style>