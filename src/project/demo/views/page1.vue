<template>
  <div class="wrap">
    <div id="map" />
    <!-- <MapDialog ref="child" >
      <div style="width:200px;height:200px;"></div>
    </MapDialog> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const buffer = require('./buffer').default;
// import MapDialog from '@/product/CommandBrain3.0/Generalparts/map/MapDialog/MapDialog.vue';

export default defineComponent({
  name: 'DemoPage1',
  components: {
    // MapDialog
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap(): void {
      const map: any = new window.HM().init('map');
      (window as any).map = map;
      // (this.$refs.child as any).init({longitude: 119.49409,latitude: 32.73100,map});
      // 绘制可编辑的线、面
      (window as any).map.createdMarkCoverage('x').then((res:any) => {
        (window as any).map.setOneMarker('x', {
          longitude: 113.1,
          latitude: 23.1,
          // imgInfo 落图标记设置
          wd: 30,
          Hg: 30,
          src: 'https://iclient.supermap.io/examples/classic/images/marker.png',
        }).then((r :any) => {
          console.log(r);
        });
      });
      (window as any).map.createdVectorCoverage('polygons').then((res:any) => {
        // map.drawLinePolyg('polygons').then((ress:any) => {
        // map.openLinePolygon("polygons",'polygon',true)
        // });
      });

      // map.searchPOIdata('广州中大').then((res:any)=>{
      //   console.log(res);
      // });
      const dataObj:any = {
        origin: '116.481028,39.989643',
        destination: '116.434446,39.90816',
        // waypoints:'116.357483,39.907234',
        // city:'北京'
      };
      map.pathPlanning(dataObj, 'truck').then((res:any) => {
        console.log(res);
      });
      map.clickDroppoint((res:any) => {
        console.log(res);
      });

      const that = this;
      buffer.buffer(map);
      // (window as any).map.createdVectorCoverage("testLine").then((res: any) => {
      //   let obj = {
      //     featureadded:function(e:any) {
      //       map.getCoverageData("testLine").then((resd: any) => {
      //         var leg = resd.length - 1;
      //         let data = resd[leg].geometry.components;
      //         map.renderBuffer("testLine",data,20).then((res:any) => {
      //           console.log(res);
      //         })
      //       });
      //       // console.log(e.feature.geometry.toJSON());
      //       // var type = e.feature.geometry.CLASS_NAME;
      //       // var cps = e.feature.geometry.toJSON();
      //       // cps = JSON.parse(cps);
      //       // console.log(JSON.stringify([{ "type": type, "cps": cps}]));
      //       // let controlPoints = e.feature.geometry.components[0].components.reduce((pre:any, ele:any) => {
      //       //   let obj = {
      //       //     x:ele.x,
      //       //     y:ele.y
      //       //   }
      //       //   pre.push(obj)
      //       //   return pre
      //       // },[])
      //       // let data = [
      //       //   {
      //       //     type: "SuperMap.Geometry.GeoPolygonEx",
      //       //     cps: {
      //       //       controlPoints,
      //       //     },
      //       //     textLabel:'测试',
      //       //     style:{
      //       //       strokeColor: 'skyblue', //生成随机颜色
      //       //       strokeWidth: 2,
      //       //       fillColor: 'skyblue',
      //       //       fillOpacity:0.5,
      //       //       fontColor: 'pink',
      //       //       fontSize: "20px",
      //       //     }
      //       //   }
      //       // ]
      //       // setTimeout(()=>{
      //       //   console.log(data);
      //       //   map.renderGraph('testLine',data)
      //       // },5000)
      //       // let data = [
      //       //   {
      //       //     type: "SuperMap.Geometry.GeoDoubleArrow",
      //       //     cps: {
      //       //       controlPoints: [
      //       //           { x: 115.82721523365, y: 32.255634778501 },
      //       //           { x: 117.39826015553, y: 30.662617200376 },
      //       //           { x: 119.3208675774,  y: 32.420429700376 },
      //       //           { x: 117.18951992115, y: 33.595966809751 }
      //       //       ]
      //       //     },
      //       //     textLabel:'测试',
      //       //     style:{
      //       //       strokeColor: 'skyblue', //生成随机颜色
      //       //       strokeWidth: 2,
      //       //       fillColor: 'skyblue',
      //       //       fillOpacity:0.5,
      //       //       fontColor: 'pink',
      //       //       fontSize: "20px",
      //       //     }
      //       //   }
      //       // ]
      //       // setTimeout(()=>{
      //       //   console.log(data);
      //       //   map.renderGraph('testLine',data)
      //       //   map.openVectorCoverageEdit('testLine')
      //       // },5000)
      //       // 清空单前图层
      //       // map.clearAtPresentVectorData('testLine')
      //       // let centerLoction = map.map.layers[5].features[0].geometry._controlPoints[0]
      //       // map.getCirLonAndLat({longitude:centerLoction.x,latitude:centerLoction.y,r:200}).then((res:any) => {
      //       //   // console.log(res);
      //       //   let lonObj = new SuperMap.Geometry.Point(res.longitude,res.latitude)
      //       //   let arr: any = [
      //       //     centerLoction,
      //       //     lonObj
      //       //   ];
      //       //   (window as any).map.map.layers[5].features[0].geometry._controlPoints = arr
      //       //   // map.map.layers[5].setFeatures(arr)
      //       //   map.map.pan(lonObj.x,lonObj.y,map.map.getZoom())
      //       //   console.log(map.map.layers);
      //       // })
      //       // console.log(map.map.layers);
      //       // console.log(map.map.layers[5].features[0].geometry._controlPoints);
      //       map.closeActivateDrawFeature('testLine')
      //       // map.openVectorCoverageEdit('testPlotting')
      //     }
      //   };
      //   map.vectorDrawCir("testLine", {
      //       longitude: 119.49409,
      //       latitude: 32.731,
      //       r: 20000
      //     });
      //   map
      //     .newDrawFeature("testLine", "Path", obj, true)
      //     .then((res: any) => {
      //       map.activateDrawFeature("testLine");
      //     });
      // });

      // 生成vector 的图层
      map
        .createdVectorCoverage('testPlotting')
        .then((res: any) => {
          // map.drawLinePolyg('testPlotting').then((res:any)=>{
          //   map.openLinePolygon('testPlotting','line',true)
          // })
          // 绘制圆圈
          map.vectorDrawCir('testPlotting', {
            longitude: 117.49409,
            latitude: 33.731,
            r: 20000,
          });
          // 通过一个经纬度和距离，获取圆圈另外的点
          map
            .getCirLonAndLat({ longitude: 119.49409, latitude: 32.731, r: 200 })
            .then((resx:unknown) => {
              console.log(resx); // 获取的点结构
              // Math.sqrt(Math.pow(119.49409-119.49596179894888,2)+Math.pow(32.73100-32.72991931637299,2))
            });
          // return map.drawLinePolyg('testPlotting')
        })
        .then((res: any) => {
          // return map.openLinePolygon('testPlotting','line',true)
          // return map.openLinePolygon('testPlotting','polygon',true)
        });
    },
  },
});
</script>
<style scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
