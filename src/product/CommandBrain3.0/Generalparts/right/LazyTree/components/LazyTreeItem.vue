<template>
  <li class="lazy-tree-item">
    <!-- 树项内容 -->
    <div
      class="lazy-tree-item__content"
      @click="handleNodeClick"
    >
      <!-- 文件夹按钮 -->
      <button
        v-if="item.hasOwnProperty('children')"
        :class="[
          'lazy-tree-item__content__folder',
          {
            'lazy-tree-item__content__folder--expanded': !isFold,
            'lazy-tree-item__content__folder--loading': isLoading,
          },
        ]"
        @click.stop="handleToggleFold"
      />
      <div v-else>
        <slot name="icon" />
      </div>
      <!-- 勾选框 -->
      <i
        v-if="!item.hasOwnProperty('children')"
        :class="[
          'lazy-tree-item__content__checkbox',
          {
            'lazy-tree-item__content__checkbox--checked': checkedNodes.has(item.id),
          },
        ]"
        @click.stop="handleCheck(item)"
      />
      <!-- 文字 -->
      <div class="lazy-tree-item__content__text">
        <slot :item="item">
          {{ item.name }}
        </slot>
      </div>
    </div>
    <!-- 子项 -->
    <ul
      v-if="item?.children?.length"
      v-show="!isFold"
      class="lazy-tree"
    >
      <LazyTreeItem
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        @node-click="$emit('node-click', $event)"
        @node-check="handleInnerCheck"
        @node-uncheck="handleInnerUncheck"
        @lazy-load="handleLazyload"
      >
        <template #default="{ item: innerItem }">
          <slot :item="innerItem">
            {{ innerItem.name }}
          </slot>
        </template>
        <template #icon>
          <slot name="icon" />
        </template>
      </LazyTreeItem>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LazyTreeItem',
  inject: {
    checkedNodes: 'checkedNodes',
  },
  props: {
    // 树形项数据
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    // 点击树节点
    'node-click',
    // 勾选树节点
    'node-check',
    // 取消勾选树节点
    'node-uncheck',
    // 懒加载数据
    'lazy-load',
  ],
  data() {
    return {
      // 是否折叠
      isFold: true,
      // 是否已经懒加载过数据
      hasFetched: false,
      // 懒加载中
      isLoading: false,
    };
  },
  methods: {
    handleCheck(node: any): void {
      const checkedMap = (this as any).checkedNodes;
      if (checkedMap.has(node.id)) {
        checkedMap.delete(node.id);
        this.$emit('node-uncheck', node);
      } else {
        checkedMap.set(node.id, node);
        this.$emit('node-check', node);
      }
    },
    handleInnerCheck(node: any, parent?: any) {
      if (parent) {
        this.$emit('node-check', node, parent);
      } else {
        this.$emit('node-check', node, this.item);
      }
    },
    handleInnerUncheck(node: any, parent?: any) {
      if (parent) {
        this.$emit('node-uncheck', node, parent);
      } else {
        this.$emit('node-uncheck', node, this.item);
      }
    },
    handleNodeClick() {
      if (!Object.prototype.hasOwnProperty.call(this.item, 'children')) {
        // 非文件夹
        this.$emit('node-click', this.item);
      } else {
        // 文件夹
        this.handleToggleFold();
      }
    },
    handleToggleFold() {
      // 还没有懒加载数据
      if (!this.hasFetched && !this.isLoading) {
        const lazyLoad = new Promise((resolve) => {
          this.$emit('lazy-load', this.item, resolve);
          this.isLoading = true;
        });
        lazyLoad.then((result: any) => {
          const copyItem = this.item;
          // 预处理children数组
          if (!copyItem?.children?.length) {
            copyItem.children = [];
          }
          if (result && Array.isArray(result)) {
            copyItem.children.push(...result);
            this.hasFetched = true;
            this.isLoading = false;
          } else {
            console.error('懒加载数据格式非法，请传递数组');
          }
        });
      }
      this.isFold = !this.isFold;
    },
    handleLazyload(node: any, resolve: any) {
      this.$emit('lazy-load', node, resolve);
    },
  },
});
</script>

<style lang="scss">
.lazy-tree-item {
  user-select: none;
  &__content {
    position: relative;
    left: -8px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    // 悬浮变青色
    &:hover {
      color: #56E9FF;
      .lazy-tree-item__content__checkbox {
        background-image: url(../assets/checkbox-empty-hover.svg);
      }
      .lazy-tree-item__content__checkbox--checked {
        background-image: url(../assets/checkbox-check-hover.svg);
      }
    }
    // 文件夹按钮
    &__folder {
      flex-shrink: 0;
      width: 16px;
      height: 14px;
      outline: none;
      border: none;
      margin-right: 11px;
      background: no-repeat center/100% url(../assets/folder.svg);
      cursor: pointer;
      // 文件夹展开
      &--expanded {
        background-image: url(../assets/folder-expanded.svg);
      }
      // 文件夹展开
      &--loading {
        background-image: url(../assets/loading.svg);
        @keyframes lazy-tree-loading {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
        animation: lazy-tree-loading infinite linear 2s;
      }
    }
    // 勾选框
    &__checkbox {
      flex-shrink: 0;
      display: block;
      width: 16px;
      height: 16px;
      border: 0;
      outline: 0;
      cursor: pointer;
      margin-right: 6px;
      background: no-repeat center/100% url(../assets/checkbox-empty.svg);
      &--checked {
        background-image: url(../assets/checkbox-check.svg);
      }
    }
    // 文字
    &__text {
      position: relative;
      flex: 1;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
