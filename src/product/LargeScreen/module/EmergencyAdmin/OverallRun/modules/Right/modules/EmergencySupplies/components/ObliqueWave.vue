<template>
  <div :class="$style.container">
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ObliqueWave',
});
</script>

<style lang="scss" module>
@keyframes oblique-wave-spread {
  from {
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}
.container {
  width: 150px;
  height: 150px;
  position: absolute;
  bottom: -30px;
  left: 50%;
  border-radius: 100%;
  transform: rotateX(60deg) translateX(-50%);
  z-index: -1;
  & > div {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    box-shadow: inset 0 0 15px #32C5FF;
    animation: oblique-wave-spread ease-in infinite 5s;
    transform: translate(-50%, -50%);
    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        animation-delay: -#{$i}s;
      }
    }
  }
}
</style>
