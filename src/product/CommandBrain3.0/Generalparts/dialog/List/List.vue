<template>
  <ul class="visualization-dialog-list">
    <li
      v-for="(item, index) in list"
      :key="index"
    >
      <slot
        :item="item"
        :index="index"
      >
        {{ item }}
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'List',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style lang="scss">
.visualization-dialog-list {
  list-style: none;
  margin: 0;
  padding: 0;
  & > li {
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #FFF;
    padding: 6px 10px;
    position: relative;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 2px;
      top: 2px;
      color: #A6ADB4;
      border-top: 3px solid currentColor;
      border-left: 3px solid currentColor;
      border-right: 3px solid transparent;
      border-bottom: 3px solid transparent;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: 2px;
      bottom: 2px;
      color: #A6ADB4;
      border-bottom: 3px solid currentColor;
      border-right: 3px solid currentColor;
      border-left: 3px solid transparent;
      border-top: 3px solid transparent;
    }
    &:hover {
      color: #56E9FF;
      border-color: #56E9FF;
    }
    &:hover::before,
    &:hover::after {
      color: #56E9FF;
    }
  }
}
</style>
