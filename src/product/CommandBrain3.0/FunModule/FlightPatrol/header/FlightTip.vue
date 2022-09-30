<template>
  <div
    class="tipsDiv"
    :class="{ showPositionLeft: positionToLeft }"
  >
    <div
      v-for="(item, index) in tipArr"
      :key="index"
      class="tipsdiv__tipsItem"
      @click="chooseDrawFun(item, index, $event)"
    >
      <div :class="[returnIcon(item), { checked: index == nowIndex }]">
        {{ item }}
      </div>
    </div>
    <div
      class="tipsdiv__esc"
      @click="escPopFun"
    >
      退出飞巡
    </div>
  </div>
  <div
    ref="centerName"
    class="center__camera__name"
  >
    {{ pointAddr }}
  </div>
  <div
    ref="cameraName"
    class="center__camera__name"
  >
    {{ tempVideoAddr }}
  </div>
  <FlightCameraView
    ref="flight-camera-view"
    v-model:flightResourceVisible="flightResourceVisible"
    :camera-tree-checked-nodes="cameraTreeCheckedNodes"
  />
  <!-- <AddFlightCamera
    v-if="!flightResourceVisible"
    @confirmAddFlightCamera="confirmAddFlightCamera"
  />-->
  <EscPop ref="EscPopRef" />
</template>

