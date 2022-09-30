<template>
  <div class="visualization-header-clock">
    <!-- 时间 -->
    <div class="visualization-header-clock__time">
      <span>
        {{ hours[0] }}
      </span>
      <span>
        {{ hours[1] }}
      </span>
      <!-- 分隔符 -->
      <i>:</i>
      <span>
        {{ minutes[0] }}
      </span>
      <span>
        {{ minutes[1] }}
      </span>
    </div>
    <!-- 日期 -->
    <div class="visualization-header-clock__date">
      <div>{{ day }}</div>
      <div>{{ today }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import clockinit from './script';

interface Data {
  date: Date;
}

export default defineComponent({
  name: 'Clock',
  setup() {
    const { date, hours, minutes, day, today, init } = clockinit();
    init(6);
    return {
      date,
      hours,
      minutes,
      day,
      today,
    };
  },
});
</script>

<style lang="scss">
@font-face {
  font-family: digit;
  src: url(./fonts/numStyle.ttf) format('truetype');
}
.visualization-header-clock {
  display: inline-block;
  user-select: none;
  // 时间
  &__time {
    display: inline-flex;
    width: 95px;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    // 数位
    & > span {
      font-family: digit;
      display: inline-block;
      width: 20px;
      height: 38px;
      line-height: 38px;
      background: no-repeat center/100% 100% url(./assets/background.svg);
      font-size: 40px;
      text-align: center;
      color: #ffffff;
    }
    // 分隔符
    & > i {
      font-family: digit;
      font-size: 30px;
      font-style: normal;
      color: #a6adb4;
      line-height: 1;
      animation: visualization-header-clock-flash infinite 1s;
      @keyframes visualization-header-clock-flash {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    }
  }
  // 日期
  &__date {
    display: inline-block;
    height: 38px;
    vertical-align: top;
    color: #a6adb4;
    font-size: 16px;
  }
}
</style>
