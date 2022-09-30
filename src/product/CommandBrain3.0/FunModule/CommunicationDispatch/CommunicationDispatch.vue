<template>
  <div style="width: 1240px; height: 742px;">
    <component
      v-bind="$attrs"
      is="CommunicationDispatchInner"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import Loading from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/Loading.vue';

export default defineComponent({
  name: 'CommunicationDispatch',
  components: {
    CommunicationDispatchInner: defineAsyncComponent({
      loader: () => import(
        /* webpackChunkName: "Command__CommunicationDispatchInner" */ './CommunicationDispatchInner.vue'
      ),
      loadingComponent: Loading,
    }),
  },
});
</script>
