<template>
  <div
    class="visualization-right-date-picker"
  >
    <input
      v-bind="$attrs"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      onfocus="(this.type='date')"
      onblur="(this.type='text')"
      @change="handleChange"
    >
    <button
      v-show="modelValue"
      @click.stop="handleClear"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DatePicker',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择日期',
    },
  },
  emits: [
    'update:modelValue',
    'change',
  ],
  methods: {
    handleChange(event: any) {
      this.$emit('update:modelValue', event.target.value);
      this.$emit('change', event.target.value);
    },
    handleClear() {
      this.$emit('update:modelValue', '');
      this.$emit('change', '');
    },
  },
});
</script>

<style lang="scss">
.visualization-right-date-picker {
  display: inline-block;
  position: relative;
  & > input {
    border: 1px solid #01607D;
    width: 155px;
    height: 38px;
    line-height: 38px;
    box-sizing: border-box;
    outline: none;
    cursor: pointer;
    background: #141D1F;
    color: #00C1DE;
    font-size: 16px;
    text-align: left;
    vertical-align: top;
    padding-left: 10px;
    &:hover {
      border-color: #56E9FF;
    }
    &::placeholder {
      color: #A6ADB4;
    }
    &::-webkit-calendar-picker-indicator {
      color: #FFFFFF;
      color: #999;
      height: 8px;
      position: relative;
      outline: none;
      width: 12px;
      margin-right: 7px;
      margin-left: 0;
      cursor: pointer;
      background: no-repeat center/60% url(./assets/arrow.svg);
    }
  }
  & > button {
    display: none;
    background: no-repeat center/100% url(./assets/clear.svg);
    outline: none;
    border: none;
    width: 14px;
    height: 14px;
    position: absolute;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    &:hover {
      opacity: .7;
    }
  }
  &:hover > button {
    display: inline-block;
  }
}
</style>
