<template>
  <div :class="$style.MapSharing">
    <!-- 导航栏 -->
    <header>
      <NavBar :config="navBarConfig" />
    </header>
    <main>
      <div id="appMap" />
      <aside>
        <div v-show="detailType === 0">
          <div>
            <span :class="$style.green">起</span>
            <span>{{ postData.startingPoint }}</span>
          </div>
          <div>
            <span :class="$style.stop">终</span>
            <span>{{ postData.terminalPoint }}</span>
          </div>
        </div>
        <div v-show="detailType === 1" :class="$style.locationInfo">
          {{ locationInfo }}
        </div>
        <div @click="Navigation">导航</div>
      </aside>
    </main>
    <div v-show="false">
      <iframe
        width="0"
        height="0"
        id="mapUrl_id"
        frameborder="0"
        scrolling="auto"
        style="width: 100%; height: 100%"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeMount,
  getCurrentInstance,
} from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
const MapLoader: any =
  require('@/product/SIOC-H5/mainCapacity/AMap/AMap').default;
const LonLatT: any = require('@/capacity/mapJs/LonLatTransform').default;

export default defineComponent({
  name: 'MapSharing',
  components: {
    NavBar,
  },
  setup() {
    const instance = getCurrentInstance();
    const route = useRoute();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const postData = ref<any>({});
    const detailType = ref<any>(0);
    const locationInfo = ref<any>('');
    const locationLonLat = ref<any>('');
    // 导航栏配置
    const navBarConfig = ref({
      title: '地图分享',
      type: 'close',
      path: '',
    });
    // 获取分享的路径信息
    function getRouteByCode(map: any, AMap: any) {
      let code: any = route.query.code;
      if (!code && sessionStorage.query) {
        code = JSON.parse(sessionStorage.query)?.code;
      }
      console.log(code);
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistRoute/getRouteByCode',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          code,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          // console.log(response.data);
          // console.log(JSON.parse(response.data.detail));
          if (response.data.detailType === 1) {
            detailType.value = 1;
            const data = JSON.parse(response.data.detail);
            locationInfo.value = data.name;
            const icon = new AMap.Icon({
              size: new AMap.Size(40, 50), // 图标尺寸
              image: require('./assets/map.png'), // Icon的图像
              imageOffset: new AMap.Pixel(9, 9), // 图像相对展示区域的偏移量，适于雪碧图等
              imageSize: new AMap.Size(25, 30), // 根据所设置的大小拉伸或压缩图片
            });
            const transF = LonLatT.LonLatTransform(
              `${data.transFromLonLat}`,
              'TTG',
            );
            locationLonLat.value = transF;
            const location = transF.split(',');
            // console.log(transF);
            // 创建一个 Marker 实例：
            const marker: any = new AMap.Marker({
              position: new AMap.LngLat(
                Number(location[0]),
                Number(location[1]),
              ), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              offset: new AMap.Pixel(-20, -40),
              title: '',
              icon,
            });
            map.add(marker);
            map.setCenter([Number(location[0]), Number(location[1])]);
          } else {
            postData.value = JSON.parse(response.data.detail);
            const { steps } = JSON.parse(response.data.detail);
            const allPath = steps.reduce((p: any, ele: any) => {
              const arrPath = ele.transFromLonLatSpot.reduce(
                (pre: any, x: any) => {
                  const transF = LonLatT.LonLatTransform(
                    `${x.x},${x.y}`,
                    'TTG',
                  );
                  const arr = [transF.split(',')[0], transF.split(',')[1]];
                  pre.push(arr);
                  return pre;
                },
                [],
              );
              p = p.concat(arrPath);
              return p;
            }, []);
            var polyline: any = new AMap.Polyline({
              path: allPath,
              isOutline: true,
              outlineColor: '#ffeeff',
              borderWeight: 3,
              strokeColor: '#3366FF',
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
            var icon = new AMap.Icon({
              size: new AMap.Size(40, 50), // 图标尺寸
              image: require('./assets/q.svg'), // Icon的图像
              imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
              imageSize: new AMap.Size(40, 50), // 根据所设置的大小拉伸或压缩图片
            });
            // 创建一个 Marker 实例：
            const marker: any = new AMap.Marker({
              position: new AMap.LngLat(allPath[0].lng, allPath[0].lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              offset: new AMap.Pixel(-20, -40),
              title: '',
              icon,
            });
            map.add(marker);
            var icon2 = new AMap.Icon({
              size: new AMap.Size(40, 50), // 图标尺寸
              image: require('./assets/z.svg'), // Icon的图像
              imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
              imageSize: new AMap.Size(40, 50), // 根据所设置的大小拉伸或压缩图片
            });
            // 创建一个 Marker 实例：
            const marker2: any = new AMap.Marker({
              position: new AMap.LngLat(
                allPath[allPath.length - 1].lng,
                allPath[allPath.length - 1].lat,
              ), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              offset: new AMap.Pixel(-20, -40),
              title: '',
              icon: icon2,
            });
            map.add(marker2);
          }
        }
      });
    }
    /**
     * @description 初始化地图
     */
    function initMap() {
      // 经纬度转换：因为天地图和高德地图的定位不一样，所以要做转换
      const lngLat: any = ref();
      // 高德地图
      MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
        (AMap: any) => {
          console.log('地图加载成功');
          const map: any = new AMap.Map('appMap', {
            resizeEnable: true,
            center: [113.25905, 23.12784],
            zoom: 15, //地图显示的缩放级别
          });
          (window as any).initMap();
          getRouteByCode(map, AMap);
          // 创建一个 Marker 实例：
          // const marker: any = new AMap.Marker({
          //   position: new AMap.LngLat(
          //     lngLat.value.longitude,
          //     lngLat.value.latitude,
          //   ), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          //   title: '',
          // });
          // map.add(marker);

          // 同时引入工具条插件，比例尺插件和鹰眼插件
          AMap.plugin(
            [
              'AMap.ToolBar',
              'AMap.Scale',
              'AMap.OverView',
              // 'AMap.MapType',
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
    // 导航
    function Navigation() {
      if (detailType.value === 0) {
        const lngLat = postData.value.terminalPointLonLat;
        const trans = LonLatT.LonLatTransform(
          postData.value.startingPointLonLat,
          'TTG',
        );
        const transF = LonLatT.LonLatTransform(
          postData.value.terminalPointLonLat,
          'TTG',
        );
        const mapUrl = `https://uri.amap.com/navigation?from=${trans},${postData.value.startingPoint}&to=${transF},${postData.value.terminalPoint},midwaypoint&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
        window.open(mapUrl);
      } else if (detailType.value === 1) {
        const mapUrl = `https://uri.amap.com/marker?position=${locationLonLat.value}&name=${locationInfo.value}`;
        window.open(mapUrl);
      }
    }
    onBeforeMount(() => {
      if (route.query.code) {
        sessionStorage.setItem('query', JSON.stringify(route.query));
      }
    });
    onMounted(() => {
      initMap(); // 地图初始化
    });
    return {
      postData,
      navBarConfig,
      Navigation,
      detailType,
      locationInfo,
    };
  },
});
</script>

<style lang="scss" module>
.MapSharing {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  & > main {
    flex: 1;
    position: relative;
    & > div {
      width: 100%;
      height: 100%;
      :global(.amap-zoomcontrol) {
        bottom: 2rem;
      }
      :global(.amap-scalecontrol) {
        display: none;
      }
      :global(.amap-logo) {
        display: none !important;
      }
      :global(.amap-copyright) {
        display: none !important;
      }
    }
    & > aside {
      position: absolute;
      border-radius: 6px 6px 0 0;
      bottom: 0;
      left: 0;
      background: #fff;
      width: 100%;
      padding: 0.3rem;
      box-sizing: border-box;
      & > div {
        &:first-child {
          background: #f2f3f5;
          border-radius: 0.2rem;
          & > div {
            padding: 0.2rem;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            & > span {
              &:first-child {
                width: 0.6rem;
                height: 0.6rem;
                line-height: 0.6rem;
                text-align: center;
                display: block;
                margin-right: 0.2rem;
                color: #fff;
              }
            }
          }
        }
        &:last-child {
          width: 93%;
          margin: auto;
          height: 0.9rem;
          background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
          box-shadow: 0px 6px 12px 0px rgba(12, 126, 161, 0.35);
          border-radius: 75px;
          text-align: center;
          line-height: 0.9rem;
          font-size: 0.5rem;
          margin-top: 0.3rem;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
}
.green {
  background: green;
  border-radius: 0.25rem;
}
.locationInfo {
  height: 0.6rem;
}
.stop {
  background: red;
  border-radius: 0.25rem;
}
</style>
