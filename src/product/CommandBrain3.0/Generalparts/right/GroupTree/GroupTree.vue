<template>
  <ul class="group-tree group-tree--root">
    <GroupTreeItem
      v-for="(item, index) in data"
      :key="index"
      :item="item"
      @node-click="$emit('node-click', $event)"
      @node-check="$emit('node-check', $event)"
      @node-uncheck="$emit('node-uncheck', $event)"
    >
      <template #default="{ item: innerItem }">
        <slot :item="innerItem" />
      </template>
      <template #icon>
        <slot name="icon" />
      </template>
    </GroupTreeItem>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GroupTreeItem from './components/GroupTreeItem.vue';

export default defineComponent({
  name: 'GroupTree',
  components: {
    // 分组树项
    GroupTreeItem,
  },
  provide() {
    return {
      checkedNodes: this.checkedNodes,
    };
  },
  props: {
    // 树形数据
    data: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    // 点击树节点
    'node-click',
    // 勾选树节点
    'node-check',
    // 取消勾选树节点
    'node-uncheck',
  ],
  data() {
    return {
      checkedNodes: new Map(),
    };
  },
  beforeUnmount() {
    this.checkedNodes.clear();
  },
  methods: {
    /**
     * @description 设置勾选
     * @param {Array} arr 勾选的节点数组
     */
    setCheck(arr: any[]) {
      this.checkedNodes.clear();
      arr.forEach((item) => {
        this.checkedNodes.set(item.id, item);
      });
    },
    /**
     * @description 获取勾选
     * @return 勾选的节点数组
     */
    getCheck(): any {
      const result: any[] = [];
      this.checkedNodes.forEach((val) => {
        result.push(val);
      });
      return result;
    },
  },
});
</script>

<style lang="scss">
.group-tree {
  list-style: none;
  margin: 0 0 10px 0;
  border-left: 1px dashed rgba(255, 255, 255, .5);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 400;
  padding-left: 26px;
  &--root {
    margin: 0;
    padding: 0 10px 0 20px;
    border: none;
  }
}
</style>
