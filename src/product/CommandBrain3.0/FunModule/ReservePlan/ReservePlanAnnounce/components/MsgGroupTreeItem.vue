<template>
  <li class="group-tree-item">
    <!-- 树项内容 -->
    <div
      class="group-tree-item__content"
      @click="$emit('node-click', item)"
    >
      <!-- 文件夹按钮 -->
      <button
        v-if="item.children"
        :class="[
          'group-tree-item__content__folder',
          {
            'group-tree-item__content__folder--expanded': !isFold,
          },
        ]"
        @click.stop="isFold = !isFold"
      />
      <div v-else>
        <slot name="icon" />
      </div>
      <!-- 勾选框 -->
      <i
        v-if="isCheckBox"
        :class="[
          'group-tree-item__content__checkbox',
          {
            'group-tree-item__content__checkbox--checked': checkedNodes.has(item.id),
          },
        ]"
        @click.stop="handleCheck(item)"
      />
      <!-- 文字 -->
      <div class="group-tree-item__content__text">
        <slot :item="item">
          <p :style="currentTreeNode?.id===item?.id?'color:#56E9FF':''">
            {{ item.name }}
          </p>
          <img
            style="position: absolute; right: 49px; top: 2px;"
            src="../assets/add.svg"
            alt=""
            @click="add(item)"
          >
          <img
            style="position: absolute; right: 23px; top: 2px;"
            src="../assets/edit.svg"
            alt=""
            @click="edit(item)"
          >
          <img
            style="position: absolute; right: 0px; top: 2px;"
            src="../assets/delete.svg"
            alt=""
            @click="deleteItem(item)"
          >
        </slot>
      </div>
    </div>
    <!-- 子项 -->
    <ul
      v-if="item?.children?.length"
      v-show="!isFold"
      class="group-tree"
    >
      <GroupTreeItem
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :currentTreeNode="currentTreeNode"
        :isCheckBox="isCheckBox"
        @node-click="$emit('node-click', $event)"
        @node-check="$emit('node-check', $event)"
        @node-uncheck="$emit('node-uncheck', $event)"
        @add="add"
        @edit="edit"
        @deleteItem="deleteItem"
      >
        <template #default="{ item: innerItem }">
          <slot :item="innerItem">
            <p :style="currentTreeNode?.id===innerItem?.id?'color:#56E9FF':''">
              {{ innerItem.name }}
            </p>
            <img
              style="position: absolute; right: 49px; top: 2px;"
              src="../assets/add.svg"
              alt=""
              @click="add(innerItem)"
            >
            <img
              style="position: absolute; right: 23px; top: 2px;"
              src="../assets/edit.svg"
              alt=""
              @click="edit(innerItem)"
            >
            <img
              style="position: absolute; right: 0px; top: 2px;"
              src="../assets/delete.svg"
              alt=""
              @click="deleteItem(innerItem)"
            >
          </slot>
        </template>
        <template #icon>
          <slot name="icon" />
        </template>
      </GroupTreeItem>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GroupTreeItem',
  inject: {
    checkedNodes: 'checkedNodes',
  },
  props: {
    // 树形项数据
    item: {
      type: Object,
      default: () => ({}),
    },
    isCheckBox: {
      type: Boolean,
      default: false,
    },
    currentTreeNode: {
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
    // 新增
    'add',
    // 修改
    'edit',
    // 删除
    'deleteItem',
  ],
  data() {
    return {
      // 是否折叠
      isFold: true,
    };
  },
  methods: {
    // 新增
    add(node: any): void {
      this.$emit('add', node);
    },
    // 修改
    edit(node: any): void {
      this.$emit('edit', node);
    },
    // 删除
    deleteItem(node: any): void {
      this.$emit('deleteItem', node);
    },
    handleCheck(node: any): void {
      const allNodes = this.findAllDescendant(node);
      const checkedMap = (this as any).checkedNodes;
      if (checkedMap.has(node.id)) {
        allNodes.forEach((item) => {
          checkedMap.delete(item.id);
        });
        this.$emit('node-uncheck', allNodes);
      } else {
        allNodes.forEach((item) => {
          checkedMap.set(item.id, item);
        });
        this.$emit('node-check', allNodes);
      }
    },
    findAllDescendant(node: any) {
      const result: any[] = [node];
      if (node?.children?.length) {
        node.children.forEach((child: any) => {
          result.push(...this.findAllDescendant(child));
        });
      }
      return result;
    },
  },
});
</script>

<style lang="scss">
.group-tree-item {
  &__content {
    position: relative;
    left: -8px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    // 悬浮变青色
    &:hover {
      color: #56E9FF;
      .group-tree-item__content__checkbox {
        background-image: url(../assets/checkbox-empty-hover.svg);
      }
      .group-tree-item__content__checkbox--checked {
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
      margin-right: 10px;
      background: no-repeat center/100% url(../assets/folder.svg);
      cursor: pointer;
      // 文件夹展开
      &--expanded {
        background-image: url(../assets/folder-expanded.svg);
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
