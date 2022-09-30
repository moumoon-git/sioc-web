<template>
  <div class="app">
    <!-- 开发任务调度时用的 -->
    <div class="moduleTitle">
      任务调度
    </div>
    <!-- 超图实例挂载点 -->
    <div id="superMap" />
    <!-- 开发任务调度时用的 -->

    <!-- 弹窗坞 -->
    <Dock ref="Dock" />
    <LiveMomentDialog />
  </div>
</template>

<script lang='ts'>
import { defineComponent, getCurrentInstance, VNode } from 'vue';
import Dock from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/Dock.vue';
import LiveMomentDialog from './LiveMomentDialog/LiveMomentDialog.vue';

export default defineComponent({
  name: 'TaskScheduling',
  components: {
    Dock,
    LiveMomentDialog,
  },
  mounted() {
    const instance = getCurrentInstance();
    const { $mapDialog }: any = instance?.appContext.config.globalProperties;
    const mapDialogInstance = $mapDialog({
      modle: 'NoTabNormal',
    });

    mapDialogInstance.open({
      data: 123,
    });

    const { getData } = ((mapDialogInstance.component) as any).proxy;
    this.initMap();

    getData();
  },
  methods: {
    initMap(): void {
      const map: any = new (window as any).HM().init('superMap');
      (window as any).map = map;
    },
  },
});
</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  min-height: 768px;
  max-height: 1080px;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  .moduleTitle {
    position: fixed;
    z-index: 9999;
    color: #fff;
    font-size: 20px;
  }
  #superMap {
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
  }
}
</style>
