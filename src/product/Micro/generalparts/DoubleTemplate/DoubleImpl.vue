<template>
  <DoubleTemplate>
    <!-- A. 左边栏 -->
    <template #left>
      <div
        v-loading="treeLoading"
        :class="$style.left"
      >
        <slot name="treetop" />
        <!-- 树形筛选框 -->
        <ElInput
          v-model="treeKeyword"
          class="sbs-input"
          clearable
          @change="handleTreeFilter"
        >
          <template #suffix>
            <i class="el-input__icon el-icon-search" />
          </template>
        </ElInput>
        <!-- 树形组件 -->
        <ElTree
          v-bind="treeSetting.props || {}"
          ref="elTree"
          class="sbs-tree"
          :data="treeData"
          :filter-node-method="treeFilterMethod"
          node-key="id"
          @node-click="handleTreeNodeClick"
        >
          <template #default="{ node, data }">
            <slot
              name="tree"
              :node="node"
              :data="data"
            >
              {{ data.name }}
            </slot>
          </template>
        </ElTree>
      </div>
    </template>
    <!-- B. 右边栏 -->
    <template #right>
      <div
        v-loading="tableLoading"
        :class="$style.right"
      >
        <!-- 标题栏 -->
        <header>
          <span
            v-if="title"
            class="sbs-title"
          >{{ title }}</span>
          <ElInput
            v-model="tableKeyword"
            class="sbs-input"
            clearable
            @change="handleTableSearch"
          >
            <template #suffix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </ElInput>
          <slot name="operation" />
        </header>
        <!-- 表格 -->
        <main>
          <ElTable
            v-bind="tableSetting.props || {}"
            ref="elTable"
            class="sbs-table"
            border
            height="100%"
            :data="tableData"
          >
            <slot name="table" />
          </ElTable>
        </main>
        <!-- 分页器 -->
        <footer>
          <ElPagination
            v-model:currentPage="curPage"
            v-model:page-size="pageSize"
            class="sbs-pagination"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="getTable()"
            @current-change="getTable()"
          />
        </footer>
      </div>
    </template>
  </DoubleTemplate>
</template>

<script lang="ts" setup>
import {
  ref,
  PropType,
  watch,
} from 'vue';
import {
  ElTree,
  ElTable,
  ElInput,
  ElPagination,
} from 'element-plus';
import DoubleTemplate from './DoubleTemplate.vue';
import useTable, { TableSetting } from './hooks/useTable';
import useTree, { TreeSetting } from './hooks/useTree';

const props = defineProps({
  title: {
    type: String,
  },
  tableSetting: {
    type: Object as PropType<
      TableSetting
      & {
        props?: Record<string, any>,
      }
    >,
    required: true,
  },
  treeSetting: {
    type: Object as PropType<
      TreeSetting
      & {
        props?: Record<string, any>,
        onNodeClick?: (data?: any, node?: any) => void,
      }
    >,
    required: true,
  },
});

/* ********************************************************** */
/* ************************ 表格的逻辑 ************************ */
// ElTable 组件实例
const elTable = ref<InstanceType<typeof ElTable>>();
// 表格数据相关参数的状态，以及请求方法
const {
  tableData,
  getTable,
  groupIds,
  keyword: tableKeyword,
  pageSize,
  curPage,
  totalCount,
  isLoading: tableLoading,
} = useTable(props.tableSetting);
const handleTableSearch = () => {
  curPage.value = 1;
  getTable();
};
/* ************************ 表格的逻辑 ************************ */
/* ********************************************************** */

/* ********************************************************** */
/* ************************ 树形的逻辑 ************************ */
// 树形数据相关参数的状态，以及请求方法
const {
  treeData,
  getTree,
  isLoading: treeLoading,
} = useTree(props.treeSetting);
/**
 * 树形节点点击，请求表格数据
 * @param data 节点的数据
 * @param node 节点本身
 */
const handleTreeNodeClick = (data: any, node: any) => {
  // 1. 外部的 hook
  if (props.treeSetting.onNodeClick) {
    props.treeSetting.onNodeClick(data, node);
  }
  // 2. 更新请求参数状态
  groupIds.value = data.id ? [data.id] : [];
  curPage.value = 1;
  tableKeyword.value = '';
  // 3. 请求数据
  getTable();
};
// ElTable 组件实例
const elTree = ref<InstanceType<typeof ElTree>>();
// 树形搜索关键词
const treeKeyword = ref('');
// 树形筛选的方法
const treeFilterMethod = (value: string, data: any) => JSON.stringify(data).includes(value);
// 触发树形筛选
const handleTreeFilter = () => elTree.value!.filter(treeKeyword.value);
/* ************************ 树形的逻辑 ************************ */
/* ********************************************************** */

// 初始化数据
getTable();
getTree();

// 树形初始化选择“全部”节点
const unwatch = watch(treeData, () => {
  setTimeout(() => {
    if (!elTree.value!.getCurrentKey()) {
      elTree.value!.setCurrentKey(0);
    }
    unwatch();
  }, 0);
});

defineExpose({
  elTree,
  elTable,
  getTree,
  getTable,
});
</script>

<style lang="scss" module>
.left,
.right {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.left {
  :global(.sbs-input) {
    margin: 10px;
    width: calc(100% - 20px);
  }
  :global(.sbs-tree) {
    flex: 1;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
.right {
  header {
    display: flex;
    align-items: center;
    padding: 10px;
    :global(.sbs-input) {
      margin-left: auto;
      width: 300px;
    }
  }
  main {
    flex: 1 1;
    height: 100%;
  }
  footer {
    text-align: right;
    padding: 10px;
    border-top: 1px solid #f2f2f2;
    :global(.sbs-pagination) {
      margin-top: 0;
    }
  }
}
</style>
