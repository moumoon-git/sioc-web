<template>
  <div :class="$style.Title">
    <h1>{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" module>
.Title {
  h1 {
    width: 366px;
    height: 52px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.04) 100%
    );
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    padding-left: 18px;
    line-height: 52px;
    box-sizing: border-box;
  }
}
</style>