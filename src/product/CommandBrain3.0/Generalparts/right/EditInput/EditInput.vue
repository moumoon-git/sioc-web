// 编辑框组件，用来重命名
<template>
  <div
    class="visualization-right-edit-input"
  >
    <!-- 输入框 -->
    <input
      v-model="innerValue"
      :placeholder="placeholder"
    >
    <!-- 确定按钮 -->
    <button @click="handleConfirm" />
    <!-- 取消按钮 -->
    <button @click.stop="handleCancel" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
  },
  emits: [
    'confirm',
    'cancel',
  ],
  data() {
    return {
      innerValue: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.innerValue = val;
      },
    },
  },
  methods: {
    /**
     * 确认输入
     */
    handleConfirm() {
      this.$emit('confirm', this.innerValue);
    },
    /**
     * 取消输入
     */
    handleCancel() {
      this.innerValue = this.value;
      this.$emit('cancel');
    },
  },
});
</script>

<style lang="scss">
.visualization-right-edit-input {
  border: 1px solid rgba(255, 255, 255, 0.65);
  display: inline-flex;
  align-items: center;
  &:focus-within,
  &:hover {
    border-color: #00ECFF;
  }
  & > input {
    flex: 1;
    width: calc(100% - 50px);
    margin: 0 5px;
    border: none;
    font-size: inherit;
    color: #FFF;
    background: transparent;
    border: none;
    outline: none;
    &::placeholder {
      color: #A6ADB4;
    }
  }
  & > button {
    flex-shrink: 0;
    border: none;
    outline: none;
    background: no-repeat center/100% url(./assets/confirm.svg);
    width: 14px;
    height: 14px;
    margin-right: 5px;
    cursor: pointer;
    position: relative;
    &:hover {
      opacity: .7;
    }
    &:active {
      top: 1px;
    }
    &:last-child {
      background-image: url(./assets/cancel.svg);
    }
  }
}
</style>
