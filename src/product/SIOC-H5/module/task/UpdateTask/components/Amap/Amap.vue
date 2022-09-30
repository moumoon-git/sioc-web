<template>
  <div class="map-container">
    <!-- 导航栏 -->
    <header>
      <NavBar :config="navBarConfig" />
    </header>
    <main>
      <div id="appMap" />
    </main>
    <footer>
      <div class="address">{{ location.address }}</div>
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import { useStore } from 'vuex';
const MapLoader: any =
  require('@/product/SIOC-H5/mainCapacity/AMap/AMap').default;
const LonLatT: any = require('@/capacity/mapJs/LonLatTransform').default;

export default defineComponent({
  name: 'AppMap',
  components: {
    NavBar,
  },
  setup() {
    const store = useStore();
    // 导航栏配置
    const navBarConfig = ref({
      title: '任务地点',
      type: 'left',
      path: '',
    });
    const location: any = store.state.reserve.location || {
      address: '',
      longitude: '',
      latitude: '',
    };

    /**
     * @description 初始化地图
     */
    function initMap() {
      // 经纬度转换：因为天地图和高德地图的定位不一样，所以要做转换
      const lngLat: any = ref();
      tdtTrGd(location.longitude, location.latitude).then((res: any) => {
        lngLat.value = res;
      });
      // 高德地图
      MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
        (AMap: any) => {
          console.log('地图加载成功');
          const map: any = new AMap.Map('appMap', {
            resizeEnable: true,
            center: [lngLat.value.longitude, lngLat.value.latitude],
            zoom: 15, //地图显示的缩放级别
          });
          (window as any).initMap();
          // 创建一个 Marker 实例：
          const marker: any = new AMap.Marker({
            position: new AMap.LngLat(
              lngLat.value.longitude,
              lngLat.value.latitude,
            ), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: location.address,
          });
          map.add(marker);

          // 同时引入工具条插件，比例尺插件和鹰眼插件
          AMap.plugin(
            [
              'AMap.ToolBar',
              'AMap.Scale',
              'AMap.OverView',
              'AMap.MapType',
              'AMap.Geolocation',
            ],
            function () {
              // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
              map.addControl(new AMap.ToolBar());

              // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
              map.addControl(new AMap.Scale());

              // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
              // map.addControl(new AMap.OverView({isOpen:true}));

              // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
              map.addControl(new AMap.MapType());

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
        },
      );
    }

    // 经纬度转换
    /**
     * @description 经纬度转换
     */
    function tdtTrGd(lng: any, lat: any) {
      return new Promise((resolve, reject) => {
        const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'TTG').split(
          ',',
        );
        const obj = {
          longitude: Number(data[0]),
          latitude: Number(data[1]),
        };
        resolve(obj);
      });
    }

    // 超图
    // function initMap() {
    //   const map: any = new (window as any).HM().init('appMap');
    //   (window as any).map = map;
    // }

    onMounted(() => {
      initMap(); // 地图初始化
    });

    return {
      navBarConfig,
      location,
    };
  },
});
</script>

<style lang="scss">
.map-container {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f7fa;
}
header {
  width: 100%;
}
main {
  flex: 1;
  #appMap {
    height: 100%;
    width: 100vw;
  }
}
footer {
  width: 100%;
  height: auto;
  padding: 0.4rem 0;

  .address {
    padding: 0 0.4rem;
    font-size: 0.36rem;
  }
}
</style>
