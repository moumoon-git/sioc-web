<template>
  <Dialog title="实时动态" @close="handleExit">
    <div :class="$style.CurrentOnline">
      <div :class="$style['tabs']">
        <div
          v-for="(item, index) in tabsList"
          :key="item.activatePane"
          :class="[$style['tabs-pane'], { [$style['tabs-activate']]: currentPane === index }]"
          @click="tabChange(index)"
        >
          {{ item.label }}
          {{ currentPane === index ? item.count : '' }}
        </div>
      </div>
    </div>
    <component :is="activateComponent" />
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onBeforeUnmount } from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
import OnlinePersonnel from './components/OnlinePersonnel.vue';
import EquipmentOnline from './components/EquipmentOnline.vue';
import { useTabs } from './useHooks/currentOnlineModel';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  name: 'CurrentOnline',
  components: {
    Dialog,
    OnlinePersonnel,
    EquipmentOnline,
  },

  setup() {
    const { $ws } = useGlobal();
    // 切换父组件模块
    const $tabModules = inject<(data: any) => void>('$tabModules');
    const handleExit = () => {
      if ($tabModules) {
        $tabModules({ icon: '' });
      }
    };
    const { tabsList, currentPane, activateComponent, tabChange, refreshData } = useTabs();

    let un: () => void;
    onMounted(() => {
      un = $ws.subscribe(
        `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
        (msg: any) => {
          if (msg?.msgType === 52001) {
            refreshData();
          }
        },
      );
    });
    onBeforeUnmount(() => {
      un();
    });

    return {
      handleExit,
      tabsList,
      currentPane,
      activateComponent,
      tabChange,
    };
  },
});
</script>

<style lang="scss" module>
.CurrentOnline {
  .tabs {
    display: flex;
    width: 96%;
    margin: 10px auto;
    border: 1px solid #57a9b3;
    > div:first-child {
      border-right: 1px solid #56e9ff;
    }
    &-pane {
      color: #a6adb4;
      flex: 1;
      cursor: pointer;
      text-align: center;
      line-height: 26px;
    }
    &-activate {
      background: linear-gradient(90deg, #00c1de 0%, rgba(24, 38, 50, 0) 100%);
      color: #00ecff;
    }
  }
}
</style>
