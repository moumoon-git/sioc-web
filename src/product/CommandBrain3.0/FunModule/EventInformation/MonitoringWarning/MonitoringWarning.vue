<!--监测预警-->
<template>
  <div class="early-warning-container">
    <Weather />
    <!-- <WaterLevel /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Weather from '@/product/CommandBrain3.0/FunModule/EventInformation/MonitoringWarning/components/Weather/Weather.vue';
import WaterLevel from '@/product/CommandBrain3.0/FunModule/EventInformation/MonitoringWarning/components/WaterLevel/WaterLevel.vue';

export default defineComponent({
  name: 'EarlyWarning',
  components: {
    Weather,
    WaterLevel
  },
})
</script>

<style lang="scss">
.early-warning-container {
  padding: 10px 19px;
  box-sizing: border-box;
  position: relative;
  overflow: scroll;
  flex: 1;
  // 滚动条样式
  &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
  }
  &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
  }
  &::-webkit-scrollbar-corner {
      background: transparent;
  }
}
</style>