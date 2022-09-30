<template>
  <button
    :class="[
      'visualization-left-wave',
      {
        'visualization-left-wave--red': type === 'red',
      },
    ]"
    :style="{
      '--wave-color': color,
    }"
  >
    <div />
    <div />
    <div />
    <div />
    <div><slot /></div>
  </button>
</template>

<script lang="ts">
export default {
  name: 'Wave',
  props: {
    type: {
      type: String,
      default: 'green',
    },
  },
  computed: {
    color(): string {
      return (this as any).type === 'red' ? '#F66E6E' : '#00EFCC';
    },
  },
};
</script>

<style lang="scss">
.visualization-left-wave {
  @keyframes visualization-left-wave__wave {
    0% {
      transform: scale(.3) translate(-50%, -50%) translate3d(0, 0, 0);
      opacity: 1;
    }
    50% {
      transform: scale(.65) translate(-50%, -50%) translate3d(0, 0, 0);
    }
    100% {
      transform: scale(1) translate(-50%, -50%) translate3d(0, 0, 0);
      opacity: 0;
    }
  }
  min-width: 60px;
  min-height: 60px;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  position: relative;
  background: transparent;
  & > div {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translate3d(0, 0, 0);
    transform-origin: top left;
    opacity: 0;
  }
  & > div:first-child {
    animation: visualization-left-wave__wave infinite 4s linear 0s;
    box-shadow: 0 0 5px 10px var(--wave-color) inset;
  }
  & > div:nth-child(2) {
    animation: visualization-left-wave__wave infinite 4s linear 1s;
    box-shadow: 0 0 5px 5px var(--wave-color) inset;
  }
  & > div:nth-child(3) {
    animation: visualization-left-wave__wave infinite 4s linear 2s;
    box-shadow: 0 0 5px 10px var(--wave-color) inset;
  }
  & > div:nth-child(4) {
    animation: visualization-left-wave__wave infinite 4s linear 3s;
    box-shadow: 0 0 5px 5px var(--wave-color) inset;
  }
  & > div:last-child {
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: var(--wave-color);
    color: #ffffff;
    opacity: 1;
  }
}
</style>
