import { ref, watch, onMounted } from 'vue';
// 获取图标
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import { searchMultiTypeResource,plottingRetrieval } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';
interface PlottingResult {code?:number,data?: object[],message?: null, success?:boolean};
function init(instance: any, store: any, modelName: string) {
  console.log(instance);
  const { $http, $mapSetSpot }: any = instance?.appContext.config.globalProperties;
  const coverObj = ref<any>({
    spotName: `${modelName}spot`,
    noodles: `${modelName}noodles`,
  });
  // 设置落点的script
  const { setDrawConverge } = $mapSetSpot;
  // 右边弹窗
  const RightPopups: any = ref<HTMLElement | null>(null);
  // 字段表
  const fieldTable = ref<any>({
    风险隐患: {
      key: 'risk',
      name: '风险隐患',
      src: '',
    },
    防护目标: {
      key: 'protect',
      name: '防护目标',
      src: '',
    },
    应急物资库: {
      key: 'material',
      name: '应急物资库',
      src: '',
    },
    避难场所: {
      key: 'resource_area',
      name: '避难场所',
      src: '',
    },
    监控摄像头: {
      key: 'camera',
      name: '监控',
      src: '',
    },
    会场终端: {
      key: 'device',
      name: '会场终端',
      src: '',
    },
    集群终端: {
      key: 'colony',
      name: '集群终端',
      src: '',
    },
    wecomm终端: {
      key: 'wecomm',
      name: 'wecomm终端',
      src: '',
    },
    人员: {
      key: 'personnel',
      name: '联系人',
      src: '',
    },
    应急队伍: {
      key: 'team',
      name: '应急队伍',
      src: '',
    },
    risk: {
      key: '风险隐患',
      src: '',
    },
    protect: {
      key: '防护目标',
      src: '',
    },
    material: {
      key: '应急物资库',
      src: '',
    },
    refuge: {
      key: '避难场所',
      src: '',
    },
    camera: {
      key: '监控摄像头',
      src: '',
    },
    device: {
      key: '会场终端',
      src: '',
    },
    colony: {
      key: '集群终端',
      src: '',
    },
    wecomm: {
      key: 'wecomm终端',
      src: '',
    },
    personnel: {
      key: '人员',
      src: '',
    },
    team: {
      key: '应急队伍',
      src: '',
    },
  });
  // solr请求的参数
  const solrParams = ref<object | any>({ polygon: '', r: 500 });
  // 行车线用到的图层名数据
  const laneCovNameArr = ref<any>([]);
  // 落点图层名的数据
  const spotCovNameArr = ref<any>([]);
  // RightPopup 单前模块 地址 规划 数据
  const RightPopupObj = ref<any>({
    selfModel: {},
    address: {
      area: '',
    },
  });
  // 圆心
  const centerCircle = ref<any>({});
  // 线的数据
  const lineAndNoodlesData = ref<any>([]);
  // 滑竿传过来的值 默认500
  const sliderChange = ref(500);
  // 控制弹窗显示
  const RightPopupFlag = ref<any>(false);
  // 初始化地图
  function loadingMap() {
    (window as any).map.closeClickDroppoint();
    (window as any).map.closeActivateDrawFeature(coverObj.value.noodles);
    (window as any).map.clearAtPresentVectorData(coverObj.value.noodles);
    (window as any).map.clearAtPresentMarkData(coverObj.value.spotName);
    // 恢复鼠标手
    (window as any).map.restoreDefaultStyle();
    if (laneCovNameArr.value.length !== 0) {
      laneCovNameArr.value.forEach((e: string) => {
        (window as any).map.clearDeleteCoverage(e);
      });
    }
    if (spotCovNameArr.value.length !== 0) {
      spotCovNameArr.value.forEach((e: string) => {
        (window as any).map.clearDeleteCoverage(e);
      });
    }
    laneCovNameArr.value = [];
    spotCovNameArr.value = [];
  }
  // 关闭弹窗
  function closeRightPopup() {
    RightPopupFlag.value = false;
    loadingMap();
    // 显示隐藏资源
    store.commit('retrieval/SET_retrievalStartupStatus', true);
  }
  // 弹窗事件绑定
  function popupEvent(key: string, data: any, imgInfo: object) {
    data.eventId = store.state.event?.id;
    setDrawConverge(key, data, imgInfo);
  }
  // solr请求
  async function solrData() {
    const typeList = store.state.retrieval.retrievalSelectType;
    /*
     字典表 fieldTable
    */
    let resoureTypeList = typeList.reduce((pre: any, e: any) => {
      switch ((e as any).typeKey) {
        case 'protect':
          pre.push(108);
          break;
        case 'risk':
          pre.push(113);
          break;
        case 'refuge':
          pre.push(107);
          break;
        case 'material':
          pre.push(106);
          break;
        case 'camera':
          pre.push(101);
          break;
        case 'device':
          pre.push(102);
          break;
        case 'colony':
          pre.push(102);
          break;
        case 'wecomm':
          // pre.push(102);
          break;
        case 'personnel':
          pre.push(103);
          break;
        case 'team':
          pre.push(109);
          break;
        default:
          break;
      }
      return pre;
    }, []);
    resoureTypeList = Array.from(new Set(resoureTypeList));
    // console.log('测试数据');
    // console.log(solrParams.value.polygon);
    const request = {
      id: store.state.event?.id, // 事件id，任务搜索时非空
      resoureTypeList, // 搜索资源类型列表，searchAllType为0时使用
      longitude: solrParams.value.longitude, // 周边搜索，中心点经度
      latitude: solrParams.value.latitude, // 周边搜索，中心点纬度
      radius: solrParams.value.r / 1000, // 周边搜索，半径，单位km
      solrType: solrParams.value.solrType,
      polygonStr: solrParams.value.polygon,
      mapIdsStr: store.state.mapIdsStr,
    };
    let plottingResult:PlottingResult = {code:1,data:[],message:null,success:false};
    (window as any).map?.clearAtPresentMarkData('图例-标绘数据');
    if(resoureTypeList.length !== 1) {
      let result = (await plottingRetrieval(request) || {});
      Object.assign(plottingResult,result);
      const arrData:object[] = plottingResult.data || [];
      const handlerData = arrData.reduce((pre:any,x:any) => {
        const childrenData = x.basicClassList.reduce((childData:any,child:any)=>{
          (child?.list||[]).forEach((ele:any) => {
            ele.url = (window as any).config.baseURL + ele.statusIconUrl;
          });
          const childObj = {
            allDrawn: true,
            children: child.list,
            count: child.list?.length || 0,
            laber: child.className,
            typeName: child.className,
          }
          childData.push(childObj)
          return childData;
        }, []);
        pre = pre.concat(childrenData)
        return pre;
      }, []);
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', handlerData);
      plottingResult.data = handlerData
    }
    searchMultiTypeResource(request).then((res: any) => {
      if (res.code === 0) {
        spotCovNameArr.value.forEach((e: string) => {
          (window as any).map.clearDeleteCoverage(e);
        });
        const handleData = res.data.reduce((pre: any, x: any) => {
          if (x.typeName !== '设备') {
            x.children = x.list;
            x.laber = x.typeName;
            pre.push(x);
          } else {
            // 设备的时候要做数据筛选 筛选出三类结果 会场终端 集群终端 wecomm
            const deviceData = x.list.reduce(
              (p: any, e: any) => {
                switch (e.type) {
                  case '1':
                    p[0].children.push(e);
                    break;
                  case '2':
                    p[1].children.push(e);
                    break;
                  case '3':
                    p[2].children.push(e);
                    break;
                  default:
                    break;
                }
                return p;
              },
              [
                {
                  laber: '会场终端',
                  children: [],
                },
                {
                  laber: '集群终端',
                  children: [],
                },
                {
                  laber: 'wecomm终端',
                  children: [],
                },
              ],
            );
            console.log(deviceData);
            pre = pre.concat(deviceData);
          }
          return pre;
        }, []);

        const newData = typeList.reduce((pre: any, e: any) => {
          const laber = fieldTable.value[e.typeKey] ? fieldTable.value[e.typeKey].key : '';
          const arr = handleData.filter((x: any) => x.laber === laber);
          if(arr && arr.length && arr[0].children && arr[0].children.length ) {
            pre = pre.concat(arr);
          }
          return pre;
        }, []);
        // console.log(newData);
        newData.forEach((e: any) => {
          const key = e.laber;
          const img = useMapMarker(fieldTable.value[key].name, 1);
          const imgInfo = {
            height: 40,
            width: 40,
            img,
          };
          // 离线
          const offLineArr: any = [];
          const spotArrData = e.children.reduce((pre: any, x: any) => {
            x.img = img;
            // 类型
            x.handleType = fieldTable.value[key].key;
            x.covName = fieldTable.value[key].name;
            x.name = x.name || x.deviceName;
            x.id = x.id || x.deviceId;
            if (key === '监控摄像头' || key === '会场终端' || key === '集群终端') {
              if (x.status !== '0') {
                x.img = useMapMarker(fieldTable.value[key].name, 0);
                // x.checkedState = true;
                offLineArr.push(x);
              } else {
                // 在线
                pre.push(x);
              }
            } else {
              pre.push(x);
            }
            return pre;
          }, []);
          spotCovNameArr.value.push(fieldTable.value[key].name);
          // 只设置在线
          popupEvent(fieldTable.value[key].name, spotArrData, imgInfo);
          // 设置离线
          if (offLineArr.length) {
            const offLineImgInfo = JSON.parse(JSON.stringify(imgInfo));
            offLineImgInfo.img = useMapMarker(fieldTable.value[key].name, 0);
            popupEvent(fieldTable.value[key].name, offLineArr, offLineImgInfo);
          }
        });
        // console.log(newData);
        if(plottingResult.code === 0) {
          console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', plottingResult.data);
          newData.push({
            children: plottingResult.data,
            laber: "协作标绘",
            list: plottingResult.data,
            type: 116,
            typeName: '协作标绘',
          })
        }

        if (RightPopups.value) {
          RightPopups.value.dataPresentationData = newData;
        }
      } else {
        if (RightPopups.value) {
          RightPopups.value.dataPresentationData = [];
        }
      }
    });
  }
  // 渲染圆
  function renderCircle(range: number) {
    let promise = new Promise((resolve, reject) => {
      (window as any).map.clearAtPresentVectorData(coverObj.value.noodles);
      // 渲染数据
      const circleData: any = {
        // longitude: Number(centerCircle.value.longitude.toFixed(5)) - 0.00006,
        // latitude: Number(centerCircle.value.latitude.toFixed(5)) + 0.00008,
        longitude: centerCircle.value.longitude,
        latitude: centerCircle.value.latitude,
        r: range,
      };
      console.log('%c [ circleData ]', 'font-size:13px; background:pink; color:#bf2c9f;', circleData);
      const circleStyle: any = {
        strokeColor: '#ffffff',
        strokeWidth: 2,
        fillColor: '#fff',
        fillOpacity: 0.1,
      };
      ((window as any) as any).map
        .vectorDrawCir(coverObj.value.noodles, circleData, circleStyle)
        .then(() => {
          // 关闭点击获取点信息
          (window as any).map.closeClickDroppoint();
          // 恢复鼠标手
          (window as any).map.restoreDefaultStyle();
          RightPopupFlag.value = true;
          // console.log('圆的数据', circleData, sliderChange.value);
          Object.assign(solrParams.value, circleData);
          solrParams.value.solrType = 1;
          solrParams.value.r = range;
          solrData();
          resolve('');
        });
    });
    return promise;
  }
  // 绘制线的缓冲区
  function renderLine(v: number) {
    (window as any).map
      .renderBuffer(coverObj.value.noodles, lineAndNoodlesData.value, v, true)
      .then((res: any) => {
        // 线的点
        solrParams.value.r = sliderChange.value;
        console.log(res.CovgData);
        const polygonArr = res.CovgData.reduce((pre: any, x: any, i: number) => {
          let oneStr = '';
          const joinArr = x.reduce((p: any, ele: any, ind: number) => {
            const elStr = ele.join(' ');
            if (ind === 0) {
              oneStr = elStr;
            }
            p.push(elStr);
            return p;
          }, []);
          joinArr.push(oneStr);
          pre.push(joinArr.join(','));
          return pre;
        }, []);
        solrParams.value.solrType = 3;
        solrParams.value.polygon = polygonArr;
        console.log('线的数据', res.CovgData, sliderChange.value);
        solrData();
      });
  }
  // 获取弹窗传过来的值
  function getRightPopupMsg(params: any) {
    console.log(params);
    switch (params.type) {
      case 'sliderChange':
        // 滑竿的值
        sliderChange.value = params.data;
        const { name } = RightPopupObj.value.selfModel;
        if (name === '点检索') {
          renderCircle(params.data);
        } else if (name === '自由线' || name === '行车线') {
          renderLine(params.data);
        }
        break;
      case 'selectPath':
        // 清楚原来行车线
        if (laneCovNameArr.value.length !== 0) {
          laneCovNameArr.value.forEach((e: string) => {
            (window as any).map.clearDeleteCoverage(e);
          });
        }
        laneCovNameArr.value = [];
        // 选择的路线
        lineAndNoodlesData.value = params.data;
        const obj = {
          type: 'SuperMap.Geometry.GeoPolyline',
          cps: {
            controlPoints: lineAndNoodlesData.value,
          },
          style: {
            strokeColor: '#08c189',
            strokeWidth: 5,
            fillColor: 'skyblue',
            fillOpacity: 0.5,
            fontColor: 'pink',
            fontSize: '20px',
          },
          id: coverObj.value.noodles,
        };
        (window as any).map.renderGraph(coverObj.value.noodles, [obj], '');
        renderLine(500);
        break;
      default:
        break;
    }
  }
  // 监听资源检索数据改变情况
  watch(
    () => store.state.retrieval.retrievalSelectType,
    (newV, oldV) => {
      // 发送改变时根据类型请求对应接口
      // console.log(newV, oldV);
      for (const key in fieldTable.value) {
        const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
        if (reg.test(key)) {
          (window as any).map.clearAtPresentVectorData(key);
        }
      }
      solrData();
    },
  );
  watch(RightPopupObj.value, newV => {
    console.log(newV);
    if (newV.address && RightPopups.value) {
      RightPopups.value.selfModel = {
        address: newV.address,
        ...newV.selfModel,
        endAddress: newV.endAddress,
      };
    }
  });
  onMounted(() => {
    const style = {
      strokeColor: '#ffffff',
      strokeWidth: 2,
      fillColor: 'skyblue',
      fillOpacity: 0.3,
      fontColor: '#1afa29',
      fontSize: '20px',
    };
    // 生成相关图层
    if ((window as any).map) {
      (window as any).map.createdMarkCoverage(coverObj.value.spotName);
      (window as any).map.createdVectorCoverage(coverObj.value.noodles, style);
    }
  });
  return {
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
  };
}
export default init;
