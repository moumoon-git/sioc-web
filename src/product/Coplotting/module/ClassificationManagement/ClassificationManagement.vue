// 分类管理弹窗
<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    :title="isBasic ? '基础分类管理' : '分类管理'"
    width="800px"
  >
    <TabSwitch
      v-model="activeTabIndex"
      :tab-list="tabList"
    />
    <main :class="$style.container">
      <!-- 左边树形 -->
      <section :class="$style.left">
        <div>
          <ElButton
            type="text"
            @click="isAddingFolder = true;"
          >
            新增文件夹
          </ElButton>
          <ElButton
            type="text"
            @click="isClassEditting = true; selectedClass = {};"
          >
            新增分类
          </ElButton>
          <!-- TODO: 搜索管理 -->
          <!-- <ElButton
            type="text"
            disabled
          >
            搜索管理
          </ElButton> -->
        </div>
        <!-- 新增文件夹组件 -->
        <AddFolder
          v-if="isAddingFolder"
          style="margin: 10px 10px 0;"
          @cancel="isAddingFolder = false;"
          @confirm="handleAddFolder"
        />
        <!-- 树形 -->
        <FilterTree
          ref="FilterTreeRef"
          :tree-data="filteredFolderList"
          @delete-folder="handleDeleteFolder"
          @delete-class="handleDeleteClass"
          @click-class="handleClickClass"
          @refresh="handleRefresh"
        />
      </section>
      <!-- 右边详情 -->
      <section :class="$style.right">
        <FormDetail
          v-if="selectedClass?.id || isClassEditting"
          ref="FormDetailRef"
          :is-class-editting="isClassEditting"
          :folder-list="
            isBasic
              ? folderList.filter((item) => item.fileType === 1)
              : folderList
          "
          :selected-class="selectedClass"
          :is-default-class="selectedClass?.parentNode?.fileType === 2"
          @refresh="handleRefresh"
        />
      </section>
    </main>
    <!-- 底部按钮 -->
    <footer :class="$style.footer">
      <div
        v-if="!isClassEditting && selectedClass?.id"
        :class="$style.templateButton"
      >
        <ElButton
          v-if="/* 只有点分类有效 */activeTabIndex === 0"
          type="text"
          @click="generateImportTemplate"
        >
          生成导入模板
        </ElButton>
        <ElButton
          type="text"
          @click="saveAsTemplate"
        >
          存为模板
        </ElButton>
        <ElButton
          type="text"
          @click="copyClassification"
        >
          复制分类
        </ElButton>
        <ElButton
          v-if="
            isBasic && selectedClass?.parentNode?.fileType === 1
              || !isBasic && selectedClass?.parentNode?.fileType !== 1
          "
          type="text"
          @click="handleOpenStatisitcTemplateManagementDialog"
        >
          统计模板管理
        </ElButton>
      </div>
      <template v-if="isClassEditting">
        <ElButton
          class="sv-button"
          type="primary"
          @click="handleSave"
        >
          保存
        </ElButton>
        <ElButton
          class="sv-button"
          @click="handleCancelAdd"
        >
          取消
        </ElButton>
      </template>
      <template v-else>
        <template v-if="isBasic || selectedClass?.parentNode?.fileType !== 1">
          <ElButton
            v-if="selectedClass?.id"
            class="sv-button"
            type="primary"
            @click="isClassEditting = true;"
          >
            修改
          </ElButton>
        </template>
        <ElButton
          class="sv-button"
          @click="handleClose"
        >
          取消
        </ElButton>
      </template>
    </footer>
  </ElDialog>
  <!-- 存为模板弹窗 -->
  <SaveAsTemplateDialog
    ref="SaveAsTemplateDialogRef"
    :class-id="selectedClass?.id"
  />
  <!-- 统计模板管理弹窗 -->
  <StatisticTemplateManagementDialog
    ref="StatisticTemplateManagementDialogRef"
    :class-id="selectedClass?.id"
  />
</template>

<script lang="ts">
import {
  defineComponent, ref, provide, getCurrentInstance, watch,
} from 'vue';
import TabSwitch from './components/TabSwitch/TabSwitch.vue';
import FilterTree from './components/FilterTree/FilterTree.vue';
import FormDetail from './components/FormDetail/FormDetail.vue';
import AddFolder from './components/AddFolder/AddFolder.vue';
import SaveAsTemplateDialog from './components/SaveAsTemplateDialog/SaveAsTemplateDialog.vue';
import StatisticTemplateManagementDialog from './components/StatisticTemplateManagementDialog/StatisticTemplateManagementDialog.vue';
import useFolder from './scripts/useFolder';

