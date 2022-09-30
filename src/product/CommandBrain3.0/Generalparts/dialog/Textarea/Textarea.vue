<template>
  <textarea
    :value="modelValue"
    class="visualization-dialog-textarea"
    @change="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Textarea',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: [
    'update:modelValue',
  ],
});
</script>

<style lang="scss">
.visualization-dialog-textarea {
  padding: 4px 12px;
  resize: none;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.65);
  outline: none;
  background: transparent;
  color: #FFFFFF;
  &:hover,
  &:focus {
    border-color: #56E9FF;
  }
  // 滚动条
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #56E9FF;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
</style>
