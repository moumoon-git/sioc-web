export default {
  namespaced: true,
  state: {
    distributionId: '', // 分发id
    searchHistory: {}, // 搜索记录
    eventId: '', // 事件Id
    headquaterData: {}, // 现场指挥部的数据
    searchResultData: {}, // 搜索结果数据
    selectedResultData: {}, // 当前选中的数据
    isFunctionalGroup: false, // 当前是否是功能组
    location: {} // 现场指挥部定位
  },
  mutations: {
    // 分发id
    setDistributionId(state, distributionId) {
      state.distributionId = distributionId;
    },
    // 搜索记录
    setSearchHistory(state, searchHistory, moduleName) {
      state.searchHistory[moduleName] = searchHistory;
    },
    // 搜索记录
    setEventId(state, eventId) {
      state.eventId = eventId;
    },
    // 搜索结果数据
    setSearchResultData(state, searchResultData) {
      state.searchResultData = searchResultData;
    },
    // 现场指挥部的数据
    setHeadquaterData(state, headquaterData) {
      state.headquaterData = headquaterData;
    },
    // 当前选中的数据
    setSelectedResultData(state, selectedResultData) {
      state.selectedResultData = selectedResultData;
    },
    // 当前是否是功能组
    setIsFunctionalGroup(state, isFunctionalGroup) {
      state.isFunctionalGroup = isFunctionalGroup;
    },
    // 现场指挥部定位
    setLocation(state, location) {
      state.location = location;
    },
  },
  actions: {},
  getters: {},
};
