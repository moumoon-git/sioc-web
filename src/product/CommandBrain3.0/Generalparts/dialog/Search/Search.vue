<template>
  <div class="visualization-dialog-search">
    <!-- 放大镜图标 -->
    <i />
    <!-- 输入框 -->
    <input
      :placeholder="placeholder"
      type="text"
      :value="modelValue"
      @change="$emit('change', $event.target.value);"
      @input="$emit('update:modelValue', $event.target.value);"
    >
    <!-- 清空按钮 -->
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '');$emit('change', '');"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Search',
  props: {
    // 占位
    placeholder: {
      type: String,
      default: '请输入',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: [
    'change',
    'update:modelValue',
  ],
});
</script>

<style lang="scss">
.visualization-dialog-search {
  display: inline-flex;
  align-items: center;
  vertical-align: center;
  box-sizing: border-box;
  height: 38px;
  padding: 10px;
  background: rgba(20, 29, 31, .68);
  // 放大镜图标
  & > i:first-child {
    display: block;
    width: 14px;
    height: 14px;
    background: no-repeat center/100% 100% url(./assets/search.svg);
    margin-right: 10px;
  }
  // 输入框
  & > input {
    border: none;
    outline: none;
    flex: 1;
    width: 100%;
    color: #FFFFFF;
    background: none;
    &::placeholder { color: #A6ADB4; }
  }
  // 清除按钮
  & > button:last-child {
    border: none;
    outline: none;
    cursor: pointer;
    width: 14px;
    height: 14px;
    margin-left: 10px;
    background: no-repeat center/100% 100% url(./assets/clear.svg);
    &:hover { opacity: .7; }
  }
}
</style>
