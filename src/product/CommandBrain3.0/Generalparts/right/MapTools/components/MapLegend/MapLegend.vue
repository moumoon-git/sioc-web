<template>
  <Dialog
    title="图例"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <div :class="$style.container">
      <Tabs v-model="pageIndex" :list="['基础数据', '标绘数据', '系统接入']" />
      <div>
        <!-- 1. 基础数据 -->
        <BasicData v-show="pageIndex === 0" />
        <!-- 2. 标绘数据 -->
        <PlottingData v-if="pageIndex === 1" />
        <!-- 3. 系统接入 -->
        <SystemAccess v-show="pageIndex === 2" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
import Tabs from '@/product/CommandBrain3.0/Generalparts/right/Tabs/Tabs.vue';
// 基础数据
import BasicData from './modules/BasicData/BasicData.vue';
// 标绘数据
import PlottingData from './modules/PlottingData/PlottingData.vue';
// 系统接入
import SystemAccess from './modules/SystemAccess/SystemAccess.vue';

export default defineComponent({
  components: {
    Dialog,
    Tabs,
    BasicData,
    PlottingData,
    SystemAccess,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup() {
    const pageIndex = ref(0);
    return {
      pageIndex,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;

  & > :first-child {
    flex-shrink: 0;
  }

  & > :not(:first-child) {
    flex: 1;
    height: calc(100% - 32px);
  }
}
</style>
