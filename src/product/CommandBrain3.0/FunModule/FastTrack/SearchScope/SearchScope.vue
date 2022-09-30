<template>
  <div :class="$style.searchScope">
    <CententModelBtn
      v-if="/* 单一检索类型时隐藏顶部栏按钮 */ !singleSearchType"
      @selectModel="getCententModelBtn"
    />
    <RightPopup
      ref="RightPopups"
      :single-search-type="singleSearchType"
      :visible="RightPopupFlag"
      @sendMsg="getRightPopupMsg"
      @close="close"
    />
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import {
  defineComponent,
  ref,
  getCurrentInstance,
  watchEffect,
  nextTick,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import {
  addFun,
  deleteFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
import CententModelBtn from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/CententModelBtn.vue';
import RightPopup from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup.vue';
import script from './script';

export default defineComponent({
  components: {
    CententModelBtn,
    RightPopup,
  },
  props: {
    /**
     * 单一检索类型
     * @example '' 默认检索全部，显示顶部【点线面】按钮
     * @example 'video' 周边视频检索
     * @example 'people' 周边人员检索
     */
    singleSearchType: {
      type: String,
      default: '',
    },
  },
  setup() {
    // 获取全局
    const instance = getCurrentInstance();
    const store = useStore(); // 使用vuex
    const modelName = 'retrieval';
    // 行车线起点和终点的经纬度
    const riseAndEnd = ref<any>({
      rise: {},
      end: {},
    });
    const {
      RightPopups,
      laneCovNameArr,
      solrParams,
      coverObj,
      lineAndNoodlesData,
      RightPopupObj,
      RightPopupFlag,
      centerCircle,
      renderCircle,
      renderLine,
      getRightPopupMsg,
      solrData,
      loadingMap,
      closeRightPopup,
    } = script(instance, store, modelName);
    const { $message }: any = instance?.appContext.config.globalProperties;
    const keyDownFlag = ref<any>(false);
    const handleModle = ref<any>('');
    function close() {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        123,
      );
      closeRightPopup();
    }
    // 点检索
    function spot(res: any, num: number): void {
      // 清空当前图层的数据
      const src = require('./assets/center.svg');
      (window as any).map.setMouseStyle(src);
      // 获取点击的点信息
      // (window as any).map.clickDroppoint((res: any) => {
      console.log(res);
      // RightPopupObj.value.address =
      //   res.res || RightPopupObj.value.address || {};
      // 落点便宜修正
      res.mapLocation.offsetAll = true;
      res.mapLocation.wd = 34;
      res.mapLocation.hg = 34;
      res.mapLocation.src = src;
      res.mapLocation.offsetY = 2;
      // 设置单个图标
      (window as any).map.setOneMarker(
        coverObj.value.spotName,
        res.mapLocation,
      );
      centerCircle.value = res.mapLocation;
      renderCircle(num);
      // });
    }
    // 线/面
    function lineAndNoodles(type: string) {
      (window as any).map
        .newDrawFeature(coverObj.value.noodles, type, {
          featureadded: (e: any) => {
            // nextTick(() => {
            //   // 显示ESC提示窗口
            //   store.commit('flightPatrol/SET_showTip', false);
            // });
            const obj = JSON.parse(e.feature.geometry.toJSON());
            lineAndNoodlesData.value = obj.controlPoints;
            // 起点
            const xy = obj.controlPoints[0];
            // 终点
            const endXy = obj.controlPoints[obj.controlPoints.length - 1];
            const promise = [
              (window as any).map.acquisitionPoint({ lon: xy.x, lat: xy.y }),
              (window as any).map.acquisitionPoint({
                lon: endXy.x,
                lat: endXy.y,
              }),
            ];
            Promise.all(promise).then((res: any) => {
              console.log(res);
              RightPopupObj.value.endAddress = res[1].res;
              // 设置为起点的数据
              RightPopupObj.value.address =
                res[0].res || RightPopupObj.value.address || {};
              if (type === 'PolyLineEx') {
                renderLine(500);
              } else if (type === 'PolygonEx') {
                // console.log(e);
                (window as any).map
                  .calculateAreas(e.feature.geometry)
                  .then((areaObj: any) => {
                    RightPopupObj.value.address.area =
                      areaObj.area || RightPopupObj.value.address;
                    console.log('面的数据', lineAndNoodlesData.value);
                    let oneStr = '';
                    const polygonArr = lineAndNoodlesData.value.reduce(
                      (pre: any, x: any, i: number) => {
                        const elStr = `${x.x} ${x.y}`;
                        if (i === 0) {
                          oneStr = elStr;
                        }
                        pre.push(elStr);
                        return pre;
                      },
                      [],
                    );
                    polygonArr.push(oneStr);
                    solrParams.value.solrType = 2;
                    solrParams.value.polygon = polygonArr;
                    solrData();
                  });
              } else if (type === 'CircleEx') {
                if (e.feature && e.feature.geometry) {
                  const location: any = JSON.parse(
                    e.feature.geometry.toJSON(),
                  ).controlPoints;
                  const start = {
                    longitude: location[0].x,
                    latitude: location[0].y,
                  };
                  const end = {
                    longitude: location[1].x,
                    latitude: location[1].y,
                  };
                  (window as any).map
                    .calculateLineDistance(start, end)
                    .then((response: any) => {
                      let num = parseInt(response);
                      console.log(num);
                      // 超过4公里之后清空地图并提示
                      const obj: any = {
                        mapLocation: {
                          longitude: location[0].x,
                          latitude: location[0].y,
                          lon: location[0].x,
                          lat: location[0].y,
                        },
                      };
                      if (num > 10000) {
                        $message.error('搜索值最大范围是10公里');
                        spot(obj, 10000);
                        num = 10000;
                      } else {
                        spot(obj, num);
                      }
                      RightPopupObj.value.selfModel.r = num;
                      RightPopupFlag.value = true;
                    });
                }
              }
            });
            if (type !== 'CircleEx') {
              RightPopupFlag.value = true;
            }
          },
        })
        .then((res: any) =>
          (window as any).map.activateDrawFeature(coverObj.value.noodles),
        );
    }

    // 渲染行车线
    function renderLaneLine(data: any, sourceData: any) {
      let oneCovName = '';
      data.forEach((e: any, i: number) => {
        // console.log(e);
        let color = '#97a09e';
        const covName = `laneLine_${Math.floor(
          Math.random() * 100000000,
        )}_${i}`;
        sourceData[i].covName = covName;
        // 新建了那些图层，保存图层名
        laneCovNameArr.value.push(covName);
        (window as any).map.createdVectorCoverage(covName);
        if (i === 0) {
          oneCovName = covName;
          color = '#08c189';
        }
        const obj = {
          type: 'SuperMap.Geometry.GeoPolyline',
          cps: {
            controlPoints: e,
          },
          style: {
            strokeColor: color,
            strokeWidth: 5,
            fillColor: 'skyblue',
            fillOpacity: 0.5,
            fontColor: 'pink',
            fontSize: '20px',
          },
          id: covName,
        };
        (window as any).map.renderGraph(covName, [obj], '');
      });
      (window as any).map.setMapCovzIndex(oneCovName);
      if (RightPopups.value) {
        RightPopups.value.PathPlanningData = sourceData;
      }
    }
    // 行车线
    function lane(src: any, num: number) {
      (window as any).map.setMouseStyle(src);
      // 获取点击的点信息
      (window as any).map.clickDroppoint((res: any) => {
        // console.log(res);
        if (num === 0) {
          riseAndEnd.value.rise = res;
        } else {
          riseAndEnd.value.end = res;
          RightPopupObj.value.endAddress = res.res;
          RightPopupObj.value.address =
            riseAndEnd.value.rise.res || RightPopupObj.value.address || {};
        }
        // 落点偏移修正
        res.mapLocation.latitude =
          Number(res.mapLocation.latitude.toFixed(5)) + 0.00006;
        res.mapLocation.longitude =
          Number(res.mapLocation.longitude.toFixed(5)) - 0.00007;
        res.mapLocation.offsetAll = true;
        res.mapLocation.wd = 30;
        res.mapLocation.hg = 30;
        res.mapLocation.src = src;
        res.mapLocation.offsetY = 2;
        (window as any).map
          .setOneMarker(coverObj.value.spotName, res.mapLocation)
          .then(() => {
            if (num < 1) {
              const url = require('./assets/end.png');
              // 设置终点
              lane(url, num + 1);
            } else {
              // console.log(res);
              const origin = riseAndEnd.value.rise.mapLocation;
              const destination = res.mapLocation;
              const objData = {
                origin: `${origin.longitude},${origin.latitude}`,
                destination: `${destination.longitude},${destination.latitude}`,
              };
              (window as any).map
                .pathPlanning(objData, 'drive')
                .then((r: any) => {
                  console.log(r);
                  if (r.route && r.route.paths) {
                    const data = r.route.paths;
                    const allLine = data.reduce((pre: any, e: any) => {
                      const lineData: any = [];
                      e.steps.forEach((x: any) => {
                        // console.log(x.transFromLonLat);
                        // console.log(x.polyline);
                        lineData.push(x.transFromLonLat);
                      });
                      const lineStr = lineData.join(';');
                      const lineStrData = lineStr.split(';');
                      // 把数据处理成地图所需要的格式
                      const handleDATA = lineStrData.reduce(
                        (pres: any, x: any) => {
                          const splitData = x.split(',');
                          const obj = {
                            x: Number(splitData[0]),
                            y: Number(splitData[1]),
                          };
                          pres.push(obj);
                          return pres;
                        },
                        [],
                      );
                      pre.push(handleDATA);
                      return pre;
                    }, []);
                    renderLaneLine(allLine, data);
                  }
                });
              // 恢复鼠标手
              (window as any).map.restoreDefaultStyle();
              // 关闭点击获取点信息
              (window as any).map.closeClickDroppoint();
              RightPopupFlag.value = true;
              if (RightPopups.value) {
                RightPopups.value.PathPlanningFlag = 'PathPlanning';
              }
            }
          });
      });
    }
    // 控制显示的头部
    function controlVisHeader(data: any) {
      console.log(data);
      RightPopupObj.value.selfModel = data;
    }

    // 选中功能
    function getCententModelBtn(data: any) {
      console.log(data);
      RightPopupObj.value.address = {};
      controlVisHeader(data);
      RightPopupFlag.value = false;
      loadingMap();
      RightPopups.value.init();
      if (data.handleModle) {
        keyDownFlag.value = true;
        $message.success('使用ECS键取消当前操作');
      }
      // nextTick(() => {
      //   // 显示ESC提示窗口
      //   store.commit('flightPatrol/SET_showTip', true);
      // });
      switch (data.name) {
        case '点检索':
          // spot();
          lineAndNoodles('CircleEx');
          break;
        case '自由线':
          lineAndNoodles('PolyLineEx');
          break;
        case '行车线':
          const src = require('./assets/rise.png');
          lane(src, 0);
          break;

        case '面检索':
          lineAndNoodles('PolygonEx');
          break;
        default:
          break;
      }
      // nextTick(() => {
      //   // 显示ESC提示窗口
      //   store.commit('flightPatrol/SET_showTip', false);
      // });
    }

    // 退出操作
    function signOut(val?: string) {
      const obj = {
        active: false,
        childrenFlag: false,
        icon: '',
        name: '',
        type: val || '',
      };
      getCententModelBtn(obj);
      store.commit('closeModle/SET_closeModle', {
        name: '资源检索',
        flag: false,
      });
    }
    // 按键取消方法
    function keyDownCancel(e: any) {
      if (e.key === 'Escape' && keyDownFlag.value) {
        signOut();
        keyDownFlag.value = false;
      }
    }
    // 按键取消
    function keyDown() {
      addFun('keydown', keyDownCancel);
    }
    onMounted(() => {
      keyDown();
    });
    onUnmounted(() => {
      deleteFun('keydown', keyDownCancel);
    });

    watchEffect(() => {
      if (store.state.retrieval.isClosePeripheralSearch) {
        close();
      }
    });
    watch(
      () => store.state.flightPatrol.escShow,
      (val, old) => {
        if (!val) {
          RightPopupObj.value.address = {};
          RightPopupFlag.value = false;
          loadingMap();
          RightPopups.value.init();
        }
      },
    );
    return {
      // 控制弹窗显示
      RightPopupFlag,
      RightPopups,
      // 选中功能
      getCententModelBtn,
      // 获取弹窗传过来的值
      getRightPopupMsg,
      // 关闭弹窗
      closeRightPopup,
      // 初始化地图
      loadingMap,
      // 圆点中心位置
      centerCircle,
      // 绘制圆并且进行检索
      renderCircle,
      // 控制显示的头部
      controlVisHeader,
      // 点信息
      RightPopupObj,
      solrData,
      solrParams,
      close,
    };
  },
});
</script>

<style lang="scss" module>
.searchScope {
}
</style>
