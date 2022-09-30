<template>
  <div class="rainfullGraph-container">
    <div class="data-division">
      <!-- todo:还不知道要怎么做，先注释 -->
      <!-- <div v-for="item in range" class="row">
        <span>{{item.name}}</span>
      </div> -->
    </div>
    <div ref="rainfullGraphRef" id="rainfullGraphRef" class="rainfullGraph"></div>
  </div>
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
  name: 'RainfullGraph',
  props: {
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
    const { xData, yData, formatter } = props;
    // y轴 - 降雨范围
    const yRange: any = ref([0, 3.44, 11.33, 51.3])
    // y轴 - 降雨范围
    const range: any = ref([
      {
        value: 11.3,
        name: '大雨'
      },
      {
        value: 3.34,
        name: '中雨'
      },
      {
        value: 0,
        name: '小雨'
      }
    ]);
    /**
     * @description 获取降雨范围
     */
    function getRange() {
      const arr: any = yData.filter((item: any) => item.value > 51.3)
      if (arr.length > 0) {
        range.value = [
          {
            value: 51.3,
            name: '暴雨'
          },
          {
            value: 11.3,
            name: '大雨'
          },
          {
            value: 3.34,
            name: '中雨'
          },
          {
            value: 0,
            name: '小雨'
          }
        ]
      } else {
        range.value = [
          {
            value: 11.3,
            name: '大雨'
          },
          {
            value: 3.34,
            name: '中雨'
          },
          {
            value: 0,
            name: '小雨'
          }
        ]
      }
    }
    /**
     * @description 获取数组最大的值
     */
    function max(arr: any){
        let num = arr[0];
        for(let i = 0; i < arr.length; i++){
            if(num < arr[i]){
                num = arr[i]
            }
        }
        return num;
    }
    // 获取最大的数值
    const maxCount: number = max([...new Set(yData.map((item: any) => item.value))])
    if(maxCount > 51.3) {
      yRange.value.push(maxCount)
    }

    /**
     * @description 绘制图表
     */
    function drawRainfullGraph() {
      const dom: any = document.getElementById('rainfullGraphRef')
        const echartsInstance = echarts.init(dom);
        const option = {
          grid: {
            width: '70%',
            height: '65%',
            left: '18%',
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
            formatter: function (params: any) {
              return `预计${params[0].axisValue}后，降水量为${params[0].data}mm`;
            },
          },
          xAxis: {
            name: '分钟',
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
            name: '降水量',
            data: yRange.value,
            splitLine: {
              lineStyle: {
                type: 'solid',
                // color: 'transparent',
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
            name: '降雨量',
            data: yData.map((el: any) => el.value),
            type: 'line',
            smooth: true,
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
      getRange()
      drawRainfullGraph();
    });
    return {
      range
    }
  }
})
</script>
<style lang="scss">
.rainfullGraph-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;

  .data-division {
    position: absolute;
    top: -8px;
    left: 30px;
    width: 80%;
    margin-right: 8px;
    .row {
      height: 30px;
      line-height: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      text-align: right;
      position: relative;
      & > span {
        right: -30px;
        top: 6px;
        display: block;
        font-size: 12px;
        font-weight: 400;
        color: #A6ADB4;
        line-height: 17px;
        position: absolute;
      }
    }
  }
  .rainfullGraph {
    width: 332px;
    height: 106px;
  }
}
</style>