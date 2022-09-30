// 【注意】该文件由 node 脚本 generateEntry.js 自动生成
<template>
  <component :is="module" />
</template>

<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
} from 'vue';
import '@/product/Micro/mainCapacity/sbs-style/index.scss';
// 页面载入中
import LoadingPage from '@/product/Micro/generalparts/LoadingPage/LoadingPage.vue';
// 404
import NotFound from '@/product/Micro/generalparts/NotFound/NotFound.vue';

export default defineComponent({
  name: 'Micro',
  components: {
    NotFound,
ElementStyle: defineAsyncComponent({
        loader: () => import(/* webpackChunkName: "Micro__ElementStyle" */'@/product/Micro/module/ElementStyle/ElementStyle.vue'),
        loadingComponent: LoadingPage,
      }),
TaskManager: defineAsyncComponent({
        loader: () => import(/* webpackChunkName: "Micro__TaskManager" */'@/product/Micro/module/TaskManager/TaskManager.vue'),
        loadingComponent: LoadingPage,
      }),
TemplateDemo: defineAsyncComponent({
        loader: () => import(/* webpackChunkName: "Micro__TemplateDemo" */'@/product/Micro/module/TemplateDemo/TemplateDemo.vue'),
        loadingComponent: LoadingPage,
      }),
  },
  setup() {
    const module = window.microProps?.module ?? 'NotFound';
    return {
      module,
    };
  },
});
</script>
