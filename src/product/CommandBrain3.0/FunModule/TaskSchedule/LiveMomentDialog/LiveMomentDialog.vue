// 实时动态/任务全景-地图弹窗
<template>
  <MapDialog
    ref="dialog"
  >
    <template #title>
      <div class="live-moment-dialog__title">
        <!-- 收藏按钮 -->
        <button
          class="live-moment-dialog__title__star"
        />
        <span>
          {{ currentDetail?.reportTime || '-' }}
        </span>
      </div>
    </template>
    <div class="live-moment-dialog">
      <div style="font-size: 16px; font-weight: 500;">
        {{ currentDetail?.appEventTask?.title || '-' }}
      </div>
      <div>{{ currentDetail?.content || '-' }}</div>
      <div v-viewer>
        <img
          v-for="img in (currentDetail?.appAttachments?.filter(i => i?.extension?.match(/(svg|png|jpe?g|webp|gif)$/i)) || [])"
          :key="img.url"
          :src="`${baseURL}${img.url}`"
        >
        <a
          v-for="file in (currentDetail?.appAttachments?.filter(i => !i?.extension?.match(/(svg|png|jpe?g|webp|gif)$/i)) || [])"
          :key="file.url"
          :href="`${baseURL}${file.url}`"
          :download="`${file.filename}.${file.extension}`"
        >
          {{ `${file.filename}.${file.extension}` }}
        </a>
      </div>
      <Address>{{ currentDetail?.address || '-' }}</Address>
    </div>
  </MapDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MapDialog from '@/product/CommandBrain3.0/Generalparts/map/MapDialog/MapDialog.vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';
import loadSetup from './scripts';

export default defineComponent({
  name: 'LiveMomentDialog',
  components: {
    // 地图弹窗
    MapDialog,
    // 地址栏
    Address,
  },
  setup() {
    return loadSetup();
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
});
</script>

<style lang="scss" src="./styles/index.scss"></style>
