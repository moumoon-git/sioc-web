<template>
  <el-config-provider :locale="locale">
    <Micro />
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import Micro from '@/product/Micro/index.vue';

export default defineComponent({
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    Micro,
  },
  data() {
    return {
      locale: zhCn,
    };
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>
