<template>
  <div class="app">
    <!-- 用定位飘起来的内容 -->
    <!-- 左边模块容器 -->
    <div class="left-module-wrap">
      <aside>
        <LeftModuleView @showRightEmit="handleOpen" @showRightEmitclose="handleClose" />
        <ModuleButton ref="ModuleButton" :button-arr="buttonArr" @tabModules="tabModules" />
        <div class="visResourceRetrievalViewWrap">
          <ResourceRetrievalView />
        </div>
      </aside>
    </div>
    <!-- 用定位飘起来的内容 end-->

    <!-- 主要内容 -->
    <MainHeader>
      <template #right>
        <FlightHeader v-if="component === '飞巡'" style="margin-right: 30px" />
      </template>
    </MainHeader>
    <!-- 超图实例挂载点 -->
    <div id="superMap" />
    <!-- 右侧弹窗（动态模块） -->
    <!-- TODO： 修改已有的模块，移除DialogBoat的使用，模块本身改为异步加载 -->
    <keep-alive :include="['ReservePlanView', 'CoplottingView']">
      <component
        :is="activeComponent"
        v-show="/* 轨迹跟踪启动时隐藏 */ !isRoutesTrackShown"
        ref="component"
      />
    </keep-alive>
    <!-- 右边内容容器 -->
    <div id="rightContainer">
      <!-- 降雨分析弹窗 -->
      <RainfullAnalysisDialog class="RainfullAnalysisDialog" />
      <MapTools ref="MapTools" @setRightPopup="setRightPopup('MapTools')" @setCenter="loginAndSetCenter" />
    </div>
    <!-- 主要内容 end-->
    <!-- 控制绘制时的操作 -->
    <div v-show="false">
      <MapConterPopup ref="MapConterPopups" enter="commandBrain" />
    </div>
    <!-- 轨迹跟踪，启动时隐藏右侧弹窗 -->
    <RoutesTrack v-if="isRoutesTrackShown" />
    <!-- 弹窗都在这了👇 -->
    <!-- 确认弹窗 -->
    <MessageBox ref="MessageBox" />
    <!-- 弹窗坞 -->
    <Dock ref="Dock" />
    <!-- 拨号盘 -->
    <DialPopup />
    <!-- 事件点设置 -->
    <Event ref="Events" />
    <!-- 图片查看器 -->
    <ImageViewer />
    <!-- 视频查看器 -->
    <VideoViewer />
    <!-- 文件查看器 -->
    <FileViewer />
    <!-- 发起会议弹窗 -->
    <StartMeetingDialog ref="startMeetingDialogRef" />
    <!-- 选择会议成员弹窗 -->
    <SelectMemberDialog ref="selectMemberDialogRef" />
    <!-- 查看更多的弹窗 -->
    <SeeMore v-if="seeMoreFlag" :activeName="seeMoreActive" enter="commandBrain" />
    <!-- 任务动态弹窗 -->
    <TaskDynamicDialogViewer />
    <!-- 通知中心 -->
    <NotificationCenter />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
  getCurrentInstance,
  watch,
  nextTick,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';
