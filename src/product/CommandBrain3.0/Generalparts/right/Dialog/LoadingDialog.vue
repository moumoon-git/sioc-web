<template>
  <Dialog
    title="载入中"
  >
    <div
      v-loading="true"
      style="width: 100%; height: 100%;"
    />
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dialog from './Dialog.vue';

export default defineComponent({
  name: 'LoadingDialog',
  components: {
    Dialog,
  },
});
</script>
