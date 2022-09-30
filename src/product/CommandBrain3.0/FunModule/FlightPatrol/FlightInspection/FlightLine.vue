<template>
  <div>
    <div
      v-if="isHomePage"
      class="flight-pointinsect"
    >
      <header
        v-if="$store.state.flightPatrol.showChecked"
        class="flight-pointinsect__header"
      >
        <div class="flight-pointinsect__header__leftNum">
          {{ returnSearchNum(searchNum) }}
        </div>
        <div class="flight-pointinsect__header_scrollCom">
          <ProcessScroll
            :type="type"
            :seach-num="lineData.r"
            @change-num-line="changeNum"
          />
        </div>
        <div class="flight-pointinsect__header__rightNum">
          <input
            v-model="totalNum"
            class="flight-pointinsect__header__rightNum_input"
            type="text"
          >
          <div class="total-num-unit">
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
      <div class="flight-pointinsect__searchSection">
        <div class="flight-pointinsect__searchSection__t">
          <div class="flight-pointinsect__searchSection__t__Icon" />
          <input
            v-model="searchName"
            class="flight-pointinsect__searchSection__t__input"
            type="text"
          >
          <div class="flight-pointinsect__searchSection__t__searchNum">
            {{ monitorCameraVOSNum }}
          </div>
        </div>
        <div class="flight-pointinsect__searchSection__b">
          {{ addrdress }}
        </div>
      </div>
      <main
        class="flight-pointinsect__main"
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
          :show-edit="false"
          :show-check="$store.state.flightPatrol.showChecked"
          @node-click="nameClickFun"
        />
      </main>
      <footer
        v-if="$store.state.flightPatrol.showChecked"
        class="flight-pointinsect__footer"
      >
        <div class="flight-pointinsect__footer_l">
          <div
            class="flight-pointinsect__footer_l_Item"
            @click="batchPreview"
          >
            批量预览
          </div>
          <div
            class="flight-pointinsect__footer_l_Item"
            @click="handleSaveAsGroup"
          >
            存为分组
          </div>
          <div
            class="flight-pointinsect__footer_l_Item"
            @click="handleCreateVideoLink"
          >
            创建视频链
          </div>
        </div>
        <div class="flight-pointinsect__footer_r">
          <div
            class="flight-pointinsect__footer_r-l"
            @click="cancelFlightPop"
          >
            取消
          </div>
          <div
            class="flight-pointinsect__footer_r-r"
            @click="openFlightRecode"
          >
            {{ sureBtnName }}
          </div>
        </div>
      </footer>
    </div>
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
    :all-camera-num="monitorCameraVOSNum"
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
import TopHeader from '@/product/CommandBrain3.0/Generalparts/right/TopHeader/TopHeader.vue';
import FlightCameraView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/FlightCameraView.vue';
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import { ElMessage } from 'element-plus';
import ProcessScroll from './processScroll/ProcessScrollEle.vue';
import MultiVideoExpand from '../components/MultiVideoExpand/MultiVideoExpand.vue';
import FlightLineDetail from './FlightLineDetail.vue';
import CreateVideoLink from '../components/CreateVideoLink/CreateVideoLink.vue';
import SaveGroup from './saveGroup.vue';
import FlightList from './FlightList.vue';
import { getFlightPatrolSearch } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

