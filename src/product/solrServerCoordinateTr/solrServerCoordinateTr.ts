import { anyTypeAnnotation } from "@babel/types";
interface Parmas {
  id?:number|string,
  resoureTypeList?: number[],
  polygonStr: string[],
  longitude: string, // 周边搜索，中心点经度
  latitude: string, // 周边搜索，中心点纬度
  radius: number, // 周边搜索，半径，单位km
  solrType: number,
  mapIdsStr?: string,
}
// 自定义坐标转换层
const batchTransfrom: any = require('@/capacity/mapJs/batchTransfrom.js').default;
// http 请求
const $http: any = require('@/product/CommandBrain3.0/mainCapacity/axios/apiRequest.js').default;
// 是否自定义坐标系
const custom = batchTransfrom.isCustom();

export function listAllByBounds(bounds: any = [], listType: number, resoureType: number, otherParam: any, eventId?: number, pageSize?: number, page?: number) {
  const promise = new Promise((resolve, reject) => {
    /*
      bounds：[{
        left: 112.83861590896,
        top: 23.428611436899,
        right: 112.93010855638549,
        bottom: 23.35466071703112
      }]
    */
    const request = {
      method: 'post',
      service: 'solr',
      // url: '/resoure/resoureProtectTarget/test',
      url: '/solr/listAllByBounds',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        resoureType,
        listType, // 0是获取聚合点只返回一条数据 1 获取当前矩阵的全部 2单个矩阵的数据不超过4个时，返回的list会有不止一条数据
        bounds,
        eventId,
        // * 会场终端  1
        // * 集群终端  2
        // * 手持终端  3
        otherParam,
        pageSize,
        page,
      },
    };
    // if (custom) {
    //   const reduceData = bounds.reduce((pre: any, x: any) => {
    //     // const obj = {
    //     //   lon: x.left,
    //     //   lat: x.top
    //     // };
    //     // const objs = {
    //     //   lon: x.right,
    //     //   lat: x.bottom
    //     // };
    //     // pre.push(obj);
    //     // pre.push(objs);
    //     pre.push(`${x.left},${x.top}`);
    //     pre.push(`${x.right},${x.bottom}`);
    //     return pre;
    //   }, []);
    //   // const arr: any = [];
    //   // reduceData.forEach((x: any) => {
    //   //   arr.push(batchTransfrom.singleTrans(x))
    //   // });
    //   batchTransfrom.batchCustomTfGPS(reduceData).then((res: any) => {
    //     const boundsData: any = [];
    //     res.forEach((x: any, i: number) => {
    //       if (i % 2 === 0) {
    //         const obj = {
    //           left: x.x,
    //           top: x.y,
    //           right: res[i + 1].x,
    //           bottom: res[i + 1].y,
    //         };
    //         boundsData.push(obj);
    //       }
    //     });
    //     request.data.bounds = boundsData;
    //     console.log(boundsData, '转换之后的数据');
    //     resolve($http(request));
    //   });
    // } else {
    resolve($http(request));
    // }
  });
  return promise;
}

/**
 * 获取资源统计数据
 * @param event 事件对象
 */
export function getResourceStats(event: {
  longitude: number;
  latitude: number;
  id: number;
}) {
  const promise = new Promise((resolve, reject) => {
    const request: any = {
      method: 'post',
      service: 'solr',
      url: '/solr/statisticsResource',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        eventId: event?.id,
        solrType: 1,
        keywords: '',
        searchAllType: 1,
        longitude: event?.longitude,
        latitude: event?.latitude,
        radius: 2,
      },
    };
    if (custom) {
      const obj = {
        lon: event?.longitude,
        lat: event?.latitude,
      };
      batchTransfrom.singleTrans(obj).then((res: any) => {
        // 自定义坐标转换成大地2000
        request.data.longitude = res.lon;
        request.data.latitude = res.lat;
        resolve($http(request));
      });
    } else {
      resolve($http(request));
    }
  });
  return promise;
}

