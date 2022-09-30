<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export default defineComponent({
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
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
@font-face {
  font-family: 'DIN';
  src: url(/DIN/DIN-Bold.otf);
  font-weight: 600;
}
@font-face {
  font-family: 'DIN';
  src: url(/DIN/DIN-Regular.otf);
  font-weight: 400;
}
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url(/YouSheBiaoTiHei/YouSheBiaoTiHei.ttf);
  font-weight: 400;
}
</style>
