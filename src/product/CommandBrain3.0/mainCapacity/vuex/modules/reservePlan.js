/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export default {
  namespaced: true,
  state: {
    // 当前预案
    currentReservePlan: null,
    // 当前整个预案状态
    status: '',
    // 当前现场指挥部详细信息
    sceneMsg: null,
    // 当前文档url
    document: '',
    // 当前树结点
    currNode: null,
    // 当前是否需要影响到左边
    leftRefresh: false,
  },
  mutations: {
    setCurrentReservePlan(state, val) {
      state.currentReservePlan = val;
    },
    setStatus(state, val) {
      state.status = val;
    },
    setSceneMsg(state, val) {
      state.sceneMsg = val;
    },
    setDocument(state, val) {
      state.document = val;
    },
    setCurrNode(state, val) {
      state.currNode = val;
    },
    setLeftRefresh(state, val) {
      state.leftRefresh = val;
    },
  },
  actions: {},
  getters: {},
};
