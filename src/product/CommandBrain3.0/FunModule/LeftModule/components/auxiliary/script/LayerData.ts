import {
  getCurrentInstance, ref, onMounted, watch, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import {
  addFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
import auxiliaryScript from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/script/auxiliaryScript';
import { listAllByBounds, sectionData } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

function inits() {
  // 获取全局参数
  const instance = getCurrentInstance();
  const { $http, $ws }: any = instance?.appContext.config.globalProperties;
  const store = useStore();
  // 记录xy的移动距离
  const recordDis = ref<any | object>({ x: 0, y: 0 });
  // 渲染数据
  const { urlByKey, getLayerDataMsg } = auxiliaryScript();
  // 从接口获取到的数据
  const apiGetDataObj = ref<any>({
    risk: [], // 风险隐患
    material: [], // 物资库
    protect: [], // 防护目标
    refuge: [], // 避难场所
    camera: [], // 摄像头
    team: [], // 应急队伍
    equipment: [], // 应急装备库
    device: [], // 会场终端
    colony: [], // 集群终端
    wecomm: [], // wecomm
    personnel: [], // 现场人员
    medical: [], // 医疗机构
    task: [], // 任务
  });
  // 地图切片矩阵存储
  const mapSectionData = ref<any>([]);
  // 请求列表数据的矩阵数据
  const getListDataMatrix = ref<any>({});
  // 请求回来的数据
  const getMatrixData = ref<any>([]);
  // 操作地图
  const handleMap = ref<any>({});
  const eventObj: any = ref({
    click: (e: any) => {
      // 点击时e必须有信息并且开启了大数据量切片处理
      if (e && e.sectionFlag) {
        handleMap.value.pixelToLatAndLon((window as any).xy).then((r: any) => {
          // 获取最大层级
          handleMap.value.getMapMaxZoom().then((maxRes: any) => {
            /*
              如果单前等级跟最大等级一样并且开启了大数据量切片服务，查看这个点是多数据的聚合点还是散开的单信息点
              多聚合点就进行列表请求
              单个信息点进行信息获取
            */
            // 获取当前层级
            handleMap.value.getMapZoom().then((res: any) => {
              // console.log(e);
              // 当前层级跟最大层级同样时，判断这个点是聚合点还是散开点，聚合点就请求信息，散开点这里不做处理，调用信息弹窗
              if (maxRes === res) {
                // 获取当前聚合点的矩阵经纬度，进行数据请求，弹出当前矩阵的数据列表
                if (e.enlarge) {
                  getListDataMatrix.value = e;
                  // 开启大数据的情况下这个点又包含放大属性，说明对应的矩阵数据超过4条以上
                  // console.log('发起请求,获取数据列表');
                  getMatrixData.value = [];
                  // 第一页
                  listVisData(1).then((getData: any) => {
                    // console.log(getData);
                    store.commit('mapDataList/set_MapDataList', {
                      openFlag: true,
                      data: getData.list,
                      page: 1,
                      maxPage: Math.ceil(getData.totalCount / 100),
                      request: false,
                      typeName: getData.typeName,
                      handleType: getData.handleType,
                      totalCount: getData.totalCount,
                    });
                  });
                }
              } else if (e.enlarge) {
                // console.log('放大');
                // 放大并且重新请求
                handleMap.value.setCentent(r, maxRes).then(() => {
                  section();
                })
              }
            })
          })
        })
      }
    }
  })

  // 根据类型获取数据
  function getResoureProtectTargetData(bounds: any = [], listType: number, resoureType: string, pageSize?: number, page?: number) {
    const promise = new Promise((resolve, reject) => {
      let resoureTypeNumber = 0;
      let typeName = '';
      switch (resoureType) {
        case 'protect':
          resoureTypeNumber = 108;
          typeName = '防护目标';
          break;
        case 'risk':
          resoureTypeNumber = 113;
          typeName = '风险隐患';
          break;
        case 'refuge':
          resoureTypeNumber = 107;
          typeName = '避难场所';
          break;
        case 'material':
          resoureTypeNumber = 106;
          typeName = '物资库';
          break;
        case 'camera':
          resoureTypeNumber = 101;
          typeName = '摄像头';
          break;
        case 'device':
          typeName = '会场终端';
          resoureTypeNumber = 102;
          break;
        case 'colony':
          resoureTypeNumber = 102;
          typeName = '集群终端';
          break;
        case 'equipment':
          resoureTypeNumber = 112;
          typeName = '应急装备库';
          break;
        case 'medical':
          resoureTypeNumber = 117;
          typeName = '医疗';
          break;
        case 'task':
          resoureTypeNumber = 104;
          typeName = '任务';
          break;
        case 'personnel':
          resoureTypeNumber = 103;
          typeName = '现场人员';
          break;
        case 'team':
          resoureTypeNumber = 109;
          typeName = '应急队伍';
          break;
        default:
          break;
      }
      if (!resoureTypeNumber) {
        return
      }
      const otherParam = {
        typeCode: (resoureType === 'device' ? 1 : 2),
      };
      listAllByBounds(bounds, listType, resoureTypeNumber, otherParam, store.state.event?.id, pageSize).then((response: any) => {
        if (response.code === 0) {
          apiGetDataObj.value[resoureType] = response.data;
        }
        response.data.typeName = typeName;
        response.data.handleType = resoureType;
        resolve(response.data);
      });
    });
    return promise;
  }

  // 列表呈现
  function listVisData(page: number, pageSize?: number) {
    const promise = new Promise((resolve, reject) => {
      getResoureProtectTargetData([getListDataMatrix.value.mapSectionData], 1, getListDataMatrix.value.handleType, (pageSize || 100), page).then((dataRes: any) => {
        // console.log(dataRes[0], '最大层级 请求回来的数据++++++');
        dataRes[0].typeName = dataRes.typeName;
        dataRes[0].handleType = dataRes.handleType;
        // 连接数据
        getMatrixData.value = getMatrixData.value.concat(dataRes[0].list);
        // 触发响应
        getMatrixData.value.push('');
        getMatrixData.value.pop();
        resolve(dataRes[0]);
      });
    });
    return promise;
  }

  // 渲染聚合点
  function renderAggregatePoints(params: any, map?: any) {
    handleMap.value = map || handleMap.value || (window as any).map;
    // params
    // [
    //   {
    //     key: type,
    //     type: 'offLine', // 离线
    //     data: offlineArr,
    //   },
    // ]
    // 进行渲染
    getLayerDataMsg(params, false, eventObj.value, handleMap.value);
  }

  // 渲染数据
  function renderData(listType: number, type: string) {
    const data = JSON.parse(JSON.stringify(apiGetDataObj.value[type]));
    // 如果是camera监控、device会场终端、colony集群就进行添加到数组中
    const offlineArr: any = [];
    let reduceData: any = data.reduce((pre: any, ele: any, i: number) => {
      // 类型为0并且开启大数据量请求
      if ((ele.list[0] && (listType === 0 || listType === 2)) && (window as any).config.sectionFlag) {
        /*
          返回的数据和请求的矩阵是一一对应关系
          单条数据的totalCount判断是否超过4超过就是单条数据聚合点
        */
        if (ele.totalCount > 4) {
          ele.list[0].name = String(ele.totalCount);
          ele.list[0].enlarge = true;
          // 聚合点的id直接置空
          ele.list[0].id = null;
        }
        ele.list.forEach((e: any) => {
          if (ele.totalCount > 4) {
            e.sectionFlag = true;
          }
          e.mapSectionData = mapSectionData.value[i];
        });
      }
      pre = pre.concat(ele.list);
      return pre;
    }, []);
    if (type === 'camera' || type === 'device' || type === 'colony') {
      // 再次进行数据处理
      reduceData = reduceData.reduce((pre: any, ele: any) => {
        if (ele.status === '0' || ele.status === 0) {
          pre.push(ele);
        } else {
          offlineArr.push(ele);
        }
        return pre;
      }, []);
    }
    // 渲染之前清楚 上一次的数据
    handleMap.value.clearAtPresentVectorData(type);
    // console.log(reduceData, type);
    // 渲染第一次
    renderAggregatePoints(
      [
        {
          key: type,
          data: reduceData,
        },
      ],
    );
    // 如果是camera监控、device会场终端、colony集群就进行二次渲染，第一次渲染的是在线的，第二次为离线
    if (type === 'camera' || type === 'device' || type === 'colony') {
      renderAggregatePoints(
        [
          {
            key: type,
            type: 'offLine', // 离线
            data: offlineArr,
          },
        ],
      );
    }
  }

  // 发起请求
  function sendRequrst(array: any, num: number) {
    const promise = new Promise((resolve, reject) => {
      // 获取最大层级
      handleMap.value.getMapMaxZoom().then((maxRes: any) => {
        // 获取当前层级
        handleMap.value.getMapZoom().then((res: any) => {
          for (const key in apiGetDataObj.value) {
            let listType: number = num;
            // 0是获取聚合点只返回一条数据 1 获取当前矩阵的全部 2单个矩阵的数据不超过4个时，返回的list会有不止一条数据
            if (maxRes === res && (window as any).config.sectionFlag) {
              if (key === 'protect' || key === 'camera') {
                listType = 2;
              } else {
                listType = 1;
              }
              // 防护目标和监控
            } else if ((key === 'protect' || key === 'camera') && (window as any).config.sectionFlag) {
              // 当这两个类型开启多个切片请求时
              listType = 0;
            } else {
              // 默认只开启视口范围请求
              listType = 1;
            }
            // 发起请求
            getResoureProtectTargetData(array, listType, key).then(() => {
              renderData(listType, key);
              resolve('');
            });
          }
        });
      });
    });
    return promise;
  }

  // 根据可视范围获取数据
  function getSectionData(map?: any) {
    const promise = new Promise((resolve, reject) => {
      handleMap.value = map || handleMap.value || (window as any).map;
      const handlerMap = map || handleMap.value || (window as any).map;
      sectionData(handlerMap).then((res: any) => {
        mapSectionData.value = res;
        resolve(sendRequrst(res, 0));
      });
    });
    return promise;
  }

  // 根据可视范围获取数据
  function getVisualData(map?: any, listType: number = 0) {
    let promise = new Promise((resolve, reject) => {
      const handlerMap = map || handleMap.value || (window as any).map;
      // 测试切片
      if (handlerMap) {
        handlerMap.getExtent().then((res: any) => {
          sendRequrst([res], listType)
          resolve('');
        });
      } else {
        setTimeout(() => {
          getVisualData();
        }, 200)
      }
    });
    return promise;
  }

  // 切片进行请求
  function section() {
    setTimeout(() => {
      // handleMap.value.clearAtPresentVectorData('编辑图形Layer');
      handleMap.value.getMapZoom().then((res: any) => {
        console.log(res);
        // 高层级大于10 并且开启了大数据量切片请求的
        if (res >= ((window as any).map.mapType?.sectionNum || 10) && (window as any).config.sectionFlag) {
          getSectionData(handleMap.value);
        } else {
          getVisualData(handleMap.value, 1)
        }
      })
    })
  }

  // 平移距离超过限定距离时
  function LimitedDistance(x: number, y: number) {
    if (Math.abs(x) >= 200 || Math.abs(y) >= 200) {
      section()
      // 把记录的存储清空
      recordDis.value = {
        x: 0,
        y: 0,
      }
    }
  }

  // 首次进入进行切片加载
  function loadIng() {
    if (handleMap.value) {
      section();
    } else {
      setTimeout(() => {
        loadIng();
      }, 500)
    }
  }
  // 给指定的地图添加事件
  function addMapEvent(map?: any) {
    handleMap.value = (map || (window as any).map);
    // 滚轮
    handleMap.value.map.eventsDiv.addEventListener('mousewheel', (e: any) => {
      section()
    });
    // 鼠标左键按下
    handleMap.value.map.eventsDiv.addEventListener('mousedown', (e: any) => {
      (window as any).xy = e.xy
    });
  }

  // 事件流程状态变更，刷新数据
  const uns = $ws.subscribe(
    `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
    (msg: any) => {
      // type: 0：摄像头，1：会场终端，2：集群终端，4：app
      // camera 摄像头
      // device 会场终端
      // colony 集群终端
      if (msg?.msgType === 50008) {
        // const devices: any = msg?.content?.devices;
        // devices.forEach((x: any) => {
        //   let key = 'camera';
        //   let imgStr = '';
        //   switch (x.type) {
        //     case 1:
        //       key = 'device';
        //       break;
        //     case 2:
        //       key = 'colony';
        //       break;
        //     default:
        //       break;
        //   }
        //   if (x.status !== 0 && x.status !== '0') {
        //     imgStr = 'OffLine';
        //   }
        //   const imgObj = {
        //     img: urlByKey[`${key}${imgStr}`],
        //     height: 40,
        //     width: 40,
        //   };
        //   console.log(imgObj);
        //   // 查询有没有这个条件
        //   (window as any).map.dataScreening(key, 'id', String(x.id)).then((res: any) => {
        //     console.log(res);
        //     if (res.length === 0) {
        //       // 进行数据设置
        //       (window as any).map.modifyStyle(key, 'id', String(x.id), imgObj);
        //     } else {
        //       x.handleType = key;
        //       (window as any).map.drawConverge(key, [x], imgObj, eventObj.value);
        //     }
        //   });
        // });
      }
    },
  );
  onBeforeUnmount(uns);

  onMounted(() => {
    // 鼠标左键抬起
    addFun('mouseup', (e: any) => {
      if (e.xy && (window as any).xy) {
        const x = e.xy.x - (window as any).xy.x;
        const y = e.xy.y - (window as any).xy.y;
        if (Math.abs(x) < 200 && Math.abs(y) < 200) {
          const computeX = recordDis.value.x + Math.abs(x);
          const computeY = recordDis.value.y + Math.abs(y);
          // 计算缓存和当前的移动距离超过200也进行切片
          if (computeX > 200 || computeY > 200) {
            LimitedDistance(computeX, computeY);
          } else {
            // 没有超过200就进行存储
            recordDis.value = {
              x: computeX,
              y: computeY,
            }
          }
        } else {
          // 一次移动超过200就进行重新切片加载
          LimitedDistance(x, y);
        }
      }
    });
    // 首次进入进行切片加载
    loadIng();
  });

  watch(() => store.state.mapDataList.turnPages,
    (newV: any) => {
      if (newV.state) {
        listVisData(newV.num).then((getData: any) => {
          // console.log(getData);
          store.commit('mapDataList/set_MapDataList', {
            openFlag: true,
            data: getData.list,
            page: 1,
            maxPage: Math.ceil(getData.totalCount / 100),
            request: false,
            typeName: getData.typeName,
            handleType: getData.handleType,
            totalCount: getData.totalCount
          });
          store.commit('mapDataList/set_TurnPages', {
            num: newV.num,
            state: false,
          });
        });
      }
    },
  )

  return {
    apiGetDataObj,
    // 获取所有防护目标
    getResoureProtectTargetData,
    // 根据可视范围获取数据
    getVisualData,
    // 给指定的地图添加事件
    addMapEvent,
    // 刷新落点
    section,
    // 根据可视范围获取数据
    getSectionData,
    // 渲染聚合点
    renderAggregatePoints,
  };
}

export default inits;
