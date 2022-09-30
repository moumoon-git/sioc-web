export default {
  namespaced: true,
  state: {
    // 控制降雨分析弹窗的显示/隐藏
    showRainfullAnalysisDialog: false,
    // 降雨分析弹窗
    rainfullAnalysis: {
      // 降雨分析-经纬度
      latLng: '',
      // 地址
      address: '',
      // 城市
      city: ''
    }
  },
  mutations: {
    // 降雨分析
    SET_rainfullAnalysis(state, val) {
      state.rainfullAnalysis = val
    },
    SET_showRainfullAnalysisDialog(state, val) {
      state.showRainfullAnalysisDialog = val
    }
  },
  actions: {},
  getters: {},
};