<template>
  <TaskScheduleListView v-if="moduleName==='预案任务'" />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import TaskScheduleListView from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskScheduleListView.vue'; // 预案任务
import ReservePlanAdmin from './ReservePlanAdmin/ReservePlanAdmin.vue'; // 预案管理
import ReservePlanDocument from './ReservePlanDocument/ReservePlanDocument.vue'; // 预案文档
import ReserveStructure from './reserveStructure/ReserveStructure.vue'; // 组织架构
import ReservePlanAnnounce from './ReservePlanAnnounce/ReservePlanAnnounce.vue'; // 响应通告
import ReservePlanScene from './ReservePlanScene/ReservePlanScene.vue'; // 现场指挥部
import ReservePlanSign from './ReservePlanSign/ReservePlanSign.vue'; // 现场签到

export default defineComponent({
  components: {
    TaskScheduleListView, // 预案任务
  },
  inject: ['$addDialog'],
  setup() {
    provide('reservePlanTask', 'reservePlanTask');
  },
  data() {
    return {
      moduleName: '', // 当前模块name
      // 预案管理弹窗
      ReservePlanAdminDialog: null as any,
      // 预案文档弹窗
      ReservePlanDocumentDialog: null as any,
      // 组织架构弹窗
      ReserveStructureDialog: null as any,
      // 响应通告弹窗
      ReservePlanAnnounceDialog: null as any,
      // 现场指挥部弹窗
      ReservePlanSceneDialog: null as any,
      // 现场签到弹窗
      ReservePlanSignDialog: null as any,
    };
  },
  methods: {
    // 模块切换
    tabModules(data:string) {
      if (data !== '预案管理' && (this as any).$store.state.reservePlan?.currentReservePlan?.currentId === 0) {
        (this as any).$message.error('请先给事件选择预案！');
        return;
      } else if (data === '现场签到' && (this as any).$store.state.reservePlan?.sceneMsg === null) {
        (this as any).$message.error('请先成立现场指挥部再签到！');
        return;
      }
      //  else if (data !== '预案管理' && (this as any).$store.state.reservePlan.status === '未启动') {
      //   (this as any).$message.error('请先启动预案！');
      //   return;
      // }
      this.moduleName = data;
      switch (data) {
        case '预案管理': {
          this.ReservePlanAdminDialog = (this as any).$addDialog('预案管理', ReservePlanAdmin);
          break;
        }
        case '预案文档': {
          this.ReservePlanDocumentDialog = (this as any).$addDialog('预案文档', ReservePlanDocument);
          break;
        }
        case '组织架构': {
          this.ReserveStructureDialog = (this as any).$addDialog('组织架构', ReserveStructure);
          break;
        }
        case '响应通告': {
          this.ReservePlanAnnounceDialog = (this as any).$addDialog('响应通告', ReservePlanAnnounce);
          break;
        }
        case '现场指挥部': {
          this.ReservePlanSceneDialog = (this as any).$addDialog('现场指挥部', ReservePlanScene);
          break;
        }
        case '现场签到': {
          this.ReservePlanSignDialog = (this as any).$addDialog('现场签到', ReservePlanSign);
          break;
        }
        default: {
          break;
        }
      }
    },
  },
});
</script>

<style lang="scss" module></style>
