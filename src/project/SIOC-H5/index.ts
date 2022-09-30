
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {
    Tab,
    Tabs,
    Search,
    Button,
    Cell,
    CellGroup,
    Popup,
    Picker,
    DatetimePicker,
    Collapse,
    CollapseItem,
    CheckboxGroup,
    Checkbox,
    Image as VanImage,
    ImagePreview, Pagination,
    Uploader,
    Notify,
    Field,
    CountDown,
    PullRefresh,
    NavBar,
    Dialog,
    Loading,
    Overlay,
    Icon,
    Popover,
} from 'vant';
import 'vant/lib/index.css';
// 全局单例 websocket 客户端
import useSingletonWS from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';

// axios 封装实例
const http: any = require('@/product/SIOC-H5/mainCapacity/axios/apiRequest.js').default;
const param: any = require('@/product/SIOC-H5/mainCapacity/axios/proceParam.js').default;
const location: any = require('@/capacity/utils/getRequireUrlData.js').default;
const websocket: any = require('@/product/SIOC-H5/mainCapacity/websocket/websocket.js').default;
const moment = require('moment');
const app:any = createApp(App);
const _HandleMapFun: any = require('@/capacity/mapJs/handleMapFun.js').default;
window.HM = _HandleMapFun;

app.config.globalProperties.$http = http;
app.config.globalProperties.$param = param;
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$location = location;
app.config.globalProperties.$websocket = websocket;
useSingletonWS(app);

app.use(store).use(router).mount('#app');
app.use(Tab);
app.use(Tabs);
app.use(Search);
app.use(Cell);
app.use(CellGroup)
app.use(Popup);
app.use(Picker);
app.use(DatetimePicker);
app.use(Collapse);
app.use(CollapseItem);
app.use(CheckboxGroup);
app.use(Checkbox);
app.use(VanImage);
app.use(Pagination);
app.use(Uploader);
app.use(Notify);
app.use(Uploader);
app.use(Field);
app.use(PullRefresh);
app.use(CountDown);
app.use(ImagePreview);
app.use(Popup);
app.use(VanImage);
app.use(Button);
app.use(NavBar);
app.use(Dialog);
app.use(Loading);
app.use(Overlay);
app.use(Icon);
app.use(Popover);
