import { getCurrentInstance, ref } from 'vue';
import { Toast } from 'vant';
const LonLatT: any = require('@/capacity/mapJs/LonLatTransform').default;
import axios from 'axios';
const MapLoader: any = require('@/product/SIOC-H5/mainCapacity/AMap/AMap').default;
const map: any = new (window as any).HM();

/**
 * @description 处理定位问题
 */
function handleLocation() {
  const instance = getCurrentInstance();
  const { $location, $http }: any = instance?.appContext.config.globalProperties;

  // 根据高德api获取高德坐标
  /**
   *
   * @param lngLan 经度在前，纬度在后
   */
  function GPSTrGD(lngLan: any) {
    return new Promise((resolve: any) => {
      axios({
        url: `https://restapi.amap.com/v3/assistant/coordinate/convert?locations=${lngLan}&coordsys=gps&output=json&key=${
          (window as any).config.mapConfig.mapBusinessAkey
        }`,
        method: 'get',
      }).then((res: any) => {
        resolve({
          longitude: res.data.locations.split(',')[0],
          latitude: res.data.locations.split(',')[1],
        });
      });
    });
  }

  /**
   * @description 获取定位
   */
  function getLocation() {
    // console.log('2-获取定位')
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position: any) => {
            console.log(position)
            let getLongitude = position.coords.longitude;
            let getLatitude = position.coords.latitude;
            let address = ref('');

            ($location as any)
              .geocoder_Gd({ longitude: getLongitude, latitude: getLatitude })
              .then((res: any) => {
                address.value = res.regeocode.formatted_address;
                const location = ref({
                  address: address.value,
                  latitude: getLatitude,
                  longitude: getLongitude,
                });
                console.log('H5原生定位信息：', location);
                resolve(location);
              });
          },
          err => {
            var errorType = [
              '无定位权限，获取不到位置信息',
              '获取不到位置信息',
              '获取位置信息超时',
            ];
            // Toast(errorType[err.code - 1]);
            console.log(errorType[err.code - 1]);
          },
        );
      } else {
        // Toast('对不起，您的设备不支持定位！');
        console.log('对不起，您的设备不支持定位！');
      }
    });
  }

  /**
   * @description 计算两个点(经纬度)的距离
   * @param lat1 纬度1
   * @param lng1 经度1
   * @param lat2 纬度2
   * @param lng2 经度2
   * @returns 公里数
   */
  function getGreatCircleDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    var EARTH_RADIUS = 6378137.0;
    var PI = Math.PI;

    function getRad(d: number) {
      return (d * PI) / 180.0;
    }
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);

    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);

    var s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
        ),
      );
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;
    return s; // 公里数
  }
  /**
   * @description 判断手机浏览器类型
   */
  function GetMobelType() {
    var browser = {
      versions: (function() {
        var u = window.navigator.userAgent;
        console.log('浏览器信息：', u);
        return {
          trident: u.indexOf('Trident') > -1, // IE内核
          presto: u.indexOf('Presto') > -1, // opera内核
          Alipay: u.indexOf('Alipay') > -1, // 支付宝
          webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
          iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者安卓QQ浏览器
          //iPhone: u.match(/iphone|ipod|ipad/),
          iPad: u.indexOf('iPad') > -1, // 是否为iPad
          webApp: u.indexOf('Safari') == -1, // 是否为web应用程序，没有头部与底部
          weixin: u.indexOf('MicroMessenger') > -1, // 是否为微信浏览器
          // qq: u.match(/\sQQ/i) !== null || u.indexOf('MQQBrowser') > -1, // 是否QQ
          qq: u.indexOf('MQQBrowser') > -1, // 是否QQ
          Safari: u.indexOf('Safari') > -1, // Safari浏览器
          Xiaomi: u.indexOf('XiaoMi') > -1 || u.indexOf('MiuiBrowser') > -1, // 小米浏览器
          UC: u.indexOf('UCBrowser') > -1, // UC浏览器
          Huawei: u.indexOf('Huawei') > -1 || u.indexOf('HuaweiBrowser') > -1, // 华为浏览器
          Vivo: u.indexOf('Vivo') > -1 || u.indexOf('VivoBrowser') > -1, // vivo浏览器
          Baidu: u.indexOf('baidu') > -1 || u.indexOf('baiduboxapp') > -1, // 百度浏览器
          Firefox: u.indexOf('Firefox') > -1, // Firefox浏览器
        };
      })(),
    };
    return browser.versions;
  }

  /**
   * @description 高德地图获取定位
   */
  function GDLocation() {
    return new Promise((resolve, reject) => {
      // 高德定位
      MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
        (AMap: any) => {
          // 浏览器定位
          AMap.plugin('AMap.Geolocation', function() {
            const geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, //是否使用高精度定位，默认:true
              timeout: 3000000, //超过10秒后停止定位，默认：无穷大
              maximumAge: 0, //定位结果缓存0毫秒，默认：0
              convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: true, //显示定位按钮，默认：true
              buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
              showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
              panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });

            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);
            AMap.event.addListener(geolocation, 'error', onError);

            console.log('浏览器信息：', GetMobelType())
            function onComplete(data: any) {
              // data是具体的定位信息
              console.log('高德定位成功-定位信息：', data);
              const latitude = data.position.lat; // 纬度
              const longitude = data.position.lng; // 经度
              if (GetMobelType().UC || GetMobelType().Baidu || GetMobelType().Firefox) {
                console.log('高德定位-返回gcj02坐标系（高德）- 不需要转坐标系');
                ($location as any)
                  .geocoder_Gd({ longitude: longitude, latitude: latitude })
                  .then((res: any) => {
                    console.log('解析地址：', res.regeocode?.formatted_address);
                    const location = {
                      address: res.regeocode?.formatted_address,
                      latitude: latitude,
                      longitude: longitude,
                    };
                    console.log('2-高德-定位信息：', location);
                    resolve(location);
                  });
              } else {
                map.tdtTrGd(longitude, latitude).then((response: any) => {
                console.log('高德定位-高德返回wgs84坐标系（天地图）- 需要转坐标系');
                console.log('转换前（天地图）：', longitude, latitude);
                console.log('转换后-天地图转高德-坐标系转换：', response);
                ($location as any)
                  .geocoder_Gd({ longitude: response.longitude, latitude: response.latitude })
                  .then((res: any) => {
                    console.log('解析地址：', res.regeocode?.formatted_address);
                    const location = {
                      address: res.regeocode?.formatted_address,
                      latitude: response.latitude,
                      longitude: response.longitude,
                    };
                    console.log('2-高德-定位信息：', location);
                    resolve(location);
                  });
                });
              }
            }

            function onError(data: any) {
              // 定位出错
              console.log('高德定位出错-报错信息：', data);
              const location = ref({
                address: '',
                latitude: '',
                longitude: '',
              });
              resolve(location);
              let errorType = data.message;
              switch (errorType) {
                case 'Browser not Support html5 geolocation.':
                  Toast('浏览器不支持原生定位接口');
                  break;
                case 'Geolocation permission denied.':
                  Toast('定位不支持http，请升级https站点');
                  break;
                case 'Get geolocation failed.':
                  Toast('定位失败');
                  break;
                case 'Get geolocation time out.':
                  Toast('定位超时');
                  break;
                case 'Get geolocation time out.Get ipLocation failed.':
                  Toast('定位超时');
                  break;
                default:
                  Toast(errorType);
              }
            }
          });
        },
        (e: any) => {
          console.log('地图加载失败', e);
        },
      );
    });
  }

  return {
    getLocation,
    getGreatCircleDistance,
    GDLocation,
  };
}

export default handleLocation;
