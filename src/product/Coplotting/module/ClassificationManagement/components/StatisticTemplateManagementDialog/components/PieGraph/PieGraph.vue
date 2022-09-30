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
      ref="pieGraphRef"
      :class="$style.pieGraph"
    />
    <div
      v-if="currentItem"
      :class="$style.innerData"
    >
      <div>{{ currentItem?.value }}</div>
      <div>统计</div>
    </div>
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
import { PieChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import {
  CanvasRenderer,
} from 'echarts/renderers';
import ButtonSet from '../../../ButtonSet/ButtonSet.vue';

echarts.use(
  [TooltipComponent, GridComponent, PieChart, CanvasRenderer, LegendComponent],
);

export default defineComponent({
  name: 'PieGraph',
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
  emits: [
    'edit',
    'delete',
  ],
  setup(props, { emit }) {
    const { data }: any = toRefs(props);
    const pieGraphRef = ref<HTMLDivElement | null>(null);
    const currentItem = ref<any>(null);
    /**
     * 绘制饼状图
     */
    function drawPieGraph() {
      if (pieGraphRef.value) {
        const echartsInstance = echarts.init(pieGraphRef.value);
        const option = {
          grid: {
            width: '80%',
            height: '80%',
            left: '10%',
            top: '10%',
          },
          legend: {
            bottom: '5%',
            left: 'center',
            backgroundColor: '#F9FBFF',
            borderRadius: 3,
            textStyle: {
              color: '#999',
            },
            itemWidth: 10,
            itemHeight: 10,
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '75%'],
              top: '10%',
              bottom: '20%',
              avoidLabelOverlap: true,
              label: {
                color: '#666',
                formatter: '{d}%',
                fontSize: 14,
              },
              labelLine: {
                show: true,
                smooth: true,
                lineStyle: {
                  color: '#E0E5EB',
                },
              },
              itemStyle: {
                borderWidth: 3,
                borderColor: '#FFF',
              },
              data: data.value?.map((item: any) => ({
                value: item.value,
                name: item.key,
              })),
            },
          ],
        };
        echartsInstance.setOption(option);
        echartsInstance.on('mouseover', (event) => {
          currentItem.value = event.data;
        });
        echartsInstance.on('mouseout', () => {
          currentItem.value = null;
        });
      }
    }

    onMounted(drawPieGraph);

    watch(data, drawPieGraph);

    /**
     * 点击按钮
     *
     * @param buttonType 按钮类型
     */
    function handleClick(buttonType: 'edit' | 'delete') {
      emit(buttonType);
    }
    return {
      pieGraphRef,
      currentItem,
      handleClick,
    };
  },
});
</script>

<style lang="scss" module>
.pieGraph {
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
.innerData {
  position: absolute;
  left: 155px;
  top: 90px;
  width: 90px;
  height: 90px;
  border-radius: 100%;
  box-shadow: 0px 1px 4px 0px rgba(220, 224, 225, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > div:first-child {
    margin-top: 10px;
    font-size: 20px;
    color: #333;
    font-weight: 500;
  }
  & > div:last-child {
    color: #666;
    font-size: 12px;
  }
}
</style>
