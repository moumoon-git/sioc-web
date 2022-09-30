import { createRouter, createWebHistory } from 'vue-router';

const routes:any = [
  // 任务调度列表
  {
    path: '/',
    name: 'productDemo',
    component: () => import(/* webpackChunkName: "page1" */ '@/product/productDemo/module/productDemo/productDemo.vue'),
  },
];

var history = createWebHistory(process.env.BASE_URL)
if (process.env.NODE_ENV !== 'production') {
  // 开发时用 http://localhost:0000/demo/ + 路由
  // 生产时用 http://localhost:0000/ + 路由
  history = createWebHistory('productDemo')
}
const router = createRouter({
  history,
  routes,
});

export default router;
