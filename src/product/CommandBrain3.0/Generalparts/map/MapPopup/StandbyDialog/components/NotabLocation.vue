<template>
  <div :class="$style.NotabLocation">
    <main>
      <Information
        v-if="bodyParts.informationList"
        :information-list="bodyParts.informationList"
        :profile-pic="bodyParts.profilePic"
        :is-attention="bodyParts.isAttention"
      />

      <RelatedResources
        v-if="bodyParts.relatedResourcesList"
        :related-resources-list="bodyParts.relatedResourcesList"
      />
      <LabelBox v-if="bodyParts.labelList" :cameraDetail="bodyParts" />
      <LocationPositioning v-if="bodyParts.locationInfo" :location-info="bodyParts.locationInfo" />
    </main>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Information from './commonSfc/Information.vue';
import LocationPositioning from './commonSfc/LocationPositioning.vue';
import RelatedResources from './commonSfc/RelatedResources.vue';
import LabelBox from './commonSfc/LabelBox.vue';

export default defineComponent({
  name: 'NotabLocation',
  components: {
    Information,
    RelatedResources,
    LocationPositioning,
    LabelBox,
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
.NotabLocation {
  width: 355px;
}
</style>
