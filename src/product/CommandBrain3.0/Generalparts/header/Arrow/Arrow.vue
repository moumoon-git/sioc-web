<template>
  <button
    :class="[
      'visualization-header-arrow',
      { 'visualization-header-arrow--reverse': reverse },
    ]"
  />
</template>

<script lang="ts">
export default {
  name: 'Arrow',
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
@keyframes visualization-header-arrow {
  from {
    opacity: .3;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
}
.visualization-header-arrow {
  outline: none;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  width: 50px;
  height: 18px;
  transform: translate3d(0, 0, 0);
  transition: transform .3s;
  &::before,
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 8px;
    position: absolute;
    left: 0;
    background: no-repeat center/100% 100% url(./assets/arrow.svg);
  }
  &::before {
    animation: visualization-header-arrow infinite 1s ease-in-out;
    animation-delay: .5s;
  }
  &::after {
    animation: visualization-header-arrow infinite 1s ease-in-out;
  }
  &--reverse {
    transform: scaleY(-1) translate3d(0, 0, 0);
  }
}
</style>
