<template>
  <div
    v-if="isHomePage"
    class="flight-areainsect"
  >
    <header v-if="$store.state.flightPatrol.showChecked">
      <div class="flight-areainsect_l">
        巡查面积:
      </div>
      <div class="flight-areainsect-r">
        {{ devertUnit }}
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
    <div class="flight-areainsect__searchSection">
      <div class="flight-areainsect__searchSection_t">
        <div class="flight-areainsect__searchSection_t__searchIcon" />
        <input
          v-model="searchName"
          class="flight-areainsect__searchSection_t__input"
          type="text"
        >
        <div class="flight-areainsect__searchSection_t__searchNum">
          {{ searchCameraNum }}
        </div>
      </div>
      <div class="flight-areainsect__searchSection_b">
        {{ addr }}
      </div>
    </div>
    <main
      class="flight-areainsect__main"
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
      class="flight-areainsect__footer"
    >
      <div class="flight-areainsect__footer_l">
        <div
          class="flight-areainsect__footer_l_Item"
          @click="batchPreview"
        >
          批量预览
        </div>
        <div
          class="flight-areainsect__footer_l_Item"
          @click="handleSaveAsGroup"
        >
          存为分组
        </div>
        <div
          class="flight-areainsect__footer_l_Item"
          @click="handleCreateVideoLink"
        >
          创建视频链
        </div>
      </div>
      <div class="flight-areainsect__footer_r">
        <div
          class="flight-areainsect__footer_r-l"
          @click="cancelFlightPop"
        >
          取消
        </div>
        <div
          class="flight-areainsect__footer_r-r"
          @click="openFlightRecode"
        >
          {{ sureBtnName }}
        </div>
      </div>
    </footer>
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
    :all-camera-num="searchCameraNum"
    :group-item="dataObj"
    @go-back="isHomePage = true;"
    @go-detail="getLayerDetail"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TopHeader from '@/product/CommandBrain3.0/Generalparts/right/TopHeader/TopHeader.vue';
import { ElMessage } from 'element-plus';
import MultiVideoExpand from '../components/MultiVideoExpand/MultiVideoExpand.vue';
import CreateVideoLink from '../components/CreateVideoLink/CreateVideoLink.vue';
import SaveGroup from './saveGroup.vue';
import FlightList from './FlightList.vue';
import { getFlightPatrolSearch } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

