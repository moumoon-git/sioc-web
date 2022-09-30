/* eslint-disable no-unused-expressions */
<template>
  <div :class="$style.coplottingMain">
    <!-- 头部 -->
    <header>
      <HeaderModuleView
        :handle-data="headerHandleData"
        @goback="goback"
      />
    </header>
    <!-- 左边功能按钮 -->
    <aside
      v-if="isFromCoop !== 'coop' && isFromCoop !== 'share'"
      :class="$style.LeftModuleBtnViewWrap"
    >
      <LeftModuleBtnView @selectModule="selectModule" />
    </aside>
    <!-- 左边搜索 -->
    <aside :class="$style.LeftSearchWrap">
      <LeftSearch
        @sendMsg="getLeftSearchMsg"
        @getSearchData="getSearchData"
      />
    </aside>
    <!-- 中间绘制功能 -->
    <aside
      v-if="isFromCoop !== 'share'"
      :class="$style.ConterModelWrap"
    >
      <ConterModel
        ref="ConterModels"
        @selectModel="conterModel"
      />
    </aside>
    <!-- 地图挂载 -->
    <div
      id="superMap"
      :class="$style.superMap"
    />
    <!-- 操作栏 -->
    <MapOperation ref="MapOperationRef" />
    <MapPlottingView
      ref="MapPlottingViews"
      :title="MapPlottingTitle"
    />
    <!-- 左下漂浮窗 -->
    <div :class="$style.LeftBottomFloat">
      <LeftBottomFloat />
    </div>
    <div v-show="false">
      <MapPopup ref="MapPopups" />
    </div>
    <div v-show="false">
      <MapConterPopup ref="MapConterPopups" />
    </div>
    <BatchImport ref="BatchImports" />
    <WsMessage
      ref="WsMessageRef"
      :to-path="'/plottingIndex'"
      :content="wsMessageContent"
      :map-id="wsMessageId"
    />
    <!-- 数据统计弹窗 -->
    <StatisticDialog ref="StatisticDialogRef" />
    <!-- 分享弹窗 -->
    <ShareIndexPop ref="ShareIndexPopRef" />
    <!-- 查看更多的弹窗 -->
    <SeeMore
      v-if="seeMoreFlag"
      :active-name="seeMoreActive"
    />
  </div>
</template>

<script lang="ts" >
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  getCurrentInstance,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';
import WsMessage from '@/product/Coplotting/module/components/WsMessage.vue'; // 消息弹窗
import { uds } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
// 头部导航
import HeaderModuleView from '@/product/Coplotting/module/HeaderModule/HeaderModuleView.vue';
// 左边功能按钮
import LeftModuleBtnView from '@/product/Coplotting/module/LeftModuleBtn/LeftModuleBtnView.vue';
// 左边搜索
import LeftSearch from '@/product/Coplotting/module/LeftSearch/LeftSearchView.vue';
// 中间绘制图形块
import ConterModel from '@/product/Coplotting/module/ConterModel/ConterModel.vue';
import BatchImport from '@/product/Coplotting/module/ConterModel/components/BatchImport.vue';
// 地图弹窗
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
// 查看更多的弹窗
import SeeMore from '@/product/Coplotting/generalparts/SeeMore/SeeMore.vue';
// 控制绘制时的操作
import MapConterPopup from '@/product/Coplotting/module/MapConterPopup/MapConterPopup.vue';
import MapOperation from '@/product/Coplotting/module/MapPlotting/PlottingMapDetail/MapOperation.vue';
import MapPlottingView from '@/product/Coplotting/module/MapPlottingView.vue';
// 左下漂浮窗
import LeftBottomFloat from '@/product/Coplotting/module/LeftBottomFloat/LeftBottomFloat.vue';
// 点线面的渲染
import spotOrLineOrNoodles from '@/product/Coplotting/module/mainLogicJS/spotOrLineOrNoodlesRender';
// 点、线、面、其他标绘业务逻辑
import spot from '@/product/Coplotting/module/mainLogicJS/spot';
import line from '@/product/Coplotting/module/mainLogicJS/line';
import lineOrNoodles from '@/product/Coplotting/module/mainLogicJS/lineOrNoodles';
// 默认样式
import defaultStyle from '@/product/Coplotting/module/mainLogicJS/defaultStyle';

