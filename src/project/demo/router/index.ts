import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'page1',
    component: () => import(/* webpackChunkName: "page1" */ '../views/page1.vue'),
  },
  {
    path: '/page2',
    name: 'page2',
    component: () => import(/* webpackChunkName: "page2" */ '../views/page2.vue'),
  },
];

const router = createRouter({
  history: createWebHistory('demo'),
  routes,
});

export default router;
