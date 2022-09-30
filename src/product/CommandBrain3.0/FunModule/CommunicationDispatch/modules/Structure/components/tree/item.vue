<template>
  <li class="TreeItemLi">
    <div
      class="TreeItemLiDiv1"
      @click="toggle"
    >
      <div
        v-if="hasChild"
        class="spreadIcon"
        :class="{'spreadIcon--active':isOpen}"
      />
      <!-- 末节点 -->
      <span v-if="!hasChild">🌞</span>
      <div class="TreeItemLi__name">
        {{ data[treeProps.label] }}
      </div>
    </div>
    <ul
      v-show="isOpen"
      v-if="hasChild"
      class="TreeItemUl"
    >
      <TreeItem
        v-for="(item, index) in data[treeProps.children]"
        :key="index"
        :data="item"
        :tree-props="treeProps"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'TreeItem', // 递归组件必须有name
  props: {
    data: {
      type: [Object, Array], // 多个可能的类型
      required: true,
    },
    // label、children 默认值
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label',
      }),
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    // 判断当前级别是否还有children
    hasChild() {
      return (
        this.data[this.treeProps.children]
        && this.data[this.treeProps.children].length
      );
    },
  },
  methods: {
    // 点击子菜单也要判断是否有children，有就展开
    toggle() {
      if (this.hasChild) {
        this.isOpen = !this.isOpen;
      }
    },
  },
};
</script>

<style lang="scss">
.TreeItemUl {
  list-style: none;
  padding-left: 20px;
  color: #fff;
  border-left: 1px dashed #d4dde6;
}
.TreeItemLi {
  color: #000;
  color: #fff;
  //   display: flex;
  .spreadIcon {
    width: 12px;
    height: 12px;
    display: block;
    background: url(./assets/right.svg) no-repeat;
    background-size: 100% 100%;
  }
  .spreadIcon--active {
    background: url(./assets/bottom.svg) no-repeat;
    background-size: 100% 100%;
    width: 12px;
    height: 12px;
  }
  .TreeItemLiDiv1 {
    display: flex;
    align-items: center;
  }
  &__name {
  }
}
.TreeItemLi > span {
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.8);

  font-weight: 500;
}
</style>
