import { createRouter, createWebHistory } from 'vue-router';

const routes: any = [
  // 单个飞巡功能
  {
    path: '/',
    name: 'FlightPatrolIndependentView',
    component: () => import(/* webpackChunkName: "page1" */ '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightPatrolIndependentView.vue'),
  },
];

var history = createWebHistory(process.env.BASE_URL)
if (process.env.NODE_ENV !== 'production') {
  // 开发时用 http://localhost:0000/demo/ + 路由
  // 生产时用 http://localhost:0000/ + 路由
  history = createWebHistory('flightPatrol')
}
const router = createRouter({
  history,
  routes,
});

export default router;
