<template>
  <div class="visualization-dialog-tab-list">
    <label
      v-for="(tab, index) in list"
      :key="`${tab}_${index}`"
      :class="[
        'visualization-dialog-tab-list__tab',
        {
          'visualization-dialog-tab-list__tab--active': index === activeTabIndex,
        },
      ]"
      @click="handleClick(index)"
    >
      {{ tab }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TabList',
  props: {
    // 标签列表
    list: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'switch',
  ],
  data() {
    return {
      activeTabIndex: 0,
    };
  },
  watch: {
    activeIndex(val) {
      this.activeTabIndex = val;
    },
  },
  methods: {
    handleClick(index: number) {
      this.activeTabIndex = index;
      this.$emit('switch', index);
    },
  },
});
</script>

<style lang="scss">
.visualization-dialog-tab-list {
  display: inline-block;
  height: 46px;
  line-height: 46px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
  position: relative;
  color: #FFFFFF;
  padding: 0 30px;
  white-space: nowrap;
  &__tab {
    font-size: 16px;
    font-weight: 400;
    padding: 0 7px;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 15px;
    }
    &:hover {
      color: #56E9FF;
    }
    &--active {
      color: #56E9FF;
      font-weight: 500;
      position: relative;
      &::after {
        content: '';
        width: 100%;
        height: 2px;
        background: #56E9FF;
        position: absolute;
        bottom: -15px;
        left: 0;
      }
    }
  }
}
</style>
