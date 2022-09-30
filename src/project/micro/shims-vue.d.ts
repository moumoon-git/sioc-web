/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare var __webpack_public_path__: any;

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__: any;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__: any;
  }
}

export {}
