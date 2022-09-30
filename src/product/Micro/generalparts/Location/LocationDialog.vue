<template>
  <ElDialog
    v-model="visible"
    custom-class="sbs-dialog"
    title="请选择地点"
    @close="handleClose"
  >
    <div style="min-width: 600px; min-height: 400px; height: 750px; padding: 20px; position: relative;">
      <Location
        :address="address"
        :lng-lat="[longitude, latitude]"
        @confirm="handleConfirm"
      />
    </div>
  </ElDialog>
</template>

<script>
import Location from './Location.vue';

export default {
  name: 'LocationDialog',
  components: {
    Location,
  },
  data() {
    return {
      visible: false,
      resolve: null,
      rejcet: null,
      longitude: 0,
      latitude: 0,
      address: '',
    };
  },
  methods: {
    open({
      longitude,
      latitude,
      address,
    }) {
      this.longitude = longitude;
      this.latitude = latitude;
      this.address = address;
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    handleClose() {
      this.visible = false;
      this.reject();
    },
    handleConfirm(address, lngLat) {
      this.resolve({
        address,
        longitude: lngLat[0],
        latitude: lngLat[1],
      });
      this.visible = false;
    },
  },
};
</script>
