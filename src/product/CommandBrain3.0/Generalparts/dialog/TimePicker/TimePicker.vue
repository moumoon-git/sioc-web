<template>
  <div class="visualization-dialog-time-picker">
    <input
      :value="modelValue"
      type="text"
      placeholder="请选择时间"
      onfocus="(this.type='time')"
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
  name: 'TimePicker',
  props: {
    modelValue: {
      type: String,
      default: '',
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
.visualization-dialog-time-picker {
  display: inline-block;
  vertical-align: middle;
  position: relative;
  & > input {
    background: #000;
    color: #FFF;
    border: 1px solid rgba(255, 255, 255, .65);
    outline: none;
    height: 32px;
    width: 120px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      border-color: #56E9FF;
    }
    &[type="text"] {
      padding-left: 12px;
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
