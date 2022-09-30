/* eslint-disable global-require */
<template>
  <div
    v-if="isHomePage"
    class="flight-Insect"
  >
    <header
      v-if="$store.state.flightPatrol.showChecked"
      class="flight-Insect__header"
    >
      <div class="flight-Insect_leftNum">
        {{ returnSearchNum(searchNum) }}
      </div>
      <div class="flight-Insect_scrollCom">
        <ProcessScroll
          :type="type"
          :seach-num="pointData.r"
          @change-num-point="changeNum"
        />
      </div>
      <div class="flight-Insect_rightNum">
        <input
          v-model="totalNum"
          class="flight-Insect_rightNum_input"
          type="text"
        >
        <div class="flight-Insect_unit">
          公里
        </div>
      </div>
    </header>
    <TopHeader
      v-else
      @go-back="goBack"
    >
      <!-- 标题 -->
      <template #default>
        <span style="font: inherit; margin-right: 5px;color:#fff">详情</span>
      </template>
      <!-- 摄像头总数统计 -->
      <template #right>
        <span @click="editFun">编辑</span>
      </template>
    </TopHeader>
    <div class="flight-Insect__searchSection">
      <div class="flight-Insect__searchSection__top">
        <div class="flight-Insect__searchSection__top__Icon" />
        <input
          ref="searchNameRef"
          v-model="searchName"
          class="flight-Insect__searchSection__top__input"
          type="text"
        >
        <div class="flight-Insect__searchSection__top__searchNum">
          {{ searchTotal }}
        </div>
      </div>
      <div class="flight-Insect__searchSection__bottom">
        {{ pointData.addr }}
      </div>
    </div>
    <main
      class="flight-Insect__main"
      @scroll.prevent="handleScroll"
    >
      <div
        v-if="$store.state.flightPatrol.showChecked"
        class="checkedTopAll"
      >
        <el-checkbox
          v-model="checkedAll"
          @change="checkedAllFun"
        >
          全选
        </el-checkbox>
        <div class="checkedNum">
          已选：{{ checkedList.length }}
        </div>
      </div>
      <MultiVideoExpand
        ref="multiexpand"
        v-model="checkedList"
        :group-data="groupData"
        :allsearch-data="allsearchData"
        :show-edit="false"
        :show-check="$store.state.flightPatrol.showChecked"
        @node-click="nameClickFun"
      />
    </main>
    <footer
      v-if="$store.state.flightPatrol.showChecked"
      class="flight-Insect__footer"
    >
      <div class="flight-Insect__footer__left">
        <div
          class="flight-Insect__footer__left__Item"
          @click="batchPreview"
        >
          批量预览
        </div>
        <div
          class="flight-Insect__footer__left__Item"
          @click="handleSaveAsGroup"
        >
          存为分组
        </div>
        <div
          class="flight-Insect__footer__left__Item"
          @click="handleCreateVideoLink"
        >
          创建视频链
        </div>
      </div>
      <div class="flight-Insect__footer__r">
        <div
          class="flight-Insect__footer__r__l"
          @click="cancelFlightPop"
        >
          取消
        </div>
        <div
          class="flight-Insect__footer__r__r"
          @click="openFlightRecode"
        >
          {{ sureBtnName }}
        </div>
      </div>
    </footer>
  </div>
  <div
    ref="cameraName"
    class="center__camera__name"
  >
    {{ tempVideoAddr }}
  </div>
  <!-- 创建视频链弹窗 -->
  <CreateVideoLink
    ref="CreateVideoLink"
    :device-list="checkedList"
    @refresh="getGroupData(activeTabIndex)"
  />
  <!-- 存为分组弹窗 -->
  <SaveGroup
    ref="SaveGroup"
    :task-data="[layerVideoObj]"
    :device-list="checkedList"
  />
  <FlightList
    v-if="!isHomePage"
    :has-repatrol="false"
    :all-camera-num="searchTotal"
    :group-item="dataObj"
    @go-back="isHomePage = true"
    @go-detail="getLayerDetail"
  />
  <FlightCameraView
    ref="flight-camera-view"
    v-model:flightResourceVisible="flightResourceVisible"
    :camera-tree-checked-nodes="cameraTreeCheckedNodes"
  />
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue';
import FlightCameraView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/FlightCameraView.vue';
import TopHeader from '@/product/CommandBrain3.0/Generalparts/right/TopHeader/TopHeader.vue';
import { ElMessage } from 'element-plus';
import ProcessScroll from './processScroll/ProcessScrollEle.vue';
import MultiVideoExpand from '../components/MultiVideoExpand/MultiVideoExpand.vue';
import CreateVideoLink from '../components/CreateVideoLink/CreateVideoLink.vue';
import SaveGroup from './saveGroup.vue';
import FlightList from './FlightList.vue';
import { getFlightPatrolSearch } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

