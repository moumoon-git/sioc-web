<template>
  <div class="map-poi-container">
    <!-- 导航栏 -->
    <header>
      <NavBar :config="navBarConfig" />
    </header>
    <main>
      <div id="appMap" />
      <Button class="confirm-button" @click="onConfirm">
        确定
      </Button>
    </main>
    <footer>
      <div class="search-input">
        <van-field v-model="searchAddress" label="" placeholder="搜索地点或地名" @input="autoInput"/>
      </div>
      <van-loading v-if="loading" size="0.36rem" color="#0094ff" class="reset-loading">定位中...</van-loading>
      <ul v-else class="address-list">
        <li
          v-for="(item, index) in addressList"
          class="address-item"
          @click="selectedLocation(item, index)"
        >
          <div
            :class="'address-item-top ' + (activeIndex === index ? 'address-item-top--active' : '')"
          >
            {{ item.address }}
          </div>
          <div
            :class="
              'address-item-bottom ' + (activeIndex === index ? 'address-item-bottom--active' : '')
            "
          >

            {{ item.distance ? item.distance + '米内' : item.area }} | {{ item.street }}
          </div>
          <div v-if="index === 0" class="address-item-tag">当前位置</div>
          <div v-if="activeIndex === index && index !== 0" class="address-item--tick" />
        </li>
      </ul>
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, getCurrentInstance } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import { useRouter } from 'vue-router';
const MapLoader: any = require('@/product/SIOC-H5/mainCapacity/AMap/AMap').default;
const LonLatT: any = require('@/capacity/mapJs/LonLatTransform').default;
const handleLocation = require('@/product/SIOC-H5/mainCapacity/Location/location').default;
const pathPlanning: any = require('@/capacity/mapJs/pathPlanning.js').default;
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import {useStore} from 'vuex';
export default defineComponent({
  name: 'AmapNavigation',
  components: {
    NavBar,
    Button
  },
  watch: {
    activeIndex: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
        if (oldVal) {
          // 移除上一个标记点
          this.GDMap.remove(this.markList[oldVal]);
        }
      },
      deep: true,
      immediate: true,
    }
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { GDLocation } = handleLocation();
    const instance = getCurrentInstance();
    const { $location }: any = instance?.appContext.config.globalProperties;
    const GDMap: any = ref();
    const GDMapFun: any = ref();
    // 导航栏配置
    const navBarConfig = ref({
      title: '任务地点',
      type: 'left',
      path: '',
    });
    // 加载
    const loading = ref(true);
    // 起点 当前定位的地址
    const origin = ref({
      address: '', // 地址
      latitude: '', // 纬度
      longitude: '', // 经度
      street: '', // 街道
      distance: 0, // 范围
      transFromLonLat: ''
    });

    // 搜索地点
    const searchAddress = ref('');
    const addressList = ref<any[]>([]);
    const activeIndex = ref(0);
    // 标记点
    const markList: any = ref([]);
    const markIcon = `<div class="icon-mark" />`;

    const mapFun = new (window as any).HM().init();
    /**
     * @description 自动搜索
     */
    function autoInput(){
      // 输入框没有内容就搜索当前地址
      if (!searchAddress.value) {
        // 获取当前定位
        getCurrentLocation();
        return;
      }
      loading.value = true;
      mapFun.searchPOIdata(searchAddress.value, 'GD').then((res: any) => {
        loading.value = false;
        console.log('搜索：', res)
        // 初始化列表
        let pointList: any = [];
        markList.value = [];
        res.forEach((el: any) => {
            pointList.push({
              address: el.name, // 地址
              latitude: Number(el.location.split(',')[1]), // 纬度
              longitude: Number(el.location.split(',')[0]), // 经度
              street: el.address, // 街道
              distance: '' , // 范围
              area: el.province + el.city + el.area, // 范围
              transFromLonLat: el.transFromLonLat,
            });
            // 标记点
            const mark: any = new GDMapFun.value.Marker({
              position: new GDMapFun.value.LngLat(Number(el.location.split(',')[0]), Number(el.location.split(',')[1])), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: el.name,
              content: markIcon,
            });
            markList.value.push(mark);
            // 添加标记点
          });
          GDMap.value.add(markList.value[0]);
          GDMap.value.setFitView(markList.value[0]);
          activeIndex.value = 0;

          addressList.value = [...pointList] as any;
      })
      
    }


    /**
     * @param range 范围
     * @description 获取当前定位
     */
    function getCurrentLocation() {
      return new Promise(resolve => {
        GDLocation().then((res: any) => {
          origin.value.address = res.address;
          origin.value.latitude = res.latitude;
          origin.value.longitude = res.longitude;
          origin.value.street =
            res.res?.regeocode?.addressComponent?.streetNumber?.street +
              res?.res?.regeocode?.addressComponent?.streetNumber?.number || '';
          origin.value.distance =
            Math.round(Number(res?.res?.regeocode?.addressComponent?.streetNumber?.distance)) || 0;
          loading.value = false;
          console.log('起点：', origin.value);
          console.log(
            `高德-当前所在地址-起点:${res.address},${origin.value.latitude},${origin.value.longitude}`,
          );
          
          let pointList = [];
          pointList.push(origin.value);
          
          // 给当前定位添加标记点
          const mark0: any = new GDMapFun.value.Marker({
            position: new GDMapFun.value.LngLat(origin.value.longitude, origin.value.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: origin.value.address,
            content: markIcon,
          });
          markList.value.push(mark0);
          GDMap.value.add(mark0);
          GDMap.value.setFitView(mark0);
          activeIndex.value = 0;
          GDTrTDT(origin.value.longitude, origin.value.latitude).then((res: any) => {
            console.log(res)
            origin.value.transFromLonLat = res.longitude + ',' + res.latitude;
          })

          res.res?.regeocode?.pois.forEach((el: any) => {
            pointList.push({
              address: el.name, // 地址
              latitude: Number(el.location.split(',')[1]), // 纬度
              longitude: Number(el.location.split(',')[0]), // 经度
              street: el.address, // 街道
              distance: Math.round(Number(el.distance)), // 范围
              transFromLonLat: null // 天地图坐标
            });
            // 标记点
            const mark: any = new GDMapFun.value.Marker({
              position: new GDMapFun.value.LngLat(Number(el.location.split(',')[0]), Number(el.location.split(',')[1])), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: el.name,
              content: markIcon,
            });
            markList.value.push(mark);
            // // 添加标记点
            // GDMap.value.add(mark);
          });
          addressList.value = [...pointList];
          console.log(addressList.value)

          resolve({
            longitude: res.longitude,
            latitude: res.latitude,
            address: res.latitude,
          });
        });
      });
    }

    /**
     * @description 初始化地图
     */
    function initMap() {
      // 高德地图
      MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
        (AMap: any) => {
          console.log('地图加载成功');
          const map: any = new AMap.Map('appMap', {
            resizeEnable: true,
            zoom: 15, //地图显示的缩放级别
          });
          (window as any).initMap();
          GDMap.value = map;
          GDMapFun.value = AMap;
          // 获取当前定位
          getCurrentLocation()
          // 同时引入工具条插件，比例尺插件和鹰眼插件
          AMap.plugin(
            ['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType', 'AMap.Geolocation'],
            function() {
              // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
              map.addControl(new AMap.ToolBar());

              // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
              map.addControl(new AMap.Scale());

              // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
              // map.addControl(new AMap.OverView({isOpen:true}));

              // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
              // map.addControl(new AMap.MapType());

              // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
              map.addControl(
                new AMap.Geolocation({
                  enableHighAccuracy: true, //是否使用高精度定位，默认:true
                  timeout: 10000, //超过10秒后停止定位，默认：无穷大
                  maximumAge: 0, //定位结果缓存0毫秒，默认：0
                  convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                  showButton: true, //显示定位按钮，默认：true
                  buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                  buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                  showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                  showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                  panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                  zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                }),
              );
            },
          );
        },
        (e: any) => {
          console.log('地图加载失败', e);
        }
      );
    }

    /**
     * @description 经纬度转换
     */
    function tdtTrGd(lng: any, lat: any) {
      return new Promise((resolve, reject) => {
        const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'TTG').split(',');
        const obj = {
          longitude: Number(data[0]),
          latitude: Number(data[1]),
        };
        resolve(obj);
      });
    }

    /**
     * @description 天地图转百度
     */
    function tdtTrBD(lng: any, lat: any) {
      return new Promise((resolve, reject) => {
        const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'TTB').split(',');
        const obj = {
          longitude: Number(data[0]),
          latitude: Number(data[1]),
        };
        resolve(obj);
      });
    }

    /**
     * @description 高德转天地图
     */
    function GDTrTDT(lng: any, lat: any) {
      return new Promise((resolve, reject) => {
        const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'GD').split(',');
        const obj = {
          longitude: Number(data[0]),
          latitude: Number(data[1]),
        };
        resolve(obj);
      });
    }

    /**
     * @description 选中地址
     */
    function selectedLocation(item: any, index: number) {
      console.log('选中点', item);
      activeIndex.value = index;
      addMark(item, index);
      GDTrTDT(item.longitude, item.latitude).then((res: any) => {
        console.log(res)
        Object.assign(addressList.value[index], {
          transFromLonLat: (res.longitude + ',' + res.latitude) || ''
        })
      })
    }
    
    /**
     * @description 添加标记点
     */
    function addMark(item: any, index: number) {
      const mark: any = new GDMapFun.value.Marker({
        position: new GDMapFun.value.LngLat(item.longitude, item.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: item.address,
        content: markIcon,
      });
      GDMap.value.add(mark);
      GDMap.value.setFitView(markList.value[index]);
    }

    /**
     * @description 确定
     */
    function onConfirm() {
      if (!loading.value) {
        console.log(addressList.value[activeIndex.value])
        if (addressList.value[activeIndex.value]?.transFromLonLat) {
          store.commit('task/setTaskLocation', addressList.value[activeIndex.value])
        } else {
          store.commit('task/setTaskLocation', {
            address: '', // 地址
            latitude: '', // 纬度
            longitude: '', // 经度
            street: '', // 街道
            distance: 0, // 范围
            transFromLonLat: ''
          })
        }
      }
      // 测试使用
      // store.commit('task/setTaskLocation', 
      //   {
      //     address: "广东省广州市海珠区凤阳街道珠江针织大厦A1栋珠江国际纺织城",
      //     distance: 13,
      //     latitude: 23.08291,
      //     longitude: 113.29985,
      //     street: "南一街10111号",
      //     transFromLonLat: "113.29447851770018,23.085565842595148",
      //   }
      // )
      console.log('task', store.state.task)
      router.push({
        path: '/UpdateTask'
      })
    }
    onMounted(() => {
      initMap(); // 地图初始化
    });

    return {
      navBarConfig,
      location,
      origin,
      loading,
      searchAddress,
      addressList,
      selectedLocation,
      activeIndex,
      GDMap,
      GDMapFun,
      markList,
      autoInput,
      onConfirm
    };
  },
});
</script>

<style lang="scss">
@use './assets/css/index.scss';
</style>
