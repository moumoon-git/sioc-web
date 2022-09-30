<template>
  <div class="app">
    <!-- 超图实例挂载点 -->
    <div id="map" />
    <FlightPatrol :title="patrolTitle" />
    <router-view />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import FlightPatrol from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightPatrol.vue';

export default defineComponent({
  components: {
    FlightPatrol,
  },
  data() {
    return {
      // 飞巡标题
      patrolTitle: '飞巡资源',
    };
  },
  mounted() {
    this.initMap();
    console.log((this as any).$http);
    console.log((this as any).$param);
    console.log((this as any).$param);
    console.log((this as any).$store);
  },
  methods: {
    /**
     * @description 初始化超图地图实例
     */
    initMap(): void {
      const map: any = new (window as any).HM().init('map');
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

  #map {
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
  }
}
</style>
