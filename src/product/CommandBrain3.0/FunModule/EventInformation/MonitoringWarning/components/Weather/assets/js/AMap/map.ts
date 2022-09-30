const MapLoader: any = require('@/product/CommandBrain3.0/FunModule/EventInformation/MonitoringWarning/components/Weather/assets/js/AMap/AMap').default;
import { ref, getCurrentInstance } from 'vue';
function getLocation() {
  return new Promise((resolve, reject) => {
    MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
      (AMap: any) => {
        // 浏览器定位
        AMap.plugin('AMap.Geolocation', function() {
          var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            // timeout: 10000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            // buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            // zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            // buttonPosition: 'RB',
          });

          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', onComplete);
          AMap.event.addListener(geolocation, 'error', onError);

          function onComplete(data: any) {
            console.log('高德：定位信息', data)
            // data是具体的定位信息
            resolve({
              latitude: data.position.lat,
              longitude: data.position.lng,
            });
            //     ($location as any)
            //       .geocoder_Gd({ longitude: longitude.value, latitude: latitude.value })
            //       .then((res: any) => {
            //         address.value = res.regeocode.formatted_address;
            //         // alert(address.value);
            //         const location = ref({
            //           address: address.value,
            //           latitude: longitude.value,
            //           longitude: latitude.value,
            //         });
            //       });
          }
          
          function onError(data: any) {
            console.log('定位出错：', data)
          }

         
        });
        
        // 注释原因：现在高德的key不支持AMap.Geocoder
        // AMap.plugin('AMap.Geocoder', function() {
        //   var geocoder = new AMap.Geocoder({
        //     // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        //     city: '010'
        //   })
        
        //   geocoder.getLocation('北京市海淀区苏州街', function(status: any, result: any) {
        //   console.log('result中对应详细地理坐标信息', status, result)
        //   if (status === 'complete' && result.info === 'OK') {
        //     // result中对应详细地理坐标信息
        //   }
        //   })
        // })
      },
      (e: any) => {
        reject(e)
        console.log('定位出错：', e)
      },
    );
  });
}

export default getLocation
