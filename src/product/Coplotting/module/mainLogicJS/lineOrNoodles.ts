import { ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';

function lineOrNoodles() {
  const types = 'lineOrNoodles';
  // 使用vuex
  const store = useStore();
  const drawType = ref<String>('');
  // 初始化点要用到的地图
  function initLineOrNoodlesMap() {
    return window.map.createdVectorCoverage(types);
  }
  // 页面结束时卸载地图
  function unInitLineOrNoodlesMap() {
    window.map.openLinePolygon(types, drawType.value, false);
    return window.map.clearDeleteCoverage(types);
  }
  onUnmounted(() => {
    unInitLineOrNoodlesMap();
  });
  // 绘制
  function drawLinePolyg(type: String, style = {}) {
    let promise = new Promise((resolve, reject) => {
      drawType.value = type;
      const eventObj = {
        Line: {
          featureadded(e: any) {
            console.log(e);
            window.map.openLinePolygon(types, type, false);
            window.map.activeACloseLinePolyg(types, true);
            const { feature } = e;
            const xy = feature.geometry.components[0].bounds;
            const allSpot = feature.geometry.components[0].components;
            const CLASS_NAME = e.feature.CLASS_NAME.split('.');
            const leg = type.length;
            const elId = e.feature.geometry.id;
            // 图形参数
            const obj = {
              type: drawType.value,
              typeId: elId,
              convergeName: types,
              graphicalType: CLASS_NAME[leg - 1],
            };
            // 绘制完成之后的图形参数
            store.commit('coplotting/SET_graphicParameters', obj);
            // 以第一个点为准 获取点信息
            window.map.acquisitionPoint({ longitude: xy.left, latitude: xy.top }).then((res: any) => {
              // console.log(res);
              if (res.res && res.res.result) {
                // console.log(resut);
                // 设置点信息
                store.commit('coplotting/SET_pointInformation', res);
              }
            });
            resolve(allSpot);
          },
        },
        Polygon: {
          featureadded(e: any) {
            console.log(e);
            window.map.openLinePolygon(types, type, false);
            window.map.activeACloseLinePolyg(types, true);
            const { feature } = e;
            const xy = feature.geometry.components[0].bounds;
            const allSpot = feature.geometry.components[0].components;
            const CLASS_NAME = e.feature.CLASS_NAME.split('.');
            const leg = type.length;
            const elId = e.feature.geometry.id;
            // 图形参数
            const obj = {
              type: 'noodles',
              typeId: elId,
              convergeName: types,
              graphicalType: CLASS_NAME[leg - 1],
            };
            // 绘制完成之后的图形参数
            store.commit('coplotting/SET_graphicParameters', obj);
            // 以第一个点为准 获取点信息
            window.map.acquisitionPoint({ longitude: xy.left, latitude: xy.top }).then((res: any) => {
              // console.log(res);
              if (res.res && res.res.result) {
                // console.log(resut);
                // 设置点信息
                store.commit('coplotting/SET_pointInformation', res);
              }
            });
            resolve(allSpot);
          },
        },
      };
      window.map.drawLinePolyg(types, eventObj, style).then((res: any) => {
        window.map.openLinePolygon(types, type, true);
      });
    })
    return promise
  }
  return {
    initLineOrNoodlesMap,
    unInitLineOrNoodlesMap,
    drawLinePolyg,
  };
}

export default lineOrNoodles;
