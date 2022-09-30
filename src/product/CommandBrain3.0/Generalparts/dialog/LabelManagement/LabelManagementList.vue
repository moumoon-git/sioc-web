<template>
  <div class="label-management-list">
    <!-- 【+】按钮 -->
    <button
      v-if="editable"
      @click="$emit('add')"
    >
      +
    </button>
    <!-- 标签列表 -->
    <div
      v-for="(label, labelIndex) in modelValue"
      :key="labelIndex"
      :class="{
        'label-management-list__label--delete': editable
      }"
    >
      <slot :item="label">
        {{ label.name }}
      </slot>
      <button @click="handleDelete(labelIndex)">
        ×
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LabelManagementList',
  props: {
    // 是否可编辑（新增、删除）
    editable: {
      type: Boolean,
      default: true,
    },
    // 标签列表
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'add',
    'update:modelValue',
  ],
  methods: {
    /**
     * 删除标签
     *
     * @param {Number} index 标签下标
     */
    handleDelete(index: number) {
      this.$emit('update:modelValue', this.modelValue.filter((item, i) => i !== index));
    },
  },
});
</script>

<style lang="scss">
.label-management-list {
  // <!-- 【+】按钮 -->
  & > button:first-child {
    background: #56E9FF;
    border-radius: 100%;
    border: none;
    outline: none;
    width: 24px;
    height: 24px;
    color: #000000;
    cursor: pointer;
    margin: 0 5px 5px 0;
    vertical-align: middle;
    &:hover { opacity: .7; }
  }
  // 标签
  & > div {
    display: inline-block;
    vertical-align: middle;
    height: 24px;
    line-height: 24px;
    padding: 0 16px;
    margin: 0 5px 5px 0;
    font-size: 12px;
    background: rgba(166, 173, 180, .25);
    border-radius: 16px;
    box-shadow: 0px 0px 3px 0px rgba(86, 233, 255, .25) inset;
    position: relative;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:nth-child(4n) {
      color: #56E9FF;
    }
    &:nth-child(4n + 1) {
      color: #F2B626;
    }
    &:nth-child(4n + 2) {
      color: #F66E6E;
    }
    &:nth-child(4n + 3) {
      color: #0091FF;
    }
    & > button:last-child {
      display: none;
      height: 18px;
      margin: 0;
      padding: 0;
      line-height: 18px;
      border: none;
      outline: none;
      background: transparent;
      color: #FFFFFF;
      font-size: 18px;
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      &:hover {
        color: #56E9FF;
      }
    }
    &.label-management-list__label--delete {
      &:hover {
        padding-left: 13px;
        padding-right: 19px;
        & > button:last-child {
          display: inline-block;
        }
      }
    }
  }
}
</style>
