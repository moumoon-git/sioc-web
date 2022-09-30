<template>
  <div :class="$style.container">
    <!-- 搜索输入框 -->
    <header>
      <ElInput
        v-model="searchKeyword"
        class="sv-input--search"
        clearable
        placeholder="请输入分类名称"
        suffix-icon="el-icon-search"
      />
    </header>
    <!-- 树形 -->
    <main>
      <ElTree
        ref="tree"
        class="sv-tree"
        icon-class="sv-tree__icon"
        :data="treeData"
        node-key="id"
        :props="propsSetting"
        empty-text="暂无数据"
        :filter-node-method="filterTreeData"
        @node-click="handleTreeClick"
      >
        <template #default="{ data, node }">
          <!-- 编辑输入框 -->
          <EditTreeNode
            v-if="editingFolder && editingFolder === data"
            :origin="editingFolder?.fileName"
            @cancel="editingFolder = null;"
            @confirm="handleUpdateFolder"
          />
          <div
            v-else
            :class="$style.treeNode"
          >
            <!-- 节点类型 -->
            <span
              v-if="data.fileType === 1"
              :class="$style.typeBasic"
            >基础</span>
            <span
              v-else-if="data.fileType === 2"
              :class="$style.typeDefault"
            >默认</span>
            <span
              v-else-if="data.fileType === 3"
              :class="$style.typeCustom"
            >自定义</span>
            <!-- 节点文字 -->
            <div
              :title="data.className || data.fileName"
            >
              {{ data.className || data.fileName }}
            </div>
            <!-- 编辑按钮 -->
            <button
              v-if="
                editable
                  && data.fileType
                  && (isBasic?.value || (!isBasic?.value && data.fileType === 3))
              "
              :class="$style.editIcon"
              @click.stop.prevent="handleEditFolder(data)"
            />
            <!-- 删除按钮 -->
            <template
              v-if="isBasic?.value || data.fileType === 3 || node.parent.data.fileType === 3"
            >
              <button
                v-if="!data?.basicClassList?.length && editable"
                :class="$style.deleteIcon"
                @click.stop.prevent="handleDelete(data)"
              />
            </template>
          </div>
        </template>
      </ElTree>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  watch,
} from 'vue';
import { ElTree } from 'element-plus';
import EditTreeNode from '@/product/Coplotting/module/TemplateManagement/components/EditTreeNode/EditTreeNode.vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import useSearch from './scripts/useSearch';

export default defineComponent({
  name: 'FilterTree',
  components: {
    EditTreeNode,
  },
  inject: [
    'isBasic',
  ],
  props: {
    // 树形数据
    treeData: {
      type: Array,
      default: () => [],
    },
    // 可编辑
    editable: {
      type: Boolean,
      default: true,
    },
    propsSetting: {
      type: Object,
      default: () => ({
        children: 'basicClassList',
      }),
    },
  },
  emits: [
    'click-class',
    'delete-folder',
    'delete-class',
    'click-folder',
    'refresh',
  ],
  setup(props, { emit }) {
    const { treeData } = toRefs(props);
    // ElTree 引用
    const tree = ref<typeof ElTree | null>(null);
    // 搜索与筛选
    const { searchKeyword, filterTreeData } = useSearch(tree);
    watch(treeData, () => {
      searchKeyword.value = '';
    }, {
      deep: true,
    });
    // 点击分类
    const handleTreeClick = (data: any, node: any) => {
      if (data.className) {
        const tmp = { ...data };
        tmp.parentNode = { ...node.parent.data };
        emit('click-class', tmp);
      }
      if (data.fileName) {
        emit('click-folder', data);
      }
    };
    /**
     * 删除节点
     *
     * @param data 节点数据
     */
    const handleDelete = (data: any) => {
      if (data.fileName) {
        emit('delete-folder', data.id);
      } else {
        emit('delete-class', data.id);
      }
    };
    const editingFolder = ref<any>(null);
    watch(treeData, () => {
      editingFolder.value = null;
    }, { immediate: true, deep: true });
    /**
     * 编辑文件夹名
     *
     * @param data 正在编辑的文件夹对象
     */
    const handleEditFolder = (data: any) => {
      editingFolder.value = data;
    };
    /**
     * 更新文件夹名
     *
     * @param newName 新的名
     */
    const handleUpdateFolder = (newName: string) => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistclassfile/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ...editingFolder.value,
          fileName: newName,
        },
      } as const;
      editingFolder.value = null;
      $http(request).then((response) => {
        if (response.code === 0 || response.errorcode === 0) {
          emit('refresh');
        } else {
          $message.error(`修改文件夹名失败，错误代码${response.code || response.errorcode}，错误信息：${response.msg || response.message}`);
        }
      }).catch((error: Error) => {
        $message.error(`修改文件夹名失败，错误信息：${error}`);
      });
    };
    return {
      searchKeyword,
      filterTreeData,
      tree,
      handleTreeClick,
      handleDelete,
      editingFolder,
      handleEditFolder,
      handleUpdateFolder,
    };
  },
  methods: {
    setCurrentNode(key: number) {
      (this as any).$refs.tree.setCurrentKey(key);
    },
    getCurrentNode() {
      return (this as any).$refs.tree.getCurrentNode();
    },
  },
});
</script>

<style lang="scss" module src="./styles/FilterTree.scss" />