export default defineComponent({
  name: 'FlightArea',
  components: {
    MultiVideoExpand, // 视频分组
    CreateVideoLink, // 创建视频链模块
    SaveGroup, // 存为分组
    FlightList, // 飞巡记录
    TopHeader, // 顶部标题栏
  },
  props: {
    areaData: {
      type: Object,
      default: () => { },
    },
  },
  emits: ['closePopEmit', 'changeData'],
  setup() {
    const multiexpand = ref<null>(null);
    const checkedAll = ref(false);
    const checkedAllFun = (e: boolean) => {
      (multiexpand.value as any).handleCheckAll(e);
    };
    return {
      checkedAllFun,
      multiexpand,
      checkedAll,
    };
  },
  data() {
    return {
      type: 'area',
      totalNum: 10, // 设置总范围
      searchNum: 0, // 搜索的范围
      searchName: '',
      // 分组数据
      groupData: [],
      // 勾选的摄像头列表
      checkedList: [],
      searchCameraNum: 0, // 摄像头总数
      addr: '',
      isHomePage: true,
      dataObj: {
        name: '飞巡测试任务',
        id: 2,
      },
      layerVideoObj: {},
      sureBtnName: '确定',
    };
  },
  watch: {
    areaData: {
      handler(val) {
        console.log(val);
        const treeData = JSON.parse(
          JSON.stringify(val.appLabelDeviceVOS)
            .replace(/labelName/g, 'name')
            .replace(/deviceId/g, 'id')
            .replace(/deviceName/g, 'name'),
        );
        this.groupData = treeData;
        this.addr = this.areaData.addr;
        this.searchCameraNum = val?.cameraData?.length || 0;
        this.renderGraph(this.areaData);
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
  computed: {
    // 换算面积，返回对应的单位
    devertUnit() {
      const num = this.areaData.area;
      console.log('[x]', num);
      if (num<1000) {
        return `${num}平方米`;
      } else {
        return `${num * 1 / 1000000}平方公里`;
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
      // console.log(newVal);
      this.checkedList.forEach((ele: any) => {
        // eslint-disable-next-line no-param-reassign
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
        beginCoordinateName: this.areaData.addr,
        controlPointseList: this.areaData.mapdata,
        devices: checkedList,
        drawType: 1, // 绘图类型(0：点，1：面，：2：线)
        endCoordinateLatitude: null,
        endCoordinateLongitude: null,
        endCoordinateName: null,
        groupId: '',
        id: 1,
        order: 1,
        title: this.searchName,
        type: 1,
        layerShowObj: this.areaData, // 当前图形的监控数据、图形数据进行保存，查看详情的时候用到
      };
      // 查看详情保存逻辑
      if (this.sureBtnName === '保存') {
        const sessionTempArr = JSON.parse(
          JSON.stringify(sessionStorage.getItem('tempListData')),
        );
        const sessionArr = this.jsonToArr(sessionTempArr);
        sessionArr.forEach((item: any, index: number) => {
          if (item.beginCoordinateName === this.areaData.addr) {
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
    // 创建视频链
    handleCreateVideoLink() {
      (this.$refs as any).CreateVideoLink.open();
    },
    /**
     * 存为分组
     */
    handleSaveAsGroup() {
      const cameraIds = [] as any[];
      this.checkedList.forEach((element: any) => {
        cameraIds.push(Number(element.id));
      });
      this.layerVideoObj = {
        beginCoordinateLatitude: '',
        beginCoordinateLongitude: '',
        beginCoordinateName: this.areaData.addr,
        controlPointseList: this.areaData.mapdata,
        devices: this.checkedList,
        deviceIds: cameraIds,
        drawType: 1, // 绘图类型(0：点，1：面，：2：线)
        endCoordinateLatitude: null,
        endCoordinateLongitude: null,
        endCoordinateName: null,
        groupId: '',
        id: 1,
        order: 1,
        title: this.searchName,
        type: 1,
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
    getAreaSearchData() {
      this.groupData = [];
      const tempAreaParam: any = {
        paramsStr: this.areaData.lonLatStr,
        resoureType: 101,
        solrType: 3,
      };
      getFlightPatrolSearch(tempAreaParam).then((response: any) => {
          console.log(response);
          const treeData = JSON.parse(
            JSON.stringify(response.data.appLabelDeviceVOS)
              .replace(/labelName/g, 'name')
              .replace(/deviceId/g, 'id')
              .replace(/deviceName/g, 'name'),
          );
          this.groupData = treeData;
          this.searchCameraNum = response?.data?.monitorCameraVOS?.length || 0;
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取摄像头数据失败，错误信息：${error}`,
          );
        });
    },
    // 动态传入飞巡任务的名字
    getFlightTaskNowName(format: any) {
      const now = new Date();
      const year = now.getFullYear(); // 得到年份
      let month: any = now.getMonth();// 得到月份
      let date: any = now.getDate();// 得到日期
      const day: any = now.getDay();// 得到周几
      let hour: any = now.getHours();// 得到小时
      let minu: any = now.getMinutes();// 得到分钟
      let sec: any = now.getSeconds();// 得到秒
      month += 1;
      if (month < 10) { month = `0${month}`; }
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
      (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
      (window as any).map.clearAtPresentVectorData('标绘图层');
    },
    // 获取详情列表传递的当前图形的数据
    getLayerDetail(areaData: any) {
      this.$emit('changeData', areaData.layerShowObj);
      this.isHomePage = true;
      this.searchName = areaData.title; // 任务标题
      this.searchCameraNum = this.areaData.cameraData.length; // 总摄像头数
      const treeData = JSON.parse(
        JSON.stringify(areaData.layerShowObj.appLabelDeviceVOS || [])
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
    // 显示多边形数据
    renderGraph(data: any) {
      console.log(data);
      const obj: any = {
        typeNum: 1,
        type: 'GeoPolygonEx',
        cps: {
          controlPoints: data.mapdata,
        },
        style: { strokeColor: '#fff', fillColor: '#fff' },
      };
      (window as any).map.renderGraph('飞巡圆图层', [obj]);
    },
  },
});
</script>

<style scoped lang="scss">
.flight-areainsect {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    background: rgba(132, 160, 193, 0.11);
    display: flex;
    height: 55px;
    line-height: 55px;
    align-items: center;
    font-size: 18px;
    color: #fff;
    .flight-areainsect_l {
      font-size: 18px;
      margin-left: 10px;
    }
    .flight-areainsect_r {
      font-size: 18px;
    }
  }
  .flight-areainsect__main {
    height: 658px;
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
  .flight-areainsect__searchSection {
    width: 380px;
    height: 80px;
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, 0.3) 0%,
      rgba(24, 38, 50, 0) 100%
    );
    margin: 0 auto;
    margin-top: 10px;
    .flight-areainsect__searchSection_t {
      height: 32px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      margin-left: 10px;
      .flight-areainsect__searchSection_t__searchIcon {
        width: 21px;
        height: 21px;
        background: url(./assets/areaIcon.svg) no-repeat;
        background-size: 100% 100%;
      }
      .flight-areainsect__searchSection_t__input {
        width: 273px;
        height: 28px;
        border: 1px solid #a6adb4;
        background: 0;
        margin-left: 6px;
        outline: none;
        color: #fff;
      }
      .flight-areainsect__searchSection_t__searchNum {
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
    .flight-areainsect__searchSection_b {
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
  .flight-areainsect__footer {
    width: 100%;
    display: flex;
    color: #fff;
    height: 52px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    .flight-areainsect__footer_l {
      display: flex;
      align-items: center;
      width: 240px;
      div {
      }
      .flight-areainsect__footer_l_Item {
        min-width: 56px;
        cursor: pointer;
        margin: 0 5px;
      }
    }
    .flight-areainsect__footer_r {
      display: flex;
      align-items: center;
      .flight-areainsect__footer_r-r {
        background: #32c5ff;
        border: 0;
      }
      div {
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
