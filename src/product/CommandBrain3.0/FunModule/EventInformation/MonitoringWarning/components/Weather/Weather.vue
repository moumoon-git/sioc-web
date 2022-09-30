<template>
  <div
    class="weather-container"
  >
    <!-- 头部 -->
    <div class="weather-container-header">
      <!-- 项目现场当天的天气情况 -->
      <div class="weather-container-header-container">
        <!-- <div class="weather-container-header-container__left">
          <span class="context-font"> {{ cityName }} </span>
        </div> -->
        <div class="weather-container-header-container__right">
          <div class="weather-container-header-container__right__top">
            <span class="context-font">{{
              daily.skyIcon.name +
              '  ' +
              daily.temperature.min +
              '-' +
              daily.temperature.max +
              '°C'
            }}</span>
            <span class="division"></span>
            <span class="context-font">{{
              daily.wind.avg.direction +
              '  ' +
              daily.wind.min.level +
              '-' +
              daily.wind.max.level +
              '级'
            }}</span>
          </div>
          <span class="context-font">{{
            '降雨量' + daily.precipitation + 'mm/h'
          }}</span>
        </div>
      </div>
      <div class="event-address">{{ eventAddress }}</div>
      <!-- <div class="weather-container-header__division"></div> -->
    </div>

    <!-- 身体 -->
    <div
      class="weather-container-body"
      :style="{
        paddingBottom: expandedStatus === 'shrinking' ? '14px' : '0px',
      }"
    >
      <!-- 实时天气情况 -->
      <div
        class="weather-container-item"
        :style="{
          paddingBottom: expandedStatus === 'shrinking' ? '18px' : '14px',
        }"
      >
        <!-- 左边 -->
        <div class="weather-container-item__left">
          <!-- 温度 -->
          <div class="temperature">
            <span class="number">{{ realtime.temperature }}</span>
            <span class="unit">°C</span>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="weather-container-item__division"></div>

        <!-- 右边 -->
        <div class="weather-container-item__right">
          <div class="weather-container-item__right__top">
            <div class="sky-icon">
              <img
                v-if="realtime.skyIcon.icon"
                :src="realtime.skyIcon.icon"
                alt=""
              />
              <img v-else src="@/common/weather/svg/weather/sunny.svg" alt="" />
            </div>
            <span class="context-font" style="margin-right: 12px">{{
              realtime.skyIcon.name || '晴'
            }}</span>
            <div class="division-icon"></div>
            <!-- 降雨分析 -->
            <div class="switch-button">
              <span
                class="context-font"
                style="color: #56e9ff"
                @click="handleShowRainfullAnalysisDialog"
                >降雨分析</span
              >
              <!-- <Switch style="margin-left:6px" @change="handleChangeSwitch" /> -->
            </div>
          </div>
          <div class="weather-container-item__right__bottom">
            <span class="context-font">{{
              realtime.wind.direction + realtime.wind.level + '级'
            }}</span>
            <div class="division-icon"></div>
            <span class="context-font">{{ '湿度' + realtime.humidity }}</span>
            <div class="division-icon"></div>
            <a
              href="http://typhoon.nmc.cn/web.html"
              target="_blank"
              rel="noopener noreferrer"
              class="context-font"
              style="color: #56e9ff; text-decoration: none"
              >卫星云图</a
            >
          </div>
        </div>
      </div>

      <template v-if="expandedStatus === 'shrinking'">
        <div class="weather-container-graph-item">
          <!-- 24小时预报 -->
          <div class="weather-container-item__header">
            <div class="section-label">24小时预报</div>
            <div class="section-tabs">
              <span
                @click="switchGraphy('温度')"
                :class="
                  'section-tabs-item ' +
                  (activeType === '温度' ? 'section-tabs-item___active' : '')
                "
                >温度</span
              >
              <span
                @click="switchGraphy('降水量')"
                :class="
                  'section-tabs-item ' +
                  (activeType === '降水量' ? 'section-tabs-item___active' : '')
                "
                >降水量</span
              >
              <span
                @click="switchGraphy('风力风向')"
                :class="
                  'section-tabs-item ' +
                  (activeType === '风力风向'
                    ? 'section-tabs-item___active'
                    : '')
                "
                >风力风向</span
              >
            </div>
          </div>
          <template v-if="hourList.length > 0">
            <div style="width: 100%; height: 127px">
              <LineGraph
                v-if="activeType === '温度'"
                :box="'chart1'"
                :xData="hourList"
                :yData="hourlyTemperature"
                :formatter="'{value} °C'"
              />
              <LineGraph
                v-if="activeType === '降水量'"
                :box="'chart2'"
                :xData="hourList"
                :yData="hourlyPrecipitation"
                :formatter="'{value} mm'"
              />
              <LineGraph
                v-if="activeType === '风力风向'"
                :box="'chart3'"
                :xData="hourList"
                :yData="hourlyWind"
                :formatter="'{value} 级'"
              />
            </div>
          </template>
        </div>
        <div class="weather-container-graph-item">
          <!-- 未来五天预报 -->
          <div class="weather-container-item__header">
            <div class="section-label">未来五天预报</div>
          </div>
          <div class="weather-container-item__body">
            <div
              v-for="(item, index) in fiveDaysWeather"
              :key="item.day"
              class="five-days-weather"
            >
              <div v-if="index !== 0" class="five-days-weather-item">
                <!-- 明天，后天，周一，周二，周三 -->
                <div>
                  {{
                    index === 1
                      ? '明天'
                      : index === 2
                      ? '后天'
                      : '周' + item.day
                  }}
                </div>
                <div>{{ item.date }}</div>
                <div>
                  <img :src="item.icon" alt="" class="skyIcon" />
                </div>
                <div>{{ item.temperature.min + '-' + item.temperature.max + '°C' }}</div>
                <div>{{ '<' + item.wind.max.level + '级' }}</div>
                <div
                  v-if="index !== fiveDaysWeather.length - 1"
                  class="division"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 展开收缩按钮 -->
    <div class="weather-container-icon" @click="handleSwitchIcon">
      <div :class="`icon_${expandedStatus}`"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  getCurrentInstance,
} from 'vue';
import LineGraph from '@/product/CommandBrain3.0/FunModule/EventInformation/components/Charts/LineGraph.vue';
import Switch from '@/product/CommandBrain3.0/FunModule/EventInformation/components/Form/swtich/Switch.vue';
import { useStore } from 'vuex';
import { parseInt } from 'lodash';

