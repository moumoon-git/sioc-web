<template>
  <button
    :class="['h5-button', `h5-button--${type}`]"
    :style="{'fontSize': fontSize,}"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    fontSize: {
      type: String,
      default: '0.36rem',
    }
  },
  setup() {},
});
</script>
<style lang="scss">
// 按钮
.h5-button {
  width: auto;
  border-radius: 0.75rem;
  border: transparent;
  font-size: 0.36rem;
  font-weight: 400;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  // 默认
  &--default {
    background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
    box-shadow: 0rem 0.06rem 0.12rem 0rem rgba(12, 126, 161, 0.35);
  }

  // 禁用
  &--disabled {
    background: linear-gradient(360deg, #b3b3b3 0%, #e6e6e6 100%);
    box-shadow: 0rem 0.06rem 0.12rem 0rem rgba(132, 132, 132, 0.35);
  }

  // 文本
  &--text {
    margin: 0;
    font-weight: 400;
    color: #0091ff;
    background: transparent;
  }

  &--text--primary {
    margin: 0;
    font-weight: 400;
    color: #ffffff;
    background: transparent;
  }

  &--text--disabled {
    margin: 0;
    font-weight: 400;
    color: #CCCCCC;
    background: transparent;
  }

  // 文本
  &--primary {
    margin: 0;
    font-weight: 400;
    color: #666666;
    background: transparent;
  }

  &:hover {
    filter: brightness(110%);
  }
}
</style>
