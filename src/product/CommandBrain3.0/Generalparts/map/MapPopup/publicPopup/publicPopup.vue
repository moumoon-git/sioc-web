<template>
  <div :class="$style.Protect">
    <!-- 显示信息 -->
    <VisInformation />
    <!-- 关联设备 -->
    <AssociatedDevices />
    <!-- 底下按钮 -->
    <FooterBtn :selfModule="selfModule" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import VisInformation from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/components/VisInformation.vue';
import AssociatedDevices from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/components/AssociatedDevices.vue';
import FooterBtn from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/components/FooterBtn.vue';

export default defineComponent({
  components: {
    VisInformation,
    AssociatedDevices,
    FooterBtn,
  },
  props: {
    selfModule: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" module>
.Protect {
}
</style>