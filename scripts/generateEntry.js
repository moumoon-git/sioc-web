// 自动生成路由文件
const path = require('path');
const fs = require('fs');

const pagesPath = path.resolve(__dirname, '../src/product/Micro/module');
const outputPath = path.resolve(__dirname, '../src/product/Micro/index.vue');
const pageList = fs.readdirSync(pagesPath);

function isDirEmpty(pathdir) {
  return fs.readdirSync(pathdir).length === 0;
}

const routesContent = `// 【注意】该文件由 node 脚本 generateEntry.js 自动生成
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
${pageList
  .map(page => {
    const pathdir = path.join(pagesPath, page);
    if (!isDirEmpty(pathdir)) {
      return `${page}: defineAsyncComponent({
        loader: () => import(/* webpackChunkName: "Micro__${page}" */'@/product/Micro/module/${page}/${page}.vue'),
        loadingComponent: LoadingPage,
      }),`;
    }
  })
  .join('\n')}
  },
  setup() {
    const module = window.microProps?.module ?? 'NotFound';
    return {
      module,
    };
  },
});
</script>
`;

fs.writeFileSync(outputPath, routesContent);
