<template>
  <div :class="$style.container">
    <div>
      <span>特重大</span>
      <span>{{ renderData[0] }}</span>
    </div>
    <div>
      <span>重大</span>
      <span>{{ renderData[1] }}</span>
    </div>
    <div>
      <span>较大</span>
      <span>{{ renderData[2] }}</span>
    </div>
    <div>
      <span>一般</span>
      <span>{{ renderData[3] }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

export default defineComponent({
  name: 'HierarchicalStatistics',
  props: {
    listData: {
      type: Array as PropType<{
        name: string,
        num: number,
        code: number | string,
      }[]>,
      default: () => [],
    },
  },
  setup(props) {
    const renderData = computed(() => {
      const res = [0, 0, 0, 0];
      props.listData.forEach((item: { name: string, num: number }) => {
        switch (item.name) {
          case '特重大':
            res[0] = item.num;
            break;
          case '重大':
            res[1] = item.num;
            break;
          case '较大':
            res[2] = item.num;
            break;
          case '一般':
            res[3] = item.num;
            break;
          default:
        }
      });
      return res;
    });
    return {
      renderData,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  min-height: 174px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  padding: 20px 0;
  gap: 20px;
  box-sizing: border-box;
  align-items: center;
  color: #FFF;
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    font-size: 26px;
    font-weight: 500;
    border-radius: 4px;
    padding: 0 20px;
    animation: blink 5s infinite;
    & > span {
      font-size: 26px;
      font-weight: 500;
      &:last-child {
        font-family: "DIN";
        font-weight: 600;
      }
    }
    @keyframes blink {
      10% { color: transparent; }
      20% { color: #FFF; }
    }
    @keyframes fly-right {
      0% {
        left: -20%;
        opacity: 5%;
      }
      30% {
        left: 120%;
        opacity: 1%;
      }
    }
    position: relative;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      display: block;
      height: 100%;
      width: 40px;
      background: #FFF;
      box-shadow: 0 0 20px #FFF;
      transform: skewX(-10deg);
      left: 120%;
      top: 0;
      animation: fly-right 5s infinite normal ease-out;
    }
    &:nth-child(1) {
      border-left: 4px solid #D5374B;
      background: linear-gradient(270deg, rgba(226, 101, 81, 0.3) 0%, rgba(218, 57, 57, 0.6) 100%);
    }
    &:nth-child(2) {
      border-left: 4px solid #FF6E06;
      background: linear-gradient(270deg, rgba(255, 168, 46, 0.3) 0%, rgba(255, 129, 34, 0.6) 100%);
    }
    &:nth-child(3) {
      border-left: 4px solid #F2B626;
      background: linear-gradient(
        270deg,
        rgba(217, 162, 77, 0.19) 0%,
        rgba(230, 182, 86, 0.6) 100%
      );
    }
    &:nth-child(4) {
      border-left: 4px solid #32C5FF;
      background: linear-gradient(270deg, rgba(50, 197, 255, 0.3) 0%, rgba(50, 197, 255, 0.6) 100%);
    }
  }
}
</style>
