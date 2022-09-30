/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export default {
  namespaced: true,
  state: {
    // 当前是否展示
    KnowledgeBaseShow: false,
  },
  mutations: {
    setKnowledgeBaseShow(state, val) {
      state.KnowledgeBaseShow = val;
    },
  },
  actions: {},
  getters: {},
};
