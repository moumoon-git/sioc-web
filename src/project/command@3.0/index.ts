import { createApp } from 'vue';
// 引入 element
import Element from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
// v-tooltip 指令
import Tooltip from '@/product/CommandBrain3.0/Generalparts/directives/Tooltip';
// v-loading 指令
import Loading from '@/product/CommandBrain3.0/Generalparts/directives/Loading/';
// v-viewer 指令
import Viewer from '@/product/CommandBrain3.0/Generalparts/directives/Viewer/';
// $message 实例方法
import Message from '@/product/CommandBrain3.0/Generalparts/utils/Message';
// $mapDialog 弹窗
import mapDialog from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/mapDialog';
import mapSetSpot from '@/product/CommandBrain3.0/mainCapacity/mapSetSpot/mapSetSpot';

// 全局单例 websocket 客户端
import useSingletonWS from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';

import App from './App.vue';
import router from './router';
import store from './store';
// axios 封装实例
const http: any = require('@/product/CommandBrain3.0/mainCapacity/axios/apiRequest.js').default;
const downFile: any = require('@/product/CommandBrain3.0/mainCapacity/axios/downloadFile.js').default;
const param: any = require('@/product/CommandBrain3.0/mainCapacity/axios/proceParam.js').default;
const _HandleMapFun: any = require('@/capacity/mapJs/handleMapFun').default;

window.HM = _HandleMapFun;
const app = createApp(App);
app.use(Element, { zIndex: 20000, locale });
app.config.globalProperties.$http = http;
app.config.globalProperties.$downFile = downFile;
app.config.globalProperties.$param = param;
app.config.globalProperties.$message = Message;
app.config.globalProperties.$mapDialog = mapDialog(app);
app.config.globalProperties.$mapSetSpot = mapSetSpot(app.config.globalProperties);
app.config.globalProperties.$globalStorageFun = {$addDialog:() => {}};
useSingletonWS(app);
app.directive('tooltip', Tooltip);
app.directive('loading', Loading);
app.directive('viewer', Viewer);

app.use(store).use(router).mount('#app');
