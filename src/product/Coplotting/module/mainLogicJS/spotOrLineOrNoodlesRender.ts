interface CoverObj {
  vector?:string,
  mark?: string,
}
function render(req: any, mapPopup: any, coverObj?: CoverObj) {
  const $http = req;
  var map_Popup_Ref = mapPopup || {};
  // 弹窗的数据获取 和 显示
  function popupGetDataAndVis(id: Number, data: any, handleData: any) {
    // console.log(id, handleData);
    const request = {
      method: 'get',
      service: 'coplotting',
      url: `/assist/assistmarkrecord/info/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    $http(request).then((r: any) => {
      if (r.code === 0 && r.data) {
        const datas: any = r.data;
        // console.log(datas);
        // console.log('lalalallalalalalalaa')
        // console.log(datas)
        if (datas) {
          if (datas.markRecord.rights !== '1' && datas.markRecord.rights) {
            map_Popup_Ref.value.editJurisdiction = false;
          }
        }
        const handleFiles = datas.files.reduce((pre: any, x: any) => {

          if (x.fileSuffix === 'jpg' || x.fileSuffix === 'png' || x.fileSuffix === 'gif' || x.fileSuffix === 'PNG' || x.fileSuffix === 'JPG' || x.fileSuffix === 'GIF') {
            x.src = ((window as any).config.baseURL + x.fileUrl);
            if (pre.image) {
              pre.image.push(x);
            } else {
              pre.image = [x];
            }
          } else if (x.fileSuffix === 'mp4' || x.fileSuffix === 'ogg') {
            x.src = ((window as any).config.baseURL + x.fileUrl);
            if (pre.video) {
              pre.video.push(x);
            } else {
              pre.video = [x];
            }
          } else if (x.fileSuffix === 'doc' || x.fileSuffix === 'pdf' || x.fileSuffix === 'xls' || x.fileSuffix === 'xlsx') {
            x.src = ((window as any).config.baseURL + x.fileUrl);
            if (pre.word) {
              pre.word.push(x);
            } else {
              pre.word = [x];
            }
          } else if (!x.fileSuffix) {
            x.type = 'link';
            x.handleType = x.fileType === 2 ? 'video' : 'image';
            x.name = x.fileUrl;
            x.serviceData = {
              url: x.fileUrl,
            };
            x.src = x.fileUrl;
            if (x.handleType === 'video') {
              if (pre.video) {
                pre.video.push(x);
              } else {
                pre.video = [x];
              }
            } else {
              if (pre.image) {
                pre.image.push(x);
              } else {
                pre.image = [x];
              }
            }
            // if (pre.netLink) {
            //   pre.netLink.push(x);
            // } else {
            //   pre.netLink = [x];
            // }
          }
          // if (x.fileType !== 4) {
          //   x.src = ((window as any).config.baseURL + x.fileUrl);
          // }
          return pre;
        }, {});
        if (map_Popup_Ref.value) {
          map_Popup_Ref.value.renderData = {
            name: datas.markRecord.markName,
            addre: datas.markRecord.address,
            ...datas,
          };
          console.log('读取的文件数据', handleFiles);
          map_Popup_Ref.value.handleFiles = handleFiles;
          map_Popup_Ref.value.tablePropertys = datas.tablePropertys;
        }
      }
    });
    console.log('lalalallalalalalalaa')
    console.log(handleData.data)
    if (handleData.data) {
      if (handleData.data.rights !== '1' && handleData.data.rights) {
        map_Popup_Ref.value.editJurisdiction = false;
      }
    }
    if (map_Popup_Ref.value) {
      map_Popup_Ref.value.coverObj = coverObj;
      map_Popup_Ref.value.setMapPopup(data, handleData);
    }
  }
  // 面的点击事件
  function noodleClickEvent(data: any) {
    const xy: Object = (window as any).xy;
    // console.log(xy, data);
    (window as any).map.pixelToLatAndLon(xy).then((res: any) => {
      if (data.length !== 0 && Array.isArray(data)) {
        // 点击的时候返回[data]
        const handleData: any = data[0];
        // handleData 就是features
        if (handleData.data && handleData.data.dataId) {
          const d = handleData.data;
          d.longitude = res.lon;
          d.latitude = res.lat;
          d.id = handleData.geometry.id + Math.floor(Math.random() * 100000000);
          let id = handleData.data.dataId
          // console.log(id, handleData);
          popupGetDataAndVis(id, d, handleData)
        }
      }
    });
  }
  // 渲染面的方法
  function renderNoodle(data: any) {
    // console.log('渲染面', data);
    const eventObj: any = {
      click(e: any, f: any) {
        noodleClickEvent([f]);
      },
    };
    (window as any).map.renderGraph(((coverObj && coverObj.vector) || (window as any).mapCoverageName.vector), data, 'textLabel', eventObj);
  }
  // 点的点击事件
  function spotClickEvent(that: any) {
    if (that.data.imgInfo || that.data.dataId || (that.data.id && typeof that.data.id === 'number')) {
      const { data } = that;
      data.dataId = that.data.dataId || (that.data.imgInfo ? that.data.imgInfo.id : data.id);
      data.id = data.dataId + Math.floor(Math.random() * 100000000);
      popupGetDataAndVis(data.dataId, data, that);
    }
  }
  // 渲染点的方法
  function renderSpot(data: any) {
    let eventObj = {
      click(e: any) {
        // this 就是它本身的数据
        console.log(e, this);
        spotClickEvent(e.object)
      }
    }
    // console.log(data);
    window.map.setMultiMarker(((coverObj && coverObj.mark) ||(window as any).mapCoverageName.mark), data, eventObj)
  }
  // 整个方法的入口
  function spotOrLineOrNoodlesRender(data: any): void {
    let allDataObj: any = {
      spot: [],
      line: [],
      noodles: [],
      other: []
    }
    // console.log('整合数据', data);
    // 整合数据
    data.map((x: any) => {
      // x.name = x.markName
      let textLabel = x.isShowMarkName === 1 ? (x.markName || x.name) : '';
      if (x.coordinatesJsonObject) {
        let j = 'SuperMap.Geometry.GeoPolygonEx';
        if (Number(x.markType) === 2) {
          j = 'SuperMap.Geometry.GeoPolyline';
        }
        let type = x.statusStyleJsonObject ? x.statusStyleJsonObject.CLASS_NAME ? x.statusStyleJsonObject.CLASS_NAME : j : j;
        let type2 = x.style ? x.style.CLASS_NAME ? x.style.CLASS_NAME : j : j;
        let type3 = type ? type : type2;
        switch (Number(x.markType)) {
          case 2:
            let lineObj = {
              isShowMarkName: x.isShowMarkName,
              coordinatesJsonObject: x.coordinatesJsonObject,
              markType: Number(x.markType),
              // 请求详情的id
              dataId: x.dataId ? x.dataId : x.id,
              type: type3,
              cps: x.coordinatesJsonObject,
              textLabel,
              style: {
                strokeColor: 'skyblue', // 生成随机颜色
                strokeWidth: (x.statusStyleJsonObject?.lineHeight) ? (x.statusStyleJsonObject?.lineHeight) : 2,
                fillColor: 'skyblue',
                fillOpacity: 0.5,
                fontSize: '20px',
                ...x.statusStyleJsonObject,
              },
            };
            lineObj.style.fillOpacity = 0;
            allDataObj.line.push(lineObj);
            break;
          case 1:
            let obj = {
              coordinatesJsonObject: x.coordinatesJsonObject,
              markType: Number(x.markType),
              // 请求详情的id
              dataId: x.dataId ? x.dataId : x.id,
              type: type3,
              cps: x.coordinatesJsonObject,
              textLabel,
              style: {
                strokeColor: 'skyblue', // 生成随机颜色
                strokeWidth: 2,
                fillColor: 'skyblue',
                fillOpacity: 0.5,
                fontSize: '20px',
                ...x.statusStyleJsonObject,
              },
            };
            if (obj.style.fillOpacity > 1) {
              obj.style.fillOpacity = 0.5
            }
            allDataObj.noodles.push(obj);
            break;
          case 3:
            let otherObj = {
              coordinatesJsonObject: x.coordinatesJsonObject,
              markType: Number(x.markType),
              // 请求详情的id
              dataId: x.dataId ? x.dataId : x.id,
              type: (x.statusStyleJsonObject ? x.statusStyleJsonObject.CLASS_NAME : x.style ? x.style.CLASS_NAME : ''),
              cps: x.coordinatesJsonObject,
              textLabel,
              style: {
                strokeColor: 'skyblue', // 生成随机颜色
                strokeWidth: 2,
                fillColor: 'skyblue',
                fillOpacity: 0.5,
                fontSize: '20px',
                ...x.statusStyleJsonObject,
              },
            };
            if (otherObj.style.fillOpacity > 1) {
              otherObj.style.fillOpacity = 0.5
            }
            allDataObj.other.push(otherObj);
            break;
          default:
            break;
        }
      }
      if (Number(x.markType) === 0) {
        x.wd = 32;
        x.hg = 32;
        if (x.statusStyleJsonObject) {
          switch (x.statusStyleJsonObject.size) {
            case 0:
              x.wd = 64;
              x.hg = 64;
              break;
            case 2:
              x.wd = 24;
              x.hg = 24;
              break;
            default:
              break;
          }
        }
        x.latitude = x.laitude || x.latitude;
        let styles = x.statusStyleJsonObject;
        let icon = require('./assets/point.svg');
        if (styles) {
          let img = styles.iconUrl ? styles.iconUrl : x.statusIconUrl;
          img = img ? (window as any).config.baseURL + img : '';
          icon = img
        } else if (x.statusIconUrl) {
          icon = (window as any).config.baseURL + x.statusIconUrl;
        }
        x.label = textLabel;
        x.src = icon;
        x.textPosition = 'tp'
        allDataObj.spot.push(x);
      }
    })
    // console.log(allDataObj);
    // 查看整合情况进行渲染
    for (const key in allDataObj) {
      if (allDataObj[key].length !== 0) {
        switch (key) {
          case 'spot':
            // 渲染点
            renderSpot(allDataObj[key])
            break;
          case 'line':
            // 渲染点
            renderNoodle(allDataObj[key])
            break;
          case 'noodles':
            // 渲染面
            renderNoodle(allDataObj[key])
            break;
          case 'other':
            // 渲染单双箭头
            renderNoodle(allDataObj[key])
            break;
          default:
            break;
        }
      }
    }
  }
  // 设置 map_Popup_Ref
  function setMapPopupRef(ref: any) {
    map_Popup_Ref = ref
    console.log(map_Popup_Ref);
  }
  return {
    spotOrLineOrNoodlesRender,
    setMapPopupRef,
    spotClickEvent,
    popupGetDataAndVis,
  }
}

export default render;
