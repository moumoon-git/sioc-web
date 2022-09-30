<template>
  <div :class="$style.EmergencyCommand">
    <!-- 地图 -->
    <div id="emergency_command_supermap"></div>
    <!-- 左侧模块 -->
    <div :class="$style.Left_module">
      <div>
        <div>
          <EventInfo :class="$style.EventInfos" />
        </div>
        <div>
          <OrganizationalDynamics />
        </div>
        <div>
          <FieldDeployment />
        </div>
        <!-- <ReservePlanAdmin v-show="false" /> -->
        <!-- 功能按钮 -->
        <aside>
          <div>
            <ModuleButton
              ref="ModuleButton"
              :button-arr="buttonArr"
              @tabModules="tabModules"
            />
            <div
              id="rightContainer"
              :class="$style['rightContainer-LargeScreen']"
            ></div>
            <div :class="$style['rightContainer__outside-dialog']">
              <!-- 降雨分析弹窗 -->
              <RainfullAnalysisDialog v-if="component === '事件情报'" />
            </div>
          </div>
        </aside>
      </div>
    </div>
    <keep-alive :include="['ReservePlanView', 'CoplottingView']">
      <component
        :is="activeComponent"
        v-show="/* 轨迹跟踪启动时隐藏 */ !isRoutesTrackShown"
        ref="component"
      />
    </keep-alive>
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
    <SeeMore
      v-if="seeMoreFlag"
      :activeName="seeMoreActive"
      enter="commandBrain"
    />
    <div v-show="false">
      <MapConterPopup ref="MapConterPopups" />
    </div>
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
} from 'vue';
import { useStore } from 'vuex';
// 事件信息
import EventInfo from '@/product/CommandBrain3.0/FunModule/LeftModule/components/EventInfo.vue';
// 组织动态
import OrganizationalDynamics from './OrganizationalDynamics/OrganizationalDynamics.vue';
// 现场部署
import FieldDeployment from './FieldDeployment/FieldDeployment.vue';
// 预案管理
import {
  getLatestEventDeal,
  getPreplanByCaseId,
  getDefault,
  getManager,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
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
  hwe,
  addFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
// 地图数据列表
import MapDataList from '@/product/CommandBrain3.0/FunModule/MapDataList/MapDataList.vue';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// 没有接通后台权限接口前暂时使用这个数据格式
const btnData = require('@/product/CommandBrain3.0/Generalparts/left/ModuleButton/btnData.json');

export default defineComponent({
  components: {
    // 事件信息
    EventInfo,
    // 组织动态
    OrganizationalDynamics,
    // 现场部署
    FieldDeployment,
    // 预案管理
    // ReservePlanAdmin,
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
    // 事件点设置
    Event,
    // 情况汇总
    Summary,
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
    // 地图数据列表
    MapDataList,
  },
  provide() {
    return {
      $MessageBox: this.openMessageBox,
      $addDialog: this.addDialog,
      $tabModules: this.tabModules,
    };
  },
  setup() {
    // const { connectMq } = FlightPatrolScript();
    const instance: any = getCurrentInstance();
    const $store = useStore();
    const { $message, $ws }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    // 用于进行启动后即时刷新
    watch(
      () => $store.state.reservePlan.leftRefresh,
      (val) => {
        console.log('指挥菜单刷新', val);
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
                      `${
                        JSON.parse(result?.content)?.groupName ||
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
      // connectMq();
    });
    onBeforeUnmount(() => {
      if (uns) uns(); // 退出websocket
    });
    return {
      // 轨迹跟踪
      ...useRoutesTrack(),
      // 启动会议
      ...useStartMeetingDialog(),
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
    };
  },
  computed: {
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    activeComponent(): string {
      switch ((this as any).component) {
        case '飞巡': {
          return 'FlightPatrolView';
        }
        case '任务': {
          return 'TaskScheduleListView';
        }
        case '应急响应': {
          return 'ReservePlanView';
        }
        case '快捷通道': {
          return 'FastTrack';
        }
        case '事件情报': {
          return 'EventInformation';
        }
        case '当前在线': {
          return 'CurrentOnline';
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
  },
  watch: {
    detailsPopUp(newV: any) {
      if (newV.flag) {
        (this as any).component = '协作标绘';
        this.$nextTick(() => {
          (this as any).$refs.component.dialogTitle = newV.title;
          (this as any).$refs.component.visible = true;
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
      (this as any).init(newV);
      if ((this as any).$store.state.coplotting) {
        const closePopupID = (this as any).$store.state.coplotting.selfPopupId;
        window.map.closeClearPopup(closePopupID);
      }
    },
    // 地图数据列表的展示
    mapDataList(newV) {
      // console.log(newV);
      if (newV.openFlag) {
        (this as any).component = '地图数据列表';
      }
    },
    seeMoreObj(newV) {
      (this as any).seeMoreFlag = newV.openFlag;
      (this as any).seeMoreActive = newV.active;
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
      console.log(newVal);
      (this as any).handleOpen(false);
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
    this.loginAndSetCenter();
    const obj = {
      distinguishId: '',
      icon: 'plotting',
      name: '标绘图层',
      type: '',
    };
    btnData[0].children.push(obj);
    this.buttonArr = btnData.filter((e: any) => e.icon !== 'knowledgeBase');
    addFun('click', (e: any) => {
      (window as any).xy = e.xy;
    });
    addFun('dblclick', (e: any) => {
      (window as any).xy = e.xy;
    });
    (window as any).map.clearDeleteCoverage('SceneMarker');
    if ((this as any).$refs.Events) {
      (this as any).$refs.Events.setEventPoint(
        (this as any).$store.state.event,
      );
    }
  },
  beforeMount() {
    (window as any).mapCoverageName = {
      mark: '落点Layer',
      event: 'eventLayer',
      vector: '其他图形Layer',
      edit: '编辑图形Layer',
      search: '搜索关键字Layer',
    };
  },
  methods: {
    /**
     * @description 切换模块
     */
    tabModules(data: any) {
      const that = this;
      console.log(data);

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
          this.component = '应急响应';
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
          } else if (data.icon === 'plotting') {
            // 标绘图层
            this.handleOpen();
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
        default:
          this.component = '';
      }
      // 关闭轨迹跟踪模块
      this.closeRoutesTrack();
    },
    /**
     * @description 初始化超图地图实例
     */
    initMap(): void {
      const map: any = new (window as any).HM().init(
        'emergency_command_supermap',
      );
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
      (window as any).map.createdVectorCoverage(
        (window as any).mapCoverageName.vector,
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
    handleOpen(flag = true) {
      (this as any).component = '协作标绘';
      this.$nextTick(() => {
        if ((this as any).$refs.component) {
          (this as any).$refs.component.dialogTitle = '协作标绘';
          (this as any).$refs.component.visible = flag;
        }
      });
    },
    // 加载预案
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
          const tempArr = btnData.filter((e: any) => e.icon !== 'knowledgeBase');
          const temp = JSON.parse(JSON.stringify(tempArr));
          if (res.data[0].status === 0) {
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
            temp.forEach((e: any) => {
              if (e.icon === 'reservePlan') {
                e.children.forEach((x: any) => {
                  x.disable = false;
                });
              }
            });
          }
          // (this as any).$nextTick(()=>{
          this.buttonArr = temp;
          (this as any).$refs.ModuleButton.closeActive(true);
          console.log((this as any).$refs.ModuleButton, '切换了事件');
        }
      });
    },

    // 地图弹窗点击的附近监控和周边检索
    peripheralSearchFun(newVal: any) {
      if (newVal.type === 'nearbyMonitoring') {
        // 附近监控
        this.$nextTick(() => {
          (this as any).$refs.component.nearbyMonitoring();
        });
      } else if (newVal.type === 'peripheralSearch') {
        // 周边检索
        this.$nextTick(() => {
          (this as any).$refs.component.peripheralSearch();
        });
      }
      (this as any).component = '快捷通道';
    },
    //
    init(newV: any) {
      // 用于初始化和切换事件时刷新
      (this as any).loadIngReservePlan(newV?.id);
      // 预案基本信息初始化
      getLatestEventDeal(newV?.id).then((res: any) => {
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
                    `${
                      (window as any).config.baseURL
                    }/event/emergency/preparation/preplan/view?versionId=${
                      temp.versionId
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
  },
});
</script>

<style lang="scss" module>
.EmergencyCommand {
  position: relative;
  width: 100%;
  height: 100%;
  :global(#emergency_command_supermap) {
    width: 100%;
    height: 100%;
    position: inherit;
  }
  .rightContainer-LargeScreen {
    position: absolute;
    top: 0;
    left: 160px;
    height: 100% !important;
  }
  .rightContainer__outside-dialog {
    position: absolute;
    right: -860px;
    top: 34px;
  }
  :global(.visualization-right-dialog) {
    height: 100%;
  }

  :global(.visualization-right-dialog > main) {
    height: 100%;
  }
}

.Left_module {
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 1;
  width: 2100px;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 80%, transparent);
  display: flex;
  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    & > div {
      flex: 1;
      height: 100%;
    }
    & > aside {
      position: absolute;
      bottom: 76px;
      right: -119px;
      & > div {
        position: relative;
      }
      :global(.module-button > ul > li) {
        width: 75px;
        height: 75px;
      }
    }
  }
}
.EventInfos {
  padding: 40px 35px 20px 35px;
  & > div {
    // 第一个标题
    &:nth-child(1) {
      display: flex;
      justify-content: flex-end;
      position: relative;
      height: 70px;
      padding-top: 8px;
      box-sizing: border-box;
      margin-bottom: 16px;
      &::before {
        content: '事件信息';
        position: absolute;
        top: -18px;
        left: 0;
        font-size: 60px;
        font-family: YouSheBiaoTiHei;
        color: #56e9ff;
        line-height: 78px;
        letter-spacing: 2px;
        text-shadow: 0px 0px 13px rgba(10, 46, 57, 0.5);
      }
      & > span {
        font-size: 19px;
        font-weight: 500;
        color: #ffffff;
        &::before {
          display: none;
        }
      }
      & > div {
        font-size: 36px;
        font-weight: 500;
        color: rgba(86, 233, 255, 1);
      }
    }
    &:nth-child(2) {
      margin-top: 5px !important;
      & > ul {
        & > li {
          & > button {
            width: 91px;
            height: 91px;
            & > div:last-child {
              width: 42px;
              height: 42px;
              line-height: 42px;
              & > span {
                font-size: 28px;
              }
            }
          }
          & > span {
            font-size: 24px;
            font-weight: 500;
          }
          :global(.visualization-left-wave--red) {
            & > div {
              & > span {
                line-height: 27px;
              }
            }
          }
        }
      }
    }
    &:nth-child(4) {
      & > div {
        width: 100%;
        & > ul {
          display: flex;
          flex-wrap: wrap;
          & > li {
            align-items: center;
            height: 60px;
            width: 295px;
            background: linear-gradient(
              90deg,
              rgba(0, 193, 222, 0.4) 0%,
              rgba(24, 38, 50, 0.8) 100%
            );
            margin-right: 9px;
            margin-bottom: 15px;
            padding-right: 5px;
            &:nth-child(2n) {
              margin-right: 0px;
            }
            & > div {
              &:first-child {
                font-size: 20px;
                font-weight: 400;
                color: #00ecff;
              }
              &:last-child {
                font-size: 28px;
                font-family: DIN-Bold, DIN;
                font-weight: bold;
                color: #ffffff;
              }
            }
          }
        }
      }
    }
    &:nth-child(6) {
      & > div {
        & > header {
          font-size: 16px;
          // font-weight: 500;
          color: #ffffff;
        }
        & > footer {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          & > p {
            font-size: 16px;
            & > span {
              font-size: 16px;
            }
          }
        }
      }
    }
    &:nth-child(8) {
      & > div {
        & > ul {
          & > li {
            & > span {
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
            }
            & > div {
              font-size: 16px;
              font-weight: 500;
              color: #ffffff;
            }
          }
        }
        & > main {
          font-size: 16px;
        }
        & > aside {
          & li {
            width: 93px;
            height: 75px;
          }
        }
      }
    }
  }
  & > h2 {
    margin-top: 21px;
    height: 42px;
    position: relative;
    background: url('./assets/title_bgr.svg') no-repeat;
    background-size: 100% 100%;
    & > span {
      &:first-child {
        font-size: 28px !important;
        font-weight: 600;
        color: #ffffff;
        background: none;
        position: relative;
        margin: 0;
        padding: 0;
        &::before {
          bottom: 5px;
          left: 118px;
          right: -50px;
          content: 'EVENT ELEMENTS';
          position: absolute;
          font-size: 14px;
          font-weight: 600;
          color: #56e9ff;
          width: initial;
          height: initial;
          white-space: nowrap;
          background: none;
        }
      }
      &:last-child {
        line-height: 42px;
        background: none;
        & > span {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
    &::before {
      content: '';
      position: absolute;
      background: url('./assets/title_bottom_bgr.svg') no-repeat;
      background-size: 100% 100%;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 100%;
    }
    &:nth-child(5) {
      & > span {
        &:first-child {
          &::before {
            content: 'UPDATE';
          }
        }
      }
    }
    &:nth-child(7) {
      & > span {
        &:first-child {
          &::before {
            content: 'ESSENTIAL INFORMATION';
          }
        }
      }
    }
  }
}
</style>
