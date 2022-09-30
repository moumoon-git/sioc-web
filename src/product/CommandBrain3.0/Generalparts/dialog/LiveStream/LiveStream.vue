<template>
  <div style="min-width: 660px; min-height: 400px;">
    <component
      v-bind="$attrs"
      is="LiveStreamInner"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import Loading from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/Loading.vue';

export default defineComponent({
  name: 'LiveStream',
  components: {
    LiveStreamInner: defineAsyncComponent({
      loader: () => import(
        /* webpackChunkName: "Command__LiveStreamInner" */ './LiveStreamInner.vue'
      ),
      loadingComponent: Loading,
    }),
  },
});
</script>
