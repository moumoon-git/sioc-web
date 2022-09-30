<template>
  <header :class="$style.headerStyle">
    <div :class="$style.headerIcon" />
    <div :class="$style.headerText">
      {{ leaderName }}职责
    </div>
  </header>
  <main :class="$style.scroll">
    <div :class="$style.text">
      {{ content }}
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DutyDetail',
  props: {
    leaderName: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" module>
  .headerStyle {
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    color: #FFF;
    .headerIcon {
      background: url(./assets/flagIcon.svg) no-repeat;
      background-size: 100%;
      width: 19px;
      height: 19px;
      position: relative;
      margin: 15px 10px 0px 10px;
      float: left;
    }
    .headerText {
      position: relative;
      margin: 13px 0px 0px 0px;
      font-size: 16px;
      float: left;
    }
  }
  .scroll {
    // height: 21vh;
    // overflow: auto;
    .text {
      color: #FFF;
      margin: 9px 11px 0px 14px;
    }
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
</style>
