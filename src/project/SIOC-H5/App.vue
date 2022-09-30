<template>
  <!-- 2.7 H5 页面加载容器 -->
  <div
    v-show="!route.matched?.length"
    id="qiankun"
  />
  <router-view />
</template>
<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { useRouter, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { registerMicroApps, start } from 'qiankun';

export default defineComponent({
  setup() {
    const store: any = useStore();
    const route = useRoute();
    watch(
      () => route.path,
      () => {
        console.log('route监听到变化', route.path);
        if (route.path !== '/Login' && route.path !== '/login' && route.path !== '/Secret') {
          sessionStorage.setItem('route', route.path ?? '');
        }
      },
    );
    onMounted(() => {
      //在页面加载时读取sessionStorage里的状态信息
      const state: any = sessionStorage.getItem('state');
      if (sessionStorage.getItem('state')) {
        store.replaceState(Object.assign({}, store.state, JSON.parse(state)));
      }
      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener('beforeunload', (e) => {
        sessionStorage.setItem('state', JSON.stringify(store.state));
      });
    });

    // 加载 2.7 H5
    onMounted(() => {
      registerMicroApps([{
        name: 'legacy',
        entry: (window as any).config.legacyH5URL,
        container: '#qiankun',
        activeRule: '/',
        // 传递给微应用的数据，可以是任何类型，可以用来通信
        props: {
          api: (window as any).config.baseURL,
          legacyH5URL: (window as any).config.legacyH5URL,
        },
      }]);
      start(
        {
          sandbox: {
            experimentalStyleIsolation: true,
          },
        },
      );
    });

    return {
      route,
    };
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  * {
    font: 400 14px/1.5 'PHT';
  }
  .viewer-container * {
    font: unset;
  }
}
@font-face {
  font-family: 'PHT';
  src: url(/PuHuiTi/fonts/Alibaba-PuHuiTi-Light.ttf);
  font-weight: 300;
}
@font-face {
  font-family: 'PHT';
  src: url(/PuHuiTi/fonts/Alibaba-PuHuiTi-Regular.ttf);
  font-weight: 400;
}
@font-face {
  font-family: 'PHT';
  src: url(/PuHuiTi/fonts/Alibaba-PuHuiTi-Medium.ttf);
  font-weight: 500;
}
@font-face {
  font-family: 'PHT';
  src: url(/PuHuiTi/fonts/Alibaba-PuHuiTi-Bold.ttf);
  font-weight: 600;
}
@font-face {
  font-family: 'PHT';
  src: url(/PuHuiTi/fonts/Alibaba-PuHuiTi-Heavy.ttf);
  font-weight: 700;
}
</style>
