<template>
  <div :class="$style.container">
    <h3 :class="$style.title">统计对象</h3>
    <ButtonSet
      v-if="!displayOnly"
      :class="$style.buttonSet"
      :icon-list="['edit', 'delete']"
      @click="handleClick"
    />
    <div
      ref="barGraphRef"
      :class="$style.barGraph"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  toRefs,
  watch,
} from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
} from 'echarts/components';
import {
  CanvasRenderer,
} from 'echarts/renderers';
import ButtonSet from '../../../ButtonSet/ButtonSet.vue';

echarts.use(
  [TooltipComponent, GridComponent, BarChart, CanvasRenderer],
);

export default defineComponent({
  name: 'BarGraph',
  components: {
    ButtonSet,
  },
  props: {
    // 仅展示，隐藏操作按钮
    displayOnly: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { data }: any = toRefs(props);
    const barGraphRef = ref<HTMLDivElement | null>(null);
    function drawBarGraph() {
      if (barGraphRef.value) {
        const echartsInstance = echarts.init(barGraphRef.value);
        const option = {
          grid: {
            width: '75%',
            height: '65%',
            left: '15%',
            top: '20%',
          },
          tooltip: {
            trigger: 'item',
            borderWidth: 0,
          },
          xAxis: {
            type: 'category',
            data: data.value?.map((item: any) => item.key),
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#999',
            },
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed',
              },
            },
            axisLabel: {
              color: 'rgba(51, 51, 51, 0.36)',
            },
          },
          series: [{
            data: data.value?.map((item: any) => item.value),
            type: 'bar',
            itemStyle: {
              color: '#0091FF',
            },
            barWidth: '15px',
          }],
        };
        echartsInstance.setOption(option);
      }
    }

    onMounted(drawBarGraph);

    watch(data, drawBarGraph);

    /**
     * 点击按钮
     *
     * @param buttonType 按钮类型
     */
    function handleClick(buttonType: 'edit' | 'delete') {
      emit(buttonType);
    }
    return {
      barGraphRef,
      handleClick,
    };
  },
});
</script>

<style lang="scss" module>
.barGraph {
  width: 400px;
  height: 300px;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  .title {
    position: absolute;
    top: 14px;
    left: 14px;
    margin: 0;
    font-weight: 500;
    color: #333;
    line-height: 14px;
    border-left: 2px solid #0091FF;
    padding-left: 8px;
    z-index: 1;
  }
  .buttonSet {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }
}
</style>
