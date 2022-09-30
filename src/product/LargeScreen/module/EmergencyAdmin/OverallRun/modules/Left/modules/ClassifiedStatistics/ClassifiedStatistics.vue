<template>
  <div :class="$style.wrapper">
    <template v-if="listData?.length">
      <div
        ref="container"
        :class="$style.container"
      />
      <ul :class="$style.list">
        <li
          v-for="(item, index) in listData"
          :key="item.name"
          :style="{
            '--dot-color': color[index],
          }"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.value }}</span>
        </li>
      </ul>
    </template>
    <EmptyHint v-else />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  watch,
  nextTick,
} from 'vue';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  GridComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';

echarts.use([
  GridComponent,
  PieChart,
  SVGRenderer,
]);

export default defineComponent({
  name: 'ClassifiedStatistics',
  components: {
    EmptyHint,
  },
  props: {
    listData: {
      type: Array as PropType<{ name: string, value: number }[]>,
      default: () => [],
    },
    // 饼图内文字大小
    fontSize: {
      type: Number,
      default: 18,
    },
  },
  setup(props) {
    const container = ref<HTMLDivElement | null>(null);
    const color = ['#00EFCC', '#008CFF', '#FFB84A', '#FF6080', '#F576FF', '#8656FF'];
    let timer: number;
    function drawGraph() {
      clearInterval(timer);
      if (container.value) {
        const options = {
          color,
          grid: {
            width: '100%',
            height: '100%',
          },
          series: [
            {
              type: 'pie',
              radius: ['75%', '100%'],
              top: '10%',
              bottom: '10%',
              left: '10%',
              right: '10%',
              avoidLabelOverlap: true,
              label: {
                show: false,
                position: 'center',
                formatter: '{d|{d}%}\n{b|{b}}',
                rich: {
                  b: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: props.fontSize,
                    padding: [10, 0, 0, 0],
                  },
                  d: {
                    color: '#FFF',
                    fontSize: props.fontSize * 2,
                    fontFamily: 'DIN',
                  },
                },
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '50',
                  fontWeight: 'bold',
                  color: '#FFF',
                },
              },
              data: props.listData.map((item, index) => ({
                value: item.value,
                name: item.name,
                emphasis: {
                  itemStyle: {
                    shadowColor: color[index],
                    shadowBlur: 10,
                  },
                },
              })),
            },
          ],
        };
        const instance = echarts.init(container.value);
        instance.setOption(options);
        let dataIndex = 0;
        let pause = false;
        instance.on('mouseover', (evt) => {
          dataIndex = evt.dataIndex;
          instance.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
          });
          instance.dispatchAction({
            type: 'highlight',
            dataIndex,
          });
          pause = true;
        });
        instance.on('mouseout', () => {
          pause = false;
        });
        instance.dispatchAction({
          type: 'highlight',
          dataIndex,
        });
        instance.resize();
        timer = window.setInterval(() => {
          if (!pause) {
            dataIndex = (dataIndex + 1) % props.listData.length;
            instance.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
            });
            instance.dispatchAction({
              type: 'highlight',
              dataIndex,
            });
          }
        }, 3000);
      }
    }
    watch(() => props.listData, () => nextTick(drawGraph), { immediate: true, deep: true });
    return {
      container,
      color,
    };
  },
});
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  padding: 10px 70px;
  color: #fff;
  min-height: 240px;
  & > .container {
    overflow: hidden;
    flex: 1;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
  & > .list {
    flex-shrink: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    & > li {
      font-size: 18px;
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      &::before {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 100%;
        margin-right: 15px;
        background: var(--dot-color);
      }
      & > span:first-child {
        margin-right: 33px;
        font-size: 18px;
      }
      & > span:last-child {
        margin-left: auto;
        color: #32c5ff;
        font-size: 18px;
        font-family: 'DIN';
      }
    }
  }
}
</style>
