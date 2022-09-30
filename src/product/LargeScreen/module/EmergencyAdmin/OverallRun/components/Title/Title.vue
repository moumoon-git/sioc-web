<template>
  <h2 :class="$style.container">
    <span :class="$style.title"><slot name="title">{{ title }}</slot></span>
    <span :class="$style.sub"><slot name="sub">{{ sub }}</slot></span>
  </h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: 'title',
    },
    sub: {
      type: String,
      default: 'sub',
    },
  },
});
</script>

<style lang="scss" module>
.container {
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(to right, rgba(#00F0F3, 10%), #00F0F3, rgba(#00F0F3, 10%)) 2 2;
  height: 40px;
  margin: 0;
  padding: 0;
  color: #FFF;
  position: relative;
  flex-shrink: 0;
  background: no-repeat center/150% 40px radial-gradient(
    ellipse at bottom, rgba(#00F0F3, 40%), transparent 60%
  );
  .title {
    font-size: 28px;
    font-weight: 500;
    display: inline-block;
    padding-right: 8px;
  }
  .sub {
    font-size: 14px;
    color: #56E9FF;
    display: inline-block;
    vertical-align: -3px;
  }

}
</style>
