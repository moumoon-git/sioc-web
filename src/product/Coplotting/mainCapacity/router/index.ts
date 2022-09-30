import { createRouter, createWebHashHistory } from 'vue-router';

const routes:any = [
  // 分类管理
  // {
  //   path: '/cm',
  //   name: 'ClassificationManagement',
  //   component: () => import('@/product/Coplotting/module/ClassificationManagement/ClassificationManagement.vue'),
  // },
  // 模板管理
  // {
  //   path: '/tm',
  //   name: 'TemplateManagement',
  //   component: () => import('@/product/Coplotting/module/TemplateManagement/TemplateManagement.vue'),
  // },
  // element-plus 样式修改预览
  // {
  //   path: '/element',
  //   name: 'Element',
  //   component: () => import('@/product/Coplotting/generalparts/Element/Element.vue'),
  // },
  // 首页
  {
    path: '/',
    name: 'plottingIndexView',
    component: () => import('@/product/Coplotting/module/MapPlotting/PlottingIndex/PlottingIndex.vue'),
  },
  {
    path: '/mapDetail',
    name: 'mapDetail',
    component: () => import('@/product/Coplotting/module/MapPlotting/PlottingMapDetail/PlottingMapDetail.vue'),
  },
  // 主要页面
  {
    path: '/plottingIndex',
    name: 'plottingIndex',
    component: () => import('@/product/Coplotting/module/coplottingMain.vue'),
  },
  // 分享链接页面
  {
    path: '/shareLinkIndex',
    name: 'shareLinkIndex',
    component: () => import('@/product/Coplotting/module/ShareSection/ShareLinkIndex.vue'),
  },
];

var history = createWebHashHistory(process.env.BASE_URL)
if (process.env.NODE_ENV !== 'production') {
  // 开发时用 http://localhost:0000/demo/ + 路由
  // 生产时用 http://localhost:0000/ + 路由
  history = createWebHashHistory('coplotting')
}
const router = createRouter({
  history,
  routes,
});

export default router;
