<template>
  <div>
    <Dialog
      v-if="visible"
      title="知识库"
      @close="handleClose"
    >
      <div :class="$style.flex">
        <Select
          v-model="tab"
          :clearable="true"
          :list="['名称', '标签']"
        />
        <!-- 搜索框 -->
        <Search
          v-model="keyword"
          placeholder="请输入关键字搜索"
        />
        <Button
          type="ghost"
          @click="handleChange"
        >
          搜索
        </Button>
      </div>
      <div
        v-if="list.length"
        v-loading="isLoading"
      >
        <Expand
          v-for="item in list"
          :key="item.id"
          :show-check="false"
          @click="openDetail(item)"
        >
          <!-- 标题 -->
          <template #title>
            {{ item?.name || '-' }}
          </template>
        </Expand>
      </div>
      <EmptyHint v-else />
    </Dialog>
    <KnowledgeBaseDetail ref="KnowledgeBaseDetailRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, defineExpose } from 'vue';
import { useStore } from 'vuex';
// 右侧弹窗
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
// 百叶窗
import Expand from './components/Expand.vue';
// 空白
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
// 搜索
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue';
// 下拉
import Select from '@/product/CommandBrain3.0/Generalparts/dialog/Select/Select.vue';
// 按钮
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue';
// 知识库弹窗
import KnowledgeBaseDetail from './components/KnowledgeBaseDetail.vue';

const { $http }: any = getCurrentInstance()?.appContext.config.globalProperties;
const visible = ref(false);
const isLoading = ref(false);
const store = useStore();
const keyword = ref(''); // 搜索
const tab: any = ref(''); // 搜索
const list = ref([]);
const KnowledgeBaseDetailRef: any = ref(null);
/**
 * 获得知识库
 */
const getList = () => {
  isLoading.value = true;
  const request = {
    method: 'GET',
    url: '/resoure/resourceKnowledgeBase/listNoPage',
    service: 'soc',
    params: {
      type: tab.value < 0 ? '' : tab.value, // 0按名称搜索，1按标签搜索，
      caseClassId: store.state.event?.caseClassId,
      search: keyword.value,
    },
  };
  $http(request).then((response :any) => {
    if (response.code === 0 || response.errorcode === 0) {
      list.value = response?.data?.list || [];
    }
  }).finally(() => {
    isLoading.value = false;
  });
};
// 关闭弹窗
const handleClose = () => {
  visible.value = false;
  store.commit('KnowledgeBase/setKnowledgeBaseShow', false);
};
// 开详情
const openDetail = (item: any) => {
  KnowledgeBaseDetailRef.value.init(item);
};
// 搜索
const handleChange = () => {
  getList();
};
defineExpose({
  visible,
  getList,
});
</script>

<style lang="scss" module>
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
</style>
