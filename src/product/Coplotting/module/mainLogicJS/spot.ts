import { ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';

function spot() {
  const types = 'spot';
  const store = useStore(); // 使用vuex
  // 操作的单个数据
  const spots = ref({});
  // 初始化点要用到的地图
  function initSpotMap() {
    return window.map.createdMarkCoverage(types);
  }
  // 页面结束时卸载地图
  function unInitSpotMap() {
    return window.map.clearDeleteCoverage(types);
  }
  onUnmounted(() => {
    unInitSpotMap();
  });
  // 设置鼠标样式
  function setMouseStyle(url = '') {
    let promise = new Promise((resolve, reject) => {
      const src = url || require('./assets/commonly.png');
      window.map.setMouseStyle(src).then((res: any) => window.map.clickDroppoint((resut: any) => {
        // console.log(res);
        const data = {
          longitude: resut.mapLocation.lon,
          latitude: resut.mapLocation.lat,
          x: resut.mapLocation.lon,
          y: resut.mapLocation.lat,
          wd: 50,
          hg: 50,
          src,
          offsetX: 2.5,
          offsetY: 2,
        };
        return window.map.setOneMarker(types, data).then((r: any) => {
          spots.value = r;
          window.map.closeClickDroppoint();
          window.map.restoreDefaultStyle();
          // console.log(r);
          const type = r.CLASS_NAME.split('.');
          const leg = type.length;
          // 图形参数
          const obj = {
            type: 'spot',
            typeId: r.icon.imageDiv.id,
            convergeName: types,
            graphicalType: type[leg - 1]
          };
          // 绘制完成之后的图形参数
          store.commit('coplotting/SET_graphicParameters', obj);
          if (resut.res && resut.res.result) {
            // console.log(resut);
            // 设置点信息
            store.commit('coplotting/SET_pointInformation', resut);
          }
          resolve([data])
        });
      }));
    })
    return promise
  }
  return {
    setMouseStyle,
    initSpotMap,
    unInitSpotMap,
  };
}
export default spot;
