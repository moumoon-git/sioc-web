<template>
  <div v-show="flightTipFlag">
    <FlightTip :tip-arr="tempArr" @emitFun="pointEmitFun" />
  </div>

  <!-- <FlightPatrol title="任务调度" /> -->
  <FlightPatrol
    v-if="controlDisplay"
    :title="title"
    :point-data="dataTemp"
    :area-data="areaData"
    :line-data="lineData"
    @close="handleClose"
    @emitFun="pointEmitFun"
  />

  <!-- 摄像头弹窗 -->
  <!-- <FlightLinkageCameraView ref="flightLinkageCameraView" /> -->
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import FlightPatrol from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightPatrol.vue';
import FlightTip from '@/product/CommandBrain3.0/FunModule/FlightPatrol/header/FlightTip.vue';
// 地图弹窗
// import FlightLinkageCameraView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/FlightCameraView.vue';
import script from './script/script';
// eslint-disable-next-line @typescript-eslint/no-var-requires

export default defineComponent({
  name: 'FlightPatrolView',
  components: {
    FlightPatrol,
    FlightTip,
    // 监控详情组件
    // FlightLinkageCameraView,
  },
  provide() {
    return {
      cameraDetail: computed(() => this.cameraDetail),
    };
  },
  setup() {
    return script();
  },
  data() {
    return {
      tempArr: ['巡查点', '巡查线', '巡查面'],
      // 控制右侧弹窗标题和对应显示
      title: '飞巡记录',
      // 控制点线面绘制按钮显示
      flightTipFlag: false,
      controlDisplay: false,
      dataTemp: {}, // 点巡检传递的数据
      lineData: {}, // 线巡检传递的数据
      areaData: {}, // 面巡检传递的数据
    };
  },
  computed: {
    isShowTip() {
      return (this as any).$store.state.flightPatrol.isShowFlightTip;
    },
    isShowWin() {
      return (this as any).$store.state.flightPatrol.isShowFlightWin;
    },
  },
  watch: {
    isShowTip: {
      handler(data: any) {
        this.flightTipFlag = data;
        if ((window as any).map) {
          (window as any).map.clearAtPresentVectorData('标绘图层');
          (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
          (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
          (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
        }
      },
      immediate: false,
    },
    isShowWin: {
      handler(data: any) {
        this.controlDisplay = data;
      },
      immediate: true,
    },
  },
  mounted() {
    this.initMapLayer();
  },
  // 卸载前清除图层
  beforeUnmount() {
    if ((window as any).map) {
      (window as any).map.clearDeleteCoverage('飞巡结果监控Layer');
      (window as any).map.clearDeleteCoverage('flightRecord');
      (window as any).map.clearDeleteCoverage('飞巡圆图层');
      (window as any).map.clearDeleteCoverage('飞巡面图层');
      (window as any).map.clearDeleteCoverage('标绘图层');
      (window as any).map.clearDeleteCoverage('flightPatrolLinkage');
    }
  },
  methods: {
    /**
     * @description 初始化地图图层
     */
    initMapLayer(): void {
      if ((window as any).map) {
        // 创建初始化图层
        (window as any).map.createdMarkCoverage('飞巡结果监控Layer');
        (window as any).map.createdVectorCoverage('flightRecord');
        // 画巡查点
        (window as any).map.createdMarkCoverage('巡查点maker');
        (window as any).map.createdVectorCoverage('飞巡圆图层', {});
        (window as any).map.createdVectorCoverage('飞巡面图层', {});
        (window as any).map.createdVectorCoverage('标绘图层', {
          strokeColor: '#ffffff',
          strokeWidth: 2,
          fillColor: '#fff',
          fillOpacity: 0.2,
        });
      } else {
        setTimeout(() => this.initMapLayer(), 1000);
      }
    },
    pointEmitFun(data: any) {
      console.log(data);
      this.controlDisplay = true;
      (this as any).$store.commit('flightPatrol/SET_isShowFlightWin', true);
      if (data.type === 'point') {
        this.title = '巡查点详情';
        this.dataTemp = data;
      }
      if (data.type === 'line') {
        this.title = '巡查线详情';
        this.lineData = data;
      }
      if (data.type === 'area') {
        this.title = '巡查面详情';
        this.areaData = data;
      }
    },
    /**
     * @description 切换模块
     */
    tabModules(data: string) {
      // console.log(data);
      if (sessionStorage.getItem('tempListData')) {
        sessionStorage.removeItem('tempListData');
      }
      (window as any).map.clearAtPresentVectorData('标绘图层');
      (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
      (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
      (window as any).map.clearDeleteCoverage('飞巡结果聚合图层'); // 删除飞巡结果聚合图层
      if (data === '新增巡查') {
        (this as any).$store.commit('flightPatrol/SET_isShowFlightTip', true);
        this.flightTipFlag = true;
        this.controlDisplay = false;
        (this as any).$store.commit('flightPatrol/SET_isShowFlightWin', false);
        if ((this as any).$route.href === '/flightPatrol/') {
          (this as any).$store.commit('SET_POSITIONTOLEFT', false);
        } else {
          (this as any).$store.commit('SET_POSITIONTOLEFT', true);
        }
      } else {
        this.flightTipFlag = false;
        this.controlDisplay = true;
        (this as any).$store.commit('flightPatrol/SET_isShowFlightWin', true);
      }
      this.title = data;
    },
    handleClose() {
      this.controlDisplay = false;
      (this as any).$store.commit('flightPatrol/SET_isShowFlightWin', false);
    },
    // 根据摄像头id获取详细信息
    getCameraDetailById(id: number) {
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdevicelist/listByDeviceIds',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [id],
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          console.log(response);
          this.showCameraDetail(
            response.data.list[0].appDeviceEntity,
            response.data.list[0].appDeviceListEntity,
          );
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取摄像头数据失败，错误信息：${error}`,
          );
        });
    },
    // 显示监控详情弹框
    showCameraDetail(obj: any, videos: any) {
      (this as any).$refs['flight-camera-view'].initMap(obj.lon, obj.lat);
    },
  },
});
</script>

<style lang="scss">
</style>
