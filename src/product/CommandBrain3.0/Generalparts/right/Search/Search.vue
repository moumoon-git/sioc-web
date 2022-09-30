<template>
  <div class="visualization-right-search">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
      @change="handleChange"
    >
    <button
      :class="{
        'visualization-right-search--clear': modelValue,
      }"
      @click="handleClear"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Search',
  props: {
    placeholder: {
      type: String,
      default: '请输入关键词',
    },
    modelValue: {
      type: String,
      default: '',
    },
    modelModifiers: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    'update:modelValue',
    'change',
  ],
  methods: {
    handleInput(event: Event): void {
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
      if (!this.modelModifiers.lazy) {
        this.$emit('change', (event.target as HTMLInputElement).value);
      }
    },
    handleChange(event: Event): void {
      if (this.modelModifiers.lazy) {
        this.$emit('change', (event.target as HTMLInputElement).value);
      }
    },
    handleClear() {
      if (this.modelValue) {
        this.$emit('update:modelValue', '');
        this.$emit('change', '');
      }
    },
  },
});
</script>

<style lang="scss">
.visualization-right-search {
  display: inline-flex;
  width: 198px;
  height: 38px;
  line-height: 38px;
  box-sizing: border-box;
  position: relative;
  background: #141D1F;
  border: 1px solid #01607D;
  vertical-align: top;
  padding: 0 30px 0 14px;
  &:hover {
    border-color: #56E9FF;
  }
  & > input {
    width: calc(100% - 20px);
    background: transparent;
    outline: none;
    border: none;
    color: #FFFFFF;
    font-size: 16px;
    &::placeholder {
      color: #A6ADB4;
    }
  }
  & > button {
    position: absolute;
    top: 50%;
    right: 11px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border: none;
    outline: none;
    cursor: pointer;
    background: no-repeat center/100% url(./assets/search.svg);
    &.visualization-right-search--clear {
      background-image: url(./assets/clear.svg);
      cursor: pointer;
      &:hover {
        opacity: .7;
      }
    }
  }
}
</style>
