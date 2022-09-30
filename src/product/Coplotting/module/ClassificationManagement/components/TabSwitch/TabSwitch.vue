// 标签页切换
<template>
  <nav :class="$style.container">
    <ul>
      <li
        v-for="(tab, tabIndex) in tabList"
        :key="tab"
        :class="{
          [$style.activeTab]: modelValue === tabIndex,
        }"
        :title="tab"
        @click="
          $emit('update:modelValue', tabIndex);
          $emit('change', tabIndex);
        "
      >
        {{ tab }}
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TabSwitch',
  props: {
    // 标签下标
    modelValue: {
      type: Number,
      default: 0,
    },
    // 标签列表
    tabList: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'update:modelValue',
    'change',
  ],
});
</script>

<style lang="scss" module>
.container {
  padding: 0;
  margin: 0;
  user-select: none;
  & > ul {
    list-style: none;
    margin: 0;
    padding: 0 10px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    // 标签页
    & > li {
      display: inline-block;
      font-size: 16px;
      color: #999;
      min-width: 80px;
      text-align: center;
      height: 44px;
      line-height: 44px;
      box-sizing: border-box;
      position: relative;
      cursor: pointer;
      &:hover {
        font-weight: 500;
      }
      // 激活的标签页
      &.activeTab {
        color: #333;
        font-weight: 500;
        // 蓝线
        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background: #0091FF;
          position: absolute;
          bottom: -1px;
          left: 0;
        }
      }
    }
  }
}
</style>
