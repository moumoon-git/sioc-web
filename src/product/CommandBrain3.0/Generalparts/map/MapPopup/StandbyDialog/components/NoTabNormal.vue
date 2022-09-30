<template>
  <div :class="$style.NoTap">
    <main>
      <Information
        v-if="bodyParts.informationList"
        :information-list="bodyParts.informationList"
        :profile-pic="bodyParts.profilePic"
        :live-data="bodyParts.liveData"
        :is-attention="bodyParts.isAttention"
      />

      <RelatedEquipment
        v-if="bodyParts.relatedEquipmentList"
        :related-equipment-list="bodyParts.relatedEquipmentList"
      />

      <LabelBox v-if="bodyParts.labelList.length" :camera-detail="bodyParts" />
      <LocationPositioning v-if="bodyParts.locationInfo" :location-info="bodyParts.locationInfo" />
    </main>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RelatedEquipment from './commonSfc/RelatedEquipment.vue';
import Information from './commonSfc/Information.vue';
import LabelBox from './commonSfc/LabelBox.vue';
import LocationPositioning from './commonSfc/LocationPositioning.vue';

export default defineComponent({
  name: 'NoTabNormal',
  components: {
    Information,
    LabelBox,
    RelatedEquipment,
    LocationPositioning,
  },
  props: {
    bodyParts: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>

<style lang="scss" module>
@import '../assets/css/common.scss';
.NoTap {
  width: 355px;
}
</style>
