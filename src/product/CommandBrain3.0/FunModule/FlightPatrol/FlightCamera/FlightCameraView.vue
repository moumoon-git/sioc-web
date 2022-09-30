<template>
  <MapDialog ref="mapDialog" :title="cameraTitle">
    <!-- 地图弹窗视频链表单 -->
    <FlightCamera
      ref="flightCamera"
      :camera-tree-checked-nodes="cameraTreeCheckedNodes"
      :edit-visible="editVisible"
    />
    <!-- 地图弹窗视频链底部功能按钮 -->
    <FlightCameraFunction
      v-model:editVisible="editVisible"
      :flight-camera-detail-visible="cameraTitle !== '视频链监控'"
      @dismissCamera="dismissCamera"
      @changeFlightResourceVisible="changeFlightResourceVisible"
      @saveFlightCamera="saveFlightCamera"
      @deleteCamera="deleteCamera"
      @preview="preview"
      @rim="rim"
    />
  </MapDialog>
</template>

<script>
import { defineComponent } from 'vue';
import MapDialog from '@/product/CommandBrain3.0/Generalparts/map/MapDialog/MapDialog.vue';
import FlightCamera from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/components/FlightCamera.vue';
import FlightCameraFunction from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/components/FlightCameraFunction.vue';

export default defineComponent({
  name: 'FlightCameraView',
  components: {
    // 地图弹窗组件
    MapDialog,
    // 视频链表单组件
    FlightCamera,
    // 视频链底部功能按钮组件
    FlightCameraFunction,
  },
  props: {
    // 飞巡资源是否可见
    flightResourceVisible: {
      type: Boolean,
      default: true,
    },
    // 新增监控树状分组勾选数据
    cameraTreeCheckedNodes: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:flightResourceVisible'],
  data() {
    return {
      // 是否编辑视频链
      editVisible: false,
      cameraTitle: '视频链监控',
    };
  },
  mounted() {
    // this.initMap();
  },
  methods: {
    // 地图弹窗初始化
    initMap(longitude, latitude) {
      this.$nextTick(() => {
        this.$refs.mapDialog.init({ longitude, latitude, map: window.map });
      });
    },
    // 解散视频链
    dismissCamera() {
      this.$refs.flightCamera.dismissCamera();
    },
    // 添加监控
    changeFlightResourceVisible() {
      this.$emit('update:flightResourceVisible', false);
    },
    // 编辑视频链保存
    saveFlightCamera() {
      this.$refs.flightCamera.saveFlightCamera();
    },
    // 批量删除视频链
    deleteCamera() {
      this.$refs.flightCamera.deleteCamera();
    },
    // 预览
    preview() {
      this.$refs.flightCamera.preview();
    },
    // 周边检索
    rim(isrim) {
      this.$refs.flightCamera.rim(isrim);
    },
  },
});
</script>

<style lang="scss"></style>
