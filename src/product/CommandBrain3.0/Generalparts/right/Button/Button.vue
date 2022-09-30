<template>
  <button
    :class="[
      'visualization-right-button',
      `visualization-right-button--${type}`
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'blue',
    },
  },
});
</script>

<style lang="scss">
.visualization-right-button {
  background: transparent;
  width: 98px;
  height: 98px;
  outline: none;
  border: none;
  color: #FFFFFF;
  font-size: 24px;
  line-height: 24px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 100%;
  padding: 20px;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: no-repeat center/100% 100% url(./assets/background.svg);
    position: absolute;
    top: 0;
    left: 0;
    @keyframes visualization-right-button--flash {
      50% { opacity: .4; }
    }
    animation: visualization-right-button--flash infinite linear 5s;
  }
  &:hover {
    color: #00ECFF;
  }
  &--red::after {
    background-image: url(./assets/background-red.svg);
  }
}
</style>
