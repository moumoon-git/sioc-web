<template>
  <div
    v-loading="true"
    style="width: 100%; height: 100%;"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingBlock',
});
</script>
