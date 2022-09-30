<template>
  <h1 class="visualization-header-title">
    <span @click.stop="toggleList">
      <span :title="title">{{ title }}</span>
      <!-- <Arrow
        v-if="showArrow"
        class="visualization-header-title__arrow"
        :reverse="isListShown"
      /> -->
    </span>
    <ListWithFilter
      :visible="isListShown"
      style="top:10px;"
      @close="isListShown = false;"
    />
  </h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import Arrow from '../Arrow/Arrow.vue';
import ListWithFilter from './components/ListWithFilter/ListWithFilter.vue';

export default defineComponent({
  name: 'Title',
  components: {
    // Arrow,
    ListWithFilter,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: '可视化项目顶部标题',
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 列表展开
      isListShown: false,
    };
  },
  watch: {
    isListShown(val: boolean): void {
      if (val) {
        const handler = () => {
          this.isListShown = false;
          window.document.removeEventListener('click', handler, false);
        };
        window.document.addEventListener('click', handler, false);
      }
    },
  },
  methods: {
    toggleList(): void {
      this.isListShown = !this.isListShown;
    },
  },
});
</script>

<style lang="scss">
.visualization-header-title {
  position: relative;
  display: inline-block;
  min-width: 500px;
  max-width: 800px;
  height: 64px;
  line-height: 64px;
  background: #003C70;
  font-size: 28px;
  font-weight: 500;
  color: #FFFFFF;
  text-align: center;
  user-select: none;
  // 文字与箭头
  & > span {
    font: inherit;
    cursor: pointer;
    transition: all .3s;
    &:first-child {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:hover {
      color: #56E9FF;
      text-shadow: 0 0 3px #56E9FF;
    }
    & > span {
      font: inherit;
      &::before {
        content: '';
        display: inline-block;
        width: 33px;
        height: 26px;
        color: inherit;
        background: currentColor;
        mask: no-repeat center/100% 100% url(./assets/icon-list.svg);
        margin-right: 10px;
        vertical-align: -3px;
      }
    }
  }
  // 左右两侧多边形
  &::before,
  &::after {
    content: '';
    display: block;
    width: 87px;
    height: 64px;
    position: absolute;
    top: 0;
    background: no-repeat center/100% 100% url(./assets/side.svg);
  }
  &::before {
    left: 0;
    transform: translateX(-100%);
  }
  &::after {
    right: 0;
    transform: translateX(100%) rotateY(180deg);
  }
  // 箭头
  &__arrow {
    position: absolute !important;
    left: calc(50% - 20px);
    bottom: 0;
  }
  // 列表
  &__list {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, 0);
  }
}
</style>
