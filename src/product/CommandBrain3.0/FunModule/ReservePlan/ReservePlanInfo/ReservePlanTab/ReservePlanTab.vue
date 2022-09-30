<template>
  <div>
    <TabList
      :list="tabList"
      @switch="tabClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabList from '@/product/CommandBrain3.0/Generalparts/dialog/TabList/TabList.vue';

export default defineComponent({
  components: {
    // 标签列表组件
    TabList,
  },
  emits: ['tabClick'],
  data() {
    return {
      tabList: [
        '版本信息',
        '专项指挥部',
        '现场指挥部',
        '预警信号',
        '应急响应',
        '应急保障',
      ],
    };
  },
  methods: {
    tabClick(item: any): void {
      this.$emit('tabClick', item);
    },
  },
});
</script>

<style lang="scss" module></style>