// 数据统计弹窗
import StatisticDialog from '@/product/Coplotting/module/ClassificationManagement/components/StatisticTemplateManagementDialog/StatisticDialog.vue';

// 分享弹窗
import ShareIndexPop from '@/product/Coplotting/module/ShareSection/ShareIndexPop.vue';
import {
  hwe,
  addFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
// websocket
const connectWebsocket = require('@/product/Coplotting/mainCapacity/websocket/websocket').default;

export default defineComponent({
  components: {
    HeaderModuleView,
    LeftModuleBtnView,
    LeftSearch,
    ConterModel,
    BatchImport,
    MapOperation, // 操作栏
    MapPlottingView, // 弹窗
    MapPopup, // 地图弹窗
    SeeMore, // 查看更多的弹窗
    MapConterPopup,
    WsMessage, // ws消息弹窗
    // 数据统计弹窗
    StatisticDialog,
    // 左下漂浮窗
    LeftBottomFloat,
    ShareIndexPop, // 分享弹窗
  },
  setup() {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { proxy }: any = getCurrentInstance();
    const route = useRoute();
    const store = useStore(); // 使用vuex
    store.commit('coplotting/SET_NEW__MAPID', Number(route.query.mapId));
    const isFromCoop = route.query.type;
    const { $http }: any = instance?.appContext.config.globalProperties;
    console.log('11111111111111111111')
    console.log(store.state.coplotting)
    watch(
      () => store.state.coplotting.selfMap,
      (newV) => {
        let headerHandleData = store.state.coplotting.selfMap;
        if (!headerHandleData.mapName) {
          headerHandleData = JSON.parse(
            (sessionStorage as any).getItem('selfMap'),
          );
        } else {
          sessionStorage.setItem('selfMap', JSON.stringify(headerHandleData));
        }
      },
    );
    let headerHandleData = store.state.coplotting.selfMap;
    if (!headerHandleData.mapName) {
      headerHandleData = JSON.parse((sessionStorage as any).getItem('selfMap'));
    } else {
      sessionStorage.setItem('selfMap', JSON.stringify(headerHandleData));
    }
    // 写死的websocket，以后再做修改
    const wsMessageContent = ref(''); // 消息内容
    const WsMessageRef = ref<null>(null);
    // // 写死的websocket，以后再做修改

    // console.log(proxy.$root.$route)
    // console.log(proxy.$root.$router)

    const MapPlottingViews: any = ref(null);
    const MapConterPopups: any = ref(null);
    const BatchImports: any = ref(null);
    const ConterModels: any = ref(null);
    // 控制弹窗的显示内容
    const MapPlottingTitle: any = ref('');
    // 地图弹窗
    const MapPopups = ref(null);
    // 数据统计弹窗
    const StatisticDialogRef = ref<typeof StatisticDialog | null>(null);
    // 分享弹窗
    const ShareIndexPopRef = ref<null>(null);
    // 渲染点线面的方法
    const { spotOrLineOrNoodlesRender } = spotOrLineOrNoodles($http, MapPopups);
    // 点绘制的方法
    const { setMouseStyle, initSpotMap, unInitSpotMap } = spot();
    // 可编辑的线绘制 面绘制的方法
    const { initLineOrNoodlesMap, unInitLineOrNoodlesMap, drawLinePolyg } = lineOrNoodles();
    // 线绘制 面绘制的方法
    const { initLineMap, unInitLineMap, newDrawFeature } = line();
    // 获取默认样式
    const {
      spotDafaultStyle,
      lineDafaultStyle,
      noodleDafaultStyle,
      otherDafaultStyle,
    } = defaultStyle();
    // 获取cookie的值
    function getCookie(cname: string) {
      const name = `${cname}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return '';
    }
    // 根据最后一个绘制的图形设置地图中心点
    function setMapCentent() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/getLastMarkRecord',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: Number(route.query.mapId),
        },
      };
      $http(request).then((res: any) => {
        if (res.data) {
          res.data.latitude = res.data.laitude;
          (window as any).map.setCentent(res.data, 14);
        } else {
          // 设置中心点
          const lat: number = parseFloat(getCookie('latitude'));
          const lon: number = parseFloat(getCookie('longitude'));
          // let platformName = getCookie('platformName'); decodeURI()
          const datas: any = {
            longitude: lon,
            latitude: lat,
          };
          (window as any).map.setCentent(datas, 14);
        }
      });
    }
    function initMap() {
      // const map = new window.HM().init('superMap', '矢量');
      const map = new window.HM().init('superMap');
      window.map = map;
      // 初始化要改 越早创建层级越低
      (window as any).map.createdVectorCoverage(
        (window as any).mapCoverageName.edit,
      );
      (window as any).map.createdMarkCoverage(
        (window as any).mapCoverageName.mark,
      );
      (window as any).map.createdVectorCoverage(
        (window as any).mapCoverageName.vector,
      );
      setMapCentent();
    }
    // 搜索
    function getSearchData(params: any) {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: Number(route.query.mapId),
          type: '',
          key: params.val,
        },
      };
      $http(request).then((res: any) => {
        if (res.code === 0 && res.data) {
          console.log('搜索标注', res.data);
          params.cbFun && params.cbFun(res.data);
          window.map.clearAtPresentMarkData(
            (window as any).mapCoverageName.mark,
          );
          window.map.clearAtPresentVectorData(
            (window as any).mapCoverageName.vector,
          );
          window.map.closeVectorCoverageEdit(
            (window as any).mapCoverageName.edit,
          );
          window.map.clearAtPresentVectorData(
            (window as any).mapCoverageName.edit,
          );
          spotOrLineOrNoodlesRender(res.data);
        }
      });
    }
    // 刷新分组
    const MapOperationRef = ref<null>(null);
    const wsMessageId = ref(0);
    // socket回调
    function websocketCallback(params: any) {
      const result: any = JSON.parse(params.body);
      console.log('获得的数据', result);
      if (result.msgType === 3002) {
        // 刷新分组
        store.commit('coplotting/SET_REFRASHGROUP', true); // 刷新分组树
        store.commit('coplotting/SET_REFRASHCOOP', true); // 刷新协作树
        // 当有新的标注从子平台添加的时候需要定位过去
        const lat = result.content.markRecord.laitude;
        const lon = result.content.markRecord.longitude;
        const pointMapId = result.content.markRecord.mapId;
        const datas: any = {
          longitude: lon,
          latitude: lat,
        };
        if (store.state.coplotting.isDynamic) {
          if (Number(route.query.mapId) === pointMapId) {
            (window as any).map.setCentent(datas, 14);
          }
        }
      } else if (result.msgType === 3001) {
        wsMessageContent.value = JSON.parse(result.content).msg;
        wsMessageId.value = JSON.parse(result.content).mapId;
        if (WsMessageRef.value) {
          (WsMessageRef.value as any).open();
        }
      }
      getSearchData('');
    }
    onBeforeMount(() => {
      (window as any).mapCoverageName = {
        mark: '标绘页点图层',
        vector: '标绘页图层',
        edit: '标绘页编辑图层',
      };
    });
    onMounted(() => {
      initMap();
      connectWebsocket.connect(websocketCallback); // 链接websocket
      addFun('click', (e: any) => {
        (window as any).xy = e.xy;
      });
      addFun('dblclick', (e: any) => {
        (window as any).xy = e.xy;
      });
    });
    // 返回
    function goback() {
      console.log('返回');
      console.log(route.query.type);
      proxy.$root.$router.push({ path: '/',query:{ type: route.query.type }});
    }
    // 出图
    function baseImg(baseImage: any) {
      // console.log(baseImage);
    }
    // 清空其他图层
    function initMapCovg() {
      const promiseAll = [
        unInitSpotMap(),
        unInitLineOrNoodlesMap(),
        unInitLineMap(),
      ];
      return Promise.all(promiseAll);
    }
    // 绘制完成后
    function drawComplete(flag: boolean, title: string) {
      if (flag) {
        const openDeta = {
          handleType: 'add', // 操作类型 add添加 vis显示 edit编辑
          handleData: {}, // 操作的数据 包括获取详情的id
          flag: true, // 打开或者关闭
          title: title || '', // 详情弹窗时的模块 标注详情
        };
        store.commit('coplotting/SET_detailsPopUp', openDeta);
      }
    }
    // 开启绘制事件
    function openDrawEvent(params: any, cb: any) {
      const obj = {
        title: '标注详情', // 详情弹窗时的模块 标注详情
        flag: false, // 是否打开
        handleData: {}, // 传入的数据
      };
      store.commit('coplotting/SET_taggingInfo', obj);
      const style = params.stylePropertyJson || '';
      initMapCovg().then((r) => {
        switch (params.modelName) {
          case '点击定位':
            initSpotMap().then(() => {
              setMouseStyle(style?.src || spotDafaultStyle.value.src).then(
                (res: any) => {
                  cb && cb(res);
                },
              );
            });
            break;
          case '自由线':
            initLineOrNoodlesMap().then(() => {
              drawLinePolyg(
                'line',
                style || lineDafaultStyle.value.stylePropertyEntity,
              ).then((res: any) => {
                cb && cb(res);
              });
            });
            // initLineMap(0.5, lineDafaultStyle.value.stylePropertyEntity).then(() => {
            //   newDrawFeature('PolyLineEx', 'line');
            // });
            break;
          case '自由面':
            initLineOrNoodlesMap().then(() => {
              drawLinePolyg(
                'polygon',
                style || noodleDafaultStyle.value.stylePropertyEntity,
              ).then((res: any) => {
                cb && cb(res);
              });
            });
            // initLineMap(0.5, noodleDafaultStyle.value.stylePropertyEntity).then(() => {
            //   newDrawFeature('PolygonEx', 'noodles');
            // });
            break;
          case '圆形线':
            initLineMap(
              0,
              style || lineDafaultStyle.value.stylePropertyEntity,
            ).then(() => {
              newDrawFeature('CircleEx', 'line').then((res: any) => {
                cb && cb(res);
              });
            });
            break;
          case '矩形线':
            initLineMap(
              0,
              style || lineDafaultStyle.value.stylePropertyEntity,
            ).then(() => {
              newDrawFeature('Rectangle', 'line').then((res: any) => {
                cb && cb(res);
              });
            });
            break;
          case '圆形面':
            initLineMap(
              0.5,
              style || noodleDafaultStyle.value.stylePropertyEntity,
            ).then(() => {
              newDrawFeature('CircleEx', 'noodles').then((res: any) => {
                cb && cb(res);
              });
            });
            break;
          case '矩形面':
            initLineMap(
              0.5,
              style || noodleDafaultStyle.value.stylePropertyEntity,
            ).then(() => {
              newDrawFeature('Rectangle', 'noodles').then((res: any) => {
                cb && cb(res);
              });
            });
            break;
          case '单箭头':
            initLineMap(
              0,
              style || otherDafaultStyle.value.stylePropertyEntity,
            ).then(() => {
              newDrawFeature('DiagonalArrow', 'other').then((res: any) => {
                cb && cb(res);
              });
            });
            break;
          case '双箭头':
            initLineMap(
              0,
              style || otherDafaultStyle.value.stylePropertyEntity,
            ).then(() => {
              newDrawFeature('DoubleArrow', 'other').then((res: any) => {
                cb && cb(res);
              });
            });
            break;
          default:
            break;
        }
      });
    }
    // 选择的绘制模块
    function conterModel(params: any) {
      console.log(params);
      if (params.modelName === '批量导入') {
        BatchImports.value.visFlag = true;
        return;
      }
      MapPlottingTitle.value = '标注详情';
      MapPlottingViews.value.isShowMapDialog = false;
      openDrawEvent(params, () => {
        drawComplete(true, MapPlottingTitle.value);
      });
    }
    // 取消绘制 或者 完成绘制
    function cancelDraw(dataObj: any) {
      initMapCovg();
      ConterModels.value.clearActiveState();
      if (dataObj.handleType === 'vector') {
        // console.log(dataObj);
        spotOrLineOrNoodlesRender(dataObj.editLocationData);
      }
    }
    // 搜索传过来的数据
    function getLeftSearchMsg(params: any) {
      console.log(params);
      MapPlottingTitle.value = '标注详情';
      MapPlottingViews.value.isShowMapDialog = true;
    }
    // 选择功能
    function selectModule(modules: any) {
      console.log(modules);
      initMapCovg();
      switch (modules.icon) {
        case 'template':
          MapPlottingTitle.value = '模板标绘';
          MapPlottingViews.value.isShowMapDialog = true;
          break;
        case 'plotting':
          MapPlottingTitle.value = '协作标绘管理';
          MapPlottingViews.value.isShowMapDialog = true;
          break;
        case 'drawing':

          break;
        // 数据统计弹窗
        case 'statistic': {
          if (StatisticDialogRef.value) {
            StatisticDialogRef.value.open();
          }
          break;
        }
        // 分享弹窗
        case 'sharing': {
          if (ShareIndexPopRef.value) {
            (ShareIndexPopRef.value as any).open();
            (ShareIndexPopRef.value as any).platformClick();
          }
          break;
        }
        default:
          break;
      }
    }
    // 标注详情弹窗
    watch(
      () => store.state.coplotting.taggingInfo,
      (newV) => {
        console.log(newV);
        if (newV.flag) {
          // 从MapPopup.vue中传输的数据
          MapPlottingTitle.value = newV.title;
        }
        MapPlottingViews.value.isShowMapDialog = newV.flag;
      },
    );
    // 弹窗点击删除时
    watch(
      () => store.state.coplotting.deleteId,
      (newV) => {
        console.log(newV);
      },
    );
    // 绘制点线面或者其他图形时
    watch(
      () => store.state.coplotting.coverageBeforDraw,
      (newV) => {
        initMapCovg();
        spotOrLineOrNoodlesRender(newV.handleData);
      },
    );
    // 控制详情弹窗
    watch(
      () => store.state.coplotting.detailsPopUp,
      (newV) => {
        // console.log(newV);
        if (newV.flag) {
          MapPlottingTitle.value = '标注详情';
        } else {
          initMapCovg();
        }
        MapPlottingViews.value.isShowMapDialog = newV.flag;
      },
    );
    // 调起绘制事件的数据 模板标绘
    watch(
      () => store.state.coplotting.drawingWventsData,
      (newV) => {
        switch (newV.type) {
          case 'spot':
            newV.modelName = '点击定位';
            break;
          case 'line':
            newV.modelName = '自由线';
            break;
          case 'noodles':
            newV.modelName = '自由面';
            break;
          case 'other':
            newV.modelName = newV.modelType === 'doubleArrow' ? '双箭头' : '单箭头';
            break;
          default:
            break;
        }
        const data = JSON.parse(JSON.stringify(newV));
        data.stylePropertyJson
          ? data.stylePropertyJson.fillOpacity
            ? (data.stylePropertyJson.fillOpacity /= 100)
            : ''
          : '';
        data.stylePropertyJson
          ? data.stylePropertyJson.lineHeight
            ? (data.stylePropertyJson.strokeWidth = data.stylePropertyJson.lineHeight)
            : ''
          : '';
        openDrawEvent(data, (res: any) => {
          console.log(res);
          const leg = res.length;
          window.map.portPxFromLonLat(res[leg - 1]).then(() => {
            const position = {
              ...res[leg - 1],
              latitude: res[leg - 1].y,
              longitude: res[leg - 1].x,
            };
            const editObj = {
              position,
              handleType: '', // mark vector
              flag: true, // 控制绘制弹窗的显示
            };
            store.commit('coplotting/SET_editCovData', editObj);
          });
        });
      },
    );
    // 编辑图形时控制绘制弹窗的显示
    watch(
      () => store.state.coplotting.editCovData,
      (newV) => {
        // console.log(newV);
        if (newV.flag) {
          MapConterPopups.value.init(newV.xy);
        }
      },
    );
    // 取消绘制 或者 完成绘制
    watch(
      () => store.state.coplotting.cancelDraw,
      (newV) => {
        // console.log(newV);
        cancelDraw(newV.handleData);
      },
    );
    const seeMoreFlag = ref<boolean | any>(false);
    const seeMoreActive = ref<string | any>('');
    // 查看更多
    watch(
      () => store.state.coplotting.seeMoreObj,
      (newV) => {
        console.log(newV);
        seeMoreFlag.value = newV.openFlag;
        seeMoreActive.value = newV.active;
      },
    );

    onUnmounted(() => {
      const { graphicParameters } = store.state.coplotting;
      if (graphicParameters.typeId) {
        window.map
          .markScreening(
            graphicParameters.convergeName,
            graphicParameters.typeId,
          )
          .then((editCovObj: any) => {
            // 关闭拖拽 并还原之前的显示
            window.map.closeMarkDrop(editCovObj);
          });
      }
    });
    // console.log(store);
    return {
      // 头部操作数据
      headerHandleData,
      // 控制模板标绘成功和取消的弹窗
      MapConterPopups,
      // 控制右边弹窗的内容
      MapPlottingTitle,
      // 右边弹窗
      MapPlottingViews,
      // 地图弹窗
      MapPopups,
      // 返回
      goback,
      // 选择功能模块
      selectModule,
      // 获取搜索数据
      getSearchData,
      // 绘制控制按钮
      ConterModels,
      // 中间控制按钮
      conterModel,
      // 获取搜索结果点击之后的数据
      getLeftSearchMsg,
      // 批量导入
      BatchImports,
      // ws消息内容
      wsMessageContent,
      WsMessageRef,
      // 数据统计弹窗
      StatisticDialogRef,
      // 当前协作的地图id
      wsMessageId,
      // 分享弹窗
      ShareIndexPopRef,
      // 是否来自协作地图
      isFromCoop,
      // 查看更多
      seeMoreFlag,
      // 查看更多激活的模块
      seeMoreActive,
    };
  },
});
</script>

<style lang="scss" module>
.coplottingMain {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  & > header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    z-index: 9999;
    background: #fff;
  }
}
.LeftModuleBtnViewWrap {
  position: absolute;
  top: 98px;
  left: 20px;
  z-index: 9999;
  width: 84px;
  background: #ffffff;
  box-shadow: 0px 3px 5px 0px rgba(230, 232, 244, 0.46);
  border-radius: 4px;
}
.LeftSearchWrap {
  position: absolute;
  top: 98px;
  left: 140px;
  z-index: 10001;
  width: 358px;
  height: 46px;
  background: #ffffff;
  box-shadow: 0px 3px 5px 0px rgba(230, 232, 244, 0.46);
  border-radius: 4px;
}
.ConterModelWrap {
  position: absolute;
  top: 98px;
  left: 0;
  right: 0;
  z-index: 10000;
  margin: auto;
  width: 488px;
  height: 46px;
  background: #ffffff;
  box-shadow: 0px 3px 5px 0px rgba(230, 232, 244, 0.46);
  border-radius: 4px;
}
.superMap {
  width: 100%;
  height: 100%;
}
.messageCoopContent {
  font-size: 18px;
}
.LeftBottomFloat {
  position: absolute;
  bottom: 28px;
  left: 37px;
  z-index: 10000;
  height: 23%;
}
</style>
