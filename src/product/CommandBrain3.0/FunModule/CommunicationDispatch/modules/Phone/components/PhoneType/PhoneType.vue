<template>
  <div :class="['phone-type', `phone-type--${active}`, `type_${type}`]">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PhoneType',
  props: {
    active: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
.phone-type {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  width: 62px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  cursor: pointer;
  position: relative;
  display: inline-block;

  &--active {
    font-size: 14px;
    font-weight: 500;
    color: #56e9ff;
    border-bottom: 2px solid #56e9ff;
  }

  &:hover {
    filter: brightness(1.5);
  }
}

.type_received,
.type_missed,
.type_dailed {
  padding-left: 26px;
  box-sizing: border-box;
}

// 已接
.type_received::before {
  content: '';
  display: block;
  position: absolute;
  background: url('../../assets/svg/circle-green.svg');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 26px;
  height: 26px;
  top: 10px;
  left: 2px;
}
// 未接
.type_missed::before {
  content: '';
  display: block;
  position: absolute;
  background: url('../../assets/svg/circle-red.svg');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 26px;
  height: 26px;
  top: 10px;
  left: 2px;
}
// 呼出
.type_dailed::before {
  content: '';
  display: block;
  position: absolute;
  background: url('../../assets/svg/circle-blue.svg');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 26px;
  height: 26px;
  top: 10px;
  left: 2px;
}
</style>
