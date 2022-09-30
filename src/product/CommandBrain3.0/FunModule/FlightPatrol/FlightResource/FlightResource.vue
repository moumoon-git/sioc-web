<template>
  <div
    v-if="flightResourceVisible"
    class="flight-resource"
  >
    <!-- 顶部内容视频总数和搜索框 -->
    <header>
      <FlightResourceHeader
        v-model:treeData="treeData"
        v-model:groupId="groupId"
        :tree-checked-nodes="treeCheckedNodes"
        @getTreeData="getTreeData"
        @append-label="handleAppendLabel"
      />
      <BatchAppendLabel
        v-if="isAppendingLabel"
        :device-ids="treeCheckedNodes?.map((i) => i.id)"
        @close="isAppendingLabel = false"
      />
    </header>
    <!-- 主体内容树状分组 -->
    <main v-loading="isLoading">
      <LazyTree
        ref="tree"
        :data="treeData"
        @node-click="handleNodeClick"
        @node-check="handleNodeCheck"
        @node-uncheck="handleNodeUncheck"
        @lazy-load="handleLazyLoad"
      >
        <template #default="{ item }">
          <span
            :class="{
              'flight-resource__offline-item': item.isOffline,
            }"
          >{{ item.name }}</span>
        </template>
        <template #icon>
          <!-- 摄像头 -->
        </template>
      </LazyTree>
    </main>
    <!-- 底部内容巡查开关 -->
    <footer>
      <PatrolSwitch
        :task-type="1"
      />
    </footer>
  </div>
  <FlightCameraView
    ref="flight-camera-view"
    v-model:flightResourceVisible="flightResourceVisible"
    :camera-tree-checked-nodes="cameraTreeCheckedNodes"
  />
  <AddFlightCamera
    v-if="!flightResourceVisible"
    @confirmAddFlightCamera="confirmAddFlightCamera"
  />
</template>

<script lang="ts">
import { defineComponent, provide, ref, getCurrentInstance } from 'vue';
import LazyTree from '@/product/CommandBrain3.0/Generalparts/right/LazyTree/LazyTree.vue';
import FlightCameraView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/FlightCameraView.vue';
// 地图标注图标
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import FlightResourceHeader from './components/FlightResourceHeader.vue';
import BatchAppendLabel from './components/BatchAppendLabel.vue';
import PatrolSwitch from '../components/PatrolSwitch/PatrolSwitch.vue';
import AddFlightCamera from '../FlightCamera/components/AddFlightCamera.vue';

