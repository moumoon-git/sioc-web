<template>
  <div :class="$style.Weather" v-show="avgTemperature && windDirectionVal">
    <!-- 温度 -->
    <div :class="$style.temperature">{{ avgTemperature }}°</div>
    <!-- 图标 -->
    <div :class="$style.weatherIcon">
      <img :src="weathIcon.src" alt="" />
    </div>
    <!-- 风力和天气 -->
    <div :class="$style.wind">
      <span>{{ windDirectionVal }}风{{ windVal.level }}级</span>
      <h1>{{ weathIcon.value }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import weatherApi from '@/common/weather/weatherApi';
import weather from '@/common/weather/weather';
// const weatherApi: any = require('@/common/weather/weatherApi.ts').default;

export default defineComponent({
  setup() {
    const { getCommonWeather } = weatherApi;
    const longitude = document.cookie.match(/longitude=([^;]*)/)?.[1];
    const latitude = document.cookie.match(/latitude=([^;]*)/)?.[1];
    // 当前温度
    const avgTemperature = ref<string | any>('');
    // 天气图标
    const weathIcon = ref<object | any>('');
    // 风力
    const windVal = ref<object | any>({});
    // 风向
    const windDirectionVal = ref<string | any>({});
    const interVal = ref<any>('');
    function getWeatherData() {
      getCommonWeather(`${longitude},${latitude}`, {
      lang: 'zh_CN',
      unit: 'metric',
      dailysteps: 6,
    }).then((res: any) => {
      if (res.data && res.data.result) {
        const daily = res.data.result?.daily || '';
        const realtime = res.data.result?.realtime || '';
        if (!daily) {
          return;
        }
        const weath =
          daily.skycon && Array.isArray(daily.skycon)
            ? daily.skycon[0].value
            : '';
        const weathObj = weather.getSkycon(weath);
        // 图标
        weathIcon.value = weathObj || {};
        weathIcon.value.src = require(`@/common/weather/svg/weather/${weathObj.icon}.svg`);
        // 温度
        avgTemperature.value = realtime.temperature;
        const windNum: number =
          realtime.wind
            ? Math.floor(Number(realtime.wind.speed))
            : 0;
        // 风力
        windVal.value = weather.getWindLevel(windNum);
        // 风向
        const windDirection =
          realtime.wind
            ? Math.floor(Number(realtime.wind.direction))
            : 0;
        windDirectionVal.value =
          weather.getWindDirection(windDirection).direction;
      }
    });
    }
    // 10分钟左右调用一次
    function setTimer() {
      interVal.value = setInterval(()=>{
        getWeatherData();
      },600000);
    }
    onBeforeUnmount(()=>{
      clearInterval(interVal.value);
      interVal.value = null;
      interVal.value = '';
    });
    onMounted(()=>{
      setTimer();
      getWeatherData();
    });
    return {
      weathIcon,
      avgTemperature,
      windVal,
      windDirectionVal,
    };
  },
});
</script>

<style lang="scss" module>
.Weather {
  display: flex;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 58px;
    top: 0;
    bottom: 0;
    right: -24px;
    margin: auto;
    background: #ffffff;
  }
}
.temperature {
  font-size: 48px;
  font-family: 'DIN';
  font-weight: bold;
  color: #ffffff;
  line-height: 59px;
}
.weatherIcon {
  margin-left: 7px;
  margin-right: 14px;
  width: 52px;
  height: 52px;
  & > img {
    width: 100%;
    height: 100%;
  }
}
.wind {
  & > span {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
  }
  & > h1 {
    margin: 0;
    margin-top: 2px;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
  }
}
</style>
