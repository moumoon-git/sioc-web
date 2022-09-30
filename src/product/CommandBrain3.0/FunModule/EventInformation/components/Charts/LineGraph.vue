<template>
  <div ref="lineGraphRef" :id="box" class="weatherChartContainer"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, toRefs, ref } from 'vue'
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  DataZoomComponent 
} from 'echarts/components';
import {
  CanvasRenderer,
} from 'echarts/renderers';

echarts.use(
  [TooltipComponent, GridComponent, DataZoomComponent,LineChart, CanvasRenderer],
);

export default defineComponent({
  name: 'LineGraph',
  props: {
    box: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    xData: {
      type: Array,
      default: () => ([])
    },
    yData: {
      type: Array,
      default: () => ([])
    },
    formatter: {
      type: String,
      default: '{value}'
    }
  },
  setup(props) {
    const { xData, yData, box, formatter } = props;
    function drawLineGraph() {
      const dom: any = document.getElementById(box)
        const echartsInstance = echarts.init(dom);
        const option = {
          grid: {
            width: '85%',
            height: '65%',
            left: '15%',
            top: '15%',
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
            data: xData,
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
            show: true, // 是否显示 y 轴。
            name: '',
            data: [0,3.11,11.4,50.1],
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(255, 255, 255, 0.15)',
              },
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 1)',
              formatter: formatter
            },
          },
          dataZoom: [ //  用于区域缩放
            {
              type: 'inside' // 内置在坐标系中
            }
          ],
          series: [{
            data: yData.map((el: any) => el.value),
            type: 'line',
            lineStyle: {
              color: '#ffffff',
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
    onMounted(() => {
      drawLineGraph();
    });
  }
})
</script>
<style lang="scss">
.weatherChartContainer {
  width: 100%;
  height: 100%;
}
</style>