export default defineComponent({
  name: 'FlightLine',
  components: {
    ProcessScroll, // 进度条拖拽组件
    MultiVideoExpand, // 视频分组
    CreateVideoLink, // 创建视频链模块
    // SaveAsGroup, // 存为分组
    SaveGroup, // 存为分组 
    FlightList, // 飞巡记录
    FlightCameraView, // 弹框
    TopHeader, // 顶部标题栏
  },
  props: {
    lineData: {
      type: Object,
      default: () => { },
    },
  },
  emits: ['closePopEmit', 'changeData'],
  setup() {
    const tempCameraDetail = ref({});
    provide('cameraDetail', tempCameraDetail);
    const multiexpand = ref<null>(null);
    const checkedAll = ref(false);
    const checkedAllFun = (e: boolean) => {
      (multiexpand.value as any).handleCheckAll(e);
    };
    return {
      tempCameraDetail,
      checkedAllFun,
      multiexpand,
      checkedAll,
    };
  },
  data() {
    return {
      type: 'line',
      isHomePage: true, // 是否是主页面
      dataObj: {
        name: '飞巡测试任务',
        id: 2,
      },
      totalNum: 10, // 设置总范围
      searchNum: 0, // 搜索的范围
      // 分组数据
      groupData: [],
      // 勾选的摄像头列表
      checkedList: [],
      layerVideoObj: {},
      searchName: '',
      monitorCameraVOSNum: '', // 当前的搜索总数
      addrdress: '',
      showCameraDetailFlag: false, // 是否显示弹窗
      // 此时hover的摄像头地址
      tempVideoAddr: '',
      cameraTreeCheckedNodes: {}, // 当前点击的对象
      // 飞巡资源是否可见
      flightResourceVisible: false,
      sureBtnName: '确定',
    };
  },
  watch: {
    lineData: {
      handler(val) {
        console.log(val);
        const treeData = val.appLabelDeviceVOS ? JSON.parse(
          JSON.stringify(val.appLabelDeviceVOS)
            .replace(/labelName/g, 'name')
            .replace(/deviceId/g, 'id')
            .replace(/deviceName/g, 'name'),
        ): [];
        this.groupData = treeData;
        this.monitorCameraVOSNum = val?.cameraData
          ? val.cameraData.length
          : 0;
        this.addrdress = val.addrs;
        this.searchNum = val.r;
        this.showCircleLayer(this.searchNum);
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
  mounted() { },
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
      if (this.searchName === '') {
        this.$message.error('请先填写名称');
        (this.$refs.searchNameRef as any).focus();
        return;
      }
      if (this.checkedList.length === 0) {
        this.$message.error('请先勾选监控');
        return;
      }
      this.getFlightTaskNowName(2);
      this.isHomePage = false;
      this.checkedList.forEach((ele: any) => {
        ele.num = ele.number;
      });
      const data = [{ devices: this.checkedList }];
      (this as any).$store.commit('flightPatrol/SET_dispatchDeskData', data);

      const checkedList: any = JSON.parse(JSON.stringify(this.checkedList));
      checkedList.forEach((ele: any) => {
        const x: any = ele;
        x.deviceId = x.deviceId || x.id;
        x.deviceName = x.deviceName || x.name;
        x.longitude = x.longitude || x.lon;
        x.latitude = x.latitude || x.lat;
      });
      this.layerVideoObj = {
        beginCoordinateLatitude: '',
        beginCoordinateLongitude: '',
        beginCoordinateName: this.lineData.addrs,
        controlPointseList: this.lineData.bufferData,
        devices: checkedList,
        drawType: 2, // 绘图类型(0：点，1：面，：2：线)
        endCoordinateLatitude: null,
        endCoordinateLongitude: null,
        endCoordinateName: this.lineData.addre,
        groupId: '',
        id: 1,
        order: 1,
        title: this.searchName,
        type: 2,
        layerShowObj: this.lineData, // 当前图形的监控数据、图形数据进行保存，查看详情的时候用到
      };
      // 查看详情保存逻辑
      if (this.sureBtnName === '保存') {
        const sessionTempArr = JSON.parse(
          JSON.stringify(sessionStorage.getItem('tempListData')),
        );
        const sessionArr = this.jsonToArr(sessionTempArr);
        sessionArr.forEach((item: any, index: number) => {
          if (item.beginCoordinateName === this.lineData.addrs) {
            sessionArr.splice(index, 1); // 删除当前的图形数据，并更新编辑后的数据
            sessionArr.push(this.layerVideoObj);
            sessionStorage.setItem('tempListData', JSON.stringify(sessionArr));
          }
        });
        this.checkedList = [];
      } else {
        // 新增逻辑
        if (sessionStorage.getItem('tempListData')) {
          const sessionTempArr = JSON.parse(
            JSON.stringify(sessionStorage.getItem('tempListData')),
          );
          const sessionArr = this.jsonToArr(sessionTempArr);
          sessionArr.push(this.layerVideoObj);
          sessionStorage.setItem('tempListData', JSON.stringify(sessionArr));
        } else {
          sessionStorage.setItem(
            'tempListData',
            JSON.stringify([this.layerVideoObj]),
          );
        }
        this.checkedList = [];
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
    /**
     * 存为分组
     */
    handleSaveAsGroup() {
      // 处理数据
      const cameraIds = [] as any[];
      this.checkedList.forEach((element: any) => {
        cameraIds.push(Number(element.id));
      });
      this.layerVideoObj = {
        beginCoordinateLatitude: '',
        beginCoordinateLongitude: '',
        beginCoordinateName: this.lineData.addrs,
        controlPointseList: this.lineData.bufferData,
        devices: this.checkedList,
        deviceIds: cameraIds,
        drawType: 2, // 绘图类型(0：点，1：面，：2：线)
        endCoordinateLatitude: null,
        endCoordinateLongitude: null,
        endCoordinateName: this.lineData.addre,
        groupId: '',
        id: 1,
        order: 1,
        title: this.searchName,
        type: 2,
      };
      (this.$refs as any).SaveGroup.open();
    },
    // 创建视频链
    handleCreateVideoLink() {
      (this.$refs as any).CreateVideoLink.open();
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
      this.searchNum = parseInt(
        ((Number(data) / 100) * this.totalNum * 1000) as any,
        0,
      );
      // (window as any).map.clearAtPresentVectorData('线缓冲图层');
      // (window as any).map.clearAtPresentVectorData('flightRecord');
      (window as any).map.clearAtPresentVectorData('标绘图层');
      this.lineData.r = this.searchNum;
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
      const param: any = {
        currentPage: 1,
        latitude: this.lineData.lat || this.lineData.latitude,
        longitude: this.lineData.lon || this.lineData.longitude,
        // pageSize: 2000,
        radius: this.searchNum / 1000,
        resoureType: 101,
        solrType: 1,
      };
      getFlightPatrolSearch(param).then((response: any) => {
          this.showPointAtMap(response.data.monitorCameraVOS); // 显示飞巡视频监控点图层以及数据
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取摄像头数据失败，错误信息：${error}`,
          );
        });
    },
    // 显示飞巡视频监控点图层以及数据
    showPointAtMap(arr: Array<any>): void {
      (window as any).map.clearAtPresentMarkData('飞巡结果监控Layer'); // 清空图层
      const tempArr2: Array<any> = [];
      arr.forEach((item) => {
        const tempItem: any = {};
        tempItem.longitude = item.lon || item.longitude;
        tempItem.latitude = item.lat || item.latitude;
        tempItem.wd = 40;
        tempItem.Hg = 40;
        tempItem.src = useMapMarker('监控');
        tempItem.imgInfo = item;
        tempArr2.push(tempItem);
      });
      (window as any).map.setMultiMarker('飞巡结果监控Layer', tempArr2, {
        click(e: any, mark: any) {
          console.log(mark);
        },
      });
      // }
    },
    // 显示飞巡画线图层
    showCircleLayer(range: any): void {
      const self: any = this;
      (window as any).map
        .getCoverageData('标绘图层')
        .then((r: any) =>
          // 绘制缓冲区
          (window as any).map.renderBuffer(
            '标绘图层',
            this.lineData.lineParam,
            range,
            true,
          ))
        .then((res: any) => {
          (self as any).getLineBuffer(res.CovgData);
        });
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
          if ((this as any).$store.state.flightPatrol.showChecked) {
            self.renderPointLayer(
              res.data.monitorCameraVOS ? res.data.monitorCameraVOS : [],
            );
            self.monitorCameraVOSNum = res.data.monitorCameraVOS.length;
            const treeData = JSON.parse(
              JSON.stringify(res.data.appLabelDeviceVOS)
                .replace(/labelName/g, 'name')
                .replace(/deviceId/g, 'id')
                .replace(/deviceName/g, 'name'),
            );
            self.groupData = treeData;
          }
        });
    },
    // 渲染搜索结果
    // renderPointLayer(arr: any) {
    //   console.log(arr);
    //   console.log('搜索出来的值');
    //   (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
    //   const tempArr2: Array<any> = [];
    //   arr.forEach((item: any) => {
    //     const tempItem: any = {};
    //     tempItem.longitude = item.lon || item.longitude;
    //     tempItem.latitude = item.lat || item.latitude;
    //     tempItem.wd = 34;
    //     tempItem.Hg = 45;
    //     tempItem.src = require('./assets/camera.svg');
    //     tempItem.imgInfo = item;
    //     tempArr2.push(tempItem);
    //   });
    //   (window as any).map.drawConverge(
    //     '飞巡结果聚合图层',
    //     tempArr2,
    //     {
    //       img: require('./assets/camera.svg'),
    //       width: 34,
    //       height: 45,
    //     },
    //     {
    //       click() {
    //         console.log(this);
    //       },
    //     },
    //   );
    // },
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
    // // 显示监控详情弹框
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
      if (format === 1) {
        time = `${year}-${month}-${date}`;
      }
      // 精确到分
      else if (format === 2) {
        time = `${year}-${month}-${date} ${hour}:${minu}:${sec}`;
      }
      // return time;
      this.dataObj.name = `${time} 飞巡任务`;
    },
    // 关闭当前窗口
    cancelFlightPop() {
      this.$emit('closePopEmit');
      (window as any).map.clearAtPresentVectorData('标绘图层');
      (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
      (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
    },
    // 获取详情列表传递的当前图形的数据
    getLayerDetail(lineData: any) {
      this.$emit('changeData', lineData.layerShowObj);
      this.isHomePage = true;
      this.searchName = lineData.title; // 任务标题
      this.monitorCameraVOSNum = this.lineData.cameraData.length; // 总摄像头数
      const treeData = JSON.parse(
        JSON.stringify(lineData.layerShowObj.appLabelDeviceVOS || [])
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

<style  lang="scss">
.flight-pointinsect {
  height: 100%;
  display: flex;
  flex-direction: column;
  .flight-pointinsect__header {
    background: rgba(132, 160, 193, 0.11);
    display: flex;
    .flight-pointinsect__header__leftNum {
      width: 64px;
      line-height: 48px;
      text-align: center;
      color: #fff;
      font-size: 18px;
    }
    .flight-pointinsect__header__rightNum {
      width: 72px;
      display: flex;
      align-items: center;
      margin-left: 3px;
      .flight-pointinsect__header__rightNum_input {
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
      .total-num-unit {
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
  .flight-pointinsect__main {
    height: 625px;
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
  .flight-pointinsect__searchSection {
    width: 380px;
    height: 80px;
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, 0.3) 0%,
      rgba(24, 38, 50, 0) 100%
    );
    margin: 0 auto;
    margin-top: 10px;
    .flight-pointinsect__searchSection__t {
      height: 32px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      margin-left: 10px;
      .flight-pointinsect__searchSection__t__Icon {
        width: 21px;
        height: 21px;
        background: url(./assets/lineIcon.svg) no-repeat;
        background-size: 100% 100%;
      }
      .flight-pointinsect__searchSection__t__input {
        width: 273px;
        height: 32px;
        border: 1px solid #a6adb4;
        background: 0;
        margin-left: 6px;
        outline: none;
        color: #fff;
      }
      .flight-pointinsect__searchSection__t__searchNum {
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
    .flight-pointinsect__searchSection__b {
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
  .flight-pointinsect__header_scrollCom {
    width: 250px;
    height: 48px;
    // margin: 0 auto;
  }
  .flight-pointinsect__footer {
    width: 100%;
    display: flex;
    color: #fff;
    height: 52px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    .flight-pointinsect__footer_l {
      display: flex;
      align-items: center;
      width: 240px;
      .flight-pointinsect__footer_l_Item {
        min-width: 56px;
        cursor: pointer;
        margin: 0 5px;
      }
    }
    .flight-pointinsect__footer_r {
      display: flex;
      align-items: center;
      .flight-pointinsect__footer_r-l {
      }
      .flight-pointinsect__footer_r-r {
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