const $weatherApi: any = require('@/common/weather/weatherApi.ts').default;
const $weather: any = require('@/common/weather/weather.ts').default;
const getLocation: any =
  require('@/product/CommandBrain3.0/FunModule/EventInformation/MonitoringWarning/components/Weather/assets/js/AMap/map.ts').default;
const $marker: any = require('@/product/CommandBrain3.0/FunModule/EventInformation/MonitoringWarning/components/Weather/assets/js/marker.ts');

export default defineComponent({
  name: 'Weather',
  components: {
    LineGraph,
    Switch,
  },
  computed: {
    eventId() {
      return (this as any).$store.state.event?.id;
    },
  },
  watch: {
    eventId: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getWeatherData();
        }
      },
    },
  },
  setup() {
    const store = useStore();
    const { getCommonWeather, getDailyWeather, getHourlyWeather } = $weatherApi;
    const instance = getCurrentInstance();
    const { $location, $http }: any = instance?.appContext.config.globalProperties;
    // 收缩展开
    const expandedStatus = ref('shrinking');
    // 项目所在城市
    const cityName = (window as any).config.cityName;
    // 事件的地址
    const eventAddress = ref('');
    console.log('项目所在城市', cityName)
    // 当前激活的图表类型
    const activeType = ref('温度');
    // 24小时
    const hourList: Array<string> = reactive([]);
    // 温度-24小时
    const hourlyTemperature: Array<any> = reactive([]);
    // 降水量-24小时
    const hourlyPrecipitation: Array<any> = reactive([]);
    // 风力风向-24小时
    const hourlyWind: Array<any> = reactive([]);

    // 未来五天天气
    const fiveDaysWeather: Array<any> = reactive([]);

    // 实时天气
    const realtime = ref({
      temperature: 0,
      humidity: '0%',
      wind: {
        direction: '',
        level: '0',
      },
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
      humidity: {
        min: '',
        max: '',
        avg: '',
      },
      wind: {
        min: {
          level: '0',
          direction: '',
        },
        max: {
          level: '0',
          direction: '',
        },
        avg: {
          level: '',
          direction: '',
        },
      },
      // 天气图标
      skyIcon: {
        name: '',
      },
      // 降雨量
      precipitation: '0',
    });


    // 切换收缩和展开按钮
    function handleSwitchIcon() {
      expandedStatus.value =
        expandedStatus.value === 'expanded' ? 'shrinking' : 'expanded';
    }

    /**
     * @description 获取事件地址
     */
    function getAddress() {
      const request = {
        method: 'get',
        url: '/event/event/info/getFirstEventDeal',
        params: {
          eventId: store.state.event?.id,
        },
      };
      $http(request)
        .then((response: any) => {
          console.log(response)
          if (response.errorcode === 0) {
            // 拿首报的落图地址
            eventAddress.value = response.data?.fallFigureAddress;
            console.log('落图地址', eventAddress.value)
          }
        })
    }

    /**
     * @description 获取定位
     */
    function getWeatherData() {
      getAddress();
      console.log('事件：', store.state.event)
      const lnglat = store.state.event?.longitude + ',' + store.state.event?.latitude;
      // 通用天气接口
      handleGetCommonWeather(lnglat);

      // 获取24小时的天气情况
      handleGetDailyWeather(lnglat);

      // 小时级预报接口
      handleGetHourlyWeather(lnglat);
      // getLocation()
      //   .then((res: any) => {
      //     const lnglat = res.longitude + ',' + res.latitude;
      //     getAddress(res.longitude, res.latitude);
      //     // 通用天气接口
      //     handleGetCommonWeather(lnglat);

      //     // 获取24小时的天气情况
      //     handleGetDailyWeather(lnglat);

      //     // 小时级预报接口
      //     handleGetHourlyWeather(lnglat);
      //   })
      //   .catch();
    }

    /**
     * @description 天级预报接口-未来五天的降雨分析
     */
    function handleGetDailyWeather(lnglat: string) {
      getDailyWeather(lnglat, {
        lang: 'zh_CN',
        unit: 'metric',
        dailysteps: 6,
      }).then((res: any) => {
        res.data.result.daily.temperature.forEach((el: any) => {
          fiveDaysWeather.push({
            day: $weather.getDay(new Date(el.date).getDay()),
            date:
              new Date(el.date).getMonth() +
              1 +
              '/' +
              new Date(el.date).getDate(),
            icon: '',
            temperature: {
              min: parseInt(el.min),
              max: parseInt(el.max),
            },
            wind: {
              max: {
                level: '',
              },
            },
          });
        });
        res.data.result.daily.skycon.forEach((el: any, index: number) => {
          // 天气图标
          fiveDaysWeather[
            index
          ].icon = require('@/common/weather/svg/weather/' +
            $weather.getSkycon(el.value).icon +
            '.svg');
        });
        res.data.result.daily.wind.forEach((el: any, index: number) => {
          // 风力风向
          fiveDaysWeather[index].wind.max.level = $weather.getWindLevel(
            el.max.speed,
          ).level;
        });
      });
    }
    /**
     * @description 小时级预报接口  获取24小时的天气情况
     */
    function handleGetHourlyWeather(lnglat: string) {
      getHourlyWeather(lnglat, {
        lang: 'zh_CN',
        unit: 'metric',
        hourlysteps: 24,
      }).then((res: any) => {
        // 温度
        res.data.result.hourly.temperature.forEach((el: any) => {
          hourlyTemperature.push({
            hour: new Date(el.datetime).getHours() + ':00',
            value: el.value,
          });
          hourList.push(new Date(el.datetime).getHours() + ':00');
        });

        // 降水量
        res.data.result.hourly.precipitation.forEach((el: any) => {
          hourlyPrecipitation.push({
            hour: new Date(el.datetime).getHours() + ':00',
            value: el.value.toFixed(2) === '0.00' ? 0 : el.value.toFixed(2),
          });
        });

        // 风力风向
        res.data.result.hourly.wind.forEach((el: any) => {
          hourlyWind.push({
            value: $weather.getWindLevel(el.speed).level,
            direction: $weather.getWindDirection(el.direction).direction + '风',
            hour: new Date(el.datetime).getHours() + ':00',
          });
        });
      });
    }

    /**
     * @description 获取通用天气情况
     */
    function handleGetCommonWeather(lnglat: string) {
      getCommonWeather(lnglat, {
        lang: 'zh_CN',
        unit: 'metric',
        hourlysteps: 24,
        dailysteps: 1,
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
          humidity: {
            min: result.daily.humidity[0].min.toFixed(2) + '%',
            max: result.daily.humidity[0].max.toFixed(2) + '%',
            avg: result.daily.humidity[0].avg.toFixed(2) + '%',
          },
          wind: {
            min: {
              level: $weather.getWindLevel(result.daily.wind[0].min.speed)
                .level,
              direction:
                $weather.getWindDirection(result.daily.wind[0].min.direction)
                  .direction + '风',
            },
            max: {
              level: $weather.getWindLevel(result.daily.wind[0].max.speed)
                .level,
              direction:
                $weather.getWindDirection(result.daily.wind[0].max.direction)
                  .direction + '风',
            },
            avg: {
              level: $weather.getWindLevel(result.daily.wind[0].avg.speed)
                .level,
              direction:
                $weather.getWindDirection(result.daily.wind[0].avg.direction)
                  .direction + '风',
            },
          },
          skyIcon: {
            name: $weather.getSkycon(result.daily.skycon[0].value).value,
          },
          precipitation: result.daily.precipitation[0].avg,
        });
        Object.assign(daily.value, dailyWeather.value);

        // 实时的天气
        const realtimeWeather = ref({
          temperature: parseInt(result.realtime.temperature),
          humidity: result.realtime.humidity.toFixed(2) + '%',
          wind: {
            direction:
              $weather.getWindDirection(result.realtime.wind.direction)
                .direction + '风',
            level: $weather.getWindLevel(result.realtime.wind.speed).level,
          },
          skyIcon: {
            name: $weather.getSkycon(result.realtime.skycon).value,
            icon: require('@/common/weather/svg/weather/' +
              $weather.getSkycon(result.realtime.skycon).icon +
              '.svg'),
          },
        });
        Object.assign(realtime.value, realtimeWeather.value);
      });
    }

    /**
     * @description 切换图表
     */
    function switchGraphy(label: string) {
      activeType.value = label;
    }

    /**
     * @description 显示降雨分析弹窗
     */
    function handleShowRainfullAnalysisDialog() {
      // 初始化降雨分析弹窗的数据
      const latLng =
        store.state.event?.longitude + ',' + store.state.event?.latitude;
      store.commit('eventInformation/SET_rainfullAnalysis', {
        latLng: latLng,
        address: eventAddress.value,
      });

      // 显示降雨分析弹窗
      store.commit('eventInformation/SET_showRainfullAnalysisDialog', true);

      // 根据事件的经纬度创建落点
      createMarker(store.state.event?.longitude, store.state.event?.latitude);

      // 设置鼠标样式
      (window as any).map.setMouseStyle(
        require('./assets/svg/mapIcon_rain.svg'),
      );

      // 开启点击获取落点信息
      (window as any).map.clickDroppoint(function (res: any) {
        // 显示弹窗的时候，才落点
        if(store.state.eventInformation.showRainfullAnalysisDialog) {
          store.commit('eventInformation/SET_rainfullAnalysis', {
            latLng:
              res.mapLocation.longitude + ',' + res.mapLocation.latitude,
            address: res.res.result.formatted_address.length > 0 ? res.res.result.formatted_address : '',
          });
          createMarker(res.mapLocation.lon, res.mapLocation.lat);
        }
      });
    }

    /**
     * @description 切换开关
     */
    function handleChangeSwitch(type: string) {
      if (type === 'active') {
        (window as any).map.setMouseStyle(
          require('./assets/svg/mapIcon_rain.svg'),
        );
        // 开启点击获取落点信息
        (window as any).map.clickDroppoint(function (res: any) {
          store.commit('eventInformation/SET_rainfullAnalysis', {
            latLng:
              res.transform.res.longitude + ',' + res.transform.res.latitude,
            address: res.res.result.formatted_address,
          });
          createMarker(res.mapLocation.lon, res.mapLocation.lat);
        });
      } else {
        removeMarker();
        (window as any).map.restoreDefaultStyle();
      }
    }

    // 地图
    function createMarker(longitude: number, latitude: number) {
      // 移除图层上所有的标记点
      removeMarker();
      // 创建图层
      (window as any).map
        .createdMarkCoverage('降雨分析')
        .then((res: any) => {});
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
        textPosition: '', //显示位置 'tp' 顶部 'bt' 底部
      });
    }

    /**
     * @description 移除落点
     */
    function removeMarker() {
      (window as any).map.clearAtPresentMarkData('降雨分析');
      (window as any).map.clearDeleteCoverage('降雨分析')
    }
    onMounted(() => {
      getWeatherData();
      // 事件的经纬度
      store.commit('eventInformation/SET_rainfullAnalysis', {
        latLng: store.state.event?.longitude + ',' + store.state.event?.latitude,
        address: eventAddress.value,
      });
    });
    return {
      expandedStatus,
      handleSwitchIcon,
      daily,
      realtime,
      hourList,
      hourlyTemperature,
      hourlyPrecipitation,
      hourlyWind,
      activeType,
      switchGraphy,
      fiveDaysWeather,
      handleChangeSwitch,
      handleShowRainfullAnalysisDialog,
      getWeatherData,
      cityName,
      eventAddress
    };
  },
});
</script>

<style lang="scss">
@import './assets/css/weather.scss';
</style>
