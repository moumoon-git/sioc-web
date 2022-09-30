<template>
  <div :class="$style.firstTab">
    <main>
      <Information
        v-if="bodyParts.informationList"
        :information-list="bodyParts.informationList"
        :profile-pic="bodyParts.profilePic"
        :is-attention="bodyParts.isAttention"
      />

      <RelatedEquipment
        v-if="bodyParts.relatedEquipmentList"
        :related-equipment-list="bodyParts.relatedEquipmentList"
      />

      <LabelBox v-if="bodyParts.labelList" :cameraDetail="bodyParts" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RelatedEquipment from '../commonSfc/RelatedEquipment.vue';
import Information from '../commonSfc/Information.vue';
import LabelBox from '../commonSfc/LabelBox.vue';

export default defineComponent({
  name: 'MatrialFirstTab',
  components: {
    Information,
    LabelBox,
    RelatedEquipment,
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
.firstTab {
  width: 355px;
}
</style>
