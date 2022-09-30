<template>
  <div>
    <Dialog
      ref="dialog"
      :title="title"
      @close="handleClose"
    >
      <component
        :is="activeComponent"
        @transmitTaskPanorama="transmitTaskPanorama"
      />
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
import TaskScheduleList from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskScheduleList/TaskScheduleList.vue';

export default defineComponent({
  name: 'TaskSchedule',
  components: {
    // 右侧弹窗
    Dialog,
    // 任务调度列表
    TaskScheduleList,
  },
  props: {
    // 弹窗标题，用于模块切换
    title: {
      type: String,
      default: '任务调度',
    },
  },
  emits: [
    'close',
    'transmitTaskPanorama',
  ],
  computed: {
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    activeComponent(): string {
      switch (this.title) {
        case '任务调度': {
          return 'TaskScheduleList';
        }
        default: {
          return 'TaskScheduleList';
        }
      }
    },
  },
  watch: {
    // 模块切换时重置折叠状态
    title() {
      if (this.$refs.dialog) {
        (this.$refs.dialog as any).isHidden = false;
      }
    },
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('close');
    },
    transmitTaskPanorama() {
      this.$emit('transmitTaskPanorama');
    },
  },
});
</script>

<style lang="scss">

</style>
