import { createStore } from 'vuex';
const reserve = require('./modules/reserve').default;
const task = require('./modules/task').default;
export default createStore({
  state: {
    reserve,
    task,
    searchContactorsPage: {
      // 搜索联系人页面的导航栏配置
      navBarConfig: {
        title: '选择联系人',
        type: 'left',
        path: '',
      },
      // 搜索记录
      searchHistory: [],
      // 选中的联系人
      selectedContactors: [],
      choiceNumber:  'single', // single or multiple
      moduleName: '', // 模块名字
    }
  },
  mutations: {
    // 搜索联系人页面的数据
    setSearchContactorsPage(state: any, val: any) {
      state.searchContactorsPage = val;
    },
    // 搜索联系人页面的数据
    setSearchContactorsPageContactors(state: any, val: any) {
      state.searchContactorsPage.selectedContactors = val;
    },
    // 搜索联系人页面的数据
    setSearchHistory(state: any, val: any) {
      state.searchContactorsPage.searchHistory = val;
    },
  },
  actions: {},
  modules: {
    reserve,
    task,
  },
});
