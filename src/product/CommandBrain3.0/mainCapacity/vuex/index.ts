import { createStore } from 'vuex';
const flightPatrol = require('./modules/flightPatrol').default;
const coplotting = require('@/product/Coplotting/mainCapacity/vuex/modules/coplotting').default;
const reservePlan = require('./modules/reservePlan').default;
const retrieval = require('./modules/retrieval').default;
const eventInformation = require('./modules/eventInformation').default;
const taskDynamicDialog = require('./modules/taskDynamicDialog').default;
const closeModle = require('./modules/closeModle').default;
const mapDataList = require('./modules/mapDataList').default;
const resAllocation = require('./modules/resAllocation').default;
const KnowledgeBase = require('./modules/knowledgeBase').default;

export default createStore({
  state: {
    event: null,
    // 飞巡tip框居左
    positionToLeft: false,
    // 文件预览弹窗的文件路径
    fileViewerPath: '',
    // 需要切换的模块
    currentComponet: {},
    // 是否刷新协作标绘分组列表
    isRefrashGroup: false,

  },
  mutations: {
    changeEvent(state, newEvent) {
      state.event = newEvent;
    },
    // 切换左边的模块出弹窗
    CHANGE_MODULES(state, val) {
      state.currentComponet = val;
    },
    // 飞巡tip居左
    SET_POSITIONTOLEFT(state, val) {
      state.positionToLeft = val;
    },
    // 保存文件预览弹窗的文件路径
    SET_fileViewerPath(state, val) {
      state.fileViewerPath = val;
    },
    SET_REFRASHGROUP(state, val) {
      state.isRefrashGroup = val;
    },
  },
  actions: {},
  modules: {
    flightPatrol, // 飞巡
    coplotting, // 协作标绘
    reservePlan, // 应急响应
    retrieval, // 检索
    eventInformation, // 事件情报
    taskDynamicDialog, // 任务动态弹窗
    closeModle, // 关闭模块
    mapDataList, // 地图数据列表
    resAllocation, // 物资调拨
    KnowledgeBase, // 知识库
  },
});
