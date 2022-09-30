import { createRouter, createWebHistory } from 'vue-router';

const routes:any = [
  // 单个飞巡功能
  {
    path: '/FlightPatrolIndependent',
    name: 'FlightPatrolIndependentView',
    component: () => import(/* webpackChunkName: "FlightPatrolIndependentView" */ '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightPatrolIndependentView.vue'),
  },
  // 预案
  {
    path: '/structureChart',
    name: 'structureChart',
    component: () => import(/* webpackChunkName: "structureChart" */ '@/product/CommandBrain3.0/FunModule/ReservePlan/reserveStructure/structureChart.vue'),
  },
  // 预案
  {
    path: '/ReservePlanView',
    name: 'ReservePlanView',
    component: () => import(/* webpackChunkName: "ReservePlanView" */ '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanView.vue'),
  },
  // 任务调度
  {
    path: '/TaskScheduleView',
    name: 'TaskScheduleView',
    component: () => import(/* webpackChunkName: "TaskScheduleView" */ '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskScheduleView.vue'),
  },
  // 所有功能合并后的视口
  {
    path: '/',
    name: 'index',
    component: () => import(/* webpackChunkName: "index" */ '@/product/CommandBrain3.0/index.vue'),
  },
  {
    path: '/flightResourceView',
    name: 'flightResourceView',
    component: () => import(/* webpackChunkName: "flightResourceView" */ '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightResource/FlightResourceView.vue'),
  },
  // 任务调度列表
  // {
  //   path: '/TaskScheduleListView',
  //   name: 'TaskScheduleListView',
  //   component: () => import(/* webpackChunkName: "TaskScheduleListView" */ '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskScheduleListView.vue'),
  // },
    // // 任务详情
    // {
    //   path: '/Taskdetail',
    //   name: 'Taskdetail',
    //   component: () => import(/* webpackChunkName: "page1" */ '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskDetail/TaskIndexDetail.vue'),
    // },
];

var history = createWebHistory(process.env.BASE_URL)
if (process.env.NODE_ENV !== 'production') {
  // 开发时用 http://localhost:0000/demo/ + 路由
  // 生产时用 http://localhost:0000/ + 路由
  history = createWebHistory('command@3.0')
}
const router = createRouter({
  history,
  routes,
});

export default router;
