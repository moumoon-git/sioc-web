import { useStore } from 'vuex';
export default function handleRainfulAnalysisMarker(longitude: number, latitude: number) {
  const store = useStore();

  /**
   * @description 设置鼠标样式
   * @param {string} type active | default
   */
  function setMouseStyle(type: string) {
    if (type === 'active') {
      (window as any).map.setMouseStyle(require('./assets/svg/mapIcon_rain.svg'));
    } else {
      // 还原默认鼠标样式
      (window as any).map.restoreDefaultStyle();
    }
  }

  /**
   * @description 获取落点信息，开始落点
   */
  function startMarker() {
    // 开启点击获取落点信息
    (window as any).map.clickDroppoint(function (res: any) {
      store.commit('eventInformation/SET_rainfullAnalysis', {
        latLng: res.transform.res.longitude + ',' + res.transform.res.latitude,
        address: res.res.result.formatted_address,
      });
      createMarker(res.mapLocation.lon, res.mapLocation.lat);
    });
  }

  /**
   * @description 创建mark图层
   */
  function createdMarkCoverage() {
    (window as any).map.createdMarkCoverage('降雨分析');
  }

  /**
   * @description 清除并删除图层
   */
  function clearDeleteCoverage() {
    (window as any).map.clearDeleteCoverage('降雨分析')
  }

  /**
   * @description 移除落点
   */
  function removeMarker() {
    (window as any).map.clearAtPresentMarkData('降雨分析');
  }

  /**
   * @description 设置单个mark落点
   */
  function setOneMarker(longitude: number, latitude: number) {
    (window as any).map.setOneMarker(
      '降雨分析',
      {
        longitude: longitude,
        latitude: latitude,
        // imgInfo 落图标记设置
        wd: 48, //宽度 type Number
        hg: 47, //高度 type Number
        src: require('./assets/svg/mapIcon_rain.svg'), //图片路径 type String
        label: '',
        color: '', //颜色16进制
        fontSize: '', //字体大小
        textPosition: '', //显示位置 'tp' 顶部 'bt' 底部
      },
      {
        // click: clickMark,
        // 'mouseup':fun
      },
    );
  }

  /**
   * @description 创建落点
   * @param longitude 纬度
   * @param latitude 经度
   */
  function createMarker(longitude: number, latitude: number) {
    // 设置鼠标样式
    setMouseStyle('active');
    // 移除图层上所有的标记点
    // removeMarker();
    // 创建图层
    createdMarkCoverage();
    // 落点
    setOneMarker(longitude, latitude);
  }

  /**
   * @description 结束落点
   */
  function endMarker() {
    // 移除图层上所有的标记点
    // removeMarker();
    // 还原默认鼠标样式
    setMouseStyle('default');
    // 清除并删除图层
    clearDeleteCoverage()
  }

  return {
    setMouseStyle,
    startMarker,
    createMarker,
    endMarker,
    setOneMarker
  }
}