// 获取搜索资源列表
export function getRetrievalLists(parmas: any) {
  const promise = new Promise((resolve, reject) => {
    const request: any = {
      method: 'post',
      service: 'solr',
      url: '/solr/searchResource',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        solrType: (parmas.solrType ? parmas.solrType : 4), // 搜索类型
        pageSize: '10',
        radius: 200,
        resoureType: parmas.resoureType, // 资源类型
        keywords: parmas.keywords, // 搜索关键字
        currentPage: parmas.currentPage,
        longitude: parmas.longitude, // 周边搜索，中心点经度
        latitude: parmas.latitude, // 周边搜索，中心点纬度
        eventId: parmas.id, // 676 this.$store.state.event?.id, 事件id，任务搜索时非空
        // 在线筛选
        // otherParam: {
        //   status: parmas.status, // 0在线 人员是1在线
        // },
        // 区域搜索的时候使用
        // polygon: 'POLYGON(())',
      },
    };
    if (parmas.status !== null || parmas.status !== undefined) {
      request.data.otherParam = {
        status: parmas.status, // 0在线 人员是1在线
      };
    }
    if (custom) {
      const obj = {
        lon: parmas.longitude,
        lat: parmas.latitude,
      };
      batchTransfrom.singleTrans(obj).then((res: any) => {
        // 自定义坐标转换成大地2000
        request.data.longitude = res.lon;
        request.data.latitude = res.lat;
        if (parmas.polygon) {
          const arr = parmas.polygon.reduce((pre: any, ele: any) => {
            pre.push(ele.replace(' ', ','));
            return pre;
          }, []);
          batchTransfrom.batchCustomTfGPS(arr).then((result: any) => {
            const handleArr = result.reduce((pre: any, ele: any) => {
              pre.push(`${ele.x} ${ele.y}`);
              return pre;
            }, []);
            request.data.polygon = `POLYGON((${handleArr.join(',')}))`;
            resolve($http(request));
          });
        } else {
          resolve($http(request));
        }
      });
    } else {
      if (parmas.polygon) {
        request.data.polygon = `POLYGON((${parmas.polygon.join(',')}))`;
      }
      resolve($http(request));
    }
  });
  return promise;
}

// 飞巡检索
export function getFlightPatrolSearch(parmas: any) {
  const promise = new Promise((resolve, reject) => {
    /*
      parmas{
        resoureType: 101,
        solrType: 1,
        // 圆检索的时候的参数
        currentPage
        latitude
        longitude
        radius
        // 面或者线检索时的数据
        paramsStr  119.49233612745442 32.732237343457534,119.49233612745442 32.732237343457534,
      }
    */
    const request = {
      method: 'post',
      service: 'solr',
      url: '/solr/searchResourceByParam',
      headers: {
        'Content-Type': 'application/json',
      },
      data: parmas,
    };
    if (parmas.solrType === 1) {
      if (custom) {
        const obj = {
          lon: parmas.longitude,
          lat: parmas.latitude,
        };
        batchTransfrom.singleTrans(obj).then((res: any) => {
          // 自定义坐标转换成大地2000
          request.data.longitude = res.lon;
          request.data.latitude = res.lat;
          resolve($http(request));
        });
      } else {
        resolve($http(request));
      }
    } else if (parmas.solrType === 2 || parmas.solrType === 3) {
      if (custom) {
        if (parmas.solrType === 2) {
          const promiseArr: any = [];
          parmas.paramsStr.forEach((ele: any) => {
            const handleData = ele.reduce((pre: any, x: any) => {
              const str = x.join(',');
              pre.push(str);
              return pre;
            }, []);
            console.log('自定义飞巡检索线数据的数量', handleData.length);
            promiseArr.push(batchTransfrom.batchCustomTfGPS(handleData));
          });
          Promise.all(promiseArr).then((res: any) => {
            const polygonArr = res.reduce((p: any, e: any) => {
              const arrs = e.reduce((pre: any, x: any) => {
                const str = `${x.x} ${x.y}`;
                pre.push(str);
                return pre;
              }, []);
              p.push(arrs.join(','));
              return p;
            }, []);
            console.log('线的数据', polygonArr);
            request.data.polygon = `POLYGON((${polygonArr.join('),(')}))`;
            resolve($http(request));
          });
        } else if (parmas.solrType === 3) {
          const arr = parmas.paramsStr.split(',');
          const handleData = arr.reduce((pre: any, x: any) => {
            const str = x.replace(/ /gi, ',');
            pre.push(str);
            return pre;
          }, []);
          /*
            handleData的格式
            [ '113.42594146729,23.092918395996',
             '113.32019805908,22.906837463379',
             '113.42594146729,23.092918395996']
          */
          console.log('自定义飞巡检索面数据的数量', handleData.length);
          batchTransfrom.batchCustomTfGPS(handleData).then((res: any) => {
            const arrs = res.reduce((pre: any, x: any) => {
              const str = `${x.x} ${x.y}`;
              pre.push(str);
              return pre;
            }, []);
            console.log('面的数据', arrs);
            request.data.polygon = `POLYGON((${arrs.join(',')}))`;
            resolve($http(request));
          });
        }
      } else {
        if (parmas.solrType === 2) {
          const promiseArr: any = [];
          parmas.paramsStr.forEach((ele: any) => {
            const handleData = ele.reduce((pre: any, x: any) => {
              const str = x.join(' ');
              pre.push(str);
              return pre;
            }, []);
            promiseArr.push(handleData);
          });
          request.data.polygon = `POLYGON((${promiseArr.join('),(')}))`;
          delete parmas.paramsStr;
        } else if (parmas.solrType === 3) {
          request.data.polygon = `POLYGON((${parmas.paramsStr}))`;
        }
        resolve($http(request));
      }
    }

  });
  return promise;
}

