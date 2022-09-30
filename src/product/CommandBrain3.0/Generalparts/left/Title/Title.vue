<template>
  <h2
    :class="[
      'visualization-left-title',
      `visualization-left-title--${Array.isArray(title) ? 'multi' : 'single'}`,
    ]"
  >
    <!-- 多个标题 -->
    <template v-if="Array.isArray(title)">
      <span
        v-for="(item, index) in title"
        :key="index"
        :class="{
          'visualization-left-title--multi__item--active': activeIndex === index,
        }"
        @click="handleClick(index)"
      >
        {{ item }}
      </span>
      <span>
        <slot />
      </span>
    </template>
    <!-- 单个标题 -->
    <template v-else>
      <span class="visualization-left-title--single__left">
        {{ title }}
      </span>
      <span class="visualization-left-title--single__right">
        <slot />
      </span>
    </template>
  </h2>
</template>

<script lang="ts">
export default {
  name: 'Title',
  props: {
    title: {
      type: [String, Array],
      default: '标题',
    },
  },
  emits: ['change'],
  data() {
    return {
      activeIndex: 0,
    };
  },
  methods: {
    handleClick(index: number): void {
      (this as any).activeIndex = index;
      (this as any).$emit('change', index);
    },
  },
};
</script>

<style lang="scss">
.visualization-left-title {
  width: 100%;
  height: 26px;
  line-height: 26px;
  user-select: none;
  margin: 0;
  display: flex;
  align-items: flex-end;
  &--single {
    &__left {
      color: #00ECFF;
      // font-weight: bold;
      font-size: 18px !important;
      padding-left: 15px;
      margin-left: 10px;
      background: no-repeat calc(100% - 1px) 100%/auto url(./assets/line.svg);
      position: relative;
      &:before {
        content: '';
        position: absolute;
        left: -10px;
        bottom: 1px;
        width: 19px;
        height: 16px;
        background: no-repeat center/100% 100% url(./assets/icon.svg);
      }
    }
    &__right {
      text-align: right;
      // margin: 0 20px 0 1px;
      background: no-repeat 100% calc(100% - 1px)/auto url(./assets/bottom.svg);
      flex: 1;
      height: 100%;
    }
  }
  &--multi {
    box-sizing: border-box;
    padding: 0 0px 0 23px;
    background: no-repeat 0px 10px/100% auto url(./assets/background_multi.svg);
    & > span:not(:last-child) {
      color: #FFFFFF;
      font-size: 16px;
      cursor: pointer;
      transition: color .3s;
      bottom: 1px;
      position: relative;
      line-height: 22px;
      &:not(:first-child) {
        margin-left: 20px;
      }
      &:hover {
        color: #00ECFF;
      }
      &.visualization-left-title--multi__item--active {
        color: #00ECFF;
        font-size: 18px;
        border-bottom: 1px solid currentColor;
      }
    }
    & > span:last-child {
      text-align: right;
      flex: 1;
      height: 100%;
    }
  }
}
</style>
