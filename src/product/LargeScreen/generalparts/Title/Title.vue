<template>
  <div :class="$style.Title">
    <div>
      <span>{{ title }}</span>
      <span>{{ tips }}</span>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" module>
.Title {
  width: 100%;
  & > div {
    width: 100%;
    background: url('./assets/title_bgr.svg') no-repeat;
    background-size: 100% 100%;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: url('./assets/title_bottom_bgr.svg') no-repeat;
    }
    & > span {
      &:first-child {
        font-size: 28px;
        font-weight: 600;
        color: #ffffff;
        margin-right: 8px;
      }
      &:nth-child(2) {
        font-size: 14px;
        font-weight: 600;
        color: #56e9ff;
      }
    }
    & > div {
      position: absolute;
      right: 0px;
      top: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      align-items: center;
    }
  }
}
</style>