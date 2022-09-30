<template>
  <div class="header-weather-container">
    <!-- 左边-天气图标 -->
    <div class="header-weather-container__left">
      <img :src="realtime.skyIcon.icon" alt="" class="header-weather-container__left__icon">
    </div>
    <!-- 右边-温度+天气 -->
    <div class="header-weather-container__right">
      <!-- 温度 -->
      <div class="header-weather-container__right__top">{{ realtime.temperature + '°C'}}</div>
      <!-- 天气描述 -->
      <div class="header-weather-container__right__bottom">
        <span class="skyIcon-name">{{ realtime.skyIcon.name }}</span>
        <span>{{ daily.temperature.min + '~' + daily.temperature.max + '°C' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount, nextTick } from 'vue'
const $weatherApi: any = require('@/common/weather/weatherApi.ts')
  .default;
const $weather: any = require('@/common/weather/weather.ts')
  .default;
const getLocation: any = require('@/product/CommandBrain3.0/FunModule/EventInformation/MonitoringWarning/components/Weather/assets/js/AMap/map.ts')
  .default;

export default defineComponent({
  name: 'HeaderWeather',
  setup() {
    const { getCommonWeather } = $weatherApi;
    // 实时天气
    const realtime = ref({
      temperature: 0,
      skyIcon: {
        name: '晴',
      },
    });
    // 日天气
    const daily = ref({
      temperature: {
        min: 0,
        max: 0,
        avg: 0,
      },
    });
    // 定时器
    const interval: any = ref();

    /**
     * @description 获取通用天气情况
     */
    function handleGetCommonWeather(lnglat: string) {
      getCommonWeather(lnglat, {
        lang: 'zh_CN',
        unit: 'metric',
        hourlysteps: 12,
        alert: true,
      }).then((res: any) => {
        let result = res.data.result;
        // 日天气
        const dailyWeather: any = ref({
          temperature: {
            min: parseInt(result.daily.temperature[0].min),
            max: parseInt(result.daily.temperature[0].max),
            avg: parseInt(result.daily.temperature[0].avg),
          },
        });
        Object.assign(daily.value, dailyWeather.value);
        // 实时的天气
        const realtimeWeather = ref({
          temperature: parseInt(result.realtime.temperature),
          skyIcon: {
            name: $weather.getSkycon(result.realtime.skycon).value,
            icon: require('./assets/svg/weather/' + $weather.getSkycon(result.realtime.skycon).icon + '.svg')
          },
        });
        Object.assign(realtime.value, realtimeWeather.value);
      });
    }

    /**
     * @description 获取定位
     */
    function getWeatherData() {
      // 平台经纬度
      nextTick(()=>{
        const longitude = (window as any).globalLon || document.cookie.match(/longitude=([^;]*)/)?.[1];
        const latitude = (window as any).globalLat || document.cookie.match(/latitude=([^;]*)/)?.[1];
        const lnglat = longitude + ',' + latitude;
        handleGetCommonWeather(lnglat);
      })

      // 注释原因：未升级https，获取浏览器定会经常失败
      // getLocation()
      //   .then((res: any) => {
      //     const lnglat = res.longitude + ',' + res.latitude;
      //     // 通用天气接口
      //     handleGetCommonWeather(lnglat);
      //   })
      // .catch();
    }


    onMounted(() => {
      getWeatherData()
      interval.value = setInterval(() => {
        console.log('定时更新天气数据');
        getWeatherData();
      }, 1000 * 60 * 10);
    })
    
    onBeforeUnmount(() => {
      // 清除定时器
      clearInterval(interval.value);
    })

    return {
      realtime,
      daily
    }
  }

})
</script>

<style lang="scss">
.header-weather-container {
  height: 100%;
  width: auto;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 20px;
  margin-left: 21px;

  &::before {
    left: 0;
    content: '';
    position: absolute;
    width: 1px;
    height: 40px;
    background: rgba(166, 173, 180, 0.1);
  }

  .header-weather-container__left {
    height: 100%;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 5px;

    .header-weather-container__left__icon {
      width: 43px;
      height: 30px;
    }
  }

  .header-weather-container__right {
    display: flex;
    flex-direction: column;

    .header-weather-container__right__top {
      font-size: 18px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 25px;
    }

    .header-weather-container__right__bottom {
      font-size: 18px;
      font-weight: 400;
      color: #A6ADB4;
      line-height: 22px;

      .skyIcon-name {
        margin-right: 5px;
      }
    }
  }

}
</style>