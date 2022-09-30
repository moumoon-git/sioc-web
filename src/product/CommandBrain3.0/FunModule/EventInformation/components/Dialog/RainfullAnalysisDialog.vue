<template>
  <div v-show="showRainfullAnalysisDialog" class="weather-dialog">
    <div class="weather-dialog__tips">
      <img src="./assets/svg/warning.svg" alt="" />
      <span class="tips">点击地图任意位置，查看该位置实时降雨信息</span>
      <img src="./assets/svg/close.svg" alt="" class="close" @click="handleClose" />
    </div>

    <div class="weather-dialog__location">
      <span class="location">{{ address }}</span>
    </div>

    <div class="weather-dialog__temperature">
      <img v-if="skyIcon" :src="skyIcon" alt="" class="skyIcon" />
      <img v-else src="@/common/weather/svg/weather/sunny.svg" alt="" class="skyIcon" />
      <div>
        <span class="temperature">{{ temperature }}</span>
        <span class="symbol">°C</span>
      </div>
    </div>

    <div class="weather-dialog__desription">
      {{ forecast_keypoint }}
    </div>

    <div class="weather-dialog__RainfullGraph">
      <RainfullGraph
        v-if="showRainfullGraph"
        :xData="hourList"
        :yData="humidity"
        :formatter="'{value} mm'"
      />
    </div>
  </div>
</template>

<script lang="ts">
const $weatherApi: any = require('@/common/weather/weatherApi.ts').default;
const $weather: any = require('@/common/weather/weather.ts').default;
import { defineComponent, onMounted, ref, watch, getCurrentInstance, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import RainfullGraph from '@/product/CommandBrain3.0/FunModule/EventInformation/components/Charts/RainfullGraph.vue';
export default defineComponent({
  name: 'RainfullAnalysisDialog',
  components: {
    RainfullGraph,
  },
  computed: {
    latLng() {
      return (this as any).$store.state.eventInformation.rainfullAnalysis.latLng;
    },
    address() {
      return (this as any).$store.state.eventInformation.rainfullAnalysis.address;
    },
    showRainfullAnalysisDialog() {
      return (this as any).$store.state.eventInformation.showRainfullAnalysisDialog;
    },
  },
  watch: {
    latLng: {
      handler(newVal, oldVal) {
        this.showRainfullGraph = false;
        this.handleGetCommonWeather(newVal); // 获取通用天气情况
      },
    },
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $location, $http }: any = instance?.appContext.config.globalProperties;
    const store: any = useStore();
    const showRainfullGraph = ref(false);
    const { getCommonWeather } = $weatherApi;
    // 温度
    const temperature = ref(0);
    const skyIcon = ref(require('@/common/weather/svg/weather/sunny.svg'));
    const hourList: any = ref([]);
    // 降雨量
    const humidity = ref([]);
    // 预测关键字
    const forecast_keypoint = ref('');

    /**
     * @description 获取时间 120分钟
     */
    function getHourly() {
      for (let i: any = 0; i <= 120; i++) {
        hourList.value.push({
          value: i + '分钟',
        });
      }
    }
    getHourly();

    /**
     * @description 获取通用天气情况
     */
    function handleGetCommonWeather(lnglat: string) {
      getCommonWeather(lnglat, {
        lang: 'zh_CN',
        unit: 'metric',
        hourlysteps: 2,
        // dailysteps: 1,
        // alert: true,
      }).then((res: any) => {
        console.log(res);
        showRainfullGraph.value = true;
        let result = res.data.result;
        forecast_keypoint.value = result.forecast_keypoint;
        // 降水量
        humidity.value = result.minutely.precipitation_2h.map((item: any) => {
          return {
            value: item.toFixed(2) || 0,
          };
        });
        // 温度
        temperature.value = parseInt(result.hourly.temperature[0].value);
        skyIcon.value = require('@/common/weather/svg/weather/' +
          $weather.getSkycon(result.hourly.skycon[0].value).icon +
          '.svg');
      });
    }
    /**
     * @description 关闭弹窗
     */
    function handleClose() {
      store.commit('eventInformation/SET_showRainfullAnalysisDialog', false);
      // 事件的经纬度
      (window as any).map.restoreDefaultStyle();
      (window as any).map.clearAtPresentMarkData('降雨分析');
    }

    // 地图
    function createMarker(longitude: number, latitude: number) {
      // 移除图层上所有的标记点
      removeMarker();
      // 创建图层
      (window as any).map.createdMarkCoverage('降雨分析').then((res: any) => {});
      // 落点
      (window as any).map.setOneMarker('降雨分析', {
        longitude: longitude,
        latitude: latitude,
        // imgInfo 落图标记设置
        wd: 48, //宽度 type Number
        hg: 47, //高度 type Number
        src: require('./assets/svg/mapIcon_rain.svg'), //图片路径 type String
        label: '',
        color: '', //颜色16进制
        fontSize: '', //字体大小
        textPosition: 'tp', //显示位置 'tp' 顶部 'bt' 底部
      });
    }

    function removeMarker() {
      (window as any).map.clearAtPresentMarkData('降雨分析');
    }

    onMounted(() => {
      const latLng = store.state.eventInformation.rainfullAnalysis.latLng;
      handleGetCommonWeather(latLng); // 获取通用天气情况
    })

    onBeforeUnmount(() => {
      handleClose();
    })
    return {
      hourList,
      humidity,
      skyIcon,
      handleGetCommonWeather,
      forecast_keypoint,
      showRainfullGraph,
      temperature,
      handleClose,
      createMarker,
      removeMarker,
    };
  },
});
</script>

<style lang="scss">
@import './assets/css/rainfullAnalysisDialog';
</style>