export default defineComponent({
  name: 'FlightResource',
  components: {
    // 顶部标题栏组件
    FlightResourceHeader,
    // 批量添加标签
    BatchAppendLabel,
    // 树状分组组件
    LazyTree,
    // 底部巡察开关组件
    PatrolSwitch,
    // 添加监控组件
    AddFlightCamera,
    // 监控详情组件
    FlightCameraView,
  },
  setup() {
    const instance = getCurrentInstance() as any;
    const { $message } = instance?.appContext.config.globalProperties;
    const tempCameraDetail = ref({});
    provide('cameraDetail', tempCameraDetail);

    const isAppendingLabel = ref(false);
    const handleAppendLabel = () => {
      if (isAppendingLabel.value) {
        isAppendingLabel.value = false;
      } else {
        if (instance?.proxy.treeCheckedNodes?.length) {
          isAppendingLabel.value = true;
        } else {
          $message.error('请勾选设备');
        }
      }
    };

    return {
      // 临时监控详情数据
      tempCameraDetail,
      // 批量设置标签
      isAppendingLabel,
      handleAppendLabel,
    };
  },
  data() {
    return {
      // 加载中
      isLoading: false,
      // 树状分组id
      groupId: '',
      // 树状分组数据
      treeData: [],
      // 树状分组勾中的数据
      treeCheckedNodes: [],
      // 飞巡资源是否可见
      flightResourceVisible: true,
      // 新增监控树状分组勾中的数据
      cameraTreeCheckedNodes: [],
      // 创建图层
      mapPromise: {},
      // 存储树状分组勾中生成的地图落点对象
      checkedMark: [],
      // 添加children后的数据
      allData: [],
    };
  },
  watch: {
    treeCheckedNodes: {
      deep: true,
      handler(newVal) {
        const obj:any = {};
        newVal.forEach((ele:any) => {
          if (ele.parent && ele.parent.id) {
            if (obj[ele.parent.id]) {
              obj[ele.parent.id].devices.push(ele);
            } else {
              obj[ele.parent.id] = { ...ele.parent };
              obj[ele.parent.id].devices = [ele];
              // eslint-disable-next-line no-unused-expressions
              obj[ele.parent.id].children && delete obj[ele.parent.id].children;
            }
          }
        });
        // 巡查时候使用的数据
        const data:any = [];
        for (const key in obj) {
          data.push(obj[key]);
        }
        (this as any).$store.commit('flightPatrol/SET_dispatchDeskData', data);
      },
    },
  },
  mounted() {
    (this as any).getTreeData(undefined, undefined);
    (this as any).initMarker();
  },
  beforeUnmount() {
    (window as any).map.clearAtPresentMarkData('飞巡资源落点');
  },
  methods: {
    // 创建地图图层
    initMarker() {
      (this as any).$nextTick(() => {
        (window as any).map.createdMarkCoverage('飞巡资源落点');
      });
    },
    // 获取树状分组数据
    getTreeData(id:any, resolve:any) {
      this.isLoading = true;
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appdevicegroup/tree',
        params: {
          groupId: id || 0,
        },
      };
      (this as any).$http(request).then((response: any) => {
        console.log('/device/appdevicegroup/tree', response);
        if (response.code === 0 && response?.data?.groups) {
          if (!id) {
            this.treeData = response.data.groups;
            this.allData = response.data.groups;
          } else {
            const devices = response.data.devices;
            devices.forEach((device: any) => {
              device.isOffline = device.status !== 0 && device.status !== '0';
            });
            resolve(devices.concat(response.data.groups));
          }
        } else {
          (this as any).$message.error(`获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        (this as any).$message.error(`获取分组数据失败，错误信息：${error}`);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 树状分组点击回调
    handleNodeClick(node: any) {
      console.log(node);
      this.groupId = node.id;
    },
    // 树状分组勾选回调
    handleNodeCheck(node: any, parent:any): void {
      console.log(node, parent);
      node = JSON.parse(JSON.stringify(node));
      if (parent) {
        node.parent = JSON.parse(JSON.stringify(parent));
      }
      (this as any).treeCheckedNodes.push(node);
      (this as any).$nextTick(() => {
        if (!(node.lon||node.longitude) && !(node.lat || node.latitude)) {
          this.$message.error(`该资源没有经纬度坐标`);
          return false;
        }
        (window as any).map.clearAtPresentMarkData('飞巡资源落点').then(() => {
          (window as any).map.setMultiMarker('飞巡资源落点', (this as any).treeCheckedNodes.map((item: any) => ({
            longitude: item.lon|| item.longitude, latitude: item.lat || item.latitude, wd: item.isMain===1?42:40, hg: item.isMain===1?48:40, src: item.isMain===1?useMapMarker('视频链'):useMapMarker('监控视频'),
          })),
          {
            click: (el:any): void => {
              const lon = el.object.data.longitude;
              const lat = el.object.data.latitude;
              const tempNode = (this as any).treeCheckedNodes.filter((item: any) => {
                return ((item.lon=== lon|| item.longitude=== lon) ) && (item.lat === lat || item.latitude=== lat)})[0];
              if (tempNode.isMain === 0) {
                (this as any).$refs['flight-camera-view'].cameraTitle = '监控详情';
              }
              (this as any).$refs['flight-camera-view'].initMap(tempNode.lon || tempNode.longitude, tempNode.lat || tempNode.latitude);
              (this as any).tempCameraDetail = tempNode;
            },
          }).then((res: any) => {
            console.log('resresresresres', res);
            (this as any).checkedMark = res;
          });
          (window as any).map.setCentent({
            longitude: node.lon|| node.longitude,
            latitude: node.lat||node.latitude,
          });
        });
      });
    },
    // 树状分组取消勾选回调
    handleNodeUncheck(node: any): void {
      console.log('(this as any).checkedMark node', (this as any).checkedMark, node);
      (this as any).treeCheckedNodes = (this as any).treeCheckedNodes.filter((item: any) => (item.id !== node.id));
      (this as any).$nextTick(() => {
        const temporaryArray = (this as any).checkedMark.filter((item: any) => (item.data.latitude === node.latitude) && (item.data.longitude === node.longitude));
        (this as any).checkedMark = (this as any).checkedMark.filter((item: any) => (item.data.latitude !== node.latitude) && (item.data.longitude !== node.longitude));
        console.log("temporaryArray",temporaryArray);
        (window as any).map.removeMark(temporaryArray[0]);
      });
    },
    // 树状分组懒加载
    handleLazyLoad(node: any, resolve: any): void {
      console.log(node);
      this.addChildToData(node);
      this.getTreeData(node.id, resolve);
    },
    // 确认保存添加监控
    confirmAddFlightCamera(el:any) {
      (this as any).flightResourceVisible = true;
      console.log(el);
      (this as any).cameraTreeCheckedNodes = el;
    },
    // 添加children到父数据中
    addChildToData(data:any) {
      this.allData.forEach((ele:any) => {
        if (data.id && data.id === ele.id) {
          // eslint-disable-next-line no-param-reassign
          ele = data;
        }
      });
    },
  },
});
</script>

<style lang="scss" src="./style/FlightResource.scss"></style>
