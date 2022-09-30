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
      id="main"
      :class="$style.main"
    />
    <!-- <div :class="$style.main">
      <div>{{ total }}</div>
      <div>总数</div> -->
    <!-- 四角文字 -->
    <!-- <div :class="$style.leftTopText">
      <div>{{ data?.[0]?.value ?? '-' }}</div>
      <div>{{ data?.[0]?.key ?? '-' }}</div>
    </div>
    <div :class="$style.rightTopText">
      <div>{{ data?.[1]?.value ?? '-' }}</div>
      <div>{{ data?.[1]?.key ?? '-' }}</div>
    </div>
    <div :class="$style.leftBottomText">
      <div>{{ data?.[2]?.value ?? '-' }}</div>
      <div>{{ data?.[2]?.key ?? '-' }}</div>
    </div>
    <div :class="$style.rightBottomText">
      <div>{{ data?.[3]?.value ?? '-' }}</div>
      <div>{{ data?.[3]?.key ?? '-' }}</div>
    </div> -->
    <!-- 四角折线 -->
    <!-- <svg
        :class="$style.leftTopLine"
        width="100px"
        height="25px"
        viewBox="0 0 100 25"
      >
        <polyline
          points="0,0 80,0 100,25"
          fill="none"
          stroke="#E7ECF3"
          stroke-width="1px"
        />
      </svg>
      <svg
        :class="$style.leftBottomLine"
        width="100px"
        height="25px"
        viewBox="0 0 100 25"
      >
        <polyline
          points="0,25 80,25 100,0"
          fill="none"
          stroke="#E7ECF3"
          stroke-width="1px"
        />
      </svg>
      <svg
        :class="$style.rightTopLine"
        width="100px"
        height="25px"
        viewBox="0 0 100 25"
      >
        <polyline
          points="0,25 20,0 100,0"
          fill="none"
          stroke="#E7ECF3"
          stroke-width="1px"
        />
      </svg>
      <svg
        :class="$style.rightBottomLine"
        width="100px"
        height="25px"
        viewBox="0 0 100 25"
      >
        <polyline
          points="0,0 20,25 100,25"
          fill="none"
          stroke="#E7ECF3"
          stroke-width="1px"
        />
      </svg>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, onMounted } from 'vue';
import * as echarts from 'echarts/core';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ButtonSet from '../../../ButtonSet/ButtonSet.vue';

echarts.use([TreemapChart, CanvasRenderer]);
export default defineComponent({
  name: 'CardGraph',
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
    data.value.length = 4;
    const total = computed(() => data.value.reduce(
      (sum: number, item: { value: number }) => sum + item.value,
      0,
    ));

    // 绘画图表
    function drawCard() {
      const chartDom = document.getElementById('main');
      const myChart = echarts.init(chartDom as any);
      let sum = 0;
      data.value.forEach((item: any) => {
        item.name = `${item.name} ${item.value}`;
        sum += item.value;
      });
      data.value.push({
        name: `总数 ${sum}`,
        value: sum,
      });
      const option = {
        // color: ['#2d98fa', '#91cc75', '#fe6f6f', '#ffdc60'],
        tooltip: {
          formatter: '{b}',
        },
        series: [
            {
              type: 'treemap',
              nodeClick: false,
              roam: false,
              data: data.value,
              breadcrumb: {
                show: false,
              },
            },
        ],
      };
      myChart.setOption(option);
      console.log('1',data.value)
    }

    onMounted(drawCard);
    /**
     * 点击按钮
     *
     * @param buttonType 按钮类型
     */
    function handleClick(buttonType: 'edit' | 'delete') {
      emit(buttonType);
    }
    return {
      handleClick,
      total,
    };
  },
});
</script>

<style lang="scss" module>
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
    border-left: 2px solid #0091ff;
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
.main{
  height: 300px;
  width: 400px;
  padding: 10px;
  box-sizing: border-box;
}
// .main {
//   background: #2d98fa;
//   color: #fff;
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   box-shadow: 0 0 0 25px #f3f8ff;
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
//   &::before {
//     content: '';
//     width: 100%;
//     height: 100%;
//     display: block;
//     position: absolute;
//     left: 0;
//     top: 0;
//     border-radius: 100%;
//     box-shadow: 0 0 10px #2d98fa;
//   }
//   & > div:first-child {
//     font-size: 26px;
//     font-weight: bold;
//     white-space: nowrap;
//   }
//   & > div:nth-child(2) {
//     color: #d8e9ff;
//     white-space: nowrap;
//   }
//   // 四角文字
//   .leftTopText,
//   .leftBottomText,
//   .rightTopText,
//   .rightBottomText {
//     position: absolute;
//     & > div:first-child {
//       color: #333;
//       font-size: 20px;
//       font-weight: 500;
//     }
//     & > div:last-child {
//       color: #666;
//     }
//   }
//   .leftTopText {
//     left: -90px;
//     top: -60px;
//   }
//   .rightTopText {
//     right: -90px;
//     top: -60px;
//     text-align: right;
//   }
//   .leftBottomText {
//     left: -90px;
//     bottom: -55px;
//   }
//   .rightBottomText {
//     right: -90px;
//     bottom: -55px;
//     text-align: right;
//   }
//   // 四角折线
//   .leftTopLine {
//     position: absolute;
//     left: 10px;
//     top: -5px;
//     transform: translate(-100%, 0);
//   }
//   .leftBottomLine {
//     position: absolute;
//     left: 10px;
//     bottom: -5px;
//     transform: translate(-100%, 0);
//   }
//   .rightTopLine {
//     position: absolute;
//     right: 10px;
//     top: -5px;
//     transform: translate(100%, 0);
//   }
//   .rightBottomLine {
//     position: absolute;
//     right: 10px;
//     bottom: -5px;
//     transform: translate(100%, 0);
//   }
// }
</style>
