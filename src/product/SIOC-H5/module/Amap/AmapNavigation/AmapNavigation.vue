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
      <div class="address-container">
        <!-- 起点 -->
        <div class="origin">
          <van-loading v-if="loading" size="0.30rem" color="#0094ff">定位中...</van-loading>
          <template v-else>{{ !origin.address ? '暂无定位' : origin.address }}</template>
        </div>
        <!-- 终点 -->
        <div class="destination">{{ destination.address }}</div>
      </div>

      <div class="button-list">
        <Button class="reset-button-style" @click="openGDClient">
          <img src="../assets/images/GDMap.svg" alt="" class="icon-map" />
          高德导航
        </Button>
        <Button class="reset-button-style" @click="openBDClient">
          <img src="../assets/images/BDMap.svg" alt="" class="icon-map" />
          百度导航
        </Button>
      </div>
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

export default defineComponent({
  name: 'AmapNavigation',
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const { GDLocation } = handleLocation();
    const instance = getCurrentInstance();
    const { $location }: any = instance?.appContext.config.globalProperties;
    // 导航栏配置
    const navBarConfig = ref({
      title: '地图定位',
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
    });
    // 终点
    const destination = ref({
      address: '', // 地址
      latitude: '', // 纬度
      longitude: '', // 经度
    });

    // 起点图标
    const originIcon = `<div class="icon-origin" />`;
    const destinationIcon = `<div class="icon-destination" />`;

    const mapTypeObj = 'GDPath';

    // 百度地图-经纬度
    const BDLng = ref({
      latitude: '', // 纬度
      longitude: '', // 经度
    })

    /**
     * @description 路径规划
     */
    function GDpathPlanning(AMap: any, map: any) {
      const planningFun = pathPlanning[mapTypeObj];
      const obj = {
        origin: origin.value.longitude + ',' + origin.value.latitude, // 起点
        destination: destination.value.longitude + ',' + destination.value.latitude, // 终点
        // waypoints:116.357483,39.907234    途径点
      };
      planningFun.drivePathFun(obj).then((res: any) => {
        console.log('路径规划1：', res);
        const { data } = res;
        if (data.route && data.route.paths) {
          let polylineList: any = [];
          data.route.paths[0].steps.forEach((el: any) => {
            polylineList = polylineList.concat(el.polyline.split(';'));
          });

          const newPolylineList = polylineList.map((el: any) => el.split(',').map((x: any) => Number(x)) )

          const polyline = new AMap.Polyline({
            path: newPolylineList,
            isOutline: true,
            outlineColor: '#ffeeff',
            borderWeight: 3,
            strokeColor: 'rgba(50, 197, 255, 1)',
            strokeOpacity: 1,
            strokeWeight: 6,
            // 折线样式还支持 'dashed'
            strokeStyle: 'solid',
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 5],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
          });

          polyline.setMap(map);
          // 缩放地图到合适的视野级别
          map.setFitView([polyline]);
        }
      });
    }

    /**
     * @description 获取终点
     */
    function setDestination() {
      // 经纬度转换：因为天地图和高德地图的定位不一样，所以要做转换
      const latitude = router.currentRoute.value.query.latitude;
      const longitude = router.currentRoute.value.query.longitude;
      tdtTrGd(longitude, latitude).then((res: any) => {
        destination.value.latitude = res.latitude;
        destination.value.longitude = res.longitude;
        ($location as any)
          .geocoder_Gd({ longitude: res.longitude, latitude: res.latitude })
          .then((res: any) => {
            destination.value.address = res.regeocode.formatted_address;
            console.log('终点', destination.value);
          });
      });
      tdtTrBD(longitude, latitude).then((res: any) => {
        BDLng.value.latitude = res.latitude
        BDLng.value.longitude = res.longitude
        console.log('百度坐标：', BDLng.value)
      })
    }

    /**
     * @param range 范围
     * @description 获取当前定位
     */
    function getCurrentLocation() {
      return new Promise((resolve) => {
        GDLocation().then((res: any) => {
          origin.value.address = res.address;
          origin.value.latitude = res.latitude;
          origin.value.longitude = res.longitude;
          loading.value = false;
          console.log(`高德-当前所在地址-起点:${res.address},${origin.value.latitude},${origin.value.longitude}`);
          resolve({
            longitude: res.longitude,
            latitude: res.latitude,
            address: res.latitude,
          })
        })
      });
    }

    /**
     * @description 设置起始点
     */
    function setPathOD(lngLat: any, AMap: any, map: any) {
      // 设置起始点
      const originMarker: any = new AMap.Marker({
        position: new AMap.LngLat(lngLat.longitude, lngLat.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: lngLat.address,
        content: originIcon,
      });
      const destinationMarker: any = new AMap.Marker({
        position: new AMap.LngLat(destination.value.longitude, destination.value.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: destination.value.address,
        content: destinationIcon,
      });
      map.add([originMarker, destinationMarker]);
      GDpathPlanning(AMap, map);
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
          // 获取当前定位
          getCurrentLocation().then((res: any) => {
            setPathOD({
              longitude: res.longitude,
              latitude: res.latitude,
              address: res.latitude,
            }, AMap, map);
          });
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
     * @description 百度地图
     */
    const baiduConfig = {
      scheme_Android: `bdapp://map/marker?location=${BDLng.value.latitude},${BDLng.value.longitude}&title=${destination.value.address}&content=${destination.value.address}`,
      scheme_IOS: `baidumap://map/marker?location=${BDLng.value.latitude},${BDLng.value.longitude}&title=${destination.value.address}&content=${destination.value.address}`,
      scheme_web: `http://api.map.baidu.com/marker?location=${BDLng.value.latitude},${BDLng.value.longitude}&title=${destination.value.address}&content=${destination.value.address}&output=html`,
      // scheme_web: 'http://api.map.baidu.com/marker?location=23.150878807647405,113.32477843061125&title=aaaa&content=bbbbbbbb&output=html',
    };

    const timeout = 600;

    /**
     * @description 判断操作系统，返回百度的不同操作系统下的接口
     */
    function adjustOS(){
      var ua = window.navigator.userAgent.toLowerCase();
      return (ua.indexOf('os') > 0) ? baiduConfig.scheme_IOS : baiduConfig.scheme_Android
    }

    /**
     * @description 打开百度客户端
     */
    function openBDClient() {
      const startTime = Date.now();
      const ifr = document.createElement('iframe');  
      ifr.src = adjustOS(); 
      ifr.style.display = 'none';  
      document.body.appendChild(ifr);
      const t = setTimeout(function() {  
        const endTime = Date.now();
        if (!startTime || endTime - startTime < timeout + 200) {   
          window.location.href = baiduConfig.scheme_web;  
        }
      }, timeout);
      window.onblur = function() {  
        clearTimeout(t);  
      }
    }
    
    /**
     * @description 打开高德地图软件
     */
    function openGDClient() {
      MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
      (AMap: any) => {
        const marker = new AMap.Marker({
          position: [destination.value.longitude, destination.value.latitude]
        });
        marker.markOnAMAP({
          position: marker.getPosition(),
          name: destination.value.address
        });
      })
    }
    onMounted(() => {
      initMap(); // 地图初始化
      setDestination();
    });

    return {
      navBarConfig,
      location,
      origin,
      destination,
      loading,
      openBDClient,
      openGDClient
    };
  },
});
</script>

