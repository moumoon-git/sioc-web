import { createApp } from 'vue';
import Element from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import '@/product/Coplotting/generalparts/Element/styles/index.scss';
import App from './App.vue';
import router from './router';
import store from './store';
// v-viewer 指令
import Viewer from '@/product/CommandBrain3.0/Generalparts/directives/Viewer/';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
// 引入Video.js
import Video from 'video.js'
import 'video.js/dist/video-js.css'

// axios 封装实例
const http: any = require('@/product/Coplotting/mainCapacity/axios/apiRequest.js').default;
const downFile: any = require('@/product/Coplotting/mainCapacity/axios/downloadFile.js').default;
const param: any = require('@/product/Coplotting/mainCapacity/axios/proceParam.js').default;
const _HandleMapFun: any = require('@/capacity/mapJs/handleMapFun').default;

window.HM = _HandleMapFun;
const app = createApp(App);
app.config.globalProperties.$http = http;
app.config.globalProperties.$downFile = downFile;
app.config.globalProperties.$param = param;
app.config.globalProperties.$video = Video
app.directive('viewer', Viewer);
app.use(store).use(router).use(Element, { locale, zIndex: 20000 }).mount('#app');
