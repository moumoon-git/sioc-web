<template>
  <div
    :style="{
      '--getWidth': `${width}px`,
      '--getHeight': `${height}px`,
      background: modelValue ? activebgr : bgr,
      borderRadius: `${radius}px`,
    }"
    :class="$style.switchs"
    @click="setSwitchFlag"
  >
    <span>{{ modelValue ? leftTxt : ' ' }}</span>
    <span>{{ !modelValue ? rightTxt : ' ' }}</span>
    <div :class="modelValue ? $style.switchs_action : ''" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 62,
    },
    height: {
      type: Number,
      default: 31,
    },
    bgr: {
      type: String,
      default: '#CCCCCC',
    },
    activebgr: {
      type: String,
      default: '#0091FF',
    },
    radius: {
      type: Number,
      default: 20,
    },
    leftTxt: {
      type: String,
      default: '开',
    },
    rightTxt: {
      type: String,
      default: '关',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    function setSwitchFlag() {
      if (!props.disabled) {
        context.emit('update:modelValue', !props.modelValue);
      }
    }
    return {
      setSwitchFlag,
    };
  },
});
</script>

<style lang="scss" module>
.switchs {
  width: var(--getWidth);
  height: var(--getHeight);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 400;
  color: #ffffff;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  & > div {
    position: absolute;
    left: 3px;
    top: 3px;
    width: calc(var(--getHeight) - 6px);
    height: calc(var(--getHeight) - 6px);
    background: #ffffff;
    border-radius: 50%;
    transition: all 0.3s;
  }
  .switchs_action {
    left: calc(100% - (var(--getHeight) - 6px + 3px));
  }
}
</style>
