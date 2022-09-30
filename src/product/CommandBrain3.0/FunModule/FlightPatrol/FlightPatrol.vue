<template>
  <div>
    <Dialog
      ref="dialog"
      :title="title"
      @close="handleClose"
    >
      <component
        :is="activeComponent"
        :point-data="pointData"
        :area-data="areaData"
        :line-data="lineData"
        @closePopEmit="handleClose"
        @changeData="changeData"
      />
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
import FlightRecord from './FlightRecord/FlightRecord.vue';
import FlightResource from './FlightResource/FlightResource.vue';
import FlightPoint from './FlightInspection/FlightPoint.vue';
// import FlightPoint from './FlightInspectionNew/FlightSearchList.vue';
import FlightLine from './FlightInspection/FlightLine.vue';
import FlightArea from './FlightInspection/FlightArea.vue';
import FlightGroup from './FlightGroup/FlightGroup.vue';
import FlightList from './FlightInspection/FlightList.vue';

export default defineComponent({
  name: 'FlightPatrol',
  components: {
    // 右侧弹窗
    Dialog,
    // 飞巡记录模块
    FlightRecord,
    // 飞巡资源模块
    FlightResource,
    // 飞巡分组模块
    FlightGroup,
    // 点飞巡
    FlightPoint,
    // 线飞巡
    FlightLine,
    // 面飞巡
    FlightArea,
    // 巡查列表
    FlightList,
  },
  props: {
    // 弹窗标题，用于模块切换
    title: {
      type: String,
      default: '飞巡记录',
    },
    pointData: {
      type: Object,
      default: () => ({}),
    },
    areaData: {
      type: Object,
      default: () => ({}),
    },
    lineData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close', 'emitFun'],
  computed: {
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    activeComponent(): string {
      switch (this.title) {
        case '飞巡分组': {
          return 'FlightGroup';
        }
        case '飞巡资源': {
          return 'FlightResource';
        }
        case '巡查点详情': {
          return 'FlightPoint';
        }
        case '巡查线详情': {
          return 'FlightLine';
        }
        case '巡查面详情': {
          return 'FlightArea';
        }
        case '巡查列表': {
          return 'FlightList';
        }
        case '飞巡记录': {
          return 'FlightRecord';
        }
        default: {
          return '';
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
      if (['巡查点详情', '巡查线详情', '巡查面详情'].includes(this.title)) {
        (window as any).map.clearAtPresentVectorData('标绘图层');
        (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
        (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
        (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
      }
    },
    //
    changeData(data:any) {
      this.$emit('emitFun', data);
    },
  },
});
</script>

<style lang="scss">
</style>
