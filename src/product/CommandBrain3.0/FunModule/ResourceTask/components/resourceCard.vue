// 现场支援
<template>
  <div :class="$style.card">
    <div :class="$style.title">
      {{ obj.name }}
    </div>
    <div :class="$style.border" />
    <div :class="$style.content">
      {{ obj.remark }}
    </div>
    <div :class="$style.type">
      <div
        v-for="(item,index) in obj.resources"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
    <div
      v-viewer
      :class="$style.imgs"
    >
      <img
        v-for="(item,index) in obj.pics"
        :key="index"
        :src="`${baseurl}/fileupload${item.path}${item.name}`"
        alt
      >
    </div>
    <Address>{{ obj.address }}</Address>
    <div :class="$style.time">
      {{ obj.arriveDate }}
    </div>
  </div>
</template>

  <script setup lang="ts">
import { ref, defineExpose, defineProps } from 'vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';

const baseurl = (window as any).config.baseURL;
const props = defineProps({
  obj: Object,
});
defineExpose({
});
</script>
  <style module lang="scss" src="../style/resourceCard.scss">
</style>
