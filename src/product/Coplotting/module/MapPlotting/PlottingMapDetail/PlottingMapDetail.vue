<template>
  <div class="mapDetailSection">
    <!-- 头部 -->
    <header class="mapDetailHeader">
      <div class="mapDetailHeader__back">
        <div
          class="mapDetailHeader__back__Item mapDetailHeader__back__icon"
          @click="jumpToIndex"
        />
        <div class="mapDetailHeader__back__Item">
          地址灾害分布点
        </div>
        <div class="mapDetailHeader__back__Item mapDetailHeader__back__edit" />
      </div>
    </header>
    <!-- 操作栏 -->
    <MapOperation />
    <!-- 地图挂载 -->
    <div class="mapInitDom">
      <Detailmap />
    </div>
  </div>
  <MapPlottingView title="协作标绘" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Detailmap from './Map.vue';
import MapOperation from './MapOperation.vue';
import MapPlottingView from '../../MapPlottingView.vue';

export default defineComponent({
  components: {
    Detailmap, // 地图
    MapOperation, // 操作栏
    MapPlottingView, // 弹窗
  },
  setup(props, context) {
  },
  methods: {
    jumpToIndex() {
      this.$router.push('/plottingIndex');
    },
  },
});
</script>

<style lang="scss" src="./style/style.scss"></style>
