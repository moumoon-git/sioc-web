import $axios from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

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
    $message: {
      info(message: string): void
      error(message: string): void
      success(message: string): void
      (message: string): void
    }
    $MessageBox(options: {
      type?: string;
      title?: string;
      message?: string;
      tips?: string;
      remark?: boolean;
      placeholder?: string;
    }): Promise<string>
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
