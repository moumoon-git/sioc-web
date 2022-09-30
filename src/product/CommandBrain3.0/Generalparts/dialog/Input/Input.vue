<template>
  <div
    :class="[
      'visualization-dialog-input',
      { 'visualization-dialog-input--readonly': readonly },
    ]"
  >
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Input',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'input',
    'change',
    'update:modelValue',
  ],
  methods: {
    handleInput(event: InputEvent) {
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
      this.$emit('input', (event.target as HTMLInputElement).value);
    },
    handleChange(event: InputEvent) {
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
      this.$emit('change', (event.target as HTMLInputElement).value);
    },
  },
});
</script>

<style lang="scss">
.visualization-dialog-input {
  display: inline-flex;
  vertical-align: middle;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  padding-left: 12px;
  box-sizing: border-box;
  &:hover,
  &:focus-within {
    border-color: #56E9FF;
  }
  & > input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    flex: 1;
    color: #FFFFFF;
    font-size: 14px;
  }
  &--readonly {
    & > input {
      cursor: inherit;
    }
  }
}
</style>
