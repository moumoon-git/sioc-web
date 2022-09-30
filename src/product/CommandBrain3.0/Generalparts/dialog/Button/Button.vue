<template>
  <button
    :class="[
      'visualization-dialog-button',
      `visualization-dialog-button--${type}`
    ]"
  >
    <slot>Dialog Button</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
  },
});
</script>

<style lang="scss">
.visualization-dialog-button {
  outline: none;
  border: 1px solid #A6ADB4;
  color: #A6ADB4;
  background: transparent;
  vertical-align: middle;
  cursor: pointer;
  height: 32px;
  padding: 0 18px;
  &--ghost:hover {
    color: #56E9FF;
    border: 1px solid currentColor;
  }
  &--primary {
    color: #FFFFFF;
    background: #32C5FF;
    border: 1px solid #32C5FF;
    &:hover {
      background: #56E9FF;
      border: 1px solid #56E9FF;
    }
  }
  &--danger {
    color: #FFFFFF;
    background: #F66E6E;
    border: 1px solid #F66E6E;
    &:hover {
      background: #FF9E9E;
      border: 1px solid #FF9E9E;
    }
  }
}
</style>
