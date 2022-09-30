<template>
  <div id="mapdetailDom" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
  },
  mounted() {
    (this as any).initMap();
  },
  methods: {
    /**
     * @description 初始化超图地图实例
     */
    initMap(): void {
      const map: any = new (window as any).HM().init('mapdetailDom');
      (window as any).map = map;
    },
  },
});
</script>

<style lang="scss">
#mapdetailDom{
    width: 100%;
    height: 100%;
    border: 1px solid black;
}
</style>
