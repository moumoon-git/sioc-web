<template>
  <div :class="$style.TaskPublishDialogWrap">
    <component v-bind="$attrs" is="TaskPublishDialogInner" />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import Loading from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/Loading.vue';

export default defineComponent({
  name: 'TaskPublishDialog',
  components: {
    TaskPublishDialogInner: defineAsyncComponent({
      loader: () =>
        import(
          /* webpackChunkName: "Command__CommunicationDispatchInner" */ './TaskPublishDialogInner.vue'
        ),
      loadingComponent: Loading,
    }),
  },
});
</script>
<style lang="scss" module>
.TaskPublishDialogWrap {
  width: 875px;
  height: 624px;
  & > div {
    height: 100%;
  }
}
</style>