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
      ref="lineGraphRef"
      :class="$style.lineGraph"
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
import { LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
} from 'echarts/components';
import {
  CanvasRenderer,
} from 'echarts/renderers';
import ButtonSet from '../../../ButtonSet/ButtonSet.vue';

echarts.use(
  [TooltipComponent, GridComponent, LineChart, CanvasRenderer],
);

export default defineComponent({
  name: 'LineGraph',
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
    const lineGraphRef = ref<HTMLDivElement | null>(null);
    function drawLineGraph() {
      if (lineGraphRef.value) {
        const echartsInstance = echarts.init(lineGraphRef.value);
        const option = {
          grid: {
            width: '75%',
            height: '65%',
            left: '15%',
            top: '20%',
          },
          tooltip: {
            trigger: 'axis',
            z: 2,
            axisPointer: {
              lineStyle: {
                color: 'rgba(204, 204, 204, 0.8)',
                type: 'solid',
              },
              z: 1,
            },
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
            type: 'line',
            lineStyle: {
              color: '#0091FF',
            },
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: '#0091FF',
                borderWidth: 1,
                opacity: 0,
              },
              emphasis: {
                borderWidth: 4,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 145, 255, 0.3)',
                opacity: 1,
              },
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(63, 146, 254, 0.2)',
                  }, {
                    offset: 1, color: 'rgba(63, 146, 254, 0)',
                  }],
                  global: false,
                },
              },
            },
          }],
        };
        echartsInstance.setOption(option);
      }
    }

    onMounted(drawLineGraph);

    watch(data, drawLineGraph);

    /**
     * 点击按钮
     *
     * @param buttonType 按钮类型
     */
    function handleClick(buttonType: 'edit' | 'delete') {
      emit(buttonType);
    }
    return {
      lineGraphRef,
      handleClick,
    };
  },
});
</script>

<style lang="scss" module>
.lineGraph {
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