<style lang="scss">
.icon-map {
  width: 0.4rem;
  height: 0.4rem;
  margin-right: 0.16rem;
}
.icon-origin {
  width: 0.82rem;
  height: 0.79rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('../assets/images/origin.svg');
}
.icon-destination {
  width: 0.82rem;
  height: 0.79rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('../assets/images/destination.svg');
}
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
  overflow: scroll;
  #appMap {
    height: 100%;
    width: 100vw;
  }
}
footer {
  width: 100%;
  height: auto;
  min-height: 3.24rem;
  background: #ffffff;
  border-radius: 0.06rem;
  padding: 0.32rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // 起点终点
  .address-container {
    padding: 0 0.16rem;
    font-size: 0.36rem;
    min-height: 1.28rem;
    background: #f2f3f5;
    border-radius: 0.06rem;

    .origin {
      position: relative;
      color: rgba(51, 51, 51, 1);
      min-height: 0.62rem;
      padding: 0 0.48rem;
      font-size: 0.28rem;
      display: flex;
      align-items: center;
      &::before {
        content: '起';
        display: block;
        position: absolute;
        top: calc(50% - 0.18rem);
        left: 0;
        width: 0.36rem;
        height: 0.36rem;
        line-height: 0.36rem;
        border-radius: 50%;
        font-size: 0.2rem;
        text-align: center;
        background: rgba(11, 210, 149, 1);
        color: #ffffff;
      }
    }
    .destination {
      position: relative;
      color: rgba(51, 51, 51, 1);
      min-height: 0.62rem;
      padding: 0 0.48rem;
      font-size: 0.28rem;
      display: flex;
      align-items: center;
      &::before {
        content: '终';
        display: block;
        position: absolute;
        top: calc(50% - 0.18rem);
        left: 0;
        width: 0.36rem;
        height: 0.36rem;
        line-height: 0.36rem;
        border-radius: 50%;
        font-size: 0.2rem;
        text-align: center;
        background: rgba(246, 110, 110, 1);
        color: #ffffff;
      }
    }
  }

  .button-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // 按钮
    .reset-button-style {
      width: 3rem;
      height: 0.8rem;
      background: #ffffff;
      border-radius: 0.08rem;
      border: 0.01rem solid #d9d6d6;
      font-size: 0.28rem;
      font-weight: 500;
      color: #969799;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