// 资源检索
export function searchMultiTypeResource(parmas: any) {
  const promise = new Promise((resolve, reject) => {
    const request: any = {
      method: 'post',
      service: 'solr',
      url: '/solr/searchMultiTypeResource',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        eventId: parmas.id, // 事件id，任务搜索时非空
        searchAllType: 0, // 是否搜索所有资源类型
        /*
            MONITOR_CAMERA("监控摄像头", "appDevice", 101),
            DEVICE("设备", "appDevice", 102),
            RESOURCE_AREA("避难场所", "resourceArea", 107),
            RESOURCE_ARTICLE_STOREHOUSE("应急物资库", "resourceArticleStorehouse", 106),
            RISK_DANGER("风险隐患", "riskDanger", 113);
            RESOURCE_PROTECT_TARGET("防护目标", "resourceProtectTarget", 108),

            MAIL_CONTACTOR("人员", "mailContactor", 103),
            EVENT_TASK("任务", "appEventTask", 104),
            RESOURCE_ARTICLE("应急物资", "resourceArticle", 105),
            RESOURCE_TEAM("应急队伍", "resourceTeam", 109),
            RESOURCE_EXPERT("应急专家", "resourceExpert", 110),
            //RESOURCE_EQUIPMENT("装备", "resourceEquipment", 111),
            //RESOURCE_EQUIPMENT_STOREHOUSE("装备库", "resourceEquipmentStorehouse", 112),
          */
        // otherParam: {
        // /*
        //  * 会场终端  1
        //  * 集群终端  2
        //  * 手持终端  3
        //  */
        //   typeCode: (e.typeKey === 'device' ? 1 : 2),
        // },
        resoureTypeList: parmas.resoureTypeList, // 搜索资源类型列表，searchAllType为0时使用
        longitude: parmas.longitude, // 周边搜索，中心点经度
        latitude: parmas.latitude, // 周边搜索，中心点纬度
        radius: parmas.radius, // 周边搜索，半径，单位km
        /*
            搜索类型
            POINT("点", 1),
            POLYGON("多边形", 2),
            LINE("线", 3),
          */
        solrType: parmas.solrType,
      },
    };
    if (custom) {
      if (parmas.solrType === 1) {
        // 点
        batchTransfrom.singleTrans(parmas).then((res: any) => {
          request.data.longitude = res.lon;
          request.data.latitude = res.lat;
          resolve($http(request));
        });
      } else if (parmas.solrType === 2) {
        // 多边形
        const handleData = parmas.polygonStr.reduce((pre: any, x: any) => {
          const str = x.replace(/ /gi, ',');
          pre.push(str);
          return pre;
        }, []);
        console.log('自定义资源检索面数据的数量', handleData.length);
        batchTransfrom.batchCustomTfGPS(handleData).then((res: any) => {
          const strArr = res.reduce((pre: any, x: any) => {
            const str = `${x.x} ${x.y}`;
            pre.push(str);
            return pre;
          }, []);
          request.data.polygon = `POLYGON((${strArr.join(',')}))`;
          resolve($http(request));
        });
      } else if (parmas.solrType === 3) {
        // 线
        const promiseArr = parmas.polygonStr.reduce((pre: any, x: any) => {
          const arr = x.split(',');
          arr.forEach((ele: any) => {
            ele = ele.replace(/ /gi, ',');
          });
          console.log('自定义资源检索线数据的数量', arr.length);
          // 线可能会出现闭合情况，可能会有多个数组
          pre.push(batchTransfrom.batchCustomTfGPS(arr));
          return pre;
        }, []);
        Promise.all(promiseArr).then((res: any) => {
          const lineReqData = res.reduce((pre: any, x: any) => {
            const strArr = x.reduce((p: any, e: any) => {
              const str = `${e.x} ${e.y}`;
              p.push(str);
              return p;
            }, []);
            pre.push(strArr.join(','));
            return pre;
          }, []);
          request.data.polygon = `POLYGON((${lineReqData.join('),(')}))`;
          resolve($http(request));
        });
      }
    } else {
      if (parmas.solrType === 2) {
        // 多边形
        request.data.polygon = `POLYGON((${parmas.polygonStr.join(',')}))`;
      } else if (parmas.solrType === 3) {
        // 线
        request.data.polygon = `POLYGON((${parmas.polygonStr.join('),(')}))`;
      }
      resolve($http(request));
    }
  });
  return promise;
}

