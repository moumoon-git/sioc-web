<!--- 事件情报 --->
<template>
  <div>
    <Dialog
      v-if="showEventInformation"
      ref="dialog"
      :title="title"
      @close="handleClose"
    >
      <div class="event-information-dialog-container" v-show="!historyLiveState">
        <Tabs
          v-model="activeIndex"
          :list="['监测预警', '情报信息']"
          @change="handleSwitchTab"
        />
        <component :is="activeComponent" ref="component" @historyLive="historyLive" />
      </div>
      <!-- 历史直播 -->
      <HistoryLive v-if="historyLiveState" @back="back" />
    </Dialog>
  </div>
  
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
import Tabs from '@/product/CommandBrain3.0/Generalparts/right/Tabs/Tabs.vue';
import MonitoringWarning from '@/product/CommandBrain3.0/FunModule/EventInformation/MonitoringWarning/MonitoringWarning.vue'
import EventAttachments from '@/product/CommandBrain3.0/FunModule/EventInformation/EventAttachments/EventAttachments.vue'
// 历史直播
import HistoryLive from '@/product/CommandBrain3.0/FunModule/EventInformation/HistoryLive/HistoryLive.vue'
import { useStore } from 'vuex';
export default defineComponent({
  name: 'EventInformation',
  components: {
    // 右侧弹窗
    Dialog,
    // Tabs
    Tabs,
    // 监测预警
    MonitoringWarning,
    // 情报信息
    EventAttachments,
    // 历史直播
    HistoryLive,
  },
  props: {
    // 弹窗标题，用于模块切换
    title: {
      type: String,
      default: '事件情报',
    },
  },
  emits: {
    close: null,
  },
  setup(props, {emit}) {
    const store = useStore();
    const activeComponent = ref('MonitoringWarning');
    const activeIndex = ref(0);
    const showEventInformation: any = ref(false);
    const dialogRef = ref<typeof Dialog | null>(null);
    // 历史直播和主功能之间的切换
    const historyLiveState = ref<boolean>(false);
    // 关闭弹窗
    function handleClose() {
      showEventInformation.value = false;
    }

    function handleSwitchTab(index: number) {
      activeIndex.value = index;
      switch(index) {
        case 0:
          activeComponent.value = 'MonitoringWarning'
          break;
        default: 
          activeComponent.value = 'EventAttachments'
      }
    }

    /**
     * 打开监测预警
     */
    function openEventInformationDialog() {
      showEventInformation.value = true;
    }
    // 历史直播
    function historyLive() {
      console.log('历史直播');
      historyLiveState.value = true;
    }
    // 返回
    function back() {
      historyLiveState.value = false;
    }
    return {
      handleClose,
      openEventInformationDialog,
      handleSwitchTab,
      activeComponent,
      activeIndex,
      showEventInformation,
      historyLive,
      historyLiveState,
      back,
      // closeRainfullAnalysisDialog
    }
  }
})
</script>

<style lang="scss">
  .RainfullAnalysisDialog {
    position: absolute;
    left: -338px;
    top: 0;
    z-index: 10000;
  }
  .event-information-dialog-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 120px);
    overflow: hidden;
  }
</style>