<script lang="ts">
import {
  defineComponent, provide, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import {
  addFun,
  deleteFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
import FlightCameraView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/FlightCameraView.vue';
import useFun from '@/product/CommandBrain3.0/FunModule/FlightPatrol/header/scripts/useEsc';
import EscPop from './EscPop.vue';
import { getFlightPatrolSearch } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

export default defineComponent({
  name: 'FlightTip',
  components: {
    // 监控详情组件
    FlightCameraView,
    // 退出提示
    EscPop,
  },
  props: {
    tipArr: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const store = useStore(); // 使用vuex
    const { escFlightFun } = useFun(store);
    const positionToLeft = ref(false); // tip位置
    const circleStyle: any = {
      strokeColor: '#ffffff',
      strokeWidth: 2,
      fillColor: '#fff',
      fillOpacity: 0.2,
    };
    const tempCameraDetail = ref({});
    provide('cameraDetail', tempCameraDetail);
    watch(
      () => store.state.positionToLeft,
      (val, old) => {
        positionToLeft.value = val;
      },
    );
    return {
      circleStyle,
      tempCameraDetail,
      positionToLeft,
      escFlightFun, // 退出飞巡
    };
  },
  data() {
    return {
      dataTemp: {} as any,
      areaData: {} as any,
      lineData: {},
      areaLonLatObj: '',
      classname: '',
      isActive: false,
      nowIndex: '',
      tempLayerData: '', // 缓存的图形标绘的数据
      isShow: false,
      thisPanel: '', // 当前打开的面板
      pointAddr: '',
      pointSearchRange: 0, // 当前点搜索的半径
      cameraTreeCheckedNodes: {}, // 当前点击的对象
      showCameraDetailFlag: false, // 是否显示弹窗
      // 飞巡资源是否可见
      flightResourceVisible: false,
      // 此时hover的摄像头地址
      tempVideoAddr: '',
      // 按键取消
      keyDownFlag: false,
    };
  },
  computed: {},
  mounted() {
    this.keyDown();
  },
  methods: {
    // 图标
    returnIcon(type: any): any {
      switch (type) {
        case '巡查点':
          return this.isActive ? 'point_active' : 'tipsdiv__tipsItem__point';

        case '巡查线':
          return this.isActive ? 'line_active' : 'tipsdiv__tipsItem__line';

        case '巡查面':
          return this.isActive ? 'area_active' : 'tipsdiv__tipsItem__area';

        default:
          return '';
      }
    },
    //
    escPopFun() {
      if (this.keyDownFlag) {
        (this as any).$refs.EscPopRef.open();
      } else {
        (this as any).$store.commit('flightPatrol/SET_isShowFlightTip', false);
      }
    },
    // 按键取消方法
    keyDownCancel(e: any) {
      if (e.key === 'Escape' && this.keyDownFlag) {
        this.nowIndex = '';
        this.cancleAllDrawFun();
        this.keyDownFlag = false;
      }
    },
    // 按键取消
    keyDown() {
      addFun('keydown', this.keyDownCancel);
    },
    // 注册方法
    chooseDrawFun(type: any, index: any, event: any): void {
      this.cancleAllDrawFun();
      this.nowIndex = index;
      this.keyDownFlag = true;
      (this as any).$message.success('使用ECS键取消当前操作');
      switch (type) {
        case '巡查点':
          this.classname = 'tipsdiv__tipsItem__point';
          return this.startDrawCircle();
        case '巡查线':
          this.classname = 'tipsdiv__tipsItem__line';
          return this.startDrawLine();
        case '巡查面':
          this.classname = 'tipsdiv__tipsItem__area';
          return this.startDrawArea();
        default:
          break;
      }
    },
    /**
    * @desc 删除图层
    * @param {}
    * @returns {}
    */
    deleteFlightLayer() {
      (window as any).map.clearAtPresentVectorData('标绘图层');
      (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
      (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
      (this as any).$store.commit('flightPatrol/SET_isShowFlightWin', false);
    },
    returnDealData(arr: any) {
      const resArr: any = [];
      arr.forEach((element: any) => {
        const tempObj: any = {};
        tempObj.x = element.x;
        tempObj.y = element.y;
        resArr.push(tempObj);
      });
      console.log(resArr);
      return resArr;
    },
    // 激活画圆工具方法
    startDrawCircle(): void {
      const that: any = this;
      this.deleteFlightLayer(); // 删除所有图层
      (window as any).map.newDrawFeature(
        '标绘图层',
        'CircleEx',
        {
          featureadded(e: any) {
            console.log(e.feature);
            console.log(e.feature.geometry);
            console.log(e.feature.geometry._controlPoints);
            that.tempLayerData = [];
            (window as any).map.closeActivateDrawFeature('标绘图层');
            that.tempLayerData = that.returnDealData(
              e.feature.geometry._controlPoints,
            ); // 缓存当前图层的数据
            // 画完圆后获取当前图层的数据
            const tempCircleData = e.feature.geometry._controlPoints;
            // 圆心坐标
            const circlrCenter: any = {
              longitude: tempCircleData[0].x,
              latitude: tempCircleData[0].y,
            };
            // 圆任意一点坐标
            const circlrRound: any = {
              longitude: tempCircleData[1].x,
              latitude: tempCircleData[1].y,
            };
            console.log(
              (window as any).map.calculateTowDistance,
              circlrCenter,
              circlrRound,
            );
            // 获取半径
            (window as any).map
              .calculateLineDistance(circlrCenter, circlrRound)
              .then((response: any) => {
                that.pointSearchRange = response;
                const circleData: any = {
                  longitude: circlrCenter.longitude,
                  latitude: circlrCenter.latitude,
                  r: response,
                };
                (window as any).map.acquisitionPoint(
                  {
                    lon: circlrCenter.longitude,
                    lat: circlrCenter.latitude,
                  },
                  (res: any) => {
                    that.pointAddr = res.res.result.formatted_address;
                    that.dataTemp.addr = that.pointAddr;
                    (window as any).map.setOneMarker(
                      '巡查点maker',
                      {
                        longitude: circlrCenter.longitude,
                        latitude: circlrCenter.latitude,
                        imgInfo: that.pointAddr,
                        wd: 34,
                        Hg: 34,
                        src: require('./assets/center.svg'),
                        offsetY: 2,
                      },
                      {
                        mouseover(e: any) {
                          that.showCenterPop(e.object.data);
                        },
                        mouseout(e: any) {
                          that.hideCenterPop(e.object.data);
                        },
                      },
                    );
                  },
                );
                const tempParam: any = {
                  currentPage: 1,
                  latitude: circlrCenter.latitude,
                  longitude: circlrCenter.longitude,
                  radius: response / 1000,
                  resoureType: 101,
                  solrType: 1,
                };

                // 画圆
                (window as any).map.clearAtPresentVectorData('标绘图层');
                (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
                const data = [
                  {
                    type: 'SuperMap.Geometry.GeoCircle',
                    cps: {
                      controlPoints: tempCircleData,
                    },
                    style: {
                      strokeColor: '#fff',
                      strokeWidth: 2,
                      fillColor: '#fff',
                      fillOpacity: 0.2,
                    },
                  },
                ];
                console.log('半径：');

                (window as any).map.renderGraph('飞巡圆图层', data);
                that.renderCirclePointLayer(tempParam, circlrCenter);
              });
          },
        },
        false,
      );
      (window as any).map.activateDrawFeature('标绘图层');
    },
    getTempLayerData() {
      (window as any).map.getCoverageData('飞巡圆图层').then((res: any) => {
        this.tempLayerData = res[0].data.cps.controlPoints;
      });
    },
    // 显示中心点弹框
    showCenterPop(obj: any) {
      this.$nextTick(() => {
        (window as any).map.mapPopup({
          id: 'centerId',
          longitude: obj.longitude,
          latitude: obj.latitude,
          class: (this as any).$refs.centerName as HTMLElement,
        });
      });
    },
    // 隐藏中心点弹框
    hideCenterPop(obj: any) {
      (window as any).map.closeClearPopup('centerId');
    },
    // 圆搜索显示图标
    renderCirclePointLayer(tempParam: any, center: any) {
      getFlightPatrolSearch(tempParam).then((response: any) => {
          const arr = response.data.monitorCameraVOS;
          this.dataTemp.cameraData = response.data.monitorCameraVOS
            ? response.data.monitorCameraVOS
            : [];
          this.dataTemp.appLabelDeviceVOS = response.data.appLabelDeviceVOS
            ? response.data.appLabelDeviceVOS
            : [];
          this.dataTemp.type = 'point';
          this.dataTemp.lon = center.longitude;
          this.dataTemp.lat = center.latitude;
          this.dataTemp.r = this.pointSearchRange;
          this.dataTemp.mapdata = this.tempLayerData;
          if (this.pointSearchRange > 500) {
            // this.dataTemp.r = 500;
            const { longitude } = center;
            const { latitude } = center;
            (window as any).map.setCentent(
              {
                longitude,
                latitude,
              },
              16,
            );
            (this as any).$message.error(
              '最大搜索值不能超过500米，请在结果中修改最大搜索范围',
            );
          }
          this.$emit('emitFun', this.dataTemp);
          this.renderPointLayer(arr || []);
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取摄像头数据失败，错误信息：${error}`,
          );
        });
    },
    // 激活划线工具方法
    startDrawLine(): void {
      const self: any = this;
      this.deleteFlightLayer();
      (window as any).map.newDrawFeature(
        '标绘图层',
        'PolyLineEx',
        {
          featureadded(e: any) {
            console.log(e);
            self.tempLayerData = [];
            self.tempLayerData = self.returnDealData(
              e.feature.geometry._controlPoints,
            ); // 缓存当前图层的数据
            const value = 200; // 200米 缓冲区范围
            (window as any).map.closeActivateDrawFeature('标绘图层');
            (window as any).map
              .getCoverageData('标绘图层')
              .then((r: any) => {
                const data: any = e.feature.geometry.components;

                (window as any).map.acquisitionPoint(
                  {
                    lon: data[0].x,
                    lat: data[0].y,
                  },
                  (res: any) => {
                    self.lineData.addrs = res.res.result.formatted_address;
                    (window as any).map.acquisitionPoint(
                      {
                        lon: data[data.length - 1].x,
                        lat: data[data.length - 1].y,
                      },
                      (res2: any) => {
                        self.lineData.addre = res2.res.result.formatted_address;
                        self.lineData.lineParam = data;
                        self.lineData.r = 200;
                        self.lineData.type = 'line';
                        self.lineData.mapdata = self.tempLayerData;
                        self.$emit('emitFun', self.lineData);
                      },
                    );
                  },
                );

                // 绘制缓冲区
                return (window as any).map.renderBuffer(
                  '标绘图层',
                  data,
                  value,
                );
              })
              .then((res: any) => {
                (self as any).getLineBuffer(res.CovgData);
              });
          },
        },
        false,
      );
      (window as any).map.activateDrawFeature('标绘图层');
    },
    // 激活画面工具方法
    startDrawArea(): void {
      const that: any = this;
      this.deleteFlightLayer();
      (window as any).map.newDrawFeature(
        '标绘图层',
        'PolygonEx',
        {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          featureadded(e: any) {
            console.log(e);
            that.tempLayerData = [];
            (window as any).map.closeActivateDrawFeature('标绘图层');
            that.tempLayerData = that.returnDealData(
              e.feature.geometry._controlPoints,
            ); // 缓存当前图层的数据
            that.areaLonLatObj = that.getAreaLonLatObj(
              e.feature.geometry._controlPoints,
            );
            const tempAddr: any = e.feature.geometry._controlPoints[0];
            (window as any).map.acquisitionPoint(
              { lon: tempAddr.x, lat: tempAddr.y },
              (res: any) => {
                (window as any).map
                  .calculateAreas(e.feature.geometry)
                  .then((resource: any) => {
                    that.areaData = {
                      lonLatStr: that.areaLonLatObj,
                      area: Math.round(resource.area),
                      addr: res.res.result.formatted_address,
                      type: 'area',
                      lon: '',
                      lat: '',
                    };
                    that.getAndRenderAreaPointLayer(that.areaLonLatObj);
                  });
              },
            );
            (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的面图层的时候先清除原有的数据
          },
        },
        false,
      );
      (window as any).map.activateDrawFeature('标绘图层');
    },
    // 渲染面搜索结果图层
    getAndRenderAreaPointLayer(str: string) {
      const tempAreaParam: any = {
        paramsStr: str,
        resoureType: 101,
        solrType: 3,
      };
      getFlightPatrolSearch(tempAreaParam).then((response: any) => {
          const arr = response.data.monitorCameraVOS;
          this.areaData.cameraData = response.data.monitorCameraVOS
            ? response.data.monitorCameraVOS
            : [];
          this.areaData.appLabelDeviceVOS = response.data.appLabelDeviceVOS
            ? response.data.appLabelDeviceVOS
            : [];
          this.areaData.type = 'area';
          this.areaData.mapdata = this.tempLayerData;
          this.$emit('emitFun', this.areaData);
          // 渲染搜索结果的聚合图层
          this.renderPointLayer(arr || []);
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取摄像头数据失败，错误信息：${error}`,
          );
        });
    },
    getAreaLonLatObj(arr: any) {
      let lonlats = '';
      arr.forEach((element: any, index: number) => {
        lonlats += element.x;
        lonlats += ' ';
        lonlats += element.y;
        lonlats += ',';
      });
      lonlats += `${arr[0].x} ${arr[0].y}`;
      return lonlats;
    },
    // 取消所有标绘工具方法
    cancleAllDrawFun(): void {
      (window as any).map.closeActivateDrawFeature('标绘图层');
    },
    // 计算飞巡面积
    measureAreaFun(obj: any): void {
      (window as any).map.calculateAreas(obj);
    },
    // 线检索 数据请求
    getLineBuffer(arr: any): void {
      const self: any = this;
      const len: number = arr.length;
      const data: any = {
        resoureType: 101, // 资源类型(101:视频监控设备)
        solrType: 2, // 检索类型(1:点，2：线，3：多边形, 4：关键字搜索)
      };
      // 不闭合图形时只有一个数组[[xxx]],闭合图形时有两个[[xxx],[xxx]]
      data.paramsStr = arr;
      // 发送请求获取数据
      getFlightPatrolSearch(data).then((res: any) => {
          self.renderPointLayer(
            res.data.monitorCameraVOS ? res.data.monitorCameraVOS : [],
          );
          self.lineData.cameraData = res.data.monitorCameraVOS
            ? res.data.monitorCameraVOS
            : [];
          self.lineData.appLabelDeviceVOS = res.data.appLabelDeviceVOS
            ? res.data.appLabelDeviceVOS
            : [];
          self.lineData.bufferData = arr;
        });
    },
    // 渲染搜索结果
    renderPointLayer(arr: any) {
      const self = this;
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
      const tempArr2: Array<any> = [];
      arr.forEach((item: any) => {
        const tempItem: any = {};
        tempItem.longitude = item.lon || item.longitude;
        tempItem.latitude = item.lat || item.latitude;
        tempItem.wd = 34;
        tempItem.Hg = 45;
        tempItem.src = require('./assets/camera.svg');
        // tempItem.src = require('./assets/newCamera.png');
        tempItem.imgInfo = item;
        tempItem.deviceId = item.deviceId; // 用来做数据筛选，点击列表的名称的时候，修改当前的图标
        tempArr2.push(tempItem);
      });
      console.log(tempArr2);
      (window as any).map.drawConverge(
        '飞巡结果聚合图层',
        tempArr2,
        {
          img: require('./assets/camera.svg'),
          width: 34,
          height: 45,
        },
        {
          dblclick(f: any) {
            if (f) {
              (self as any).getCameraDetailById(Number(f.imgInfo.deviceId));
            }
          },
          click(f: any) {
            if (f) {
              (self as any).getCameraDetailById(Number(f.imgInfo.deviceId));
            }
          },
          over(f: any) {
            console.log('in');
            (self as any).hideVideoPop();
            (self as any).showVideoPop(f);
          },
          out() {
            console.log('out');
            (self as any).hideVideoPop();
          },
        },
      );
    },
    // 显示摄像头名称弹框
    showVideoPop(obj: any) {
      this.tempVideoAddr = obj.imgInfo.deviceName;
      (window as any).map.mapPopup({
        id: 'videoId',
        longitude: obj.longitude,
        latitude: obj.latitude,
        class: (this as any).$refs.cameraName as HTMLElement,
      });
    },
    // 隐藏摄像头名称弹框
    hideVideoPop() {
      (window as any).map.closeClearPopup('videoId');
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
    // // 显示监控详情弹框
    showCameraDetail(obj: any, videos: any) {
      this.cameraTreeCheckedNodes = obj;
      (this as any).$refs['flight-camera-view'].initMap(
        obj.lon || obj.longitude,
        obj.lat || obj.latitude,
      );
      if (obj.isMain === 0) {
        (this as any).tempCameraDetail = obj;
        (this as any).$refs['flight-camera-view'].cameraTitle = '监控详情';
      } else {
        obj.devices = videos.devices;
        (this as any).tempCameraDetail = obj;
      }
      (this as any).$refs['flight-camera-view'].initMap(
        obj.lon || obj.longitude,
        obj.lat || obj.latitude,
      );
    },
    // 确认保存添加监控
    confirmAddFlightCamera(el: any) {
      (this as any).flightResourceVisible = true;
      console.log(el);
      (this as any).cameraTreeCheckedNodes = el;
    },
  },
  onUnmounted() {
    deleteFun('keydown', this.keyDownCancel);
  },
});
</script>

<style lang="scss">
.tipsDiv {
  position: fixed;
  top: 75px;
  height: 44px;
  display: flex;
  color: #fff;
  left: 52%;
  transform: translate(-50%, 81px);
  .checked {
    color: #56e9ff;
    text-shadow: 0px 0px 4px rgba(86, 233, 255, 0.31);
  }
  .tipsdiv__tipsItem {
    width: 120px;
    height: 44px;
    background: url(./assets/tip.png) no-repeat;
    background-size: 100% 100%;
    font-size: 16px;
    text-align: center;
    line-height: 44px;
    cursor: pointer;
    .tipsdiv__tipsItem__point {
      background: url(./assets/tipIcon/point.png) no-repeat;
      width: 100%;
      height: 100%;
      align-items: center;
      line-height: 44px;
      background-position: 10% 50%;
    }
    .tipsdiv__tipsItem__line {
      background: url(./assets/tipIcon/line.png) no-repeat;
      width: 100%;
      height: 100%;
      align-items: center;
      line-height: 44px;
      background-position: 10% 50%;
    }
    .tipsdiv__tipsItem__area {
      background: url(./assets/tipIcon/area.png) no-repeat;
      width: 100%;
      height: 100%;
      align-items: center;
      line-height: 44px;
      background-position: 10% 50%;
    }
  }
  .tipsdiv__esc {
    width: 90px;
    background: #000;
    font-size: 16px;
    line-height: 44px;
    text-align: center;
    margin-left: 3px;
    cursor: pointer;
  }
}
.showPositionLeft {
  position: fixed;
  top: 75px;
  height: 44px;
  display: flex;
  color: #fff;
  left: 60%;
}
.center__camera__name {
  position: absolute;
  height: 27px;
  background: #050505;
  box-shadow: 0px 4px 6px 0px rgb(0 0 0 / 80%);
  opacity: 0.9;
  border: 1px solid rgba(166, 173, 180, 0.3);
  color: #fff;
  padding: 0 10px;
  line-height: 27px;
  width: max-content;
}
</style>
