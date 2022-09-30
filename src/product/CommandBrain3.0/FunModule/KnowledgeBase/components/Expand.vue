<template>
  <div
    :class="[
      'visualization-right-expand',
      {
        'visualization-right-expand--folded': isFolded,
      },
    ]"
  >
    <!-- 上方标题 -->
    <header
      class="visualization-right__header"
    >
      <!-- 标题 -->
      <div>
        <slot name="title">
          title
        </slot>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Expand',
  props: {
    // 列表数据
    list: {
      type: Array,
      default: () => [],
    },
    // 显示勾选框
    showCheck: {
      type: Boolean,
      default: true,
    },
    // 显示排序
    showSort: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'check',
    'uncheck',
    'check-all',
    'uncheck-all',
    'fold-change',
  ],
  data() {
    return {
      isFolded: true,
      isCheckAll: false,
      checkedList: new Set(),
    };
  },
  watch: {
    isCheckAll(val) {
      if (val) {
        this.$emit('check-all');
      } else {
        this.$emit('uncheck-all');
      }
    },
  },
  beforeUnmount() {
    this.checkedList.clear();
  },
  methods: {
    toggleFold() {
      this.isFolded = !this.isFolded;
      this.$emit('fold-change', this.isFolded);
    },
    handleCheckAll(checkAll?: boolean) {
      this.isCheckAll = checkAll ?? !this.isCheckAll;
      if (this.isCheckAll) {
        const newAddList: any = [];
        this.list.forEach((item) => {
          if (!this.checkedList.has(item)) {
            this.checkedList.add(item);
            newAddList.push(item);
          }
        });
        this.$emit('check', newAddList);
      } else {
        const newDeleteList: any = [];
        this.list.forEach((item) => {
          if (this.checkedList.has(item)) {
            this.checkedList.delete(item);
            newDeleteList.push(item);
          }
        });
        this.$emit('uncheck', newDeleteList);
      }
    },
    handleCheck(item: any) {
      if (this.checkedList.has(item)) {
        this.checkedList.delete(item);
        this.$emit('uncheck', [item]);
        this.isCheckAll = false;
      } else {
        this.checkedList.add(item);
        this.$emit('check', [item]);
        // 判断全选
        if (this.checkedList.size === this.list.length) {
          this.isCheckAll = true;
        }
      }
    },
    /**
     * @description 设置勾选
     * @param {Array} arr 设置勾选的项目
     */
    setCheck(arr: any) {
      this.checkedList.clear();
      arr.forEach((item: any) => {
        // 列表中存在的项才添加
        const index = this.list.findIndex((listItem: any) => listItem.id === item.id);
        if (index !== -1) {
          this.checkedList.add(this.list[index]);
        }
      });
      // 判断全选
      if (this.checkedList.size === this.list.length) {
        this.isCheckAll = true;
        this.$emit('check-all');
      }
    },
        /**
  * @desc 上移
  * @param {}
  * @returns {}
  */
  upFun(index: number, arr: any) {
      if (index !== 0) {
        arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      } else {
        arr.push(arr.shift());
      }
    },
    /**
    * @desc 下移
    * @param {}
    * @returns {}
    */
    downFun(index: number, arr: any) {
      if (index !== arr.length - 1) {
        arr[index] = arr.splice(index + 1, 1, arr[index])[0];
      } else {
        arr.unshift(arr.splice(index, 1)[0]);
      }
    },
  },
});
</script>

<style lang="scss">
.visualization-right-expand {
  padding: 3px;
  margin: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  &:hover {
    border-color: rgba(86, 233, 255, 0.5);
  }
  & > header {
    border: 1px solid rgba(166, 173, 180, 0.9);
    background: rgba(132, 160, 193, 0.11);
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    height: 30px;
    line-height: 30px;
    position: relative;
    padding: 0 30px 0 16px;
    display: flex;
    align-items: center;
    // 左上角三角形
    &:before {
      content: "";
      display: block;
      border-top: 3px solid #a6adb4;
      border-left: 3px solid #a6adb4;
      border-right: 3px solid transparent;
      border-bottom: 3px solid transparent;
      position: absolute;
      left: 2px;
      top: 2px;
    }
    // 插槽内容
    & > div {
      flex: 1;
      height: 100%;
      line-height: inherit;
      overflow: hidden;
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:hover {
      border-color: #56e9ff;
      color: #56e9ff;
      background: rgba(86, 233, 255, 0.11);
      &:before {
        border-top: 3px solid #56e9ff;
        border-left: 3px solid #56e9ff;
      }
      & > i:first-child {
        // &.visualization-right-expand__uncheck {
        //   background-image: url(./assets/empty-hover.svg);
        // }
        // &.visualization-right-expand__check {
        //   background-image: url(./assets/tick-hover.svg);
        // }
      }
    }
  }
  & > main {
    overflow-y: auto;
    max-height: 250px;
    transition: max-height 0.3s linear;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    // 列表
    & > .visualization-right-expand__default-list {
      list-style: none;
      margin: 10px 0;
      padding: 0;
      & > li {
        display: flex;
        align-items: center;
        color: #ffffff;
        position: relative;
        padding-left: 16px;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
        &:hover {
          color: #56e9ff;
          // & > .visualization-right-expand__uncheck {
          //   background-image: url(./assets/empty-hover.svg) !important;
          // }
          // & > .visualization-right-expand__check {
          //   background-image: url(./assets/tick-hover.svg) !important;
          // }
        }
        & > i:first-child {
          flex-shrink: 0;
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: baseline;
          cursor: pointer;
          margin-right: 10px;
          transition: box-shadow 0.7s;
          border-radius: 2px;
          overflow: hidden;
          &.visualization-right-expand__uncheck {
            // background: no-repeat center/100% 100% url(./assets/empty.svg);
            &:hover {
              // background-image: url(./assets/empty-hover.svg);
            }
          }
          &.visualization-right-expand__check {
            box-shadow: 0 0 5px currentColor inset;
            // background: no-repeat center/100% 100% url(./assets/tick.svg);
            &:hover {
              // background-image: url(./assets/tick-hover.svg);
            }
          }
        }
      }
    }
  }
  &--folded {
    & > header > i:last-child {
      // transform: translateY(-50%);
    }
    & > main {
      max-height: 0;
    }
  }
}
.visualization-right__header__sort {
  display: none;
}
.visualization-right__header {
  &:hover {
    .visualization-right__header__sort {
      display: block;
    }
  }
}
.visualization-right-expand__default-list__sort{
    width: 44px;
    display: flex;
    justify-content: space-between;
  .visualization-right-expand__default-list__sort-up{
    width: 16px;
    height: 16px;
    font-size: 12px;
    margin-right: 10px;
    // background: url(./assets/up.svg) no-repeat;
    cursor: pointer;
    &:hover {
      // background: url(./assets/up-hover.svg) no-repeat;
    }
  }
  .visualization-right-expand__default-list__sort-down{
    width: 16px;
    height: 16px;
    font-size: 12px;
    // background: url(./assets/down.svg) no-repeat;
    cursor: pointer;
    &:hover {
      // background: url(./assets/down-hover.svg) no-repeat;
    }
  }
}
</style>
