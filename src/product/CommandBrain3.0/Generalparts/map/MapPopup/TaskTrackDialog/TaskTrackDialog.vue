<template>
  <div class="live-moment-dialog">
    <div style="font-size: 16px; font-weight: 500;">
      {{ composeData?.responseData?.appEventTask?.typeName }}
      {{ composeData?.responseData?.appEventTask?.title || '暂无标题' }}
    </div>
    <div class="live-moment-dialog__line" />
    <div>{{ composeData?.responseData?.content || '-' }}</div>
    <div v-viewer class="img-box">
      <img
        v-for="img in composeData?.responseData?.appAttachments?.filter(i =>
          i?.title?.toLowerCase()?.match(/(svg|png|jpe?g|webp|gif)$/i),
        ) || []"
        :key="img.url"
        :src="`${baseURL}${img.url}`"
        :alt="img.title"
        class="imgDec"
      />
      <!-- <a
        v-for="file in (currentDetail?.appAttachments?.filter(i => !i?.title?.toLowerCase()?.match(/(svg|png|jpe?g|webp|gif)$/i)) || [])"
        :key="file.url"
        :href="`${baseURL}${file.url}`"
        :download="`${file.title}`"
      >
        {{ `${file.title}` }}
      </a> -->
    </div>
    <Address>{{ composeData?.responseData?.address || '-' }}</Address>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';

export default defineComponent({
  name: 'TaskTrackDialog',
  components: {
    // 地址栏
    Address,
  },
  props: {
    composeData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
});
</script>

<style lang="scss" scoped>
.live-moment-dialog {
  .live-moment-dialog__line {
    margin: 5px 0;
    height: 2px;
    width: 100%;
    background: linear-gradient(to right, transparent 5%, #32b0ff, transparent 95%);
  }
  .img-box {
      .imgDec {
        width: 130px;
        margin: 10px;
      }
    }
}

</style>

<style
  lang="scss"
  src="@/product/CommandBrain3.0/FunModule/TaskSchedule/LiveMomentDialog/styles/index.scss"
></style>
