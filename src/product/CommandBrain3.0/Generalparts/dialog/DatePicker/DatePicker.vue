<template>
  <div
    class="visualization-dialog-date-picker"
  >
    <input
      :value="modelValue"
      type="text"
      placeholder="请选择日期"
      onfocus="(this.type='date')"
      onblur="(this.type='text')"
      :min="min"
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
    min: {
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
.visualization-dialog-date-picker {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  & > input {
    border: 1px solid rgba(255, 255, 255, .65);
    width: 140px;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    outline: none;
    cursor: pointer;
    background: #000000;
    color: #FFFFFF;
    font-size: 14px;
    text-align: left;
    vertical-align: top;
    padding-left: 10px;
    &:hover {
      border-color: #56E9FF;
    }
    &::placeholder {
      color: #686868;
    }
    &::-webkit-calendar-picker-indicator {
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
