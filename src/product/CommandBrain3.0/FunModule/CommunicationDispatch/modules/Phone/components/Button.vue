<!--组件 —— 按钮-->
<template>
  <button
    :class="['communication-dispatch-phone-button', `communication-dispatch-phone-button--${type}`]"
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
      default: 'active',
    },
  },
});
</script>

<style lang="scss">
.communication-dispatch-phone-button {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  border: none;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 400;

  &--active {
    background: #00c1de;
    border: 1px solid transparent;
    color: #ffffff;
  }

  &--default {
    background: transparent;
    border: 1px solid #00c1de;
    color: #00c1de;
  }

  // 左边图标
  .button_pre {
    display: block;
    width: 16px;
    height: 16px;
    margin-right: 2px;
  }

  // 左边图标
  .button_pre {
    display: block;
    width: 16px;
    height: 16px;
    margin-left: 2px;
  }

  &:hover {
    filter: brightness(1.2);
  }
}
</style>
