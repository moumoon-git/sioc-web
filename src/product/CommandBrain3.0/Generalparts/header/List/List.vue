<template>
  <transition name="visualization-header-list__transition">
    <div
      v-bind="$attrs"
      class="visualization-header-list"
    >
      <h3
        v-if="title"
        :title="title"
      >
        {{ title }}
      </h3>
      <ul @scroll="handleScroll">
        <li
          v-for="(item, index) in listData"
          :key="index"
          :title="item?.[listName] || ''"
          @click="$emit('click', item)"
        >
          {{ item?.[listName] || item }}
        </li>
      </ul>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'List',
  props: {
    title: {
      type: String,
      default: '',
    },
    listData: {
      type: Array,
      default: (): Array<string | number> => [],
    },
    // 列表项显示的属性名
    listName: {
      type: String,
      default: 'name',
    },
  },
  emits: [
    'click',
    'scroll-bottom',
  ],
  methods: {
    handleScroll(e: Event): void {
      const dom = e.target as HTMLElement;
      if (dom.scrollHeight - dom.scrollTop === dom.clientHeight) {
        this.$emit('scroll-bottom');
      }
    },
  },
});
</script>

<style lang="scss">
@keyframes visualization-header-list__show {
  from {
    transform: translate(-50%, -5px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
  }
}
.visualization-header-list {
  width: 334px;
  background: rgba(5, 5, 5, .9);
  border: 1px solid rgba(166, 173, 180, 0.3);
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
  animation: visualization-header-list__show .3s ease;
  // 标题
  & > h3 {
    height: 48px;
    line-height: 48px;
    text-align: left;
    margin: 0;
    padding: 0 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 18px;
    color: #FFFFFF;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // 列表
  & > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 373px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 3px;
    }
    & > li {
      text-align: left;
      color: #56E9FF;
      font-size: 18px;
      line-height: 18px;
      padding: 7px 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        background: linear-gradient(to right, #1D76AC, transparent);
      }
    }
  }
}
.visualization-header-list__transition-leave-active {
  transition: all .8s ease;
}
.visualization-header-list__transition-leave-to {
  opacity: 0;
}
</style>
