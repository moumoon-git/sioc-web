<template>
  <div
    v-show="list?.length"
    class="visualization-right-button-radio"
  >
    <div
      v-for="(tab, tabIndex) in list"
      :key="tab"
      :class="[
        'visualization-right-button-radio__item',
        {
          'visualization-right-button-radio__item--active': modelValue === tabIndex,
        },
      ]"
      @click="
        $emit('update:modelValue', tabIndex);
        $emit('change', tabIndex);
      "
    >
      {{ tab?.name ?? tab }}
      {{ tab?.value ? `(${tab.value})` : '' }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  name: 'ButtonRadio',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'update:modelValue',
    'change',
  ],
});
</script>

<style lang="scss">
.visualization-right-button-radio {
  padding: 10px 7px 0;
  user-select: none;
  &__item {
    $cyan: #00C1DC;
    display: inline-block;
    color: $cyan;
    box-sizing: border-box;
    border: 1px solid $cyan;
    height: 30px;
    line-height: 28px;
    padding: 0 10px;
    margin: 0 3px 10px;
    cursor: pointer;
    transition: all .2s;
    &--active {
      color: #FFF;
      background: $cyan;
    }
    &:hover {
      filter: brightness(120%);
    }
  }
}
</style>
