<template>
  <ul class="department-tree">
    <DepartmentTreeItem
      v-for="treeItem in treeData"
      :key="treeItem[propsSetting.id]"
      :tree-item-data="treeItem"
      :layer="0"
      @node-click="handleNodeClick"
    >
      <template #default="{ item }">
        <slot :item="item">
          {{ item.name }}
        </slot>
      </template>
    </DepartmentTreeItem>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DepartmentTreeItem from './DepartmentTreeItem.vue';

export default defineComponent({
  name: 'DepartmentTree',
  components: {
    DepartmentTreeItem,
  },
  provide() {
    return {
      propsSetting: this.propsSetting,
      currentNode: this.currentNode,
    };
  },
  props: {
    // 树形数据
    treeData: {
      type: Array,
      default: () => [],
    },
    // 树形数据属性名配置
    propsSetting: {
      type: Object,
      default: () => ({
        id: 'id',
        name: 'name',
        children: 'children',
      }),
    },
  },
  emits: [
    'node-click',
  ],
  data() {
    return {
      // 当前节点
      currentNode: ref({}),
    };
  },
  methods: {
    handleNodeClick(node: any) {
      this.$emit('node-click', node);
      (this.currentNode as any).value = node;
    },
  },
});
</script>

<style lang="scss">
.department-tree {
  color: #FFF;
  list-style: none;
  user-select: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
