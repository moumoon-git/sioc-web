// 资源调度
<template>
  <Dialog title="现场支援" @close="handleClose" v-if="showResourceDetailRef">
    <div :class="$style.resource">
      <div :class="$style.total">
        总数：{{ listData.length }}条
      </div>
      <div :class="$style.items">
        <Card
          v-for="(item,index) in listData"
          :key="index"
          :obj="item"
          @click="openDetail(item)"
        />
      </div>
    </div>
  </Dialog>
  <ResourceDetail ref="ResourceDetailRef" />
</template>

  <script setup lang="ts">
import { ref, defineExpose, onMounted } from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
import Card from './components/resourceCard.vue';
import ResourceDetail from './components/resourceDetail.vue';
import resourceTaskViewFun from './scripts/resourceTaskView';

const { listData, getListData } = resourceTaskViewFun();
// 现场支援详情
const ResourceDetailRef = ref<null>(null); // 现场支援ref
const openDetail = (item: any) => {
  console.log(item);
  if (ResourceDetailRef.value) {
    (ResourceDetailRef.value as any).open();
    (ResourceDetailRef.value as any).detailObj = item;
  }
};
 // 关闭弹窗
 const showResourceDetailRef = ref(false);
function handleClose() {
    showResourceDetailRef.value = false;
  }
  // 打开弹窗
  const open = () => {
    showResourceDetailRef.value = true;
  }
onMounted(() => {
  getListData();
});
defineExpose({
  ResourceDetailRef,
  open,
});
</script>
  <style module lang="scss" src="./style/resourceTaskView.scss">
</style>
