<template>
  <div>
    <HomePage v-if="!path" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref  } from 'vue';
import { useRouter } from 'vue-router';
import HomePage from '@/product/SIOC-H5/module/HomePage/HomePage.vue';

export default defineComponent({
  components: {
    HomePage
  },
  setup() {
    const router = useRouter();
    const path = ref('');
    /**
     * @description 获取首页携带的参数,跳转路由（给安卓使用）
     */
    function getHref() {
      const index = document.location.href.lastIndexOf('?router=');
      if (index > -1) {
        // 路由
        path.value = document.location.href.substring(index + 8, document.location.href.length);
        router.push({
          path: path.value
        })
      }
    }
    getHref();
    return {
      path
    }
  }
})
</script>