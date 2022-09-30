import $axios from '@/product/Coplotting/mainCapacity/axios/apiRequest';
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'lodash'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $http: typeof $axios
  }
}

declare global {
  interface Window {
    HM: any,
    SuperMap: any,
    map: any,
  }
}

export {}
