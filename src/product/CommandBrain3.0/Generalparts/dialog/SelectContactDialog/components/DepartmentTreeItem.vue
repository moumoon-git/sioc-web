<template>
  <li>
    <!-- 当前项 -->
    <div
      :class="[
        'department-tree-item',
        {
          'department-tree-item--current':
            treeItemData[propsSetting.id] === currentNode.value?.[propsSetting.id],
        },
      ]"
      :style="{
        // 左缩进
        paddingLeft: `${17 * layer + 10}px`,
      }"
      @click="$emit('node-click', treeItemData); isChildrenShow = !isChildrenShow;"
    >
      <i
        v-if="treeItemData[propsSetting.children]?.length"
        :class="[
          'department-tree-item__prefix',
          {
            'department-tree-item__prefix--rotate': isChildrenShow,
          },
        ]"
      />
      <div>
        <slot :item="treeItemData">
          {{ treeItemData[propsSetting.name] }}
        </slot>
      </div>
    </div>
    <!-- 当前项子树 -->
    <transition name="department-tree-collapse">
      <ul
        v-show="isChildrenShow"
        v-if="treeItemData[propsSetting.children]?.length"
        class="department-tree"
      >
        <DepartmentTreeItem
          v-for="treeItemChild in treeItemData[propsSetting.children]"
          :key="treeItemChild[propsSetting.id]"
          :tree-item-data="treeItemChild"
          :layer="layer + 1"
          @node-click="$emit('node-click', $event)"
        >
          <template #default="{ item }">
            <slot :item="item">
              {{ item[propsSetting.name] }}
            </slot>
          </template>
        </DepartmentTreeItem>
      </ul>
    </transition>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DepartmentTreeItem',
  inject: {
    // 树形数据属性名配置
    propsSetting: {
      from: 'propsSetting',
      default: {
        id: 'id',
        name: 'name',
        children: 'children',
      },
    },
    currentNode: 'currentNode',
  },
  props: {
    // 树形项数据
    treeItemData: {
      type: Object,
      required: true,
    },
    // 第几层
    layer: {
      type: Number,
      default: 1,
    },
  },
  emits: [
    'node-click',
  ],
  data() {
    return {
      // 子树是否显示
      isChildrenShow: false,
    };
  },
});
</script>

<style lang="scss">
.department-tree-item {
  display: flex;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: linear-gradient(90deg, rgba(0, 193, 222, .3) 0%, rgba(24, 38, 50, 0) 100%);
  }
  // 当前点击的树项
  &--current {
    border-left: 2px solid #56E9FF;
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, .7) 0%,
      rgba(24, 38, 50, 0) 100%
    ) !important;
  }
  // 前缀箭头
  &__prefix {
    display: block;
    width: 6px;
    height: 12px;
    align-self: center;
    flex-shrink: 0;
    margin-right: 10px;
    cursor: pointer;
    position: relative;
    transition: transform .3s;
    &::before {
      content: '';
      border-top: 4px solid #56E9FF;
      border-left: 4px solid #56E9FF;
      border-bottom: 4px solid transparent;
      border-right: 4px solid transparent;
      position: absolute;
      left: -4px;
      top: 2px;
      transform: rotate(135deg);
    }
    &--rotate {
      transform: rotate(90deg);
    }
  }
}
.department-tree-collapse-leave-active,
.department-tree-collapse-enter-active {
  transition: max-height .3s linear;
}
.department-tree-collapse-leave-from,
.department-tree-collapse-enter-to {
  max-height: 200px;
}
.department-tree-collapse-leave-to,
.department-tree-collapse-enter-from {
  max-height: 0;
}
</style>
