<template>
  <div class="visualization-right-address">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Address',
});
</script>

<style lang="scss">
.visualization-right-address {
  color: #FFFFFF;
  font-size: 14px;
  line-height: 14px;
  padding-left: 22px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: -1px;
    width: 13px;
    height: 16px;
    background: no-repeat center/100% url(./assets/address.svg);
  }
  &:not(:last-child) {
    margin-bottom: 5px;
  }
}
</style>
