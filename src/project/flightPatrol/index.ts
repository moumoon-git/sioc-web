import { createApp } from 'vue';
// v-tooltip 指令
import Tooltip from '@/product/CommandBrain3.0/Generalparts/directives/Tooltip';
// v-loading 指令
import Loading from '@/product/CommandBrain3.0/Generalparts/directives/Loading/';
// v-viewer 指令
import Viewer from '@/product/CommandBrain3.0/Generalparts/directives/Viewer/';
// $message 实例方法
import Message from '@/product/CommandBrain3.0/Generalparts/utils/Message';
import mapSetSpot from '@/product/CommandBrain3.0/mainCapacity/mapSetSpot/mapSetSpot';
// 引入 element
import Element from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

// axios 封装实例
const http: any = require('@/product/CommandBrain3.0/mainCapacity/axios/apiRequest.js').default;
const param: any = require('@/product/CommandBrain3.0/mainCapacity/axios/proceParam.js').default;
const _HandleMapFun: any = require('@/capacity/mapJs/handleMapFun').default;

window.HM = _HandleMapFun;
const app = createApp(App);
app.config.globalProperties.$http = http;
app.config.globalProperties.$param = param;
app.config.globalProperties.$message = Message;
app.config.globalProperties.$mapSetSpot = mapSetSpot(app.config.globalProperties);
app.directive('tooltip', Tooltip);
app.directive('loading', Loading);
app.directive('viewer', Viewer);
app.use(store).use(router).use(Element, { zIndex: 20000 }).mount('#app');
