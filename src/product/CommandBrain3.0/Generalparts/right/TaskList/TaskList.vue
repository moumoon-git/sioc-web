<template>
  <ul class="visualization-right-task-list">
    <li
      v-for="(item, index) in list"
      :key="index"
      @click="$emit('click', item, index)"
    >
      <!-- 勾选框 -->
      <i
        :class="
          checkedItems.has(item.id)
            ? 'visualization-right-task-list__check'
            : 'visualization-right-task-list__uncheck'
        "
        @click.stop="handleCheck(item)"
      />
      <!-- 内容 -->
      <div>
        <slot :item="item">
          {{ item }}
        </slot>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TaskList',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'click',
    'check',
    'uncheck',
  ],
  data() {
    return {
      // 是否勾选
      isCheck: false,
      checkedItems: new Set(),
    };
  },
  computed: {
    checkedList(): any[] {
      return Array.from(this.checkedItems);
    },
  },
  beforeUnmount() {
    this.checkedItems.clear();
  },
  methods: {
    handleCheck(item: any) {
      if (this.checkedItems.has(item.id)) {
        this.checkedItems.delete(item.id);
      } else {
        this.checkedItems.add(item.id);
      }
    },
  },
});
</script>

<style lang="scss">
.visualization-right-task-list {
  margin: 0;
  padding: 0;
  list-style: none;
  & > li {
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 3px;
    margin: 10px;
    cursor: pointer;
    color: #FFFFFF;
    position: relative;
    // 勾选框
    & > i {
      display: block;
      width: 16px;
      height: 16px;
      position: absolute;
      left: 13px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      &.visualization-right-task-list__check {
        background: no-repeat center/100% 100% url(./assets/tick.svg);
      }
      &.visualization-right-task-list__uncheck {
        background: no-repeat center/100% 100% url(./assets/empty.svg);
      }
    }
    & > div {
      border: 1px solid rgba(166, 173, 180, 0.9);
      background: rgba(132, 160, 193, 0.11);
      padding: 6px 30px 6px 35px;
      font-size: 14px;
      font-weight: 400;
      position: relative;
      // 左上角三角形
      &::before {
        content: '';
        display: block;
        border-top: 3px solid #A6ADB4;
        border-left: 3px solid #A6ADB4;
        border-right: 3px solid transparent;
        border-bottom: 3px solid transparent;
        position: absolute;
        left: 2px;
        top: 2px;
      }
      // 右箭头
      &::after {
        content: '';
        display: none;
        width: 10px;
        height: 18px;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: no-repeat center/90% 90% url(./assets/right.svg);
      }
    }
    &:hover {
      color: #56E9FF;
      & > i.visualization-right-task-list__check {
        background: no-repeat center/100% 100% url(./assets/tick-hover.svg);
      }
      & > i.visualization-right-task-list__uncheck {
        background: no-repeat center/100% 100% url(./assets/empty-hover.svg);
      }
      & > div {
        border: 1px solid #56E9FF;
        background: rgba(86, 233, 255, 0.11);
        &::before {
          border-top: 3px solid #56E9FF;
          border-left: 3px solid #56E9FF;
        }
        &::after {
          display: block;
        }
      }
    }
  }
}
</style>
