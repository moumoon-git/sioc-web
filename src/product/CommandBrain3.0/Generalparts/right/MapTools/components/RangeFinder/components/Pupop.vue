<template>
  <div :class="$style.Pupop" ref="Pupop">
    {{ visContent }}
    <i v-if="visDelete" @click="deleteSlef"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
interface config {
  longitude?: number;
  latitude?: number;
  map?: any;
}
export default defineComponent({
  props: {
    visContent: {
      type: String,
      default: '',
    },
    visDelete: {
      type: Boolean,
      default: false,
    },
    layerKey: {
      type: String,
      default: '',
    },
    callback: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const Pupop = ref<HTMLElement | null | any>(null);
    function open(config: config) {
      let promise = new Promise((resolve, reject) => {
        const id = `map-dialog--${Math.floor(Math.random() * 100000000)}`;
        const data = {
          id,
          longitude: config.longitude,
          latitude: config.latitude,
          class: Pupop.value,
        };
        (window as any).map.mapPopup(data);
        resolve(id);
      });
      return promise;
    }
    // 删除
    function deleteSlef() {
      props.callback && props.callback(props.layerKey);
    }
    return {
      Pupop,
      deleteSlef,
      open,
    };
  },
});
</script>

<style lang="scss" module>
.Pupop {
  white-space: nowrap;
  padding: 10px;
  position: absolute;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: rgba(0, 36, 60, 0.82);
  border: 1px solid #014b71;
  margin-left: 15px;
  margin-top: -44px;
  display: flex;
  align-items: center;
  i {
    cursor: pointer;
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-left: 8px;
    background: url('../assets/delete.svg') no-repeat;
    background-size: 100% 100%;
    &:hover {
      background: url('../assets/delete_active.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>