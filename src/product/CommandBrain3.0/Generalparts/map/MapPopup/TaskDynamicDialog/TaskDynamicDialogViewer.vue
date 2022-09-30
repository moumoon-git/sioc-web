<template>
  <div v-for="item in taskDynamicList" :key="item.id">
    <TaskDynamicDialog
      ref="TaskDynamicDialogRef"
      :visible="item.visible"
      :dynamic-data="item"
      @close="item.visible = false"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import TaskDynamicDialog from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/TaskDynamicDialog/TaskDynamicDialog.vue';
import { useStore } from 'vuex';
import loadSetup from './script/setup';

export default defineComponent({
  name: 'TaskDynamicDialogViewer',
  components: {
    TaskDynamicDialog,
  },
  computed: {
    taskDynamicList() {
      return (
        (this as any).$store.state.taskDynamicDialog.taskDynamicDialogData || []
      );
    },
    eventId() {
      return (this as any).$store.state.event?.id;
    },
  },
  watch: {
    taskDynamicList: {
      handler(newVal) {
        (this as any).showTaskDynamicDialog();
        console.log('监听-缓存里的任务动态：', newVal);
      },
      deep: true,
    },
    eventId: {
      handler(newVal, oldVal) {
        // 事件发生改变了，清空任务动态落点
        if (newVal !== oldVal) {
          (this as any).$store.commit(
            'taskDynamicDialog/SET_taskDynamicDialogData',
            [],
          );
        }
      },
      deep: true,
    },
  },
  setup() {
    /**
     * 业务如下：
     * 1、收到websocket上报的任务动态，自动打开上报地点的弹窗，并且落点，5秒后关闭弹窗，点不消失;
     * 2、点击右侧的任务动态列表，打开弹窗并且落点，手动关闭弹窗，点不用消失
     **/
    const instance = getCurrentInstance();
    const { $ws }: any = instance?.appContext.config.globalProperties;
    const store: any = useStore();
    const {
      // 拿到消息后的回调
      websocketCallback,
      // 显示任务动态弹窗
      showTaskDynamicDialog,
      // 创建图层
      createdMarkCoverage,
    } = loadSetup();

    // WebSocket
    let un: () => void;
    un = $ws.subscribe(`/topic/eventTask/dynamic`, (msg: any, result: any) => {
      console.log(result);
      websocketCallback(result);
    });

    /**
     * @description 初始化任务动态落点
     */
    function initTaskDynamicMarkers() {
      const dynamicList = store.state.taskDynamicDialog.taskDynamicDialogData;
      if (dynamicList.length > 0) {
        showTaskDynamicDialog();
      }
    }

    onMounted(() => {
      // 创建任务动态的图层
      createdMarkCoverage();
      initTaskDynamicMarkers();
    });

    onBeforeUnmount(() => {
      un();
    });

    return {
      showTaskDynamicDialog,
    };
  },
});
</script>

<style lang="scss"></style>
