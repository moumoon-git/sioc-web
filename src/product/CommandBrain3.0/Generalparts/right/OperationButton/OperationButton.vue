<template>
  <span
    class="visualization-right-operation-button"
  >
    <button
      v-for="(button, index) in list"
      :key="index"
      :class="`visualization-right-operation-button--${button}`"
      @click.stop="$emit(button)"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OperationButton',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style lang="scss">
.visualization-right-operation-button {
  & > button {
    vertical-align: middle;
    width: 16px;
    height: 16px;
    cursor: pointer;
    margin: 0 3px;
    position: relative;
    background: no-repeat center/100% 100% transparent;
    outline: none;
    border: none;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    &:active {
      top: 1px;
    }
    $iconList: edit, up, down, delete;
    @each $icon in $iconList {
      &.visualization-right-operation-button--#{$icon} {
        background-image: url(./assets/#{$icon}.svg);
        &:hover {
          background-image: url(./assets/#{$icon}-hover.svg);
        }
      }
    }
  }
}
</style>
