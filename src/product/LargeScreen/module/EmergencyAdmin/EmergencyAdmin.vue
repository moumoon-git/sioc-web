<template>
  <div :class="$style.EmergencyAdmin">
    <!-- 应急管理的地图 -->
    <div id="emergency_admin_supermap"></div>
    <!-- 左侧模块 -->
    <aside :class="$style.Left_module">
      <component :is="'OverallRun'" />
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent } from 'vue';
import LoadingBlock from './OverallRun/components/LoadingBlock/LoadingBlock.vue';

export default defineComponent({
  components: {
    // 总体态势
    OverallRun: defineAsyncComponent({
      loader: () => import('./OverallRun/OverallRun.vue'),
      loadingComponent: LoadingBlock,
    }),
  },
  setup(props) {
    onMounted(() => {
      const map: any = new (window as any).HM().init(
        'emergency_admin_supermap',
      );
      (window as any).admin_map = map;
    });
  },
  beforeMount() {
    (window as any).mapCoverageName = {
      mark: '落点Layer',
      event: 'eventLayer',
      vector: '其他图形Layer',
      edit: '编辑图形Layer',
      search: '搜索关键字Layer',
    };
  },
});
</script>

<style lang="scss" module>
.EmergencyAdmin {
  position: relative;
  width: 100%;
  height: 100%;
}
:global(#emergency_admin_supermap) {
  width: 100%;
  height: 100%;
  position: inherit;
}
.Left_module {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 2100px;
  height: 100%;
  background: linear-gradient(
    270deg,
    transparent 0%,
    rgba(4, 7, 11, 0.5) 10%,
    rgba(10, 11, 11, 0.85) 100%
  );
}
</style>
