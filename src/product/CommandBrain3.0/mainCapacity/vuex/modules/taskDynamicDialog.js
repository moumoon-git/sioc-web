export default {
  namespaced: true,
  state: {
    taskDynamicDialogData: []
  },
  mutations: {
    // 任务动态
    SET_taskDynamicDialogData(state, val) {
      state.taskDynamicDialogData = val
    },
  },
  actions: {},
  getters: {},
};