// 标绘数据的资源检索
export function plottingRetrieval(parmas:Parmas) {
  const promise = new Promise((resolve, reject) => {
    const request: any = {
      method: 'post',
      service: 'solr',
      url: '/solr/searchMarkRecord',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        longitude: parmas.longitude, // 周边搜索，中心点经度
        latitude: parmas.latitude, // 周边搜索，中心点纬度
        radius: parmas.radius, // 周边搜索，半径，单位km
        solrType: parmas.solrType,
        otherParam: {
          mapIdsStr: parmas.mapIdsStr,
        }
      },
    };
    if (custom) {
      if (parmas.solrType === 1) {
        // 点
        batchTransfrom.singleTrans(parmas).then((res: any) => {
          request.data.longitude = res.lon;
          request.data.latitude = res.lat;
          resolve($http(request));
        });
      } else if (parmas.solrType === 2) {
        // 多边形
        const handleData = parmas.polygonStr.reduce((pre: any, x: any) => {
          const str = x.replace(/ /gi, ',');
          pre.push(str);
          return pre;
        }, []);
        console.log('自定义资源检索面数据的数量', handleData.length);
        batchTransfrom.batchCustomTfGPS(handleData).then((res: any) => {
          const strArr = res.reduce((pre: any, x: any) => {
            const str = `${x.x} ${x.y}`;
            pre.push(str);
            return pre;
          }, []);
          request.data.polygon = `POLYGON((${strArr.join(',')}))`;
          resolve($http(request));
        });
      } else if (parmas.solrType === 3) {
        // 线
        const promiseArr = parmas.polygonStr.reduce((pre: any, x: any) => {
          const arr = x.split(',');
          arr.forEach((ele: any) => {
            ele = ele.replace(/ /gi, ',');
          });
          console.log('自定义资源检索线数据的数量', arr.length);
          // 线可能会出现闭合情况，可能会有多个数组
          pre.push(batchTransfrom.batchCustomTfGPS(arr));
          return pre;
        }, []);
        Promise.all(promiseArr).then((res: any) => {
          const lineReqData = res.reduce((pre: any, x: any) => {
            const strArr = x.reduce((p: any, e: any) => {
              const str = `${e.x} ${e.y}`;
              p.push(str);
              return p;
            }, []);
            pre.push(strArr.join(','));
            return pre;
          }, []);
          request.data.polygon = `POLYGON((${lineReqData.join('),(')}))`;
          resolve($http(request));
        });
      }
    } else {
      if (parmas.solrType === 2) {
        // 多边形
        request.data.polygon = `POLYGON((${parmas.polygonStr.join(',')}))`;
      } else if (parmas.solrType === 3) {
        // 线
        request.data.polygon = `POLYGON((${parmas.polygonStr.join('),(')}))`;
      }
      resolve($http(request));
    }
  });
  return promise;
}

// 可视范围的切片数据
export function sectionData(map?: any) {
  const promise = new Promise((resolve, reject) => {
    const handlerMap = map || (window as any).map;
    if (handlerMap) {
      handlerMap.getRectangleSection().then((res: any) => {
        const getSectionReqData: any = [];
        // 处理切片之后返回的数据
        const datas = res.reduce((pre: any, e: any) => {
          const controlPoint = e.reduce((p: any, x: any) => {
            const controlPoints = x.reduce((pres: any, xs: any) => {
              const o = {
                x: xs[0],
                y: xs[1],
              };
              pres.push(o);
              return pres;
            }, []);
            // let objs = {
            //   type: 'SuperMap.Geometry.GeoPolygonEx',
            //   cps: {
            //     controlPoints,
            //   }
            // }
            getSectionReqData.push(controlPoints);
            // p.push(objs);
            return p;
          }, []);
          pre = pre.concat(controlPoint);
          return pre;
        }, []);
        // 整理请求的数据格式
        const sectionReqData = getSectionReqData.reduce((pre: any, e: any) => {
          const obj = {
            left: e[0].x,
            right: e[2].x,
            top: e[0].y,
            bottom: e[2].y,
          };
          pre.push(obj);
          return pre;
        }, []);
        // handlerMap.renderGraph('编辑图形Layer', datas)
        resolve(sectionReqData);
      });
    } else {
      setTimeout(() => {
        resolve(sectionData());
      }, 200);
    }
  });
  return promise;
}

export default {
  listAllByBounds,
  getResourceStats,
  getRetrievalLists,
  getFlightPatrolSearch,
  searchMultiTypeResource,
  sectionData,
  plottingRetrieval,
};
