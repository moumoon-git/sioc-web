// import { isConstructorDeclaration } from 'typescript';
import { ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';

function line() {
  const types = 'line';
  // 使用vuex
  const store = useStore();
  // 操作的单个数据
  const lines = ref({});
  const style = ref<any>({
    strokeColor: '#ffffff',
    strokeWidth: 20,
    fillColor: '#87ceeb',
  });
  // 初始化点要用到的地图
  function initLineMap(fillOpacity = 0, st = {}) {
    style.value.fillOpacity = fillOpacity;
    Object.assign(style.value, st);
    // console.log(style.value, st);
    return window.map.createdVectorCoverage(types, style.value);
  }
  // 页面结束时卸载地图
  function unInitLineMap() {
    window.map.closeActivateDrawFeature(types);
    return window.map.clearDeleteCoverage(types);
  }
  onUnmounted(() => {
    unInitLineMap();
  });
  function newDrawFeature(type:String, drawType:String) {
    let promise = new Promise((resolve,reject)=>{
      const eventObj = {
        featureadded(e:any) {
          // console.log(e); 
          lines.value = e;
          window.map.openVectorCoverageEdit(types);
          const { feature } = e;
          const allSpot = e.feature.geometry.toJSON();
          // console.log(allSpot);
          const xy = feature.geometry.components[0].bounds;
          const type = e.feature.CLASS_NAME.split('.');
          const leg = type.length;
          const elId = e.feature.geometry.id;
           // 图形参数
          const obj = {
            type: drawType,
            typeId: elId,
            convergeName: types,
            graphicalType:type[leg - 1]
          };
          // 绘制完成之后的图形参数
          store.commit('coplotting/SET_graphicParameters', obj);
          // 以第一个点为准 获取点信息
          window.map.acquisitionPoint({ longitude: xy.left, latitude: xy.top }).then((res:any) => {
            // console.log(res);
            if (res.res && res.res.result){
              // console.log(resut);
              // 设置点信息
              store.commit('coplotting/SET_pointInformation', res);
            }
          });
          resolve(JSON.parse(allSpot).controlPoints)
        },
      };
      window.map.newDrawFeature(types, type, eventObj, false).then((res:any) => {
        window.map.activateDrawFeature(types);
      })
    })
    return promise
  }
  return {
    initLineMap,
    unInitLineMap,
    newDrawFeature,
  };
}

export default line;
