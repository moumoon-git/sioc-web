<template>
  <div :class="$style.MainContentDialog">
    <component
      :is="refActiveComponent"
      v-bind="$attrs"
    />
    <slot name="footer" />
  </div>
</template>

<script lang="ts" >
import {
 defineComponent, watch, inject, ref,
} from 'vue';
import NoTabNormal from './components/NoTabNormal.vue';
import NotabLocation from './components/NotabLocation.vue';
import MaterialsTab from './components/MaterialsTab/MaterialsTab.vue';
import useStore from './store/useStore';

export default defineComponent({
  name: 'MainContentDialog',
  components: {
    NoTabNormal,
    NotabLocation,
    MaterialsTab,
  },

  props: {
    activeComponent: {
      type: String,
      default: 'NotabLocation',
    },
  },
  setup(props) {
    console.log(props);
    const { state } = useStore();
    const uid:any = inject<string>('uid');
    const refActiveComponent = ref(props.activeComponent);

    // 监听切换物资库详情model
    watch(
      () => (state as any)[uid]?.isArticleStoreHouseDetail,
      (newValue) => {
        if (newValue) {
          refActiveComponent.value = 'MaterialsTab';
        } else {
          refActiveComponent.value = 'NoTabNormal';
        }
      },
    );

    return {
      refActiveComponent,
    };
  },

});
</script>

<style lang="scss" module>
.MainContentDialog {}
</style>
