// 树形组件
<template>
  <ElTree
    ref="tree"
    class="sv-tree"
    icon-class="sv-tree__icon"
    :data="treeData"
    node-key="id"
    :props="propsSetting"
    empty-text="暂无数据"
    :show-checkbox="showcheckbox"
    :filter-node-method="filterTreeData"
    @node-click="handleTreeClick"
  >
    <template #default="{node,data}">
      <div class="inviteTree">
        <div class="inviteTree__Left">
          {{ data.name }}
        </div>
        <div
          v-if="data.children"
          class="inviteTree__right__icon"
          @click="deleteFun(data.id)"
        />
        <div
          v-else
          class="inviteTree__right"
        >
          {{ data.rights==='0'?'仅查看':'可编辑' }}
        </div>
      </div>
    </template>
  </ElTree>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    treeData: {
      type: Array,
      default: [],
    },
  },
  emits: ['lookFun', 'deleteRecord'],
  setup(props, context) {
    const labelFlag = ref([]);
    function handleTreeClick(e: any) {
      console.log(e);
    }
    function handClick() {
      context.emit('lookFun');
    }
    function deleteFun(id: number) {
      context.emit('deleteRecord', id);
    }
    return {
      labelFlag,
      // treeData,
      handleTreeClick,
      handClick,
      deleteFun,
    };
  },
  data() {
    return {
      // 树形参数配置
      propsSetting: {
        label: 'name',
        children: 'children',
      },
    };
  },
});
</script>

<style lang="scss">
.inviteTree {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  &__right {
    margin-right: 10px;
  }
  &__right__icon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
    background: url(../../PlottingMapDetail/assets/odelete.svg);
    &:hover {
      background: url(../../PlottingMapDetail/assets/odeleteActive.svg);
    }
  }
}
</style>
