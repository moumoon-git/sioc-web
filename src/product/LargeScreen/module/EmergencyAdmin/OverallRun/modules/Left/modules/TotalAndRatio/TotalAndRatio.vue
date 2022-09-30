<template>
  <div :class="$style.wrapper">
    <div :class="$style.container">
      <div :class="$style.warning" />
      <div :class="$style.mid">
        <div>总数</div>
        <div>
          <span
            v-for="(digit, index) in formatCount(countData.all || 0)"
            :key="index"
          >
            {{ digit }}
          </span>
          <span style="font-size: 24px;">个</span>
        </div>
      </div>
      <div :class="$style.right">
        <div v-if="Object.prototype.hasOwnProperty.call(countData, 'tbDelta')">
          同比：{{ Math.abs(countData.tbDelta) }}
          <span
            v-if="countData.tbDelta !== 0"
            :class="countData.tbDelta < 0 ? $style.down : $style.up"
          />
        </div>
        <div v-if="Object.prototype.hasOwnProperty.call(countData, 'hbDelta')">
          环比：{{ Math.abs(countData.hbDelta) }}
          <span
            v-if="countData.hbDelta !== 0"
            :class="countData.hbDelta < 0 ? $style.down : $style.up"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'TotalAndRatio',
  props: {
    countData: {
      type: Object as PropType<{
        all?: number,
        tbDelta?: number,
        tbNum?: number,
        hbDelta?: number,
        hbNum?: number,
      }>,
      default: () => ({}),
    },
  },
  setup() {
    function formatCount(rawValue: number | string): string[] {
      return Array.from(String(Math.min(Number(rawValue), 9999)).padStart(4, '0'));
    }
    return {
      formatCount,
    };
  },
});
</script>

<style lang="scss" module>
.wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}
.container {
  display: flex;
  align-items: center;
  height: 97px;
  box-sizing: border-box;
  border: 3px solid #32C5FF;
  background-image: linear-gradient(262deg, rgba(66,143,236,0.20) 0%, rgba(61,139,235,0.45) 98%);
  box-shadow: inset 0 0 16px 0 rgba(76, 200, 255, 0.40);
  border-radius: 48px;
  position: relative;
  margin: 0 auto;
  padding-left: 90px;
  width: calc(100% - 36px);
  color: #FFF;
  &::before,
  &::after {
    content: '';
    position: absolute;
    display: block;
    height: 97px;
    width: 40px;
    top: 50%;
    transform: translateY(-50%);
    background: no-repeat center/auto 100% url(./assets/imgs/aside.svg);
  }
  &::before {
    left: -25px;
  }
  &::after {
    right: -25px;
    transform: translateY(-50%) rotate(180deg);
  }
}
.warning {
  position: absolute;
  left: 8px;
  width: 76px;
  height: 76px;
  top: 50%;
  transform: translateY(-50%);
  background: no-repeat center/100% 100% url(./assets/imgs/ring.svg);
  display: flex;
  align-items: center;
  justify-items: center;
  @keyframes total-ratio-flip {
    0% { transform: scaleX(1); }
    10% { transform: scaleX(0); }
    20% { transform: scaleX(1); }
  }
  &::after {
    content: '';
    display: block;
    width: 39px;
    height: 36px;
    margin: 0 auto 5px;
    background: no-repeat center/100% 100% url(./assets/imgs/warning.svg);
    animation: total-ratio-flip infinite linear 5s;
  }
}
.mid {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div:first-child {
    font-size: 24px;
    margin-right: 20px;
  }
  & > div:last-child {
    display: flex;
    & > span {
      font-family: 'DIN';
      font-weight: 600;
      font-size: 36px;
      display: flex;
      width: 42px;
      height: 70px;
      align-items: center;
      justify-content: center;
      margin: 0 5px;
      background: no-repeat center/100% 100% url(./assets/imgs/digit.svg);
    }
  }
}
.right {
  flex-shrink: 0;
  margin: 0 24px;
  & > div {
    font-size: 24px;
    font-family: 'DIN';
  }
}
@mixin arrow {
  display: inline-block;
  width: 10px;
  height: 12px;
  margin-left: 5px;
  mask: no-repeat center/100% 100% url(./assets/imgs/arrow.svg);
  -webkit-mask: no-repeat center/100% 100% url(./assets/imgs/arrow.svg);
}
.down {
  @include arrow;
  background: #F66E6E;
}
.up {
  @include arrow;
  background: #0BD295;
  transform: rotate(180deg);
}
</style>
