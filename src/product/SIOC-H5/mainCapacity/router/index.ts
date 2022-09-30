import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

const routes: any = [
  // 通知公告列表
  {
    path: '/Announce',
    name: 'Announce',
    component: () =>
      import(
        /* webpackChunkName: "H5Announce" */
        '@/product/SIOC-H5/module/Announce/List.vue' // 竖屏打包
        // '@/product/SIOC-H5/module/Announce/Horizon.vue' // 横屏打包
      ),
  },
  // 通知公告详情
  {
    path: '/AnnounceDetail/:noticeId',
    name: 'AnnounceDetail',
    component: () =>
      import(/* webpackChunkName: "H5AnnounceDetail" */ '@/product/SIOC-H5/module/Announce/Detail.vue'),
  },
  // 任务调度列表
  {
    path: '/TaskManagement',
    name: 'TaskManagement',
    component: () =>
      import(
        /* webpackChunkName: "H5TaskManagement" */ '@/product/SIOC-H5/module/task/taskManagement/TaskManagement.vue'
      ),
  },
  // 任务调度列表
  {
    path: '/TaskList',
    name: 'TaskList',
    component: () =>
      import(
        /* webpackChunkName: "H5TaskList" */ '@/product/SIOC-H5/module/task/TaskList/TaskList.vue'
      ),
  },
  // 任务详情
  {
    path: '/TaskDetail/:id',
    name: 'TaskDetail',
    component: () =>
      import(
        /* webpackChunkName: "H5TaskDetail" */ '@/product/SIOC-H5/module/task/TaskDetail/TaskDetailsViewer.vue'
      ),
  },
  // 任务反馈
  {
    path: '/CompleteCancelTask',
    name: 'CompleteCancelTask',
    component: () =>
      import(
        /* webpackChunkName: "H5CompleteCancelTask" */ '@/product/SIOC-H5/module/task/TaskList/components/CompleteCancelTask.vue'
      ),
  },
  // 所有功能合并后的视口
  {
    path: '/',
    name: 'index',
    component: () => import(/* webpackChunkName: "H5Index" */ '@/product/SIOC-H5/index.vue'),
  },
  {
    path: '/Login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "H5Login" */ '@/product/SIOC-H5/module/Login/Login.vue'),
  },
  // 现场签到
  {
    path: '/Sign/:eventId',
    name: 'Sign',
    component: () =>
      import(/* webpackChunkName: "H5Sign" */ '@/product/SIOC-H5/module/Reserve/Sign/Sign.vue'),
  },
  // 响应通告
  {
    path: '/Annunciate/:distributionId',
    name: 'Annunciate',
    component: () =>
      import(
        /* webpackChunkName: "H5Annunciate" */ '@/product/SIOC-H5/module/Reserve/Annunciate/Annunciate.vue'
      ),
  },
  // 事件详情
  {
    path: '/EventInformation/:eventId',
    name: 'EventInformation',
    component: () =>
      import(
        /* webpackChunkName: "H5EventInformation" */ '@/product/SIOC-H5/module/Reserve/Event/EventInformation.vue'
      ),
  },
  // 现场指挥部
  {
    path: '/Headquarters/:eventId',
    name: 'Headquarters',
    component: () =>
      import(
        /* webpackChunkName: "H5Headquarters" */ '@/product/SIOC-H5/module/Reserve/Headquarters/Headquarters.vue'
      ),
  },
  // 联系人详情
  {
    path: '/ContactorInformation/:contactorId',
    name: 'ContactorInformation',
    component: () =>
      import(
        /* webpackChunkName: "H5ContactorInformation" */ '@/product/SIOC-H5/module/Reserve/Contactor/ContactorInformation.vue'
      ),
  },
  // 地图
  {
    path: '/Map',
    name: 'Map',
    component: () =>
      import(/* webpackChunkName: "H5Map" */ '@/product/SIOC-H5/module/Reserve/Map/Map.vue'),
  },
  // 地图
  {
    path: '/MapPOI',
    name: 'MapPOI',
    component: () =>
      import(/* webpackChunkName: "H5MapPOI" */ '@/product/SIOC-H5/module/Amap/AmapPOI/AmapPOI.vue'),
  },
  // 地图
  {
    path: '/MapNavigation',
    name: 'MapNavigation',
    component: () =>
      import(/* webpackChunkName: "H5MapNavigation" */ '@/product/SIOC-H5/module/Amap/AmapNavigation/AmapNavigation.vue'),
  },
  // 地图分享
  {
    path: '/MapSharing',
    name: 'MapSharing',
    component: () =>
      import(/* webpackChunkName: "H5MapSharing" */ '@/product/SIOC-H5/module/MapSharing/MapSharing.vue'),
  },
  {
    path: '/SearchResult/:searchTxt',
    name: 'SearchResult',
    component: () =>
      import(
        /* webpackChunkName: "H5SearchResult" */ '@/product/SIOC-H5/module/Reserve/Headquarters/SearchResult.vue'
      ),
  },
  // 搜索页面
  {
    path: '/Search/:module',
    name: 'Search',
    component: () =>
      import(
        /* webpackChunkName: "H5Search" */ '@/product/SIOC-H5/module/Reserve/Headquarters/Search.vue'
      ),
  },
  // 现场指挥部-搜索结果
  {
    path: '/SearchResultDetail',
    name: 'SearchResultDetail',
    component: () =>
      import(
        /* webpackChunkName: "H5SearchResultDetail" */ '@/product/SIOC-H5/module/Reserve/Headquarters/SearchResultDetail.vue'
      ),
  },
  // 首页-业务入口
  {
    path: '/HomePage',
    name: 'HomePage',
    component: () =>
      import(
        /* webpackChunkName: "H5HomePage" */ '@/product/SIOC-H5/module/HomePage/HomePage.vue'
      ),
  },
  // 响应通告列表
  {
    path: '/ReserveList',
    name: 'ReserveList',
    component: () =>
      import(
        /* webpackChunkName: "H5ReserveList" */ '@/product/SIOC-H5/module/Reserve/ReserveList/ReserveList.vue'
      ),
  },
  // 转交记录
  {
    path: '/DeliverHistory',
    name: 'DeliverHistory',
    component: () =>
      import(
        /* webpackChunkName: "H5DeliverHistory" */ '@/product/SIOC-H5/module/Reserve/DeliverHistory/DeliverHistory.vue'
      ),
  },
  // 发送任务
  {
    path: '/UpdateTask',
    name: 'UpdateTask',
    component: () =>
      import(
        /* webpackChunkName: "H5UpdateTask" */ '@/product/SIOC-H5/module/task/UpdateTask/UpdateTask.vue'
      ),
  },
  {
    path: '/SearchContactors',
    name: 'SearchContactors',
    component: () =>
      import(
        /* webpackChunkName: "H5SearchContactors" */ '@/product/SIOC-H5/module/SearchContactors/SearchContactors.vue'
    ),
  },
  // 现场支援列表
  {
    path: '/ResourceList',
    name: 'ResourceList',
    component: () =>
      import(
        /* webpackChunkName: "H5ResourceList" */ '@/product/SIOC-H5/module/resource/ResourceList/ResourceList.vue'
      ),
  },
  // 资源处理
  {
    path: '/ResourceHandle/:resourceId',
    name: 'ResourcHandle',
    component: () =>
      import(
        /* webpackChunkName: "H5ResourceHandle" */ '@/product/SIOC-H5/module/resource/ResourceHandle/ResourceHandle.vue'
      ),
  },  
  // 签到审批
  {
    path: '/SignCheck',
    name: 'SignCheck',
    component: () =>
      import(
        /* webpackChunkName: "H5SignCheck" */
        '@/product/SIOC-H5/module/Reserve/Sign/components/SignCheck.vue'
      ),
  },
  // 隐私声明
  {
    path: '/Secret',
    name: 'Secret',
    component: () =>
      import(
        /* webpackChunkName: "H5Secret" */ '@/product/SIOC-H5/module/Secret/Secret.vue'
      ),
  },

];

console.log(process.env.NODE_ENV);
var history = createWebHashHistory(process.env.BASE_URL); // 生产环境路由模式路径带#号
if (process.env.NODE_ENV !== 'production') {
  // 开发时用 http://localhost:0000/demo/ + 路由
  // 生产时用 http://localhost:0000/#/ + 路由
  history = createWebHashHistory('SIOC-H5');
}
const router = createRouter({
  history,
  routes,
});

export default router;
