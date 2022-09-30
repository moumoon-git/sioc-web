<template>
  <TopHeader
    title="风险隐患分析"
    :show-quarter="true"
    @change="handleQuarterChange"
  />
  <TotalAndRatio :count-data="totalCount" />
  <Title title="分级统计" sub="HIERARCHICAL STATISTICS" />
  <HierarchicalStatistics :list-data="hierarchicalStatisticsList" />
  <Title title="分类统计" sub="CLASSIFIED STATISTICS" />
  <ClassifiedStatistics
    :list-data="
      classifiedStatisticsList.map((item) => ({
        name: item.name,
        value: item.num,
      }))
    "
  />
  <Title title="区域统计" sub="REGIONAL STATISTICS" />
  <RegionalStatistics
    :list-data="regionalStatisticsList"
    :headers="[
      { name: '区域名称', prop: 'townName' },
      { name: '隐患数量', prop: 'num' },
      { name: '重点隐患', prop: 'key' },
    ]"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, getCurrentInstance } from 'vue';
// 最顶部标题
import TopHeader from '../../components/TopHeader/TopHeader.vue';
// 小标题
import Title from '../../components/Title/Title.vue';
// 总数与比率
import TotalAndRatio from './modules/TotalAndRatio/TotalAndRatio.vue';
// 分级统计
import HierarchicalStatistics from './modules/HierarchicalStatistics/HierarchicalStatistics.vue';
// 分类统计
import ClassifiedStatistics from './modules/ClassifiedStatistics/ClassifiedStatistics.vue';
// 区域统计
import RegionalStatistics from './modules/RegionalStatistics/RegionalStatistics.vue';

// Composition API

// 总数与比率
import useTotalAndRatio from './services/useTotalAndRatio';
// 分级统计
import useHierarchicalStatistics from './services/useHierarchicalStatistics';
// 分类统计
import useClassifiedStatistics from './services/useClassifiedStatistics';
// 区域统计
import useRegionalStatistics from './services/useRegionalStatistics';

export default defineComponent({
  name: 'Left',
  components: {
    TopHeader,
    Title,
    TotalAndRatio,
    HierarchicalStatistics,
    ClassifiedStatistics,
    RegionalStatistics,
  },
  setup() {
    const instance = getCurrentInstance();
    const { $ws }: any = instance?.appContext.config.globalProperties;
    // 总数与比率
    const [totalCount, getTotalCount] = useTotalAndRatio();

    // 分级统计
    const [hierarchicalStatisticsList, getHierarchicalStatisticsList] =
      useHierarchicalStatistics();

    // 分类统计
    const [classifiedStatisticsList, getClassifiedStatisticsList] =
      useClassifiedStatistics();

    // 区域统计
    const [regionalStatisticsList, getRegionalStatisticsList] =
      useRegionalStatistics();

    let lastOption: { year: number; quarter: number };

    // 季度改变，刷新数据
    function handleQuarterChange(option: { year: number; quarter: number }) {
      lastOption = option;
      getTotalCount(option);
      getHierarchicalStatisticsList(option);
      getClassifiedStatisticsList(option);
      getRegionalStatisticsList(option);
    }

    const un = $ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg: any) => {
        if (msg?.msgType === 50005) {
          handleQuarterChange(lastOption);
        }
      },
    );
    onBeforeUnmount(() => {
      un();
    });

    return {
      handleQuarterChange,
      totalCount,
      hierarchicalStatisticsList,
      classifiedStatisticsList,
      regionalStatisticsList,
    };
  },
});
</script>
