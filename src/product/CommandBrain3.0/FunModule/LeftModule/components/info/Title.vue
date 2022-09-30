<template>
  <div :class="$style.title">
    <span class="">事件等级</span>
    <div>
      <span />
      {{ grade }}
      <span />
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Title',
  data() {
    return {
      grade: (this as any).$store.state.event?.responseLevel || '未设置等级',
    };
  },
  computed: {
    event() {
      return (this as any).$store.state.event;
    },
  },
  watch: {
    event: {
      handler(newVal: any) {
        if (newVal) {
          (this as any).grade = (this as any).$store.state.event?.responseLevel || '未设置等级';
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style module lang="scss">
.title {
  display: flex;
  align-items: flex-end;
  /* line-height: 22px; */
  & > span {
    padding-left: 10px;
    font-size: 16px;
    color: #ffffff;
    position: relative;
    &::before {
      position: absolute;
      content: '';
      width: 2px;
      top: 0;
      bottom: 0;
      left: 0px;
      margin: auto;
      height: 16px;
      background: #ffffff;
    }
  }
  div {
    font-size: 30px;
    color: #00ecff;
    padding: 0 6px;
    line-height: 30px;
    position: relative;
    min-width: 225px;
    box-sizing: border-box;
    max-width: 225px;
    span {
      position: absolute;
      width: 6px;
      height: 3px;
      &:first-child {
        top: -2px;
        left: 0;
        border: 1px solid #00ecff;
        border-bottom-color: transparent;
        border-right-color: transparent;
      }
      &:last-child {
        bottom: -4px;
        right: 0;
        border: 1px solid #00ecff;
        border-top-color: transparent;
        border-left-color: transparent;
      }
    }
  }
}
</style>