export default defineComponent({
  name: 'FlightInspection',
  components: {
    ProcessScroll, // 进度条拖拽组件
    MultiVideoExpand, // 视频分组
    CreateVideoLink, // 创建视频链模块
    SaveGroup, // 存为分组
    FlightList, // 飞巡记录
    FlightCameraView, // 监控详情组件
    TopHeader, // 顶部标题栏
  },
  inheritAttrs: false,
  props: {
    pointData: {
      type: Object,
      default: () => { },
    },
  },
  emits: ['closePopEmit', 'changeData'],
  setup() {
    const tempCameraDetail = ref({});
    const checkedAll = ref(false);
    const multiexpand = ref<null>(null);
    provide('cameraDetail', tempCameraDetail);
    const checkedAllFun = (e: boolean) => {
      (multiexpand.value as any).handleCheckAll(e);
    };
    return {
      tempCameraDetail,
      checkedAll,
      checkedAllFun,
      multiexpand,
    };
  },
  data() {
    return {
      type: 'point',
      totalNum: 10, // 设置总范围
      searchNum: 0, // 搜索的范围
      // 分组数据
      groupData: [],
      // 勾选的摄像头列表
      checkedList: [],
      tempLon: '',
      tempLat: '',
      searchTotal: 0, // 摄像头总数
      isHomePage: true,
      isShow: false,
      dataObj: {
        name: '飞巡测试任务',
        id: 3,
      },
      layerVideoData: [] as any[], // 当前的点飞巡的地图数据以及选中的摄像头数据
      searchName: '',
      layerVideoObj: {},
      allsearchData: [], // 搜索出来的摄像头数据
      popIndex: '', // 全局弹框id
      clickCameraId: [], // 点击的摄像头记录
      showCameraDetailFlag: false, // 是否显示弹窗
      // 此时hover的摄像头地址
      tempVideoAddr: '',
      cameraTreeCheckedNodes: {}, // 当前点击的对象
      // 飞巡资源是否可见
      flightResourceVisible: false,
      // 勾选框、底部footer是否可见
      showChecked: (this as any).$store.state.flightPatrol.showChecked,
      sureBtnName: '确定',
    };
  },
  watch: {
    pointData: {
      handler(val) {
        this.searchNum = Math.round(this.pointData.r) || 0;
        this.tempLon = this.pointData.lon || this.pointData.longitude;
        this.tempLat = this.pointData.lat || this.pointData.latitude;
        if (this.pointData.cameraData) {
          this.searchTotal = this.pointData.cameraData.length;
          const treeData = JSON.parse(
            JSON.stringify(val.appLabelDeviceVOS || [])
              .replace(/labelName/g, 'name')
              .replace(/deviceId/g, 'id')
              .replace(/deviceName/g, 'name'),
          );
          this.groupData = treeData;
          this.showCircleLayer(this.searchNum);
        } else {
          this.showCircleLayer(this.searchNum);
          this.searchTotal = 0;
          this.groupData = [];
        }
      },
      deep: true,
      immediate: true,
    },
    // 设备离线状态预处理
    groupData(groupData) {
      if (Array.isArray(groupData)) {
        for (const group of groupData) {
          group.children?.forEach((i: any) => {
            i.isOffline = i.status !== 0 && i.status !== '0';
          });
          group.children?.sort((a: any, b: any) => {
            return b.isOffline - a.isOffline;
          });
        }
      }
    },
  },
  methods: {
    // 批量预览
    batchPreview() {
      (this as any).$store.commit(
        'flightPatrol/SET_flightPatrolPreviewCachePool',
        this.checkedList,
      );
    },
    // 点击节点的方法
    nameClickFun(obj: any) {
      console.log(localStorage.getItem('clickCameraId'));
      (window as any).map.setCentent(
        {
          longitude: obj.lon || obj.longitude,
          latitude: obj.lat || obj.latitude,
        },
        17,
      );
      // 如果上一次点击过，下一次点击之前将样式还原
      (window as any).map.modifyStyle(
        '飞巡结果聚合图层',
        'deviceId',
        localStorage.getItem('clickCameraId'),
        {
          img: require('./assets/camera.svg'),
          width: 34,
          height: 45,
        },
      );
      localStorage.setItem('clickCameraId', obj.id);
      (window as any).map.modifyStyle('飞巡结果聚合图层', 'deviceId', obj.id, {
        img: require('./assets/cameraActive.svg'),
        width: 48,
        height: 62,
      });
    },
    // 保存
    openFlightRecode() {
      console.log('图形数据：');
      console.log(this.pointData);
      (window as any).map.clearAtPresentVectorData('标绘图层');
      (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
      (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
      if (this.searchName === '') {
        this.$message.error('请先填写名称');
        (this.$refs.searchNameRef as any).focus();
        return;
      }
      if (this.checkedList.length === 0) {
        this.$message.error('请先勾选监控');
        return;
      }
      this.getFlightTaskNowName(2); // 获取此时的时间，用于显示飞巡任务标题
      this.isHomePage = false; // 隐藏当前页面
      console.log(this.checkedList);
      const checkedList: any = JSON.parse(JSON.stringify(this.checkedList));
      this.layerVideoObj = {
        beginCoordinateLatitude: this.pointData.lat || this.pointData.latitude,
        beginCoordinateLongitude: this.pointData.lon || this.pointData.longitude,
        beginCoordinateName: this.pointData.addr,
        controlPointseList: this.pointData.mapdata, // 图层数据
        devices: checkedList,
        drawType: 0, // 绘图类型(0：点，1：面，：2：线)
        endCoordinateLatitude: null,
        endCoordinateLongitude: null,
        endCoordinateName: null,
        groupId: '',
        id: 1,
        order: 0,
        title: this.searchName,
        type: 0,
        layerShowObj: this.pointData, // 当前图形的监控数据、图形数据进行保存，查看详情的时候用到
      };
      // 查看详情保存逻辑
      if (this.sureBtnName === '保存') {
        const sessionTempArr = JSON.parse(
          JSON.stringify(sessionStorage.getItem('tempListData')),
        );
        const sessionArr = this.jsonToArr(sessionTempArr);
        sessionArr.forEach((item: any, index: number) => {
          if (item.beginCoordinateName === this.pointData.addr) {
            sessionArr.splice(index, 1); // 删除当前的图形数据，并更新编辑后的数据
            sessionArr.push(this.layerVideoObj);
            sessionStorage.setItem('tempListData', JSON.stringify(sessionArr));
          }
        });
        this.checkedList = [];
      } else {
        if (sessionStorage.getItem('tempListData')) {
          const sessionTempArr = JSON.parse(
            JSON.stringify(sessionStorage.getItem('tempListData')),
          );
          const sessionArr = this.jsonToArr(sessionTempArr);
          sessionArr.push(this.layerVideoObj);
          sessionArr.forEach((item: any, index: number) => {
            item.order = index;
          });
          sessionStorage.setItem('tempListData', JSON.stringify(sessionArr));
        } else {
          sessionStorage.setItem(
            'tempListData',
            JSON.stringify([this.layerVideoObj]),
          );
        }
        this.checkedList = [];
        this.showChecked = true;
      }
    },
    jsonToArr(jsonStr: any) {
      const jsonObj = JSON.parse(jsonStr);
      const jsonStr1 = JSON.stringify(jsonObj);
      const jsonArr = [];
      for (let i = 0; i < jsonObj.length; i++) {
        jsonArr[i] = jsonObj[i];
      }
      return jsonArr;
    },
    // 创建视频链
    handleCreateVideoLink() {
      (this.$refs as any).CreateVideoLink.open();
    },
    // 存为分组
    handleSaveAsGroup() {
      // 处理数据
      const cameraIds = [] as any[];
      this.checkedList.forEach((element: any) => {
        cameraIds.push(Number(element.id));
      });
      this.layerVideoObj = {
        beginCoordinateLatitude: this.pointData.lat || this.pointData.latitude,
        beginCoordinateLongitude:
          this.pointData.lon || this.pointData.longitude,
        beginCoordinateName: this.pointData.addr,
        controlPointseList: this.pointData.mapdata,
        devices: this.checkedList,
        deviceIds: cameraIds,
        drawType: 0, // 绘图类型(0：点，1：面，：2：线)
        endCoordinateLatitude: null,
        endCoordinateLongitude: null,
        endCoordinateName: null,
        groupId: '',
        id: 1,
        order: 0,
        title: this.searchName,
        type: 0,
      };

      (this.$refs as any).SaveGroup.open();
    },
    handleScroll(event: Event): void {
      const DOM: HTMLElement = event.target as HTMLElement;
      if (DOM.clientHeight + DOM.scrollTop === DOM.scrollHeight) {
        // TODO 滚动到底请求数据
        console.log('to bottom');
      }
    },
    // 进度条
    changeNum(data: any): void {
      this.searchNum = Math.round(
        parseInt(((Number(data) / 100) * this.totalNum * 1000) as any, 0),
      );
      localStorage.setItem('lastNumber', this.searchNum as any);
      this.showCircleLayer(this.searchNum);
    },
    // 不满1000米单位按米、超过1000米单位按公里
    returnSearchNum(num: number) {
      if (num > 1000) {
        return `${(num / 1000).toFixed(1)}公里`;
      } else {
        return `${num}米`;
      }
    },
    // 请求点飞巡数据
    pointSearchFun(): void {
      this.groupData = [];
      const param: any = {
        currentPage: 1,
        latitude: this.pointData.lat || this.pointData.latitude,
        longitude: this.pointData.lon || this.pointData.longitude,
        // pageSize: 2000,
        radius: this.searchNum / 1000,
        resoureType: 101,
        solrType: 1,
      };

      getFlightPatrolSearch(param).then((response: any) => {
          this.renderPointLayer(response.data.monitorCameraVOS);
          this.allsearchData = response.data.monitorCameraVOS;
          const treeData = JSON.parse(
            JSON.stringify(response.data.appLabelDeviceVOS)
              .replace(/labelName/g, 'name')
              .replace(/deviceId/g, 'id')
              .replace(/deviceName/g, 'name'),
          );
          this.groupData = treeData;
          this.searchTotal = response.data.monitorCameraVOS.length;
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取摄像头数据失败，错误信息：${error}`,
          );
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
    // 显示监控详情弹框
    showCameraDetail(obj: any, videos: any) {
      this.cameraTreeCheckedNodes = obj;
      console.log(this.cameraTreeCheckedNodes);
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
    // 关闭当前窗口
    cancelFlightPop() {
      this.$emit('closePopEmit');
      (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
    },
    // 显示飞巡画圆图层
    showCircleLayer(range: any): void {
      console.log(this.showChecked);
      (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      const circleData: any = {
        longitude: this.pointData.lon || this.pointData.longitude,
        latitude: this.pointData.lat || this.pointData.latitude,
        r: range,
      };
      const circleStyle: any = {
        strokeColor: '#ffffff',
        strokeWidth: 2,
        fillColor: '#fff',
        fillOpacity: 0.1,
      };
      (window as any).map
        .vectorDrawCir('飞巡圆图层', circleData, circleStyle)
        .then((res: any) => {
          console.log(res);
          if ((this as any).$store.state.flightPatrol.showChecked) {
            this.pointSearchFun();
          }
        });
    },
    // 动态传入飞巡任务的名字
    getFlightTaskNowName(format: any) {
      const now = new Date();
      const year = now.getFullYear(); // 得到年份
      let month: any = now.getMonth(); // 得到月份
      let date: any = now.getDate(); // 得到日期
      const day: any = now.getDay(); // 得到周几
      let hour: any = now.getHours(); // 得到小时
      let minu: any = now.getMinutes(); // 得到分钟
      let sec: any = now.getSeconds(); // 得到秒
      month += 1;
      if (month < 10) {
        month = `0${month}`;
      }
      if (date < 10) date = `0${date}`;
      if (hour < 10) hour = `0${hour}`;
      if (minu < 10) minu = `0${minu}`;
      if (sec < 10) sec = `0${sec}`;
      let time = '';
      // 精确到天
      if (format == 1) {
        time = `${year}-${month}-${date}`;
      }
      // 精确到分
      else if (format == 2) {
        time = `${year}-${month}-${date} ${hour}:${minu}:${sec}`;
      }
      // return time;
      this.dataObj.name = `${time} 飞巡任务`;
    },
    // 获取详情列表传递的当前图形的数据
    getLayerDetail(pointData: any) {
      this.$emit('changeData', pointData.layerShowObj);
      this.isHomePage = true;
      this.searchName = pointData.title; // 任务标题
      this.searchTotal = this.pointData.cameraData.length; // 总摄像头数
      const treeData = JSON.parse(
        JSON.stringify(pointData.layerShowObj.appLabelDeviceVOS || [])
          .replace(/labelName/g, 'name')
          .replace(/deviceId/g, 'id')
          .replace(/deviceName/g, 'name'),
      );
      this.groupData = treeData;
    },
    // 编辑
    editFun() {
      (this as any).$nextTick(() => {
        (this as any).$store.commit('flightPatrol/SET_showChecked', true);
      });
      this.sureBtnName = '保存';
    },
    // 详情返回
    goBack() {
      this.getFlightTaskNowName(2); // 获取此时的时间，用于显示飞巡任务标题
      this.isHomePage = false; // 隐藏当前页面
      (this as any).$store.commit('flightPatrol/SET_showChecked', true);
    },
  },
});
</script>

<style scoped lang="scss">
.flight-Insect {
  height: 100%;
  display: flex;
  flex-direction: column;
  .flight-Insect__header {
    background: rgba(132, 160, 193, 0.11);
    display: flex;
    justify-content: space-around;
    .flight-Insect_leftNum {
      width: 64px;
      line-height: 48px;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .flight-Insect_rightNum {
      width: 72px;
      display: flex;
      align-items: center;
      margin-left: 3px;
      .flight-Insect_rightNum_input {
        width: 30px;
        height: 28px;
        background: #141d1f;
        border: 1px solid #01607d;
        color: rgba(86, 233, 255, 1);
        font-size: 18px;
        padding-left: 4px;
        border-right: 0;
        outline: none;
      }
      .flight-Insect_unit {
        width: 36px;
        height: 30px;
        background: #141d1f;
        border: 1px solid #01607d;
        font-size: 17px;
        border-left: 0;
        color: #a6adb4;
        line-height: 30px;
        text-align: center;
      }
    }
  }
  .flight-Insect__main {
    height: 730px;
    width: 389px;
    margin: 0 auto;
    overflow: auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .flight-Insect__searchSection {
    width: 380px;
    height: 80px;
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, 0.3) 0%,
      rgba(24, 38, 50, 0) 100%
    );
    margin: 0 auto;
    margin-top: 10px;
    .flight-Insect__searchSection__top {
      height: 32px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      margin-left: 10px;
      .flight-Insect__searchSection__top__Icon {
        width: 21px;
        height: 21px;
        border: 2px solid #f7b500;
        border-radius: 50%;
      }
      .flight-Insect__searchSection__top__input {
        width: 273px;
        height: 32px;
        border: 1px solid #a6adb4;
        background: 0;
        margin-left: 6px;
        color: #ffffff;
        outline: none;
      }
      .flight-Insect__searchSection__top__searchNum {
        width: 50px;
        height: 100%;
        line-height: 34px;
        text-align: right;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        background: url(./assets/cameraNum.svg) no-repeat;
        background-position: 32% 60%;
      }
    }
    .flight-Insect__searchSection__bottom {
      height: 20px;
      line-height: 20px;
      margin-top: 10px;
      font-size: 14px;
      color: #fff;
      margin-left: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .flight-Insect_scrollCom {
    width: 240px;
    height: 48px;
  }
  .flight-Insect__footer {
    width: 100%;
    display: flex;
    color: #fff;
    height: 52px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    .flight-Insect__footer__left {
      display: flex;
      align-items: center;
      width: 240px;
      .flight-Insect__footer__left__Item {
        min-width: 56px;
        cursor: pointer;
        margin: 0 5px;
      }
    }
    .flight-Insect__footer__r {
      display: flex;
      align-items: center;
      .flight-Insect__footer__r__r {
        background: #32c5ff;
        border: 0;
      }
      & > div {
        width: 64px;
        height: 32px;
        border: 1px solid #a6adb4;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
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
.checkedTopAll {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  width: 95%;
  margin: 0 auto;
  margin-top: 10px;
  .checkedNum {
    color: #fff;
    width: 100px;
    height: 100%;
    text-align: center;
    line-height: 30px;
  }
}
</style>