export default defineComponent({
  name: 'ClassificationManagement',
  components: {
    // 标签页切换组件
    TabSwitch,
    // 筛选树形组件
    FilterTree,
    // 表格详情
    FormDetail,
    // 新增文件夹组件
    AddFolder,
    // 存为模板弹窗
    SaveAsTemplateDialog,
    // 统计模板管理弹窗
    StatisticTemplateManagementDialog,
  },
  setup() {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 树形组件的引用
    const FilterTreeRef = ref<null | typeof FilterTree>(null);
    // 弹窗显示
    const showDialog = ref(false);
    // 是否基础分类
    const isBasic = ref(false);
    provide('isBasic', isBasic);
    // 标签列表
    const tabList = ref(['点分类', '面分类', '线分类', '其他']);
    const activeTabIndex = ref(0);
    provide('activeTabIndex', activeTabIndex);
    // 文件夹相关的逻辑
    const {
      folderList,
      filteredFolderList,
      getFolderList,
      isAddingFolder,
      handleAddFolder,
      handleDeleteFolder,
      handleDeleteClass,
    } = useFolder($http, activeTabIndex, isBasic);
    // 正在新增或修改
    const isClassEditting = ref(false);
    // 点击选中的分类
    const selectedClass = ref<any>(null);
    /**
     * 点击分类，执行查看
     */
    const handleClickClass = (node: any) => {
      isClassEditting.value = false;
      selectedClass.value = node;
    };
    watch(activeTabIndex, () => {
      isClassEditting.value = false;
      selectedClass.value = null;
    });
    watch(folderList, (newVal) => {
      if (!selectedClass.value) {
        // 找出第一条分类
        const list = newVal || [];
        for (let i = 0; i < list.length; i += 1) {
          if (list[i]?.basicClassList?.[0]) {
            list[i].basicClassList[0].parentNode = list[i];
            handleClickClass(list[i].basicClassList[0]);
            setTimeout(() => {
              if (FilterTreeRef.value) {
                FilterTreeRef.value.setCurrentNode(list[i].basicClassList[0].id);
              }
            }, 0);
            return;
          }
        }
      } else {
        setTimeout(() => {
          if (FilterTreeRef.value) {
            FilterTreeRef.value.setCurrentNode(selectedClass.value.id);
          }
        }, 0);
      }
    }, {
      deep: true,
      immediate: true,
    });
    /**
     * 打开弹窗
     */
    const open = (isBasicClassification = false) => {
      getFolderList();
      isBasic.value = Boolean(isBasicClassification);
      showDialog.value = true;
      setTimeout(() => {
        if (FilterTreeRef.value && selectedClass.value) {
          FilterTreeRef.value.setCurrentNode(selectedClass.value.id);
        }
      }, 500);
    };
    /**
     * 取消新增
     */
    const handleCancelAdd = () => {
      isClassEditting.value = false;
      selectedClass.value = FilterTreeRef.value!.getCurrentNode();
    };
    return {
      showDialog,
      open,
      tabList,
      activeTabIndex,
      isAddingFolder,
      handleAddFolder,
      folderList,
      filteredFolderList,
      getFolderList,
      handleDeleteFolder,
      handleDeleteClass,
      handleClickClass,
      isClassEditting,
      selectedClass,
      isBasic,
      FilterTreeRef,
      handleCancelAdd,
    };
  },
  methods: {
    handleSave() {
      (this.$refs as any).FormDetailRef.handleSave();
    },
    // 新增、修改成功，刷新
    handleRefresh() {
      this.getFolderList();
      this.isClassEditting = false;
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false;
      this.isBasic = false;
      this.activeTabIndex = 0;
      this.isClassEditting = false;
      this.isAddingFolder = false;
      this.selectedClass = null;
    },
    // 生成导入模板
    generateImportTemplate() {
      (this.$refs as any).FormDetailRef.generateImportTemplate();
    },
    // 存为模板
    saveAsTemplate() {
      (this as any).$refs.SaveAsTemplateDialogRef.open();
    },
    // 复制分类
    copyClassification() {
      (this.$refs as any).FormDetailRef.copyClassification();
    },
    handleOpenStatisitcTemplateManagementDialog() {
      (this.$refs as any).StatisticTemplateManagementDialogRef.open();
    },
  },
});
</script>

<style lang="scss" module src="./styles/ClassificationManagement.scss" />
