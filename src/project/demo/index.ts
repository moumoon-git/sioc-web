import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
const _HandleMapFun:any = require('@/capacity/mapJs/handleMapFun').default;
window.HM = _HandleMapFun;
createApp(App).use(store).use(router).mount('#app');
