<template>
  <div>
    <!-- <div class="app"> -->
    <!-- 超图实例挂载点 -->
    <!-- <div id="map" /> -->
    <TaskSchedule
      v-if="visTaskSchedule"
      :title="reservePlanTask==='reservePlanTask'?'预案任务':scheduleTitle"
      @transmitTaskPanorama="taskPanorama"
      @close="handleClose"
    />
    <TaskSchedulePanorama
      v-if="taskPanoramaFlag"
      @closePanorama="closePanorama"
    />
    <router-view />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
} from 'vue';
import TaskSchedule from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskSchedule.vue';
import TaskSchedulePanorama from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskScheduleList/components/TaskSchedulePanorama.vue';

export default defineComponent({
  components: {
    TaskSchedule,
    TaskSchedulePanorama,
  },
  setup() {
    const reservePlanTask = inject('reservePlanTask');
    return {
      reservePlanTask,
    };
  },
  data() {
    return {
      // 任务调度标题
      scheduleTitle: '任务调度',
      // 控制任务全景显示
      taskPanoramaFlag: false,
      // 控制右边弹窗的显示
      visTaskSchedule: true,
    };
  },
  mounted() {
    // this.initMap();
    console.log((this as any).$http);
    console.log((this as any).$param);
    console.log((this as any).$param);
    console.log((this as any).$store);
  },
  methods: {
    /**
     * @description 初始化超图地图实例
     */
    initMap(): void {
      const map: any = new (window as any).HM().init('map');
      (window as any).map = map;
    },
    // 显示任务全景
    taskPanorama() {
      (this as any).taskPanoramaFlag = true;
    },
    // 关闭任务全景
    closePanorama() {
      (this as any).taskPanoramaFlag = false;
    },
    // 关闭右边弹窗
    handleClose() {
      (this as any).visTaskSchedule = false;
    },
  },
});
</script>

<style lang="scss">
// .app {
//   display: flex;
//   flex-direction: column;
//   width: 100vw;
//   height: 100vh;
//   min-height: 768px;
//   max-height: 1080px;
//   margin: 0;
//   padding: 0;
//   position: relative;
//   overflow: hidden;

//   #map {
//     height: 100%;
//     border: none;
//     outline: none;
//     flex: 1;
//   }
// }
</style>
