import { ref, getCurrentInstance, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

// 点、线、面、其他标绘业务逻辑
import spot from '@/product/Coplotting/module/mainLogicJS/spot';
import line from '@/product/Coplotting/module/mainLogicJS/line';
import lineOrNoodles from '@/product/Coplotting/module/mainLogicJS/lineOrNoodles';
// 点线面的渲染
import spotOrLineOrNoodles from '@/product/Coplotting/module/mainLogicJS/spotOrLineOrNoodlesRender';
// 默认样式
import defaultStyle from '@/product/Coplotting/module/mainLogicJS/defaultStyle';
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';

// websocket
const connectWebsocket = require('@/product/Coplotting/mainCapacity/websocket/websocket').default;

interface AddStateDialog {
  open: () => void;
  getRecentPlatform: () => void;
  getAllPlatform: () => void;
}

function init() {
  // 获取全局参数
  const instance = getCurrentInstance();
  const { $http, $mapSetSpot }: any = instance?.appContext.config.globalProperties;
  const InvitePopStepOneRef = ref<null | AddStateDialog>(null); // 邀请协作
  const store = useStore(); // 使用vuex
  const MapPopups = ref<HTMLElement | null>(null);
  const renderData = ref<any>([]);
  const mapIds = ref<number>(0);
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
  // 渲染点线面的方法
  const { spotOrLineOrNoodlesRender } = spotOrLineOrNoodles($http, MapPopups);
  // 模板数据
  const listData = ref([]);
  // SelectTemplate El
  const SelectTemplates = ref<any>(null);
  // 已选择的模板的数据
  const checkList = ref([]);
  // 控制选择模板弹窗显示
  const controlSTPopupFlag = ref(false);
  // 类型按钮的值
  const typeVal = ref(0);
  // 模板的id
  const templateType = ref(0);
  // 协同标绘数据
  const collaborativePlottingData = ref<any>([]);
  // 图层数据el
  const LayerDatas = ref<HTMLElement | null | any>(null);
  // 用于记录图层数据绘制到地图上的图层名
  const mapCovName = ref<any>([]);
  // 设置落点的script
  const { setDrawConverge } = $mapSetSpot;
  // 图例控制数据
  const controlVis = ref<any>([
    'risk', // 风险隐患
    'material', // 物资库
    'protect', // 防护目标
    'refuge', // 避难场所
    'camera', // 摄像头
    'team', // 应急队伍
    'equipment', // 应急装备库
    'device', // 会场终端
    'colony', // 集群终端
    'wecomm', // wecomm
    'personnel', // 现场人员
  ])
  // 获取模板内容的数据
  function getTemplateContert() {
    const request = {
      method: 'get',
      service: 'coplotting',
      url: '/assist/assisttemplatebasicclassrelated/list',
      params: {
        type: typeVal.value,
        templateTypeId: templateType.value,
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0) {
        // 点图标要进行路劲拼接
        if (typeVal.value === 0) {
          response.data.map((e: any) => {
            if (e.iconUrl) {
              e.src = (window as any).config.baseURL + e.iconUrl;
            }
          });
        } else {
          response.data.map((e: any) => {
            e.stylePropertyJson.strokeDashstyle =
              e.stylePropertyJson.lineType === 0 ? 'dash' : 'solid';
          });
        }
        renderData.value = response.data;
        console.log(renderData.value);
      }
    });
  }
  // 获取模板类型列表
  function getTemplateList() {
    const request = {
      method: 'get',
      service: 'coplotting',
      url: '/assist/assisttemplatetype/list',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    $http(request).then((res: any) => {
      // console.log(res);
      if (res.code === 0 && res.data) {
        listData.value = res.data;
        checkList.value = res.data.reduce((pre: any, e: any) => {
          pre.push(e.id);
          return pre;
        }, []);
        console.log(res.data, checkList.value);
        templateType.value = res.data[0].id;
        getTemplateContert();
      }
    });
  }
  getTemplateList();
  // 获取消息
  function getSelectTempMsg(params: any) {
    controlSTPopupFlag.value = false;
    console.log(params);
    if (params.type === 'checkData') {
      listData.value = params.checkData;
      checkList.value = params.checkData.reduce((pre: any, ele: any) => {
        pre.push(ele.id);
        return pre;
      }, []);
      if (SelectTemplates.value) {
        SelectTemplates.value.init();
      }
    }
  }
  // 根据mapid查询整个地图的图形
  function getAllMapCov(mapId: any) {
    const request = {
      method: 'get',
      service: 'coplotting',
      url: '/assist/assistmarkrecord/list',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        mapId,
        type: '',
        key: '',
      },
    };
    $http(request).then((res: any) => {
      // console.log(res);
      if (res.code === 0 && res.data) {
        console.log('搜索标注', res.data);
        if (MapPopups.value) {
          spotOrLineOrNoodlesRender(res.data);
        }
        // LayerDatas.value.checkedAll();
      }
    });
  }
  // 获取协作标绘数据
  function getCollaborativePlottingData(mapId: any) {
    const request = {
      method: 'get',
      service: 'coplotting',
      url: '/assist/assistinvitecooperaterecord/getInviteCooperateRecordList',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        mapId,
      },
    };
    $http(request).then((res: any) => {
      console.log(res);
      if (res.code === 0 && res.data) {
        collaborativePlottingData.value = res.data.list || [];
      }
    });
  }
  // 删除某个协助
  function deleteColl(params: any) {
    const request = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistinvitecooperaterecord/delete',
      headers: {
        'Content-Type': 'application/json',
      },
      data: [params.id],
    };
    $http(request).then((res: any) => {
      console.log(res);
      if (res.code === 0) {
        getCollaborativePlottingData(mapIds.value);
      }
    });
  }
  // 保存地图
  function saveEvenetMap() {
    const request = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistmap/save',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        eventId: store.state.event?.id || 0, // 事件id
        mapName: store.state.event?.title || '', // 地图名称
        eventType: 1, // 事件类型
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0) {
        const mapId = response.data; // 地图id
        mapIds.value = mapId;
        store.commit('coplotting/SET_NEW__MAPID', Number(mapId));
        getAllMapCov(mapId);
        getCollaborativePlottingData(mapId);
      }
    });
  }
  // 查询地图列表
  function findMapList() {
    const request = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistmap/getAssistMapEntityVOList',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        mapType: 1, // 要获取的地图类型（0：回收站地图，1：我的地图，2：协作地图）
        eventId: store.state.event?.id || 0,
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0) {
        // 如果查询结果为空就进行生成
        if (
          response.data &&
          response.data.list &&
          Array.isArray(response.data.list) &&
          response.data.list.length !== 0
        ) {
          const mapId = response.data.list[0].id; // 地图id
          mapIds.value = mapId;
          console.log(mapId);
          store.commit('coplotting/SET_NEW__MAPID', Number(mapId));
          getAllMapCov(mapId);
          getCollaborativePlottingData(mapId);
        } else {
          saveEvenetMap();
        }
      }
    });
  }
  // 清空其他图层
  function initMapCovg() {
    const promiseAll = [unInitSpotMap(), unInitLineOrNoodlesMap(), unInitLineMap()];
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
    const style = params.stylePropertyJson || '';
    initMapCovg().then(r => {
      switch (params.type) {
        case 'spot':
          initSpotMap().then(() => {
            setMouseStyle(style?.src || spotDafaultStyle.value.src).then((res: any) => {
              cb && cb(res);
            });
          });
          break;
        case 'line':
          initLineOrNoodlesMap().then(() => {
            drawLinePolyg('line', style || lineDafaultStyle.value.stylePropertyEntity).then(
              (res: any) => {
                cb && cb(res);
              },
            );
          });
          break;
        case 'noodles':
          initLineOrNoodlesMap().then(() => {
            drawLinePolyg('polygon', style || noodleDafaultStyle.value.stylePropertyEntity).then(
              (res: any) => {
                cb && cb(res);
              },
            );
          });
          break;
        case 'polygonEx':
          initLineOrNoodlesMap().then(() => {
            drawLinePolyg('polygon', style || noodleDafaultStyle.value.stylePropertyEntity).then(
              (res: any) => {
                cb && cb(res);
              },
            );
          });
          break;
        case 'circleEx':
          initLineMap(0.5, style || noodleDafaultStyle.value.stylePropertyEntity).then(() => {
            newDrawFeature('CircleEx', 'noodles').then((res: any) => {
              cb && cb(res);
            });
          });
          break;
        case 'rectangle':
          initLineMap(0.5, style || noodleDafaultStyle.value.stylePropertyEntity).then(() => {
            newDrawFeature('Rectangle', 'noodles').then((res: any) => {
              cb && cb(res);
            });
          });
          break;
        case 'arrow':
          initLineMap(0, style || otherDafaultStyle.value.stylePropertyEntity).then(() => {
            newDrawFeature('DiagonalArrow', 'other').then((res: any) => {
              cb && cb(res);
            });
          });
          break;
        case 'doubleArrow':
          initLineMap(0, style || otherDafaultStyle.value.stylePropertyEntity).then(() => {
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
  // 接受通用工具发送的消息
  function getGeneralToolsMsg(params: any) {
    console.log(params);
    const openDeta = {
      handleType: 'add', // 操作类型 add添加 vis显示 edit编辑
      handleData: {}, // 操作的数据 包括获取详情的id
      flag: false, // 打开或者关闭
      title: '', // 详情弹窗时的模块 标注详情
    };
    store.commit('coplotting/SET_detailsPopUp', openDeta);
    openDrawEvent(params, (res: any) => {
      drawComplete(true, '标注详情');
    });
  }
  // 获取从模板标绘发送过来的消息
  function getSelectTemplateMsg(params: any) {
    console.log(params);
    templateType.value = params.id;
    getTemplateContert();
  }
  // 获取选中模板的数据
  function getTemplateContentMsg(params: any) {
    console.log(params);
    if (params.moduleType === 'btn') {
      typeVal.value = params.data.id;
      getTemplateContert();
    } else if (params.data.className && params.data.basicClassId) {
      params.className = params.data.className;
      params.basicClassId = params.data.basicClassId;
      params.stylePropertyJson = params.data.stylePropertyJson;
      if (params.type === 'arrow' || params.type === 'doubleArrow') {
        params.stylePropertyJson.CLASS_NAME =
          params.type === 'arrow'
            ? 'SuperMap.Geometry.GeoDiagonalArrow'
            : 'SuperMap.Geometry.GeoDoubleArrow';
      }
      store.commit('coplotting/SET_drawingWventsData', params);
    }
  }
  // 取消绘制 或者 完成绘制
  function cancelDraw(dataObj: any) {
    initMapCovg();
    if (dataObj.handleType === 'vector') {
      console.log(dataObj.editLocationData);
      spotOrLineOrNoodlesRender(dataObj.editLocationData);
    }
  }

  const urlByKey: Record<string, string> = {
    protect: useMapMarker('防护目标'),
    risk: useMapMarker('风险隐患'),
    refuge: useMapMarker('避难场所'),
    material: useMapMarker('应急物资库'),
    camera: useMapMarker('监控'),
    cameraOffLine: useMapMarker('监控', 0),
    device: useMapMarker('会场终端'),
    deviceOffLine: useMapMarker('会场终端', 0),
    colony: useMapMarker('集群终端'),
    colonyOffLine: useMapMarker('集群终端', 0),
    wecomm: useMapMarker('wecomm'),
    personnel: useMapMarker('联系人'),
    team: useMapMarker('应急队伍'),
    equipment: useMapMarker('应急装备库'),
    task: useMapMarker('任务'),
    medical: useMapMarker('医疗'),
  };

  // 从图层数据中获取到的数据
  function getLayerDataMsg(params: any, addFlag: boolean = true, addEventlist?: any, map?: any) {
    // console.log(params, addFlag, 'params');
    if (addFlag) {
      mapCovName.value = [];
    }
    params.forEach((x: any) => {
      x.src = urlByKey[x.key];
      if (x.type === 'offLine') {
        x.src = urlByKey[`${x.key}OffLine`];
      }
      x.data.map((e: any) => {
        e.markType = 0;
        e.handleType = x.key;
      });
      x.data.eventId = store.state.event?.id;
      if (addFlag) {
        (window as any).map.clearDrawConvergeData(x.key);
        mapCovName.value.push(x.key);
      }
      setDrawConverge(x.key, x.data, { img: x.src, width: 40, height: 40 }, addEventlist, map);
    });
  }
  // 全选
  function checkedAll(e: any) {
    if (e.target.nodeName === 'INPUT') {
      if (LayerDatas.value) {
        LayerDatas.value.checkedAll();
      }
    }
  }
  // 反选
  function antiCheck(e: any) {
    if (e.target.nodeName === 'INPUT') {
      if (LayerDatas.value) {
        LayerDatas.value.antiCheck();
      }
    }
  }
  // socket回调
  function websocketCallback(params: any) {
    const result: any = JSON.parse(params.body);
    // console.log('获得的数据', result);
    if (result.msgType === 3002) {
      // 刷新分组
      store.commit('coplotting/SET_REFRASHGROUP', true);
      store.commit('coplotting/SET_REFRASHCOOP', true);
      const mapId = store.state.coplotting.mapId;
      getAllMapCov(mapId);
    } else if (result.msgType === 3001) {
    }
  }
  // 控制详情弹窗
  watch(
    () => store.state.coplotting.detailsPopUp,
    newV => {
      // console.log(newV);
      if (!newV.flag) {
        initMapCovg();
      }
    },
  );
  // 调起绘制事件的数据 模板标绘
  watch(
    () => store.state.coplotting.drawingWventsData,
    newV => {
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
  // 绘制点线面或者其他图形完成时
  watch(
    () => store.state.coplotting.coverageBeforDraw,
    newV => {
      initMapCovg();
      spotOrLineOrNoodlesRender(newV.handleData);
    },
  );
  // 弹窗点击删除时
  watch(
    () => store.state.coplotting.deleteId,
    newV => {
      console.log(newV);
    },
  );
  // 取消绘制 或者 完成绘制
  watch(
    () => store.state.coplotting.cancelDraw,
    newV => {
      console.log(newV);
      cancelDraw(newV.handleData);
    },
  );
  // 监听资源检索启动情况
  watch(
    () => store.state.retrieval.retrievalStartupStatus,
    newV => {
      console.log(mapCovName.value);
      if (newV) {
        if (store.state.retrieval.legendState) {
          mapCovName.value.forEach((e: any) => {
            (window as any).map.setCoverageShow(e);
          });
          controlVis.value.forEach((e: any) => {
            (window as any).map.setCoverageShow(e);
          });
        }
      } else {
        mapCovName.value.forEach((e: any) => {
          (window as any).map.setCoverageHide(e);
        });
        controlVis.value.forEach((e: any) => {
          (window as any).map.setCoverageHide(e);
        });
      }
    },
  );
  // 监听事件切换改变地图
  watch(
    () => store.state.event,
    newV => {
      (window as any).map.clearAtPresentMarkData((window as any).mapCoverageName.mark); // 切换事件时清空点图层
      (window as any).map.clearAtPresentMarkData((window as any).mapCoverageName.event); // 切换事件时清空点图层
      (window as any).map.clearAtPresentMarkData((window as any).mapCoverageName.search); // 切换事件时清空关键字图层
      (window as any).map.clearAtPresentVectorData((window as any).mapCoverageName.vector); // 切换事件时清空标绘图层
      (window as any).map.clearAtPresentVectorData((window as any).mapCoverageName.edit); // 切换事件时清空编辑图层
      findMapList(); // 重新加载数据
      // 清空数据图层
      mapCovName.value.forEach((e: any) => {
        (window as any).map.clearDrawConvergeData(e);
      });
    },
  );
  // 分享成功之后进行数据刷新
  watch(
    () => store.state.coplotting.isRefrashCoop,
    newV => {
      if (newV) {
        getCollaborativePlottingData(mapIds.value);
      }
    },
  );
  // 打开邀请协作弹框
  function InviteFun() {
    if (InvitePopStepOneRef.value) {
      InvitePopStepOneRef.value.open();
      InvitePopStepOneRef.value.getRecentPlatform();
      InvitePopStepOneRef.value.getAllPlatform();
    }
  }
  onMounted(() => {
    console.log('指挥端链接websocket');
    (window as any).connectPlatform = connectWebsocket.connect(websocketCallback); // 链接websocket
    if (store.state.event && store.state.event.id) {
      // findMapList(); // 重新加载数据
    }
  });
  return {
    // 数据加载的图层名记录空间
    mapCovName,
    // 模板内容数据
    renderData,
    // 地图弹窗
    MapPopups,
    // 标绘模板的数据
    listData,
    // SelectTemplate El
    SelectTemplates,
    // 已选择的模板的数据
    checkList,
    // 获取通用工具发送过来的消息
    getGeneralToolsMsg,
    // 获取从模板标绘发送过来的消息
    getSelectTemplateMsg,
    // 获取选中模板的数据
    getTemplateContentMsg,
    // 控制选择模板弹窗显示
    controlSTPopupFlag,
    // 选择模板弹窗传过来的消息
    getSelectTempMsg,
    // 协同标绘数据
    collaborativePlottingData,
    // 删除某个协助
    deleteColl,
    // 图层数据
    LayerDatas,
    // 全选
    checkedAll,
    // 反选
    antiCheck,
    // 从图层数据中获取到的数据
    getLayerDataMsg,
    InvitePopStepOneRef,
    InviteFun,
    // 使用的图标
    urlByKey,
  };
}
export default init;
