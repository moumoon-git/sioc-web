<template>
  <ul
    v-if="refreshFlag"
    class="lazy-tree lazy-tree--root"
  >
    <LazyTreeItem
      v-for="item in data"
      :key="item.id"
      :item="item"
      @node-click="$emit('node-click', $event)"
      @node-check="handleCheck"
      @node-uncheck="handleUncheck"
      @lazy-load="handleLazyload"
    >
      <template #default="{ item: innerItem }">
        <slot :item="innerItem" />
      </template>
      <template #icon>
        <slot name="icon" />
      </template>
    </LazyTreeItem>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LazyTreeItem from './components/LazyTreeItem.vue';

export default defineComponent({
  name: 'LazyTree',
  components: {
    // 分组树项
    LazyTreeItem,
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
    // 懒加载
    'lazy-load',
  ],
  data() {
    return {
      refreshFlag: true,
      checkedNodes: new Map(),
    };
  },
  watch: {
    // 数据替换之后，需要刷新树组件内部状态
    data() {
      this.refreshFlag = false;
      this.$nextTick(() => {
        this.refreshFlag = true;
      });
    },
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
    handleLazyload(node: any, resolve: any) {
      this.$emit('lazy-load', node, resolve);
    },
    handleCheck(node: any, parent: any) {
      this.$emit('node-check', node, parent);
    },
    handleUncheck(node: any, parent: any) {
      this.$emit('node-uncheck', node, parent);
    },
  },
});
</script>

<style lang="scss">
.lazy-tree {
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
