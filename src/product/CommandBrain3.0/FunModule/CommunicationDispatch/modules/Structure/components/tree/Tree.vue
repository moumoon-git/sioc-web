<template>
  <div>
    <ul
    class="TreeUl"
      v-for="(item,index) in datademo"
      :key="index"
    >
      <TreeItem
        :data="item"
        :tree-props="treeProps"
      />
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import TreeItem from './item.vue';

export default defineComponent({
  components: {
    TreeItem,
  },
  props: {
    datademo: {
      type: [Object, Array],
      required: true,
    },
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label',
      }),
    },
  },
  setup() {},
});
</script>
<style lang="scss">
.TreeUl{
    margin: 10px 0
}
</style>