// 功能模块按钮
import ModuleButton from '@/product/CommandBrain3.0/Generalparts/left/ModuleButton/ModuleButton.vue';
// 禅道13625 按钮组里面隐藏现场支援模块、以后再恢复
// {
//     "name": "现场支援",
//     "type": "",
//     "distinguishId": "",
//     "icon": "support",
//     "children": [],
//     "activeState": false
// },
// 右侧地图工具
import MapTools from '@/product/CommandBrain3.0/Generalparts/right/MapTools/MapTools.vue';
// 消息确认弹窗
import MessageBox from '@/product/CommandBrain3.0/Generalparts/dialog/MessageBox/MessageBox.vue';
// 多任务管理组件
import Dock from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/Dock.vue';
// 拨号盘组件
import DialPopup from '@/product/CommandBrain3.0/Generalparts/dialog/DialPopup/DialPopup.vue';
// 飞巡头部搜索框
import FlightHeader from '@/product/CommandBrain3.0/FunModule/FlightPatrol/header/Header.vue';
// 顶部栏
import MainHeader from '@/product/CommandBrain3.0/FunModule/MainHeader/MainHeader.vue';
// 飞巡模块
import FlightPatrolView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightPatrolView.vue';
// 通讯调度
import CommunicationDispatch from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/CommunicationDispatch.vue';
// 左边的事件和组织动态模块
import LeftModuleView from '@/product/CommandBrain3.0/FunModule/LeftModule/LeftModuleView.vue';
// 资源检索
import ResourceRetrievalView from '@/product/CommandBrain3.0/FunModule/ResourceRetrieval/ResourceRetrievalView.vue';
// 协作标绘弹窗
import CoplottingView from '@/product/CommandBrain3.0/FunModule/Coplotting/CoplottingView.vue';
// 协作标绘控制绘制时的操作
import MapConterPopup from '@/product/Coplotting/module/MapConterPopup/MapConterPopup.vue';
// 应急响应
import ReservePlanView from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanView.vue';
// 应急响应函数
import {
  getLatestEventDeal,
  getPreplanByCaseId,
  getDefault,
  getManager,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
// 快捷通道
import FastTrack from '@/product/CommandBrain3.0/FunModule/FastTrack/FastTrack.vue';
// 动态弹窗模块载入中
import LoadingDialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/LoadingDialog.vue';
// 轨迹跟踪
import useRoutesTrack from '@/product/CommandBrain3.0/FunModule/RoutesTrack/scripts/useRoutesTrack';
import RoutesTrack from '@/product/CommandBrain3.0/FunModule/RoutesTrack/RoutesTrack.vue';
// 事件点设置
import Event from '@/product/CommandBrain3.0/FunModule/Event/Event.vue';
// 情况汇总
import Summary from '@/product/CommandBrain3.0/FunModule/Summary/Summary.vue';
// 地图数据列表
import MapDataList from '@/product/CommandBrain3.0/FunModule/MapDataList/MapDataList.vue';
// 飞巡通讯链接
import FlightPatrolScript from '@/product/CommandBrain3.0/FunModule/FlightPatrol/script/script';
// 总结报告
import FinalReport from '@/product/CommandBrain3.0/FunModule/FinalReport/FinalReport.vue';
// 图片查看器
import ImageViewer from '@/product/CommandBrain3.0/Generalparts/dialog/ImageViewer/ImageViewer.vue';
// 视频查看器
import VideoViewer from '@/product/CommandBrain3.0/Generalparts/dialog/VideoViewer/VideoViewer.vue';
// 文件查看器
import FileViewer from '@/product/CommandBrain3.0/Generalparts/dialog/FileViewer/FileViewer.vue';
// 降雨分析弹窗
import RainfullAnalysisDialog from '@/product/CommandBrain3.0/FunModule/EventInformation/components/Dialog/RainfullAnalysisDialog.vue';
// 查看更多的弹窗
import SeeMore from '@/product/Coplotting/generalparts/SeeMore/SeeMore.vue';
// 启动会议弹窗
import StartMeetingDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/StartMeetingDialog.vue';
import useStartMeetingDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/useStartMeetingDialog';
// 选人弹窗
import SelectMemberDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/SelectMemberDialog/SelectMemberDialog.vue';
import {
  heartbeat,
  addCallback,
  uds,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import {
  hwe,
  addFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';

// 任务动态弹窗
import TaskDynamicDialogViewer from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/TaskDynamicDialog/TaskDynamicDialogViewer.vue';
// 地图标注图标
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';

import rimHandler from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/script';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// 没有接通后台权限接口前暂时使用这个数据格式
const btnData = require('@/product/CommandBrain3.0/Generalparts/left/ModuleButton/btnData.json');

export default defineComponent({
  components: {
    FlightHeader,
    FlightPatrolView,
    // 任务调度
    TaskScheduleListView: defineAsyncComponent({
      loader: () =>
        import(
          /* webpackChunkName: "Command__TaskScheduleList" */ '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskScheduleListView.vue'
        ),
      loadingComponent: LoadingDialog,
    }),
    LeftModuleView,
    // 功能模块按钮
    ModuleButton,
    // 右侧地图工具
    MapTools,
    // 主头部
    MainHeader,
    // 消息确认弹窗
    MessageBox,
    // 弹窗坞
    Dock,
    // 拨号盘
    DialPopup,
    // 协作标绘弹窗
    CoplottingView,
    // 协作标绘控制绘制时的操作
    MapConterPopup,
    // 应急响应
    ReservePlanView,
    // 快捷通道
    FastTrack,
    // 资源检索
    ResourceRetrievalView,
    // 事件情报
    EventInformation: defineAsyncComponent({
      loader: () =>
        import(
          /* webpackChunkName: "Command__EventInformation" */ '@/product/CommandBrain3.0/FunModule/EventInformation/EventInformation.vue'
        ),
      loadingComponent: LoadingDialog,
    }),
    // 知识库弹窗
    KnowledgeBase: defineAsyncComponent({
      loader: () =>
        import(
          /* webpackChunkName: "Command__KnowledgeBase" */ '@/product/CommandBrain3.0/FunModule/KnowledgeBase/KnowledgeBase.vue'
        ),
      loadingComponent: LoadingDialog,
    }),
    // 事件点设置
    Event,
    // 情况汇总
    Summary,
    // 地图数据列表
    MapDataList,
    // 图片查看器
    ImageViewer,
    // 视频查看器
    VideoViewer,
    // 文件查看器
    FileViewer,
    // 降雨分析弹窗
    RainfullAnalysisDialog,
    // 实时动态-当前在线
    CurrentOnline: defineAsyncComponent({
      loader: () =>
        import(
          /* webpackChunkName: "Command__CurrentOnline" */ '@/product/CommandBrain3.0/FunModule/RealtimeDynamic/CurrentOnline/CurrentOnline.vue'
        ),
      loadingComponent: LoadingDialog,
    }),
    // 实时动态-动态关注
    DynamicFollow: defineAsyncComponent({
      loader: () =>
        import(
          /* webpackChunkName: "Command__DynamicFollow" */ '@/product/CommandBrain3.0/FunModule/RealtimeDynamic/DynamicFollow/DynamicFollow.vue'
        ),
      loadingComponent: LoadingDialog,
    }),
    // 资源调度
    ResourceView: defineAsyncComponent({
      loader: () =>
        import(
          '@/product/CommandBrain3.0/FunModule/ResourceTask/resourceTaskView.vue'
        ),
      loadingComponent: LoadingDialog,
    }),
    // 轨迹跟踪
    RoutesTrack,
    // 总结报告
    FinalReport,
    // 开始会议
    StartMeetingDialog,
    // 选择成员
    SelectMemberDialog,
    // 查看更多的弹窗
    SeeMore,
    // 任务动态弹窗
    TaskDynamicDialogViewer,
    // 右下角通知中心
    NotificationCenter: defineAsyncComponent(() => import(/* webpackChunkName: "Command__NotificationCenter" */'@/product/CommandBrain3.0/FunModule/NotificationCenter/NotificationCenter.vue')),
  },
  provide() {
    return {
      $MessageBox: this.openMessageBox,
      $addDialog: this.addDialog,
      $tabModules: this.tabModules,
    };
  },
  setup() {
    const { connectMq } = FlightPatrolScript();
    const instance: any = getCurrentInstance();
    const $store = useStore();
    const route = useRoute(); // 指挥对接需要从链接获取token
    const { $message, $ws, $mapSetSpot }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    const { closeRightPopup } = rimHandler(instance, $store, 'retrieval');
    // 南海需求，指挥对接需要从地址栏获取token
    const changeToken = () => {
      if (route?.query?.token) {
        (window as any).globalToken = route.query.token; // 登录token
        (window as any).globalLon = route.query.longitude; // 平台经度
        (window as any).globalLat = route.query.latitude; // 平台纬度
        (window as any).globalUserName = route.query.userName; // 登录用户名
        (window as any).globalPassword = route.query.password; // 登录密码
        console.log('index发送的')
        console.log((window as any).globalUserName)
      }
    };
    // 订阅直播
    function concatLiveWs() {
      $ws.subscribe(
        `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
        (result: any) => {
          if (Number(result?.msgType) === 111111 || Number(result?.msgType) === 111112) {
            if (result.content) {
              const soptData = JSON.parse(result.content) || {};
              const coverageName = (window as any).mapCoverageName.liveSopt;
              console.log(soptData);
              if ( Number(result?.msgType) === 111111 && soptData.latitude && soptData.longitude) {
                soptData.handleType = 'live';
                $mapSetSpot.setDrawConverge(coverageName, [soptData], {
                  width: 40,
                  height: 40,
                  img: useMapMarker('直播'),
                });
              } else {
                (window as any).map.dataScreening(coverageName, 'id', soptData.id).then((res:any) => {
                  console.log(res[0]);
                  (window as any).map.deleteSpecifiedData(coverageName, res[0].geometry.id);
                });
              }
            }
          }
        },
      );
    }

    // 用于进行启动后即时刷新
    watch(
      () => $store.state.reservePlan.leftRefresh,
      (val) => {
        console.log('菜单刷新', val);
        if (val) instance.proxy.loadIngReservePlan($store.state.event.id);
      },
    );
    let uns: () => void;
    // 切换事件时检查当前有没有指挥部
    watch(
      () => $store.state.event?.id,
      (val: any) => {
        getManager(val, $store).then(() => {
          console.log('有无指挥部', $store.state.reservePlan?.sceneMsg?.id);
          if (uns) uns();
          if ($store.state.reservePlan?.sceneMsg?.id) {
            // 有指挥部则建立ws
            const seatInformation = document.cookie.match(
              /seatInformation=([^;]*)/,
            )?.[1];
            if (
              seatInformation !== 'null' &&
              seatInformation !== 'undefined' &&
              seatInformation
            ) {
              const str = (window as any).decodeURIComponent(seatInformation);
              const objs: any = JSON.parse(str);
              uns = $ws.subscribe(
                `/platform/${objs?.platformId}/message`,
                (result: any) => {
                  if (Number(result?.msgType) === 51000) {
                    $message.info(
                      `${JSON.parse(result?.content)?.groupName ||
                      JSON.parse(result?.content)?.name
                      }签到成功√`,
                    );
                  }
                },
              );
            }
          }
        });
      },
    );
    onMounted(() => {
      connectMq();
      changeToken();
      concatLiveWs();
    });
    onBeforeUnmount(() => {
      if (uns) uns(); // 退出websocket
      if ((window as any).map) { // 退出系统才销毁预案管理的指挥部落点
        (window as any).map.clearDeleteCoverage('AdminMarker');
      }
    });
    return {
      // 轨迹跟踪
      ...useRoutesTrack(),
      // 启动会议
      ...useStartMeetingDialog(),
      closeRightPopup,
    };
  },
  data() {
    return {
      component: '',
      buttonArr: [],
      // 协作标绘弹窗
      CoplottingViewTitle: '',
      // 控制查看更多显示
      seeMoreFlag: false,
      // 激活的模块
      seeMoreActive: '',
      // uds登录状态查看
      udsLoginState: false,
    };
  },
  computed: {
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    activeComponent(): string {
      console.log((this as any).component);
      switch ((this as any).component) {
        case '飞巡': {
          return 'FlightPatrolView';
        }
        case '任务': {
          return 'TaskScheduleListView';
        }
        case '预案响应': {
          return 'ReservePlanView';
        }
        case '知识库': {
          return 'KnowledgeBase';
        }
        case '快捷通道': {
          return 'FastTrack';
        }
        case '事件情报': {
          return 'EventInformation';
        }
        case '实时动态': {
          return 'CurrentOnline';
        }
        case '动态关注': {
          return 'DynamicFollow';
        }
        case '协作标绘': {
          return 'CoplottingView';
        }
        case '总结报告': {
          return 'FinalReport';
        }
        case '现场支援': {
          return 'ResourceView';
        }
        case '地图数据列表': {
          return 'MapDataList';
        }
        default: {
          return '';
        }
      }
    },
    detailsPopUp(): any {
      return (this as any).$store.state.coplotting.detailsPopUp;
    },
    taggingInfo(): any {
      return (this as any).$store.state.coplotting.taggingInfo;
    },
    editCovData(): any {
      return (this as any).$store.state.coplotting.editCovData;
    },
    // 切换事件
    events() {
      return (this as any).$store.state.event;
    },
    // 查看更多
    seeMoreObj() {
      return (this as any).$store.state.coplotting.seeMoreObj;
    },
    // 打开模块的tabModules
    currentComponet() {
      return (this as any).$store.state.currentComponet;
    },
    peripheralSearch() {
      return (this as any).$store.state.retrieval.peripheralSearch;
    },
    mapId() {
      return (this as any).$store.state.coplotting.mapId;
    },
    closeModle() {
      return (this as any).$store.state.closeModle.closeModle;
    },
    mapDataList() {
      return (this as any).$store.state.mapDataList.MapDataList;
    },
    KnowledgeBaseShow() {
      return (this as any).$store.state.KnowledgeBase.KnowledgeBaseShow;
    },
  },
  watch: {
    detailsPopUp(newV: any) {
      if (newV.flag) {
        this.setRightPopup('coplotting');
        (this as any).component = '协作标绘';
        this.$nextTick(() => {
          if ((this as any).$refs.component) {
            (this as any).$refs.component.dialogTitle = newV.title;
            (this as any).$refs.component.visible = true;
          }
        });
      } else {
        this.$nextTick(() => {
          (this as any).$refs.component.dialogTitle = '';
          (this as any).$refs.component.visible = false;
          (this as any).$refs.component?.init &&
            (this as any).$refs.component?.init();
        });
      }
    },
    // 标注详情弹窗
    taggingInfo(newV: any) {
      if (newV.flag) {
        (this as any).component = '协作标绘';
        // 从MapPopup.vue中传输的数据
        this.$nextTick(() => {
          (this as any).$refs.component.dialogTitle = newV.title;
          (this as any).$refs.component.visible = true;
        });
      }
    },
    // 编辑图形时控制绘制弹窗的显示
    editCovData(newV: any) {
      // console.log(newV);
      // 打开弹窗
      if (newV.flag) {
        if ((this as any).$refs.MapConterPopups) {
          (this as any).$refs.MapConterPopups.init(newV.xy);
        }
      }
    },
    // 切换事件
    events(newV) {
      // 用于初始化和切换事件时刷新
      (this as any).loadIngReservePlan(newV.id);
      if ((this as any).$store.state.coplotting) {
        const closePopupID = (this as any).$store.state.coplotting.selfPopupId;
        window.map.closeClearPopup(closePopupID);
      }
      // 知识库初始化
      (this as any).$store.commit('KnowledgeBase/setKnowledgeBaseShow', false);
      // 预案基本信息初始化
      getLatestEventDeal(newV.id).then((res: any) => {
        (this as any).$refs.Events.setEventPoint(res.data);
        if (res.data.caseClassId) {
          getPreplanByCaseId(res.data.caseClassId).then((res1: any) => {
            if (res1.errorcode === 0) {
              getDefault(newV.id, res.data.caseClassId).then((res2: any) => {
                // 要么有默认预案,要么列表够长
                if (
                  (res2.errorcode === 0 && res2.data?.preplans) ||
                  res1.data.length
                ) {
                  const temp = {
                    currentId: res2.data?.preplans?.id || res1.data[0]?.id,
                    versionId:
                      res2.data?.preplans?.versionId || res1.data[0]?.versionId,
                  };
                  (this as any).$store.commit(
                    'reservePlan/setCurrentReservePlan',
                    temp,
                  );
                  // 文档初始化，使得不用进入预案页面直接获得
                  (this as any).$store.commit(
                    'reservePlan/setDocument',
                    `${(window as any).config.baseURL
                    }/event/emergency/preparation/preplan/view?versionId=${temp.versionId
                    }`,
                  );
                } else {
                  const temp = {
                    currentId: 0,
                    versionId: 0,
                  };
                  (this as any).$store.commit(
                    'reservePlan/setCurrentReservePlan',
                    temp,
                  );
                  (this as any).$store.commit('reservePlan/setDocument', '');
                }
              });
            }
          });
        }
      });
    },
    // 地图数据列表的展示
    mapDataList(newV) {
      // console.log(newV);
      if (newV.openFlag) {
        (this as any).component = '地图数据列表';
      }
    },
    // 知识库的展示
    KnowledgeBaseShow(newV) {
      console.log(newV);
      if (newV) {
        (this as any).component = '知识库';
        setTimeout(() => {
          (this as any).$refs.component.visible = true;
          (this as any).$refs.component.getList();
        }, 300);
      } else {
        (this as any).$refs.component.visible = false;
      }
    },
    seeMoreObj(newV) {
      (this as any).seeMoreFlag = newV.openFlag;
      (this as any).seeMoreActive = newV.active;
    },
    // 打开模块的tabModules
    currentComponet(newV) {
      this.tabModules(newV);
    },
    // 从地图弹窗 点击的附近监控或者周边检索激活
    peripheralSearch(newVal) {
      // 附近监控(nearbyMonitoring) 周边检索(peripheralSearch)
      if (newVal.type) {
        (this as any).peripheralSearchFun(newVal);
      }
    },
    // 拥有地图ID之后
    mapId(newVal) {
      (this as any).handleOpen(false);
    },

    activeComponent(newVal) {
      // 切换模块时 把资源检索的圈关闭
      if (newVal !== 'FastTrack') {
        (this as any).closeRightPopup();
      }
    },
    // 关闭某个模块
    closeModle(newV) {
      console.log(newV);
      var selfModle: any = {};
      (this as any).buttonArr.filter((x: any, i: number) =>
        x.children.filter((e: any) => {
          if (e.name === newV.name) {
            e.activeState = newV.flag;
            selfModle = x;
          }
        }),
      );
      if (!newV.flag) {
        if ((this as any).component === selfModle.name) {
          (this as any).component = '';
        }
      }
    },
  },
  mounted() {
    (this as any).initMap();
    (this as any).loginAndSetCenter();
    (this as any).buttonArr = btnData;
    addFun('click', (e: any) => {
      (window as any).xy = e.xy;
    });
    addFun('dblclick', (e: any) => {
      (window as any).xy = e.xy;
    });
    (window as any).map.clearDeleteCoverage('SceneMarker');
    (this as any).udsHeartbeat();
    (this as any).$globalStorageFun.$addDialog = this.addDialog;
  },
  beforeMount() {
    (window as any).mapCoverageName = {
      mark: '落点Layer',
      event: 'eventLayer',
      vector: '其他图形Layer',
      edit: '编辑图形Layer',
      search: '搜索关键字Layer',
      retrievalVector: '检索标绘图形',
      retrievalMark: '检索标绘点',
      liveSopt: '直播落点',
    };
  },
  methods: {

    // 设置唯一弹窗
    setRightPopup(type:string) {
      const funMap: Record<string, () => void> = {
        coplotting: () => {
          (this as any).$refs.MapTools.toggleMapLegend('close');
          (this as any).tabModules({
            activeState: false,
            children: [],
            distinguishId: '',
            icon: '',
            name: '',
            type: '',
          });
        },
        MapTools: () => {
          (this as any).handleOpen(false, false);
          (this as any).tabModules({
            activeState: false,
            children: [],
            distinguishId: '',
            icon: '',
            name: '',
            type: '',
          });
        },
        tabModules: () => {
          (this as any).handleOpen(false, false);
          (this as any).$refs.MapTools.toggleMapLegend('close');
        },
      };
      console.log(type);
      funMap[type]();
    },
    /**
     * @description 切换模块
     */
    async tabModules(data: any) {
      const that = this;
      console.log(data);
      if (data.icon || data.parentNode) {
        await this.setRightPopup('tabModules');
      }
      switch (data.parentNode || data.icon) {
        case 'filghtPatrol':
          this.component = '飞巡';
          if (this.activeComponent === 'FlightPatrolView') {
            setTimeout(() => {
              (that as any).$refs.component.tabModules(data.name);
            }, 300);
          }
          break;
        case 'task':
          this.component = '任务';
          setTimeout(() => {
            (that as any).$refs.component.visTaskSchedule = true;
          }, 300);
          break;
        case 'reservePlan':
          this.component = '预案响应';
          if (this.activeComponent === 'ReservePlanView') {
            setTimeout(() => {
              (that as any).$refs.component.tabModules(data.name);
            }, 300);
          }
          break;
        case 'communication':
          this.component = '通讯调度';
          this.addDialog('通讯调度', CommunicationDispatch);
          break;
        case 'quick':
          this.component = '快捷通道';
          if (data.icon === 'task') {
            // 创建任务
            this.$nextTick(() => {
              (this as any).$refs.component.openTaskPublishDialog();
            });
          } else if (data.icon === 'meeting') {
            // 发起会议
            this.$nextTick(() => {
              (this as any).openStartMeetingDialog();
            });
          } else if (data.icon === 'searchScope') {
            (this as any).$store.commit('closeModle/SET_closeModle', {
              name: '资源检索',
              flag: true,
            });
            // 资源检索
            this.$nextTick(() => {
              (this as any).$refs.component.searchAllResources();
            });
          } else if (data.icon === 'video') {
            // 周边视频
            this.$nextTick(() => {
              (this as any).$refs.component.searchNearbyVideo();
            });
          } else if (data.icon === 'people') {
            // 现场人员
            this.$nextTick(() => {
              (this as any).$refs.component.searchNearbyPeople();
            });
          }
          break;
        case 'cuttingEdgeNews':
          this.component = '事件情报';
          setTimeout(() => {
            (that as any).$refs.component.openEventInformationDialog();
          }, 300);
          break;
        case 'summary':
          this.component = '情况汇总';
          this.addDialog('情况汇总', Summary);
          break;
        case 'knowledgeBase':
          this.component = '知识库';
          (this as any).$store.commit('KnowledgeBase/setKnowledgeBaseShow', true);
          break;
        case 'dynamic': {
          this.component = data.name;
          break;
        }
        case 'report': {
          this.component = '总结报告';
          setTimeout(() => {
            (that as any).$refs.component.open();
          }, 300);
          break;
        }
        case 'resource': {
          this.component = '现场支援';
           setTimeout(() => {
            (that as any).$refs.component.open();
          }, 300);
          break;
        }
        default:
          this.component = '';
      }
      if (this.isRoutesTrackShown) {
        // 关闭轨迹跟踪模块
        this.closeRoutesTrack();
      }
    },
    /**
     * @description 初始化超图地图实例
     */
    initMap(): void {
      const map: any = new (window as any).HM().init('superMap');
      (window as any).map = map;
      (window as any).map.createdVectorCoverage(
        (window as any).mapCoverageName.edit,
      );
      // 头部搜索
      (window as any).map.createdMarkCoverage(
        (window as any).mapCoverageName.search,
      );
      // mark 图层可以无限添加
      (window as any).map.createdMarkCoverage(
        (window as any).mapCoverageName.mark,
      );
      (window as any).map.createdMarkCoverage(
        (window as any).mapCoverageName.event,
      );
      (window as any).map.createdMarkCoverage(
        (window as any).mapCoverageName.retrievalMark,
      );
      (window as any).map.createdVectorCoverage(
        (window as any).mapCoverageName.vector,
      );
      (window as any).map.createdVectorCoverage(
        (window as any).mapCoverageName.retrievalVector,
      );
      (window as any).map.createdMarkCoverage('searchMark');
      (window as any).map.createdMarkCoverage('AdminMarker');
      (window as any).map.createdMarkCoverage('任务调度落点');
    },
    /**
     * @description 确认弹窗
     */
    openMessageBox(options: any) {
      return (this.$refs.MessageBox as any).init(options);
    },
    /**
     * @description 弹窗坞
     */
    addDialog(dialog: string, el: HTMLElement | any, props?: any) {
      return (this.$refs.Dock as any).addDialog(dialog, el, props);
    },
    // 登录用户名密码写死，初始化从登录接口获取初始中心点经纬度、并设置层级。等登录页面完成后再改这块逻辑
    loginAndSetCenter() {
      const longitude = document.cookie.match(/longitude=([^;]*)/)?.[1];
      const latitude = document.cookie.match(/latitude=([^;]*)/)?.[1];
      (window as any).map.setCentent(
        {
          longitude,
          latitude,
        },
        10,
      );
    },
    handleOpen(flag = true, openPopupFlag = true) {
      if (openPopupFlag) {
        this.setRightPopup('coplotting');
      }
      (this as any).component = '协作标绘';
      this.$nextTick(() => {
        if ((this as any).$refs.component) {
          (this as any).$refs.component.dialogTitle = '协作标绘';
          (this as any).$refs.component.visible = flag;
        }
      });
    },
    // 加载预案左侧状态,同时获取中间弹窗状态
    loadIngReservePlan(eventId: any) {
      const request = {
        method: 'get',
        url: '/event/event/info/getEventStepStatus',
        params: {
          eventId,
        },
      };
      (this as any).$http(request).then((res: any) => {
        if (res.data) {
          // 深拷贝
          const temp = JSON.parse(JSON.stringify(btnData));
          if (res.data[0].status === 0) {
            (this as any).$store.commit('reservePlan/setLeftRefresh', false);
            temp.forEach((e: any) => {
              if (e.icon === 'reservePlan') {
                e.children.forEach((x: any) => {
                  x.disable = true;
                  if (x.name === '现场指挥部' || x.name === '现场签到') {
                    e.children = e.children.filter((ele: any) => ele !== x);
                  }
                });
              }
            });
          } else {
            (this as any).$store.commit('reservePlan/setLeftRefresh', true);
            temp.forEach((e: any) => {
              if (e.icon === 'reservePlan') {
                e.children.forEach((x: any) => {
                  x.disable = false;
                });
              }
            });
          }
          this.buttonArr = temp;
          (this as any).$refs.ModuleButton.closeActive(true);
        }
      });
    },
    // 检测uds登录
    udsHeartbeat(): void {
      const that = this;
      if (uds.connected) {
        heartbeat();
        addCallback((this as any).udsHandleMQMessage);
        setTimeout(() => {
          if (!(that as any).udsLoginState) {
            uds.waken();
          }
        }, (window as any)?.config?.UDSMQConfig?.heartbeatAckTime * 1000 || 3000);
      }
    },
    udsHandleMQMessage(code: any, message: any) {
      if (code === 5) {
        console.log('【UDS】心跳检测');
        (this as any).udsLoginState = true;
      }
    },
    // 地图弹窗点击的附近监控和周边检索
    peripheralSearchFun(newVal: any) {
      if (newVal.type === 'nearbyMonitoring') {
        // 附近监控
        this.$nextTick(() => {
          (this as any).$refs.component.nearbyMonitoring().then(() => {
            (this as any).setSearchSpot(newVal);
          });
        });
      } else if (newVal.type === 'peripheralSearch') {
        // 周边检索
        this.$nextTick(() => {
          (this as any).$refs.component.peripheralSearch().then(() => {
            (this as any).setSearchSpot(newVal);
          });
        });
      }
      this.setRightPopup('tabModules');
      (this as any).component = '快捷通道';
    },
    // 设置检索的点
    setSearchSpot(newVal: any) {
      const urlByKey: Record<string, string> = {
        protect: useMapMarker('防护目标'),
        risk: useMapMarker('风险隐患'),
        refuge: useMapMarker('避难场所'),
        material: useMapMarker('应急物资库'),
        camera: useMapMarker('监控'),
        device: useMapMarker('会场终端'),
        colony: useMapMarker('应急物资'),
        wecomm: useMapMarker('wecomm'),
        personnel: useMapMarker('联系人'),
        team: useMapMarker('应急队伍'),
      };
      // 设置单个点
      const x = newVal.sourceData;
      const data: any = [x];
      data.eventId = (this as any).$store.state.event?.id;
      (this as any).$mapSetSpot.setDrawConverge('检索点', data, {
        img: urlByKey[x.handleType],
        width: 40,
        height: 40,
      });
    },
  },
});
</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
  min-height: 768px;
  max-height: 2700px;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;

  #superMap {
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
  }
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}
.left-module-wrap {
  position: absolute;
  top: 74px;
  left: 0;
  height: calc(100% - 84px);
  z-index: 2;
  & > aside {
    position: relative;
    height: 100%;
    padding-left: 10px;
    display: flex;
    .visResourceRetrievalViewWrap {
      width: 1px;
      height: 1px;
    }
  }
}
#rightContainer {
  position: absolute;
  bottom: 0;
  right: 0;
  height: calc(100vh - 74px);
  padding-right: 10px;
  display: flex;
  align-items: flex-start;
}
</style>
