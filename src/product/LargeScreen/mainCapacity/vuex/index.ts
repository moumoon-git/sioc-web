import { createStore } from 'vuex';
const flightPatrol = require('@/product/CommandBrain3.0/mainCapacity/vuex/modules/flightPatrol').default
const coplotting = require('@/product/Coplotting/mainCapacity/vuex/modules/coplotting').default
const reservePlan = require('@/product/CommandBrain3.0/mainCapacity/vuex/modules/reservePlan').default
const retrieval = require('@/product/CommandBrain3.0/mainCapacity/vuex/modules/retrieval').default
const eventInformation = require('@/product/CommandBrain3.0/mainCapacity/vuex/modules/eventInformation').default
const btnTab = require('./modules/btnTab').default
const closeModle = require('@/product/CommandBrain3.0/mainCapacity/vuex/modules/closeModle').default;
const mapDataList = require('@/product/CommandBrain3.0/mainCapacity/vuex/modules/mapDataList').default;

export default createStore({
  state: {
    event: null,
    // 飞巡tip框居左
    positionToLeft: false,
    // 文件预览弹窗的文件路径
    fileViewerPath: '',
    // 所选中的分组中的监控数据
    selectedVideoArr: [],
    // 所选中的分组中的名称
    selectGroupName: '',
    // 所选中的轮询模式模式
    selectPollingMode: 1,
    // 所选中的轮询时间
    selectPollingTime: 30000,
    // 是否是飞巡启动
    isFlight: false,
  },
  mutations: {
    changeEvent(state, newEvent) {
      state.event = newEvent;
    },
    // 飞巡tip居左
    SET_POSITIONTOLEFT(state, val) {
      state.positionToLeft = val;
    },
    // 保存文件预览弹窗的文件路径
    SET_fileViewerPath(state, val) {
      state.fileViewerPath = val;
    },
    // 实时视频更新选中的分组数据
    SET_VIDEOARR(state, val) {
      state.selectedVideoArr = val
    },
    // 实时视频更新选中的分组名称
    SET_GROUPNAME(state, val) {
      state.selectGroupName = val
    },
    // 实时视频更新选中的轮询模式1路、4路、6路、8路、9路视频监控
    SET_POLLINGMODE(state, val) {
      state.selectPollingMode = val
    },
    // 更新视频更新选中的轮询时间
    SET_POLLINGTIME(state, val) {
      state.selectPollingTime = val
    },
    // 更新视频更新选中的轮询时间
    SET_isFlight(state, val) {
      state.isFlight = val
    }
  },
  actions: {
  },
  modules: {
    flightPatrol, // 飞巡
    coplotting, // 协作标绘
    reservePlan, // 应急响应
    retrieval, // 检索
    eventInformation, // 事件情报
    btnTab, //功能切换
    closeModle, // 关闭模块
    mapDataList, // 关闭模块
  }
});

