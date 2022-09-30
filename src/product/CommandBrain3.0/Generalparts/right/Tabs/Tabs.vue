<template>
  <div class="visualization-right-tabs">
    <button
      v-for="(name, index) in list"
      :key="index"
      :class="{ 'visualization-right-tabs__active': index === modelValue }"
      @click="$emit('update:modelValue', index); $emit('change', index);"
    >
      {{ name }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Tabs',
  props: {
    list: {
      type: Array,
      default: () => ['标签1', '标签2'],
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'change',
    'update:modelValue',
  ],
});
</script>

<style lang="scss">
.visualization-right-tabs {
  display: flex;
  height: 32px;
  align-items: stretch;
  user-select: none;
  & > button {
    outline: none;
    border: none;
    background: rgba(0, 193, 222, .25);
    color: #A6ADB4;
    flex: 1;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    position: relative;
    transition: color .3s;
    &:not(:last-child) {
      border-right: 1px solid rgba(86, 233, 255, .29);
    }
    &:hover {
      color: #00ECFF;
    }
  }
  & > &__active {
    color: #00ECFF;
    background: linear-gradient(90deg, rgba(0, 193, 222, .38) 0%, transparent 100%);
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);
    }
  }
}
</style>
