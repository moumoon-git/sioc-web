<template>
  <div :class="$style.Clock">
    <!-- 日期 -->
    <div :class="$style.clock__date">{{ today.replace(/\//gi, '.') }}</div>
    <!-- 时间 -->
    <div :class="$style.clock__time">
      {{ `${hours[0]}${hours[1]}:${minutes[0]}${minutes[1]}:${second}` }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import clockinit from '@/product/CommandBrain3.0/Generalparts/header/Clock/script';

export default defineComponent({
  setup() {
    const { date, hours, minutes, second, day, today, init } = clockinit();
    init(1);
    return {
      date,
      hours,
      minutes,
      second,
      day,
      today,
    };
  },
});
</script>

<style lang="scss" module>
.Clock {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.clock__date {
  font-size: 32px;
  font-family: 'DIN';
  font-weight: bold;
  color: #ffffff;
  line-height: 39px;
  margin-bottom: 4px;
}
.clock__time {
  width: 115px;
  height: 30px;
  // background: #1f4d9b;
  font-size: 24px;
  text-align: center;
  font-family: 'DIN';
  font-weight: 400;
  color: #ffffff;
  line-height: 29px;
}
</style>