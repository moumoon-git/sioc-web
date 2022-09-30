<template>
  <div class="visualization-left-percentage">
    <div
      :style="{
        width: `${value}%`
      }"
    />
    <div />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Percentage',
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
  },
};
</script>

<style lang="scss">
.visualization-left-percentage {
  height: 8px;
  position: relative;
  display: flex;
  align-items: flex-end;
  & > div:first-child {
    height: 8px;
    background: linear-gradient(270deg, #00F1F3 0%, #0076CC 100%);
    flex-shrink: 0;
    transition: width .3s;
  }
  & > div:last-child {
    width: 100%;
    height: 3px;
    opacity: .3;
    background: linear-gradient(270deg, #00F1F3 0%, #0076CC 100%);
    flex-shrink: 1;
  }
}
</style>
