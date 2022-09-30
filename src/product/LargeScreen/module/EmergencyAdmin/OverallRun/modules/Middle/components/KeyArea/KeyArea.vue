<template>
  <div :class="$style.keyArea">
    <div ref="container" :class="$style.container" />
    <EmptyHint :class="$style.fixed" v-if="!areaOptions.legendData?.length"></EmptyHint>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  BarChart,
  CanvasRenderer,
]);

export default defineComponent({
  name: 'KeyArea',
  components: {
    EmptyHint,
  },
  props: {
    areaOptions: {
      type: Object,
      default: () => ({
        legendData: [],
        xAxis: [],
        series: [],
      }),
    },
  },
  setup(props, { expose }) {
    const container = ref<HTMLDivElement | null>(null);
    let timer: any;
    // const legendData = ['2020', '2021', '2022'];

    const initEcharts = () => {
      clearInterval(timer);
      const options = {
        // 图例颜色[2020,2021] 后续新增在这里新增
        color: ['#00EFCC', '#3F99FF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },

        legend: {
          data: props.areaOptions.legendData,
          textStyle: {
            color: '#D0CECD',
            fontFamily: 'DIN',
          },
          // itemStyle: {
          //   color: ['#00EFCC', '#3F99FF'],
          // },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: props.areaOptions.xAxis,
          axisLabel: {
            color: function() {
              return '#D0CECD';
            },
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#25343C'],
              fontFamily: 'DIN',
            },
          },
          nameTextStyle: {
            color: ['#25343C'],
            fontFamily: 'DIN',
          },
          axisLine: {
            lineStyle: {
              color: '#25343C',
              fontFamily: 'DIN',
            },
          },
        },

        yAxis: {
          type: 'value',
          axisLabel: {
            color: function() {
              return '#D0CECD';
            },
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#25343C'],
              fontFamily: 'DIN',
            },
          },
          nameTextStyle: {
            color: ['#25343C'],
            fontFamily: 'DIN',
          },
          axisLine: {
            lineStyle: {
              color: '#25343C',
              fontFamily: 'DIN',
            },
          },
        },

        series: props.areaOptions.series,
      };
      if (container.value) {
        const instance = echarts.init(container.value);
        instance.setOption(options);
        let dataIndex = 0;
        let pause = false;
        instance.on('legendselectchanged', (evt: any) => {
          // 自己手动点击的处理
          const viewIndex = props.areaOptions.legendData.findIndex(
            (item: any) => item === evt.name,
          );
          if (viewIndex === props.areaOptions.legendData.length - 1) {
            pause = true;
            return;
          }
          if (viewIndex === dataIndex) {
            dataIndex++;
          } else if (viewIndex) {
            dataIndex = viewIndex;
          }

          if (
            dataIndex === props.areaOptions.legendData.length - 1 ||
            viewIndex === props.areaOptions.legendData.length - 1
          ) {
            dataIndex = 0;
          }
        });

        timer = setInterval(() => {
          if (!pause) {
            instance.dispatchAction({
              type: 'legendToggleSelect',
              name: props.areaOptions.legendData[dataIndex],
            });
          }
        }, 3000);
      }
    };

    expose({
      initEcharts,
    });

    return {
      container,
    };
  },
});
</script>

<style lang="scss" module>
.keyArea {
  flex: 1;
  padding-top: 20px;
  position: relative;
  .container {
    height: 100%;
  }
  .fixed {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
