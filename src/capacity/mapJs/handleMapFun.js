import get from '../utils/getRequireUrlData';
// poi 搜索
import integration from './integration';
// 加载地图
import getBaseMap from './mapFactory';
// 经纬度转换
import LonLatT from './LonLatTransform';
// 路径规划
import pathPlanning from './pathPlanning';
// 截图
import MapToImg from './MapToImg';

import batchTransfrom from './batchTransfrom';

import useProcess from '../utils/useProcess';

const custom = batchTransfrom.isCustom();
const host = window.isLocal ? window.server : 'https://iclient.supermap.io';
const plotUrl = `${host}/iserver/services/plot-jingyong/rest/plot/`;
const mapurl = `${host}/iserver/services/map-world/rest/maps/World`;
/*
 * @Author: ENLONG DENG
 * @Date: 2020-11-16 19:42:44
 * @LastEditTime: 2021-04-02 15:05:24
 * @LastEditors: Please set LastEditors
 * @Description: 操作地图的方法
 * @FilePath: \增城大屏\exhibition\src\assets\js\hadlerMapFun.js
 */
// (function () {
//   const head = document.getElementsByTagName('head')[0];
//   let style = head.getElementsByTagName('style');
//   const supStyle = '.superMapZindex{z-index:9999 !important;}';
//   if (style) {
//     style[0].innerText += supStyle;
//   } else {
//     style = document.createElement('style');
//     style.innerText = supStyle;
//     head.appendChild(style);
//   }
// }());
class handleMap {
    constructor() {
        this.mapEl = ''; // 地图元素
        this.map = '';
        this.state = ''; // 状态
        this.mapType = {}; // 地图信息
        this.mapDataType = ''; // TDT BU GD 数据类型 涉及到 点距离计算、面积计算
        this.allCoverage = {}; // 所有图层
        this.drawFeature = {}; // 标绘图形
        this.plottingEdit = {}; // 编辑标绘图形的图层
        this.allVectorStyleObj = {
            type: 'vector',
        }; // 存放图形样式
        this.markImg = require('./marker.png'); // mark默认的图标
        // this.markImg = require('') // mark默认的图标
        this.vectorStyle = {
            strokeColor: 'white',
            strokeWidth: 2,
            fillColor: '#0091FF',
            fillOpacity: 0.5,
            fontColor: '#1afa29',
            fontSize: '20px',
            hoverFillColor: 'white',
            hoverFillOpacity: 0.8,
            strokeOpacity: 1,
            strokeLinecap: 'round',
            strokeDashstyle: 'solid',
            hoverStrokeColor: 'red',
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: 0.2,
            pointRadius: 6,
            hoverPointRadius: 1,
            hoverPointUnit: '%',
            pointerEvents: 'visiblePainted',
            cursor: 'inherit',
            labelAlign: 'cm',
            labelOutlineColor: 'white',
            labelOutlineWidth: 3,
        }; // 默认图形样式
        this.popupInfowin = {}; // 弹窗
        this.mapClickObj = {
            // 地图点击配置对象
            flag: false,
            data: {},
            locationStr: '',
        };
        this.beforeCreateMaps = '';
        this.createdMaps = {};
        this.converge = {
            type: 'converge',
        }; // 聚合图层
        // 拖拽图层
        this.dragFeature = {};
        // 控制点和面绘制结束之后再次编辑的图层对象
        this.ModifyFeature = {};
        // 截图
        this.screenshot = MapToImg();
        // 所有事件图层
        this.select = '';
        // 文字颜色
        this.textColor = '#fff';
        this.setSuperMapStyle();
        this.clickState = true; // 可点击状态
        this.WMSLayer = {}; // WMS 图层存放点
        this.vectorEventName = ''; // vector图形的状态
    }

    // 创建地图对象前
    beforeCreateMap(cb) {
        this.beforeCreateMaps = function() {
            return new Promise(resolve => {
                cb && cb();
                resolve();
            });
        };
    }

    // 创建地图对象后
    createdMap(cb) {
        this.createdMaps = cb;
    }

    // 数据初始化
    initMapData() {
        this.map = '';
        this.state = '';
        this.mapDataType = ''; // TDT BU GD 数据类型 涉及到 点距离计算、面积计算
        this.allCoverage = {}; // 所有图层
        this.drawFeature = {}; // 标绘图形
        this.plottingEdit = {}; // 编辑标绘图形的图层
        this.allVectorStyleObj = {
            type: 'vector',
        }; // 存放图形样式
        this.markImg = require('./marker.png'); // mark默认的图标
        // this.markImg = require('') // mark默认的图标
        this.vectorStyle = {
            strokeColor: 'white',
            strokeWidth: 2,
            fillColor: '#0091FF',
            fillOpacity: 0.5,
            fontColor: '#1afa29',
            fontSize: '20px',
            hoverFillColor: 'white',
            hoverFillOpacity: 0.8,
            strokeOpacity: 1,
            strokeLinecap: 'round',
            strokeDashstyle: 'solid',
            hoverStrokeColor: 'red',
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: 0.2,
            pointRadius: 6,
            hoverPointRadius: 1,
            hoverPointUnit: '%',
            pointerEvents: 'visiblePainted',
            cursor: 'inherit',
            labelAlign: 'cm',
            labelOutlineColor: 'white',
            labelOutlineWidth: 3,
        }; // 默认图形样式
        this.popupInfowin = {}; // 弹窗
        this.mapClickObj = {
            // 地图点击配置对象
            flag: false,
            data: {},
            locationStr: '',
        };
        this.beforeCreateMaps = '';
        this.createdMaps = '';
        this.converge = {
            type: 'converge',
        }; // 聚合图层
        // 控制点和面绘制结束之后再次编辑的图层对象
        this.ModifyFeature = {};
        // 截图
        this.screenshot = MapToImg();
    }

    // 初始化地图
    init(ele, initVis) {
        this.state = 'padding';
        // 加载地图
        const {
            map,
            mapType
        } = getBaseMap(
            ele,
            window.config.project,
            window.config.mapConfig,
            initVis,
        );
        if (initVis === '矢量') {
            this.textColor = '#000';
        } else {
            this.textColor = '#fff';
        }
        this.mapEl = document.getElementById(ele);
        this.mapType = mapType;
        console.log(mapType);
        if (!this.beforeCreateMaps) {
            this.map = map;
            this.state = 'finish';
            this.createdVectorCoverage('checkAll'); // 圈选
            this.addEventMap(); // 给地图绑定点击事件
        } else {
            this.beforeCreateMaps().then((res) => {
                this.map = map;
                this.state = 'finish';
                this.createdMaps && this.createdMaps();
                this.createdVectorCoverage('checkAll'); // 圈选
                this.addEventMap(); // 给地图绑定点击事件
            });
        }
        return this;
    }

    // 获取地图加载状态
    getMapInitState() {
        const res = this.state === 'finish';
        return res;
    }

    // 不对API使用者提供，文档不具备说明，开发API人员 ------------------------------ stated
    // 初始化时 插入样式
    setSuperMapStyle() {
        const header = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.className = 'superMap';
        style.innerText = `
        .superMapZindex{z-index:9998 !important;}
        #popwin{background: none !important;}
        .setSuperMapText text{display:none;}
        `;
        header.appendChild(style);
    }

    // 检查重名
    examineRepetition(coverageName, cb) {
        let flag = true;
        for (const key in this.allCoverage) {
            if (coverageName === key) {
                // 发现包含了这个图层，退出代码块并抛出语法错误
                console.error(`The coverage already exists${key}`);
                flag = false;
            }
        }
        if (flag) {
            cb && cb();
        }
        return flag;
    }

    // vector 生成图形
    createdGraph(typeStr, data, label = 'textLabel') {
        // 动态生成图形的类型
        // typeStr 参照文档  实例化绘制图形控件 newDrawFeature 中的 TypeStr
        // data:[
        //     {
        //         cps: {
        //             controlPoints: [
        //             { x: 107.91209220888, y: 27.808370590211 },
        //             ...
        //             ]
        //         },
        //         textLabel: "测试",
        //         style: {...} style 参照 生成vector图层 createdVectorCoverage 的 style
        //     }
        // ]
        const cps = JSON.parse(JSON.stringify(data.cps));
        const b = eval(`SuperMap.Geometry.${typeStr}.fromJSON(JSON.stringify(cps))`);
        const c = eval(`new SuperMap.Geometry.${typeStr}()`);
        c.setControlPoint(b.getControlPoints());
        // 存储生成图形的几何信息
        const f = new SuperMap.Feature.Vector(c);
        // const color = (`#${Math.random().toString(16).substr(2, 6).toUpperCase()}`);
        const color = this.textColor;
        let bgrColor = (`#${Math.random().toString(16).substr(2, 6).toUpperCase()}`);
        const fillOpacity = 0.3;
        bgrColor = bgrColor == color ? (`#${Math.random().toString(16).substr(2, 6).toUpperCase()}`) : bgrColor;
        const textstyle = {
            strokeColor: bgrColor, // 生成随机颜色
            strokeWidth: 2,
            fillColor: bgrColor,
            fillOpacity,
            label: data[label],
            fontColor: color,
            fontSize: '20px',
        };
        // 查看数据中有无包含style对象信息
        Object.assign(textstyle, data.style);
        f.data = data;
        f.style = textstyle;
        // console.log(f);
        return f;
    }

    // 给地图绑定点击事件
    addEventMap() {
        if (this.map) {
            const that = this;
            this.map.div.onclick = function(e) {
                if (that.mapClickObj.flag) {
                    // 获取当前视图窗口的像素坐标
                    const viewX = e.xy.x;
                    const viewY = e.xy.y;
                    // 转为图层坐标
                    const viewLocation = new SuperMap.Pixel(viewX, viewY);
                    const mapLocation = that.map.getLonLatFromPixel(viewLocation);
                    mapLocation.latitude = mapLocation.lat;
                    mapLocation.longitude = mapLocation.lon;
                    that.mapClickObj.data = mapLocation;
                    mapLocation.transform(that.map.projection, 'EPSG:4326');
                    that.acquisitionPoint(mapLocation, that.mapClickObj.cb);
                }
            };
        } else {
            throw console.error('The map is not defined');
        }
    }

    // 通过经纬度获取点信息
    acquisitionPoint(params, cb) {
        /*
              {
                lon or longitude
                lat or latitude
              }
            */
        if (custom) {
            // 自定义的先进行一次坐标的转换，自定义转换成大地2000
            batchTransfrom.singleTrans(params).then((res) => {
                this.getGDDotInfo(res, cb, params);
            });
        } else if (window.config.mapConfig.mapBusiness === 'SJS') {
            return this.getSJSDotInfo(params, cb);
        } else if (window.config.mapConfig.mapBusiness === 'EGIS') {
            return this.getEGSDotInfo(params, cb);
        } else if (window.config.mapConfig.mapBusiness === 'TDT') {
            return this.getTDTDotInfo(params, cb);
        } else {
            return this.getGDDotInfo(params, cb);
        }
    }

    // 天地图获取点信息
    getTDTDotInfo(mapLocation, cb) {
        const promise = new Promise((resolve, reject) => {
            const that = this;
            const obj = JSON.parse(JSON.stringify(mapLocation));
            Object.assign(obj, {
                ver: '1',
            });
            const data = {
                postStr: obj,
                type: 'geocode',
                tk: window.config.mapConfig.tk,
            };
            get.geocoder_default(data).then(res => {
                cb &&
                    cb({
                        mapLocation,
                        res,
                    });
                resolve({
                    mapLocation,
                    res,
                });
            });
        });
        return promise;
    }

    // 高德逆地理获取
    getGDDotInfo(mapLocation, cb, params = '') {
        const promise = new Promise((resolve, reject) => {
            this.tdtTrGd(
                mapLocation.lon || mapLocation.longitude,
                mapLocation.lat || mapLocation.latitude,
            ).then(res => {
                // console.log(res);
                get
                    .geocoder_Gd({
                        longitude: res.longitude,
                        latitude: res.latitude,
                    })
                    .then(r => {
                        // console.log(res);
                        if (r.regeocode.addressComponent) {
                            r.regeocode.addressComponent.county = r.regeocode.addressComponent.district;
                        }
                        if (params) {
                            Object.assign(mapLocation, params);
                        }
                        const obj = {
                            transform: {
                                type: 'GD',
                                res: r,
                            },
                            mapLocation,
                            res: {
                                ...r,
                                result: r.regeocode,
                            },
                        };
                        resolve(obj);
                        cb && cb(obj);
                    });
            });
        });
        return promise;
    }

    // 石景山获取点信息
    getSJSDotInfo(mapLocation, cb) {
        const that = this;
        const data = {
            geometry: mapLocation.toShortString(),
            geometryType: 'esriGeometryPoint',
            layers: 'all:10,11,12,15,17,18,19,20,21,23,24,25,26,28,29,30,31,33,34,35,37,38,39,40,42,43,45,46,47,48,49,51,52,53,54,55,56,58,59,60,61,62,64,65,66,68,69,70,72',
            tolerance: 10,
            mapExtent: this.map.getMaxExtent().toString(),
            imageDisplay: `${this.map.getSize().w},${this.map.getSize().h},96`,
            returnGeometry: true,
            f: 'json',
        };
        get.geocoder_sjs(data).then((res) => {
            cb(res);
        });
    }

    // EGS获取点信息
    getEGSDotInfo(mapLocation, cb) {
        const that = this;
        const promise = new Promise((resolve, reject) => {
            get.geocoder_egisGetTk().then(res => {
                const data = {
                    client_id: window.config.mapConfig.CLIENT_ID,
                    access_token: res.access_token,
                    location: `${mapLocation.lon || mapLocation.longitude},${mapLocation.lat ||
            mapLocation.latitude}`,
                };
                get.geocoder_egis(data).then(r => {
                    r.result.addressComponent = JSON.parse(JSON.stringify(r.result.address_component));
                    delete r.result.address_component;
                    const obj = {
                        transform: {
                            type: 'EGIS',
                        },
                        mapLocation,
                        res: {
                            ...r,
                            result: r.result,
                        },
                    };
                    cb && cb(obj);
                    resolve(obj);
                });
            });
        });
        return promise;
    }

    // 检查键是否存在
    isKeyInObj(obj, arr) {
        if (arr.length != 0) {
            arr.forEach((ele) => {
                if (!obj.hasOwnProperty(ele)) {
                    return `${ele} is not defined`;
                }
            });
        }
    }

    // 生成聚合需要的数据格式
    createConverge(data, ImgInfo) {
        return new Promise((resolve, reject) => {
            const featuresArr = [];
            data.forEach((ele) => {
                const f = new SuperMap.Feature.Vector();
                f.geometry = new SuperMap.Geometry.Point(ele.longitude, ele.latitude);
                f.style = {
                    pointRadius: 4,
                    graphic: true,
                    externalGraphic: '',
                    externalGraphic: ImgInfo.img,
                    graphicWidth: ImgInfo.width,
                    graphicHeight: ImgInfo.height,
                    label: ele.label || ele.name || '',
                    fontColor: ele.color || this.textColor || '#fff',
                    fontSize: ele.fontSize || '12px',
                    fontWeight: ele.fontWeight || 'normal',
                    fontStyle: ele.fontStyle || 'normal',
                    labelAlign: ele.labelAlign || 'cb',
                    labelXOffset: ele.labelXOffset || 0,
                    labelYOffset: ele.labelYOffset || -24,
                };
                f.info = ele;
                featuresArr.push(f);
            });
            resolve(featuresArr);
        });
    }

    // 给图层绑定事件
    coverageAddEventlist() {
        const that = this;
        const layer = [];
        for (const key in this.allCoverage) {
            if (this.allCoverage[key].CLASS_NAME.indexOf('Markers') === -1 &&
                this.allCoverage[key].CLASS_NAME.indexOf('HeatMapLayer') === -1) {
                layer.push(this.allCoverage[key]);
            }
        }
        const select = new SuperMap.Control.SelectCluster(layer, {
            callbacks: {
                click(f) {
                    const flag = that.vectorEventName === f.layer.name;
                    if (that.clickState || flag) {
                        if (!f.layer.eventListener) {
                            return
                        }
                        f.layer.eventListener.click && f.layer.eventListener.click(f.info, f);
                    }
                },
                clickout(f) {
                    // 点击退出
                    if (!f.layer.eventListener) {
                        return;
                    }
                    f.layer.eventListener.clickout && f.layer.eventListener.clickout(f.info, f);
                },
                over(f) {
                    // 鼠标移入
                    if (!f.layer.eventListener) {
                        return;
                    }
                    f.layer.eventListener.over && f.layer.eventListener.over(f.info, f);
                },
                out(f) {
                    // 鼠标移出
                    if (!f.layer.eventListener) {
                        return;
                    }
                    f.layer.eventListener.out && f.layer.eventListener.out(f.info, f);
                },
                dblclick(f) {
                    // 鼠标双击
                    if (!f.layer.eventListener) {
                        return;
                    }
                    f.layer.eventListener.dblclick && f.layer.eventListener.dblclick(f.info, f);
                },
            },
            onSelect(f) {
                if (!f.layer.eventListener) {
                    return;
                }
                f.layer.eventListener.onSelect && f.layer.eventListener.onSelect(f.info, f);
            },
            onUnselect(f) {
                if (!f.layer.eventListener) {
                    return;
                }
                f.layer.eventListener.onUnselect && f.layer.eventListener.onUnselect(f.info, f);
            },
        });
        if (this.select) {
            this.select.deactivate();
            // this.select.destroy();
            // this.select.layer.destroy();
            this.map.removeControl(this.select);
        }
        this.map.layers.forEach((ele, i) => {
            if (ele.CLASS_NAME === 'SuperMap.Layer.Vector.RootContainer') {
                this.map.layers.splice(i, 1);
            }
        });
        this.map.addControl(select);
        select.activate();
        this.select = select;
    }

    // 设置marker图层和聚合图层的统一级别
    setMarkerAndPolymerizationZindex(num) {
        if (this.map) {
            this.map.layers.forEach((x) => {
                if (x.CLASS_NAME === 'SuperMap.Layer.Markers' ||
                    x.CLASS_NAME === 'SuperMap.Layer.ClusterLayer'
                ) {
                    x.div.style.zIndex = num;
                }
            });
        } else {
            throw console.error('this the map is not definde');
        }
    }

    //
    // 不对API使用者提供，文档不具备说明，开发API人员 ------------------------------ end
    // 一般地图操作 ------------------------------- stated
    // 计算边界框
    bboxPolygon(data) {
        /*
          [{x:113,y:23}]
        */
        const promise = new Promise((resolve, reject) => {
            const handleData = data.reduce((pre, x) => {
                const arr = [Number(x.x), Number(x.y)];
                pre.push(arr);
                return pre;
            }, []);
            var line = turf.lineString(handleData);
            var bbox = turf.bbox(line);
            var bboxPolygons = turf.bboxPolygon(bbox);
            resolve(bboxPolygons.bbox);
        });
        return promise;
    }

    // 根据范围进行居中
    centerAccording(params) {
        const promise = new Promise((resolve, reject) => {
            var bounds = new SuperMap.Bounds(params[0], params[1], params[2], params[3]);
            this.map.zoomToExtent(bounds);
            resolve();
        });
        return promise;
    }

    // 添加wms服务的图层
    addWMSLayer(obj) {
        const promise = new Promise((resolve, reject) => {
            /*
                obj:{
                   name:'', // 图层名字
                   layerName:'', // url的最后一个/后的字符串
                   WMSURL:'',
                   VERSION:'', // 版本信息
                }
            */
            if (this.WMSLayer[obj.name]) {
                this.WMSLayer[obj.name].setVisibility(true);
                resolve(this.WMSLayer[obj.name]);
                return;
            }
            const bZLayer = new SuperMap.Layer.WMS(
                obj.name,
                obj.WMSURL, // 图层地址
                {
                    layers: obj.layerName, // 标注
                    VERSION: obj.VERSION,
                    TRANSPARENT: true,
                }, {
                    resolutions: this.map.baseLayer.resolutions,
                    projection: this.map.baseLayer.projection.projCode,
                    maxExtent: this.map.baseLayer.maxExtent,
                },
            );
            bZLayer.isLabel = true;
            bZLayer.layerType = 'img';
            bZLayer.isBaseLayer = false;
            this.map.addLayer(bZLayer);
            this.coverageAddEventlist();
            this.WMSLayer[obj.name] = bZLayer;
            resolve(bZLayer);
        });
        return promise;
    }

    // 设置WMS图层的显示和隐藏
    setWMSLayerVis(coverageName, flag) {
        const promise = new Promise((resolve, reject) => {
            if (this.WMSLayer[coverageName]) {
                this.WMSLayer[coverageName].setVisibility(flag);
            }
        });
        return promise;
    }

    // 计算切片
    getSection(location = '', cellSide) {
        const promise = new Promise((resolve, reject) => {
            if (!location) {
                resolve('');
            }
            // location = {
            //     right: {
            //         longitude,
            //         latitude
            //     },
            //     left: {
            //         longitude,
            //         latitude
            //     }
            // }
            // 右上角 左下角
            const bbox = [
                location.right.longitude,
                location.right.latitude,
                location.left.longitude,
                location.left.latitude,
            ];
            // 按照公里进行切片
            const options = { units: 'kilometers' };
            const squareGrid = turf.squareGrid(bbox, cellSide || 1, options);
            resolve(squareGrid.features);
        });
        return promise;
    }

    // 计算切片前处理
    getSectionBefor(res) {
        const promise = new Promise((resolve, reject) => {
            // console.log('切片处理前的数据', res);
            // 计算上边和右边的距离，同时除以3取最小值
            Promise.all([
                this.calculateLineDistance({
                    longitude: res.right,
                    latitude: res.top,
                }, {
                    longitude: res.left,
                    latitude: res.top,
                }, false),
                this.calculateLineDistance({
                    longitude: res.right,
                    latitude: res.top,
                }, {
                    longitude: res.right,
                    latitude: res.bottom,
                }, false),
            ]).then(response => {
                // console.log('计算距离', response);
                const num1 = (response[0] / 9 / 1000).toFixed(2);
                const num2 = (response[1] / 9 / 1000).toFixed(2);
                const obj = {
                    // 横 左上角
                    transverse: {
                        longitude: res.right,
                        latitude: res.top,
                        distance: num1,
                        frame: 9,
                        bearing: 90,
                    },
                    // 竖 右下角
                    vertical: {
                        longitude: res.left,
                        latitude: res.top,
                        distance: num2,
                        frame: 10,
                        bearing: 180,
                    },
                };
                // console.log(obj, '矩形切片的参数');
                // 切片 先竖后横
                const dataArr = this.getGeoPolygonExSection(obj.vertical).then(getSectionRes => {
                    const promiseArr = [];
                    getSectionRes.forEach(e => {
                        const o = {
                            ...obj.transverse,
                            longitude: e[0][0],
                            latitude: e[0][1],
                        };
                        promiseArr.push(this.getGeoPolygonExSection(o));
                    });
                    Promise.all(promiseArr).then(result => {
                        // console.log('矩形切片之后的数据', result);
                        result.forEach((e, i) => {
                            e.forEach((x, ind) => {
                                if (result[i + 1]) {
                                    x.push(result[i + 1][ind][1]);
                                    x.push(result[i + 1][ind][0]);
                                    x.push(x[0]);
                                }
                            });
                        });
                        result.pop();
                        resolve(result);
                    });
                });
            });
        });
        return promise;
    }

    // 根据当前视口直接进行矩形切片,九宫格模式，返回值为大地2000坐标系
    getRectangleSection() {
        const promise = new Promise((resolve, reject) => {
            this.getExtent().then(res => {
                // 自定义的坐标系
                if (custom) {
                    batchTransfrom.batchCustomTfGPS([`${res.right},${res.top}`, `${res.left},${res.bottom}`]).then((response) => {
                        console.log('自定义坐标系转换之后的数据', response);
                        resolve(this.getSectionBefor({
                            right: response[0].x,
                            left: response[1].x,
                            top: response[0].y,
                            bottom: response[1].y,
                        }));
                    });
                } else {
                    resolve(this.getSectionBefor(res));
                }
            });
        });
        return promise;
    }

    // 矩形切片
    getGeoPolygonExSection(obj = '', currentNum = 0, arr = []) {
        const promise = new Promise((resolve, reject) => {
            if (!obj) {
                return resolve(null);
            }
            if (obj) {
                if (currentNum < obj.frame) {
                    this.getDestination(obj, obj.distance, obj.bearing).then(res => {
                        const arrs = [
                            [obj.longitude, obj.latitude],
                            [...res.coordinates]
                        ];
                        arr.push(arrs);
                        obj.longitude = res.coordinates[0];
                        obj.latitude = res.coordinates[1];
                        resolve(this.getGeoPolygonExSection(obj, currentNum + 1, arr));
                    });
                } else {
                    return resolve(arr);
                }
            }
        });
        return promise;
    }

    // 根据点、距离和角度计算出另外一个点
    getDestination(location = '', distance = '', bearing = '') {
        const promise = new Promise((resolve, reject) => {
            if (!location || !distance || !bearing) {
                return resolve('');
            }
            // 点、距离、角度
            const point = turf.point([location.longitude, location.latitude]);
            const options = { units: 'kilometers' };
            const destination = turf.destination(point, distance, bearing, options);
            resolve(destination.geometry);
        });
        return promise;
    }

    // 根据线的数据、间隔距离分割线数据外露接口方法
    intervalDistanceApi(lineArr, num) {
        const promise = new Promise((resolve, reject) => {
            if (lineArr && num) {
                const res = this.intervalDistance(lineArr, num);
                const arr = res.reduce((pre, x) => {
                    pre.push({
                        calculationArr: x.calculationArr,
                    });
                    return pre;
                }, []);
                resolve(arr);
            }
        });
        return promise;
    }

    // 根据线的数据、间隔距离分割线数据实际方法
    intervalDistance(lineArr, num, saveArr = []) {
        /*
          lineArr:
          [
            [109.502991, 29.68718],
            [108.837829, 32.969237],
            [113.567871, 37.200787]
          ],
          num: 300 米
        */
        if (lineArr && num) {
            // 进行拷贝
            var Arr = JSON.parse(JSON.stringify(lineArr));
            var line = turf.lineString(Arr);
            var options = { units: 'kilometers' };
            var pointsArr = Arr.reduce((pre, x) => {
                pre.push(turf.point(x));
                return pre;
            }, []);
            // 计算沿线距离的点
            var along = turf.along(line, num, options);
            // 计算出来的距离点
            // along.geometry.coordinates [112.015826, 36.074031]
            var targetPoint = turf.point(along.geometry.coordinates);
            // [turf.point([110.907223, 33.09316])]
            var points = turf.featureCollection(pointsArr);
            // 查找离他最近的距离点
            var nearest = turf.nearestPoint(targetPoint, points);
            // nearest.geometry.coordinates.toString()
            const strPoint = nearest.geometry.coordinates.toString();
            // 查找出最近的距离点的值和下标
            var ind = 0;
            const diffArr = Arr.find((x, i) => {
                if (x.toString() === strPoint) {
                    ind = i;
                    return x
                }
            });
            let silceArr = []
                // 最近的点是否是最后一个值
            if (Arr.length - 1 === ind) {
                silceArr = Arr.slice(0);
                // 计算两点之间的距离是否小于分段距离
                var lineLengthArr3 = turf.lineString(silceArr);
                let length = turf.length(lineLengthArr3, { units: 'kilometers' });
                if (length <= num) {
                    saveArr.push({
                        calculationArr: silceArr,
                        index: ind,
                        near: '',
                        distance: silceArr[silceArr.length - 1],
                        position: 'after',
                        state: 'end',
                    });
                    return saveArr;
                }
            } else {
                silceArr = Arr.slice(0, ind + 1);
            }
            // 放到相近点之后计算
            var silceArr2 = JSON.parse(JSON.stringify(silceArr))
            silceArr2.push(along.geometry.coordinates);
            var lineLengthArr2 = turf.lineString(silceArr2);
            let length2 = turf.length(lineLengthArr2, { units: 'kilometers' });
            // 放到相近点之前计算
            var silceArr3 = JSON.parse(JSON.stringify(silceArr))
            let a = silceArr3.pop();
            silceArr3.push(along.geometry.coordinates);
            silceArr3.push(a);
            var lineLengthArr3 = turf.lineString(silceArr3);
            let length3 = turf.length(lineLengthArr3, { units: 'kilometers' });
            // 之前、之后、条件进行互相判断，取最接近的值
            let diffNum = Math.abs(num - length2);
            let diffNum2 = Math.abs(num - length3);
            // 不管是之前计算还是之后计算的返回都要，返回下标、相近点、距离点、计算的整段数组的数据
            if (diffNum > diffNum2) {
                saveArr.push({
                    calculationArr: silceArr3,
                    index: ind,
                    near: nearest.geometry.coordinates,
                    distance: along.geometry.coordinates,
                    position: 'before',
                    state: 'padding',
                });
                let nextArr = Arr.slice(ind);
                if (nextArr.length === 1) {
                    // 计算两点之间的距离是否小于分段距离
                    nextArr.unshift(along.geometry.coordinates);
                }
                return this.intervalDistance(nextArr, num, saveArr);
            } else {
                saveArr.push({
                    calculationArr: silceArr3,
                    index: ind,
                    near: nearest.geometry.coordinates,
                    distance: along.geometry.coordinates,
                    position: 'after',
                    state: 'padding',
                });
                let nextArr = Arr.slice(ind + 1);
                nextArr.unshift(along.geometry.coordinates);
                return this.intervalDistance(nextArr, num, saveArr);
            }
        }
    }

    // 根据数据进行生成图层和加载运动动画
    loadAnimator(coverageName, styleObj, data = [], time, startUp = true) {
        /*
        coverageName: string/图层名
        styleObj: 样式对象数据{
          img: 'xxx':string,
          wd: 0:number,
          hg: 0:number,
        }
        data: [
          [113.89035, 22.79078]/array
        ]/array,
        time: number/秒
        */
        const promise = new Promise((resolve, reject) => {
            var style = {
                fillColor: "#fff",
                fillOpacity: 1,
                strokeOpacity: 0,
                pointRadius: 5,
                externalGraphic: styleObj.img, // "https://iclient.supermap.io/examples/classic/images/blueCar.png",
                allowRotate: true,
                graphicWidth: styleObj.wd,
                graphicHeight: styleObj.hg,
            };
            let computingTime = Math.ceil(time / data.length);
            let timeNum = 0;
            var animatorCove = this.allCoverage[coverageName];
            // 先查看是否存在这个图层
            if (!this.allCoverage[coverageName]) {
                animatorCove = new SuperMap.Layer.AnimatorVector(coverageName, { rendererType: "TadpolePoint" }, {
                    startTime: 0,
                    endTime: time,
                });
                this.map.addLayers([animatorCove]);
                this.allCoverage[coverageName] = animatorCove;
            }
            // 处理数据
            const pointData = data.reduce((pre, x) => {
                let point = new SuperMap.Feature.Vector(
                    new SuperMap.Geometry.Point(x[0], x[1]), {
                        FEATUREID: 0,
                        TIME: timeNum,
                    }, style);
                timeNum += computingTime;
                pre.push(point);
                return pre;
            }, []);
            animatorCove.addFeatures(pointData);
            if (startUp) {
                animatorCove.animator.start();
            }
            resolve('');
        });
        return promise;
    }

    // 获取地图当前层级
    getMapZoom() {
        const promise = new Promise((resolve, reject) => {
            resolve(this.map.getZoom());
        });
        return promise;
    }

    // 获取地图最大的缩放层级
    getMapMaxZoom() {
        const promise = new Promise((resolve, reject) => {
            resolve(this.map.maxZoom);
        });
        return promise;
    }

    // 获取地图最小的缩放层级
    getMapMinZoom() {
        const promise = new Promise((resolve, reject) => {
            resolve(this.map.minZoom);
        });
        return promise;
    }

    // 控制整个图层的文字显示
    setCoverTextVis(flag) {
        const promise = new Promise((resolve, reject) => {
            const { className } = this.mapEl;
            if (flag) {
                // 显示
                if (className.indexOf('setSuperMapText') !== -1) {
                    this.mapEl.className = className.replace('setSuperMapText', '');
                }
            } else {
                // 隐藏
                if (className.indexOf('setSuperMapText') === -1) {
                    this.mapEl.className = `${className} setSuperMapText`;
                }
            }
            // console.log(this.mapEl);
        });
        return promise;
    }

    // 控制整个图层的文字颜色
    setCoverTextColor(color) {
        const promise = new Promise((resolve, reject) => {
            this.textColor = color;
            // 修改颜色
            for (const key in this.allCoverage) {
                if (this.allCoverage[key].features) {
                    this.allCoverage[key].features.forEach((x) => {
                        x.style.fontColor = color;
                    });
                    if (this.allCoverage[key].clusterPoints) {
                        this.allCoverage[key].clusterPoints.forEach((x) => {
                            x.style.fontColor = color;
                        });
                    }
                }
            }
            // 显示
            const elArr = this.mapEl.querySelectorAll('text');
            Array.from(elArr).forEach(ele => {
                ele.style.color = color;
                if (ele.id.indexOf('label') !== -1) {
                    ele.setAttribute('fill', color);
                }
            });
        });
        return promise;
    }

    // 控制图层的显示
    setCoverageShow(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                this.allCoverage[coverageName].setVisibility(true);
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 控制图层的隐藏
    setCoverageHide(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                this.allCoverage[coverageName].setVisibility(false);
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 控制所有图层的显示隐藏
    setAllCoverageShowHide(flag) {
        const promise = new Promise((resolve, reject) => {
            if (flag) {
                for (const key in this.allCoverage) {
                    this.allCoverage[key].setVisibility(true);
                }
            } else {
                for (const key in this.allCoverage) {
                    this.allCoverage[key].setVisibility(false);
                }
            }
            resolve();
        });
        return promise;
    }

    // 批量控制图层模板函数
    batchCoverageTempatle(coverageNameArr, fun) {
        const Promise = new Promise((resolve, reject) => {
            if (coverageNameArr) {
                if (Array.isArray(coverageNameArr)) {
                    coverageNameArr.forEach((ele) => {
                        fun(ele);
                    });
                    resolve();
                } else {
                    reject();
                    throw console.error('The coverageNameArr is not Array');
                }
            } else {
                reject();
                throw console.error('The coverageNameArr is not defined');
            }
        });
        return Promise;
    }

    // 批量控制图层的显示
    setBatchCoverageShow(coverageNameArr) {
        return this.batchCoverageTempatle(coverageNameArr, this.setCoverageShow);
    }

    // 批量控制图层的隐藏
    setBatchCoverageHide(coverageNameArr) {
        return this.batchCoverageTempatle(coverageNameArr, this.setCoverageHide);
    }

    // 前端计算两点之间的距离
    calculateLineDistance(start, end, flag = true) {
        /**
         * @Description: el
         * @Date: 2021-02-24 11:12:27
         * @param {*}
         * @description:
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        return new Promise((resolve, reject) => {
            // const d1 = 0.01745329251994329;
            // let d2 = start.longitude;
            // let d3 = start.latitude;
            // let d4 = end.longitude;
            // let d5 = end.latitude;
            // d2 *= d1;
            // d3 *= d1;
            // d4 *= d1;
            // d5 *= d1;
            // const d6 = Math.sin(d2);
            // const d7 = Math.sin(d3);
            // const d8 = Math.cos(d2);
            // const d9 = Math.cos(d3);
            // const d10 = Math.sin(d4);
            // const d11 = Math.sin(d5);
            // const d12 = Math.cos(d4);
            // const d13 = Math.cos(d5);
            // const arrayOfDouble1 = [];
            // const arrayOfDouble2 = [];
            // arrayOfDouble1.push(d9 * d8);
            // arrayOfDouble1.push(d9 * d6);
            // arrayOfDouble1.push(d7);
            // arrayOfDouble2.push(d13 * d12);
            // arrayOfDouble2.push(d13 * d10);
            // arrayOfDouble2.push(d11);
            // const d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] -
            //         arrayOfDouble2[0]) +
            //     (arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
            //     (arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));
            // const data = (Math.asin(d14 / 2.0) * 12742001.579854401);
            const custom = batchTransfrom.isCustom();
            if (custom && flag) {
                // 先进行转换成大地2000
                Promise.all([
                    batchTransfrom.singleTrans(start),
                    batchTransfrom.singleTrans(end)
                ]).then(res => {
                    const from = turf.point([res[0].longitude, res[0].latitude]);
                    const to = turf.point([res[1].longitude, res[1].latitude]);
                    const options = { units: 'kilometers' };
                    const distance = turf.distance(from, to, options);
                    resolve(distance * 1000);
                })
            } else {
                const from = turf.point([start.longitude, start.latitude]);
                const to = turf.point([end.longitude, end.latitude]);
                const options = { units: 'kilometers' };
                const distance = turf.distance(from, to, options);
                resolve(distance * 1000);
            }
        });
    }

    // 批量计算两点之间的距离
    batchCalculateTowDistance(data) {
        const promise = new Promise((resolve, reject) => {
            if (data && Array.isArray(data) && data.length != 0) {
                const arr = [];
                data.forEach(ele => {
                    arr.push(this.calculateLineDistance(ele.stated, ele.end));
                });
                Promise.all(arr).then(res => {
                    resolve(res);
                });
            }
        });
        return promise;
    }

    // 获取当前图层的数据
    getCoverageData(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                const coverage = this.allCoverage[coverageName];
                let arr = [];
                if (coverage.id.toLowerCase().indexOf('vector') !== -1) {
                    if (
                        coverage.features &&
                        coverage.features.length !== 0 &&
                        Array.isArray(coverage.features)
                    ) {
                        arr = coverage.features;
                    }
                } else if (coverage.id.toLowerCase().indexOf('markers') !== -1) {
                    if (
                        coverage.markers &&
                        coverage.markers.length !== 0 &&
                        Array.isArray(coverage.markers)
                    ) {
                        arr = coverage.markers;
                    }
                }
                resolve(arr);
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 清除、删除图层
    clearDeleteCoverage(coverageName) {
        // console.log(coverageName);
        // console.log(this.allCoverage);
        const that = this;
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName] || this.converge[coverageName]) {
                // console.log('allCoverage', coverageName);
                if (this.allCoverage[coverageName]) {
                    delete this.allCoverage[coverageName];
                }
                if (this.converge[coverageName]) {
                    delete this.converge[coverageName];
                }
                if (this.drawFeature[coverageName]) {
                    delete this.drawFeature[coverageName];
                }
                if (this.plottingEdit[coverageName]) {
                    delete this.plottingEdit[coverageName];
                }
                if (this.allVectorStyleObj[coverageName]) {
                    delete this.allVectorStyleObj[coverageName];
                }
                this.map.layers.forEach((ele, index) => {
                    if (ele.name === coverageName) {
                        if (ele.CLASS_NAME === 'SuperMap.Layer.Markers') {
                            ele.clearMarkers();
                        } else if (
                            ele.CLASS_NAME === 'SuperMap.Layer.ClusterLayer' ||
                            ele.CLASS_NAME === 'SuperMap.Layer.Vector' ||
                            ele.CLASS_NAME === 'SuperMap.Layer.HeatMapLayer'
                        ) {
                            ele.removeAllFeatures();
                            setTimeout(() => {
                                ele.div.remove();
                            }, 20);
                            // ele.destroy()
                        } else if (ele.CLASS_NAME === 'SuperMap.Layer.AnimatorVector') {
                            ele.destroy();
                        } else {
                            ele.removeAllFeatures();
                        }
                        this.map.layers.splice(index, 1);
                    }
                });
                this.coverageAddEventlist();
                resolve();
            } else {
                resolve('The coverage is not defined');
                // throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 切换图层
    tabCoverage(name) {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                // console.log(this.map);
                // console.log(this.map.baseLayers);
                let baseLayer = '';
                if (this.map.baseLayers) {
                    this.map.baseLayers.forEach(ele => {
                        if (name === ele.name) {
                            if (ele.otherLayers.length !== 0) {
                                ele.otherLayers[0].setVisibility(true);
                            }
                            ele.baseLayer.setVisibility(true);
                            baseLayer = ele.baseLayer;
                        } else {
                            if (ele.otherLayers.length !== 0) {
                                ele.otherLayers[0].setVisibility(false);
                            }
                            ele.baseLayer.setVisibility(false);
                        }
                    });
                }
                this.map.setBaseLayer(baseLayer);
                // 对矢量和影响的地图做位置转换
                const vec = [];
                const img = [];
                let index = 0; // 地图的下标
                this.map.layers.forEach(e => {
                    if (e.layerType) {
                        if (e.layerType === 'vec') {
                            vec.push(e);
                        }
                        if (e.layerType === 'img') {
                            img.push(e);
                        }
                        index++;
                    }
                });
                this.map.layers.splice(0, index);
                if (name === '影像') {
                    this.map.layers.unshift(...vec, ...img);
                }
                if (name === '矢量') {
                    this.map.layers.unshift(...img, ...vec);
                }
                resolve();
            } else {
                reject();
                throw console.error('The map has not yet been created');
            }
        });
        return promise;
    }

    // 圈选
    handleCheckAll(TypeStr) {
        const promise = new Promise((resolve, reject) => {
            if (TypeStr) {
                this.clearAtPresentVectorData('checkAll');
                const str = resolve.toString();
                this.newDrawFeature('checkAll', TypeStr).then(res => {
                    this.drawFeature.checkAll.events.on({
                        featureadded() {
                            resolve(this.layer.features);
                            // resolve(this.layer.features[0].geometry._controlPoints)
                        },
                    });
                    this.activateDrawFeature('checkAll');
                });
            } else {
                reject();
                throw console.error('The TypeStr is not defined');
            }
        });
        return promise;
    }

    // 开启点击获取落点信息 逆地理
    clickDroppoint(cb) {
        if (this.map) {
            this.clickState = false;
            this.mapClickObj.flag = true;
            this.mapClickObj.cb = cb;
        } else {
            throw console.error('The map is not defined');
        }
    }

    // 关闭点击获取点信息
    closeClickDroppoint() {
        const promise = new Promise((resolve, reject) => {
            const that = this;
            setTimeout(() => {
                that.clickState = true;
            }, 500);
            if (this.map) {
                this.mapClickObj.flag = false;
                resolve();
            } else {
                throw console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 还原默认鼠标样式
    restoreDefaultStyle() {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                this.map.div.style.cursor =
                    'url(./static/js/supMap/iClient/libs/../theme/images/cursors/Pan.cur),default';
                resolve();
            } else {
                reject();
                throw console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 设置鼠标样式
    setMouseStyle(src) {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                this.map.div.style.cursor = `url(${src}) 15 17 ,default`;
                // console.log(this.map.div);
                resolve();
            } else {
                reject();
                throw console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 设置地图中心点
    setCentent(data, zoom) {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                this.getMapMaxZoom().then(res => {
                    this.map.setCenter(
                        new SuperMap.LonLat(data.longitude || data.lon, data.latitude || data.lat),
                        zoom || res,
                    );
                    resolve();
                });
            } else {
                reject();
                throw console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 获取地图中心点
    getMapCenter() {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                this.getMapMaxZoom().then(res => {
                    resolve(this.map.getCenter());
                });
            } else {
                reject();
                console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 获取图形的中心点
    getCoverageCentet(data) {
        const promise = new Promise((resolve, reject) => {
            const featureData = data.reduce((pre, e) => {
                pre.push(turf.point([e.x, e.y]));
                return pre;
            }, []);
            const features = turf.featureCollection(featureData);
            const center = turf.center(features);
            resolve(center.geometry);
        });
        return promise;
    }

    // 添加自定义图片到图层
    addImgCoverage(url, LonLat, key = '') {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                const options = {
                    numZoomLevels: 999, // 显示层级
                    useCanvas: false, // {Boolean} 设置是否将一个图层用Canvas元素显示，默认为true，使用Canvas显示。
                    isBaseLayer: false, // {Boolean} 是否为基础图层，默认为true。
                };
                // ​var bounds = new SuperMap.Bounds(-180,-90,180,90)
                const LonLatArr = LonLat.split(',');
                const bounds = new SuperMap.Bounds(LonLatArr[0], LonLatArr[1], LonLatArr[2], LonLatArr[3]);
                const imageLayer = new SuperMap.Layer.Image(key, url, bounds, options);
                imageLayer.setVisibility(true);
                this.map.addLayer(imageLayer);
                resolve();
            } else {
                reject();
                throw console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 在地图上添加标注文字
    addFontToCoverage(obj) {
        const promise = new Promise((resolve, reject) => {
            const str = this.isKeyInObj(obj, ['lon', 'lat', 'key']);
            if (str) {
                reject(str);
                console.error(str);
                return;
            }
            const geoText = new SuperMap.Geometry.GeoText(obj.lon, obj.lat, obj.key);
            const geotextFeature = new SuperMap.Feature.Vector(geoText);
            // 新建一个策略并使用在矢量要素图层(vector)上。
            const strategy = new SuperMap.Strategy.GeoText();
            strategy.style = {
                fontColor: obj.color ? obj.color : '#000',
                fontSize: obj.size ? obj.size : '100px',
                fontWeight: 600,
                fill: true,
                fillColor: obj.bgr ? obj.bgr : '#FFFFFF',
                fillOpacity: obj.opacity ? obj.opacity : 0.01,
            };
            const vectorLayer = new SuperMap.Layer.Vector(obj.covName || obj.key, {
                strategies: [strategy],
            });
            this.map.addLayers([vectorLayer]);
            vectorLayer.div.style.zIndex = 9998;
            vectorLayer.addFeatures([geotextFeature]);
            this.coverageAddEventlist();
            resolve(vectorLayer);
        });
        return promise;
    }

    // 根据layer对象 删除 layer
    deleteLayer(layer) {
        const promise = new Promise((resolve, reject) => {
            this.map.removeLayer(layer);
            resolve();
        });
        return promise;
    }

    // 搜索POI数据
    searchPOIdata(key, type = '', page = 1) {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                const mapTypeStr = type || window.config.mapConfig.mapBusiness;
                console.log(this.mapType);
                const obj = {
                    city: window.config.cityName,
                    page
                };
                this.getExtent().then(res => {
                    let bounds = `${res.right},${res.bottom},${res.left},${res.top}`;
                    const custom = batchTransfrom.isCustom();
                    if (custom) {
                        // 先进行坐标转换
                        batchTransfrom
                            .batchCustomTfGPS([`${res.right},${res.bottom}`, `${res.left},${res.top}`])
                            .then(coordinate => {
                                bounds = `${coordinate[0].x},${coordinate[0].y},${coordinate[1].x},${coordinate[1].y}`;
                                console.log(res, bounds, 'poi之前先进行坐标处理，获得的数据');
                                integration.mapPOISearch(key, mapTypeStr, bounds, obj).then(r => {
                                    // 整理出来的数据都是默认转换为大地2000，转换后的字段名称 transFromLonLat
                                    console.log(r);
                                    const tfArrArr = r.reduce((pre, ele) => {
                                        pre.push(ele.transFromLonLat);
                                        return pre;
                                    }, []);
                                    // poi搜索的数据，接口处做了处理最多的只有50条，所以这里不做数据坐标转换数量限制
                                    batchTransfrom.batchGPSTFCustom(tfArrArr).then(tfRes => {
                                        tfRes.forEach((x, i) => {
                                            r[i].transFromLonLat = `${x.x},${x.y}`;
                                        });
                                        console.log(tfRes, '转换之后的数据');
                                        console.log(r, '转换之后的数据');
                                        resolve(r);
                                    });
                                });
                            });
                    } else {
                        integration.mapPOISearch(key, mapTypeStr, bounds, obj).then(r => {
                            // 整理出来的数据都是默认转换为大地2000，转换后的字段名称 transFromLonLat
                            console.log(r);
                            resolve(r);
                        });
                    }
                });
            } else {
                reject();
                throw console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 范围搜索
    rangeSearchData(key, type = '') {
        const promise = new Promise((resolve, reject) => {
            if (this.map) {
                const mapTypeStr = type || window.config.mapConfig.mapBusiness;
                console.log(this.mapType);
                const obj = {
                    city: window.config.cityName,
                };
                this.getExtent().then(res => {
                    let bounds = `${res.right},${res.bottom},${res.left},${res.top}`;
                    let gd1 = LonLatT.LonLatTransform(`${res.right},${res.bottom}`, 'TTG').split(',');
                    let gd2 = LonLatT.LonLatTransform(`${res.left},${res.top}`, 'TTG').split(',');
                    if (mapTypeStr === 'GD') {
                        bounds = `${gd1[0]},${gd1[1]}|${gd2[0]},${gd2[1]}`;
                    }
                    const custom = batchTransfrom.isCustom();
                    if (custom) {
                        // 先进行坐标转换
                        batchTransfrom
                            .batchCustomTfGPS([`${res.right},${res.bottom}`, `${res.left},${res.top}`])
                            .then(coordinate => {
                                bounds = `${coordinate[0].x},${coordinate[0].y},${coordinate[1].x},${coordinate[1].y}`;
                                if (mapTypeStr === 'GD') {
                                    gd1 = LonLatT.LonLatTransform(`${res.right},${res.bottom}`, 'TTG').split(',');
                                    gd2 = LonLatT.LonLatTransform(`${res.left},${res.top}`, 'TTG').split(',');
                                    bounds = `${gd1[0]},${gd1[1]}|${gd2[0]},${gd2[1]}`;
                                }
                                console.log(res, bounds, 'poi之前先进行坐标处理，获得的数据');
                                integration.mapRangeSearch(key, mapTypeStr, bounds, obj).then(r => {
                                    // 整理出来的数据都是默认转换为大地2000，转换后的字段名称 transFromLonLat
                                    console.log(r);
                                    const tfArrArr = r.reduce((pre, ele) => {
                                        pre.push(ele.transFromLonLat);
                                        return pre;
                                    }, []);
                                    // poi搜索的数据，接口处做了处理最多的只有50条，所以这里不做数据坐标转换数量限制
                                    batchTransfrom.batchGPSTFCustom(tfArrArr).then(tfRes => {
                                        tfRes.forEach((x, i) => {
                                            r[i].transFromLonLat = `${x.x},${x.y}`;
                                        });
                                        console.log(tfRes, '转换之后的数据');
                                        console.log(r, '转换之后的数据');
                                        resolve(r);
                                    });
                                });
                            });
                    } else {
                        integration.mapRangeSearch(key, mapTypeStr, bounds, obj).then(r => {
                            // 整理出来的数据都是默认转换为大地2000，转换后的字段名称 transFromLonLat
                            console.log(r);
                            resolve(r);
                        });
                    }
                });
            } else {
                reject();
                throw console.error('The map is not defined');
            }
        });
        return promise;
    }

    // 截图
    mapScreenshot(cb) {
        const promise = new Promise((resolve, reject) => {
            this.screenshot.excute(this.map, cb);
            resolve();
        });
        return promise;
    }

    // 计算面积
    calculateAreas(geometry) {
        const promise = new Promise((resolve, reject) => {
            // 获得图层几何对象
            if (
                geometry.id.indexOf('SuperMap.Geometry.Polygon') === -1 &&
                geometry.id.indexOf('SuperMap.Geometry.GeoPolygonEx') === -1
            ) {
                reject();
                throw new Error('feature is not Polygon');
            }
            const obj = JSON.parse(geometry.toJSON());
            const polygonData = obj.controlPoints.reduce((pre, ele) => {
                const arr = [ele.x, ele.y];
                pre.push(arr);
                return pre;
            }, []);
            polygonData.push(polygonData[0]);
            const polygon = turf.polygon([polygonData]);
            const area = turf.area(polygon);
            resolve({ area: area.toString() });
            // const measureParam = new SuperMap.REST.MeasureParameters(
            //     geometry); /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积 */
            // const myMeasuerService = new SuperMap.REST.MeasureService(
            //     mapurl); // 量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
            // myMeasuerService.events.on({
            //     processCompleted(measureEventArgs) {
            //         resolve(measureEventArgs.result);
            //     },
            // });
            // // 对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
            // myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;
            // myMeasuerService.processAsync(measureParam); // processAsync负责将客户端的量算参数传递到服务端。
        });
        return promise;
    }

    // 获取当前地图的范围
    getExtent() {
        const promise = new Promise((resolve, reject) => {
            const obj = this.map.getExtent();
            resolve(obj);
        });
        return promise;
    }

    // 路劲规划
    pathPlanning(obj, type) {
        const promise = new Promise((resolve, reject) => {
            /*
                    obj: {
                      origin:113.12,23.221,
                      destination:113.12,23.221,
                    }
                  */
            const custom = batchTransfrom.isCustom();
            if (custom) {
                const params = [obj.origin, obj.destination];
                // 进行一次参数转换
                batchTransfrom.batchCustomTfGPS(params).then(res => {
                    const str = window.config.project;
                    let objs = {};
                    if (str === 'CC') {
                        objs = {
                            origin: `${res[0].x},${res[0].y}`,
                            destination: `${res[1].x},${res[1].y}`,
                        };
                    }
                    // console.log(objs, '路径规划需要的数据');
                    // 拿到自定义的坐标之后进行路劲规划，获取到路径规划之前的数据进行再次处理
                    this.pathPlanningBefor(objs, type).then(res => {
                        console.log(res, '自定义的坐标系进行的路径规划，通过GD获取的数据');
                        res.route.paths.forEach(ele => {
                            const { process } = useProcess({
                                data: ele.steps,
                                requestApi: batchTransfrom.batchGPSTFCustom,
                            });
                            process();
                        });
                    });
                });
            } else {
                resolve(this.pathPlanningBefor(obj, type));
            }
        });
        return promise;
    }

    // 路径规划前
    pathPlanningBefor(obj, type) {
        const promise = new Promise((resolve, reject) => {
            // obj 传过来的定位默认以使用的地图为准
            const mapType = window.config.mapConfig.mapBusiness;
            if (mapType === 'GD') {
                const origin = obj.origin.split(',');
                const destination = obj.destination.split(',');
                Promise.all([
                    this.tdtTrGd(Number(origin[0]), Number(origin[1])),
                    this.tdtTrGd(Number(destination[0]), Number(destination[1])),
                ]).then(res => {
                    console.log(res);
                    obj.origin = `${res[0].longitude},${res[0].latitude}`;
                    obj.destination = `${res[1].longitude},${res[1].latitude}`;
                    resolve(this.pathPlannings(obj, type));
                });
            } else if (mapType === 'EGIS') {
                resolve(this.pathPlannings(obj, type));
            } else {
                resolve(this.pathPlannings(obj, type));
            }
        });
        return promise;
    }

    // 整理高德的数据
    handleGDdata(data) {
        const promise = new Promise((resolve, reject) => {
            data.map(e => {
                e.steps.map(x => {
                    const lonlatArrStr = x.polyline.split(';');
                    const handleFun = lonlatArrStr.reduce((pre, ele) => {
                        const splitArr = ele.split(',');
                        pre.push(this.gdTrTdt(Number(splitArr[0]), Number(splitArr[1])));
                        return pre;
                    }, []);
                    Promise.all(handleFun).then(r => {
                        // console.log(r);
                        const transFromLonLatSpot = [];
                        const transFromLonLat = r.reduce((pre, e) => {
                            const arr = {
                                x: e.longitude,
                                y: e.latitude,
                            };
                            pre.push(`${e.longitude},${e.latitude}`);
                            transFromLonLatSpot.push(arr);
                            return pre;
                        }, []);
                        x.transFromLonLatSpot = transFromLonLatSpot;
                        x.transFromLonLat = transFromLonLat.join(';');
                        // console.log(transFromLonLat.join(';'));
                    });
                });
            });
            resolve('');
        });
        return promise;
    }

    // 路径规划
    pathPlannings(obj, type) {
        const promise = new Promise((resolve, reject) => {
            const mapType = window.config.mapConfig.mapBusiness;
            const mapTypeObj = {
                GD: 'GDPath',
                TDT: 'TDTPath',
                EGIS: 'EGISPath',
            };
            if (!obj.hasOwnProperty('origin') || !obj.hasOwnProperty('destination')) {
                reject();
                return;
            }
            const planningFun = pathPlanning[mapTypeObj[mapType]];
            switch (type) {
                // 驾车
                case 'drive':
                    planningFun.drivePathFun(obj).then(res => {
                        if (mapType === 'GD') {
                            console.log(res.data);
                            const { data } = res;
                            if (data.route && data.route.paths) {
                                this.handleGDdata(data.route.paths).then(() => {
                                    resolve(res.data);
                                });
                            }
                        } else if (mapType === 'EGIS') {
                            // console.log(res.data, 'EGIS');
                            console.log(res.data, 'EGIS');
                            resolve(res.data);
                        } else {
                            console.log(res.data);
                            // 天地图没有做兼容
                            resolve(res.data);
                        }
                    });
                    break;
                    // 步行
                case 'walk':
                    planningFun.walkPathFun(obj).then(res => {
                        if (mapType === 'GD') {
                            // console.log(res.data);
                            const { data } = res;
                            if (data.route && data.route.paths) {
                                this.handleGDdata(data.route.paths).then(() => {
                                    resolve(res.data);
                                });
                            }
                        } else if (mapType === 'EGIS') {
                            // console.log(res.data, 'EGIS');
                            console.log(res.data, 'EGIS');
                            resolve(res.data);
                        } else {
                            console.log(res.data);
                            // 天地图没有做兼容
                            resolve(res.data);
                        }
                    });
                    break;
                    // 公交
                case 'transit':
                    if (!obj.hasOwnProperty('city')) {
                        reject();
                        return;
                    }
                    planningFun.transitPathFun(obj).then(res => {
                        resolve(res.data);
                    });
                    break;
                    // 骑行
                case 'cycling':
                    planningFun.cyclingPathFun(obj).then(res => {
                        if (mapType === 'GD') {
                            const { data } = res;
                            if (data.data && data.data.paths) {
                                this.handleGDdata(data.data.paths).then(() => {
                                    resolve({ route: res.data.data });
                                });
                            }
                        } else if (mapType === 'EGIS') {
                            // console.log(res.data, 'EGIS');
                            console.log(res.data, 'EGIS');
                            resolve(res.data);
                        } else {
                            console.log(res.data);
                            // 天地图没有做兼容
                            resolve(res.data);
                        }
                    });
                    break;
                    // 货车
                case 'truck':
                    planningFun.truckPathFun(obj).then(res => {
                        resolve(res.data);
                    });
                    break;
                default:
                    break;
            }
        });
        return promise;
    }

    // 根据像素坐标转换成经纬度
    pixelToLatAndLon(xy) {
        const promise = new Promise((resolve, reject) => {
            const viewX = xy.x;
            const viewY = xy.y;
            // 转为图层坐标
            const viewLocation = new SuperMap.Pixel(viewX, viewY);
            const mapLocation = this.map.getLonLatFromPixel(viewLocation);
            resolve(mapLocation);
        });
        return promise;
    }

    // 根据经纬度转换成像素坐标
    portPxFromLonLat(lonlat) {
        const promise = new Promise((resolve, reject) => {
            // getPixelFromLonLat getViewPortPxFromLonLat getLayerPxFromViewPortPx
            // const mapLocation = this.map.getViewPortPxFromLonLat(viewLocation);
            const viewX = lonlat.x;
            const viewY = lonlat.y;
            // 转为图层坐标
            // const viewLocation = new SuperMap.Pixel(viewX, viewY);
            const viewLocation = new SuperMap.LonLat(lonlat.x, lonlat.y);
            const mapLocation = this.map.getViewPortPxFromLonLat(viewLocation);
            resolve(mapLocation);
        });
        return promise;
    }

    // 提升地图层级到最高
    setMapCovzIndex(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                // console.log(this.allCoverage[coverageName]);
                const { id } = this.allCoverage[coverageName].div;
                const nodeEl = document.getElementById(`${id}_root`);
                // 它的父元素
                const parentEl = nodeEl.parentElement;
                // 移入文档碎片
                const d = document.createDocumentFragment();
                d.appendChild(nodeEl);
                // 再次插入到父元素
                parentEl.appendChild(d);
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 还原地图层级
    reductionMapZindex(coverageName) {
        // 可能废弃
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                // const id = this.allCoverage[coverageName].div.id;
                // const nodeEl = document.getElementById(id + '_root');
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 在当前缩放级别的基础上放大一级。
    zoomIn() {
        const promise = new Promise((resolve, reject) => {
            this.map.zoomIn();
            resolve();
        });
        return promise;
    }

    // 在当前缩放级别的基础上缩小一级。
    zoomOut() {
        const promise = new Promise((resolve, reject) => {
            this.map.zoomOut();
            resolve();
        });
        return promise;
    }

    // 一般地图操作 ------------------------------- end
    // mark ----------------------------------- stated
    // 创建mark图层
    createdMarkCoverage(coverageName) {
        const promise = new Promise((resolve, reject) => {
            const that = this;
            // 检查图层容器是否包含这个图层
            this.examineRepetition(coverageName, () => {
                // 没有包含图层，进行图层定义
                that.allCoverage[coverageName] = new SuperMap.Layer.Markers(coverageName);
                that.map.addLayer(that.allCoverage[coverageName]);
                this.setMarkerAndPolymerizationZindex(9999);
                this.coverageAddEventlist();
                resolve(that.allCoverage[coverageName]);
            });
        });
        return promise;
    }

    // 清空当前图层
    clearAtPresentMarkData(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                this.allCoverage[coverageName].clearMarkers();
            }
            resolve('clearAtPresentMarkData succeed');
        });
        return promise;
    }

    // 设置单个mark落点
    setOneMarker(coverageName, data, addEventlist = '') {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                // this.allCoverage[coverageName].clearMarkers();
                if (data.longitude && data.latitude) {
                    this.creatTempMark(data, addEventlist).then(res => {
                        this.allCoverage[coverageName].addMarker(res);
                        resolve(res);
                    });
                }
            } else {
                reject();
                // 发现没有这个图层，退出代码块并抛出语法错误
                throw console.error('the coverage is not defined');
            }
        });
        return promise;
    }

    // 根据icon的Id 筛查指定 mark
    getFilterIdMark(coverageName, value) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                this.allCoverage[coverageName].markers.forEach(ele => {
                    if (ele.icon && ele.icon.imageDiv) {
                        if (ele.icon.imageDiv.id === value) {
                            resolve(ele);
                        }
                    }
                });
                resolve();
            } else {
                reject();
                // 发现没有这个图层，退出代码块并抛出语法错误
                throw console.error('the coverage is not defined');
            }
        });
        return promise;
    }

    // 根据条件筛查指定 mark
    getFilterMark(coverageName, condition, value) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                this.allCoverage[coverageName].markers.forEach(ele => {
                    if (ele.data && ele.data[condition]) {
                        if (ele.data[condition] === value) {
                            resolve(ele);
                        }
                    }
                });
                resolve();
            } else {
                reject();
                // 发现没有这个图层，退出代码块并抛出语法错误
                throw console.error('the coverage is not defined');
            }
        });
        return promise;
    }

    // 设置单个marker的样式
    setOneMarkerStyle(that, style) {
        const promise = new Promise((resolve, reject) => {
            if (that && that.icon) {
                const el = that.icon;
                el.imageDiv.style.width = style.wd || el.imageDiv.style.width;
                el.imageDiv.style.height = style.hg || el.imageDiv.style.height;
                const imgEl = el.imageDiv.getElementsByTagName('img')[0];
                imgEl.style.width = style.wd || imgEl.style.width;
                imgEl.style.height = style.hg || imgEl.style.height;
                imgEl.src = style.src;
                el.drawingData = {
                    ...style,
                };
                el.size = {
                    h: style.hg || parseFloat(el.imageDiv.style.width),
                    w: style.wd || parseFloat(el.imageDiv.style.width),
                };
                el.url = style.src;
                resolve();
            } else {
                reject('that or icon is not definde');
            }
        });
        return promise;
    }

    // 设置多个mark落点
    setMultiMarker(coverageName, data, addEventlist = '') {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                if (Array.isArray(data) && data.length != 0) {
                    const arr = [];
                    data.forEach(ele => {
                        if (ele.longitude && ele.latitude) {
                            arr.push(this.setOneMarker(coverageName, ele, addEventlist));
                        }
                    });
                    Promise.all(arr).then(res => {
                        resolve(res);
                    });
                } else {
                    reject();
                    throw console.error('the data is not Array');
                }
            } else {
                reject();
                // 发现没有这个图层，退出代码块并抛出语法错误
                throw console.error('the coverage is not defined');
            }
        });
        return promise;
    }

    // 指定某个图层添加点
    assignCoverageAddMark(coverageName, data, addEventlist = '') {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                if (data.longitude && data.latitude) {
                    this.creatTempMark(data, addEventlist).then(res => {
                        this.allCoverage[coverageName].addMarker(res);
                        resolve('assignCoverageAddMark succeed');
                    });
                } else {
                    reject();
                    throw console.error('longitude or latitude is not defined');
                }
            } else {
                reject();
                // 发现没有这个图层，退出代码块并抛出语法错误
                throw console.error('the coverage is not defined');
            }
        });
        return promise;
    }

    // 删除指定mark
    removeMark(that) {
        const promise = new Promise((resolve, reject) => {
            if (that) {
                that.setOpacity(0);
                if (that.icon) {
                    if (that.icon.imageDiv) {
                        that.icon.imageDiv.remove();
                    }
                }
                if (that.data) {
                    that.data.delete = 1;
                }
                resolve();
            } else {
                reject();
            }
        });
        return promise;
    }

    // 获取元素宽度进行位置设置
    getElWHSetPos(text, el, imgEl, data, num = 0) {
        const that = this;
        setTimeout(() => {
            // console.log(text.offsetWidth, el.offsetWidth);
            if (text.offsetWidth && el.offsetWidth) {
                Array.from(imgEl).forEach(e => {
                    // 取消img的定位
                    e.style.position = 'initial';
                });
                if (text.offsetWidth > el.offsetWidth) {
                    const diff = text.offsetWidth - el.offsetWidth;
                    if (data.textPosition === 'tp') {
                        text.style.top = `-${text.offsetHeight}px`;
                        text.style.left = `-${diff / 2}px`;
                    } else {
                        text.style.marginLeft = `-${diff / 2}px`;
                    }
                }
                text.style.opacity = '1';
            } else {
                // console.log(num);
                if (num >= 1000) {} else {
                    num += 200;
                    that.getElWHSetPos(text, el, imgEl, data, num);
                }
            }
        }, 200);
    }

    // 生成mark标记
    creatTempMark(data, addEventlist = '') {
        const promise = new Promise((resolve, reject) => {
            const that = this;
            const size = new SuperMap.Size(data.wd ? data.wd : 40, data.hg ? data.hg : 50);
            const offset = new SuperMap.Pixel(-(size.w / (data.offsetX ? data.offsetX : 2)), -size.h / (data.offsetY ? data.offsetY : 1.65), );
            const icon = new SuperMap.Icon(data.src ? data.src : this.markImg, size, offset);
            const tempMarker = new SuperMap.Marker(
                new SuperMap.LonLat(data.longitude, data.latitude),
                icon,
            );
            tempMarker.data = data;
            let obj = {};
            // label有值的话渲染文字
            if (data.label && tempMarker.icon && tempMarker.icon.imageDiv) {
                const el = tempMarker.icon.imageDiv;
                const imgEl = el.getElementsByTagName('img');
                // var d = document.createDocumentFragment();
                const text = document.createElement('text');
                text.innerText = data.label;
                text.style.color = data.color || this.textColor; // 0091FF
                text.style.fontSize = data.fontSize || '14px';
                text.style.opacity = '0';
                text.style.position = 'absolute';
                text.style.top = '-21px';
                el.style.whiteSpace = 'nowrap';
                el.style.textAlign = 'center';
                // d.appendChild(text);
                switch (data.textPosition) {
                    case 'bt':
                        el.appendChild(text);
                        break;
                    case 'tp':
                        setTimeout(() => {
                            // 先渲染再插入，防止错乱
                            el.insertBefore(text, el.childNodes[0]);
                        });
                        break;
                    case 'ct':
                        text.style.top = '0';
                        text.style.left = '0';
                        text.style.right = '0';
                        text.style.bottom = '0';
                        text.style.margin = 'auto';
                        text.style.display = 'flex';
                        text.style.alignItems = 'center';
                        text.style.justifyContent = 'center';
                        el.appendChild(text);
                        break;
                    default:
                        el.appendChild(text);
                        break;
                }
                that.getElWHSetPos(text, el, imgEl, data);
            }
            if (addEventlist) {
                if (addEventlist.constructor === Object) {
                    const events = {
                        click: e => {
                            if (that.clickState) {
                                e.object = tempMarker;
                                addEventlist.click && addEventlist.click(e, tempMarker);
                            }
                        },
                        dblclick: e => {
                            e.object = tempMarker;
                            addEventlist.dblclick && addEventlist.dblclick(e, tempMarker);
                        },
                        mousedown: e => {
                            e.object = tempMarker;
                            addEventlist.mousedown && addEventlist.mousedown(e, tempMarker);
                        },
                        mouseup: e => {
                            e.object = tempMarker;
                            addEventlist.mouseup && addEventlist.mouseup(e, tempMarker);
                        },
                        mousemove: e => {
                            e.object = tempMarker;
                            addEventlist.mousemove && addEventlist.mousemove(e, tempMarker);
                        },
                        mouseout: e => {
                            e.object = tempMarker;
                            addEventlist.mouseout && addEventlist.mouseout(e, tempMarker);
                        },
                        mouseover: e => {
                            e.object = tempMarker;
                            addEventlist.mouseover && addEventlist.mouseover(e, tempMarker);
                        },
                        rightclick: e => {
                            e.object = tempMarker;
                            addEventlist.click && addEventlist.click(e, tempMarker);
                            addEventlist.rightclick && addEventlist.rightclick(this);
                        },
                        touchstart: e => {
                            e.object = tempMarker;
                            addEventlist.touchstart && addEventlist.touchstart(e, tempMarker);
                        },
                        touchmove: e => {
                            e.object = tempMarker;
                            addEventlist.touchmove && addEventlist.touchmove(e, tempMarker);
                        },
                        touchend: e => {
                            e.object = tempMarker;
                            addEventlist.touchend && addEventlist.touchend(e, tempMarker);
                        },
                    };
                    obj = Object.assign(events, {
                        scope: tempMarker,
                    });
                } else {
                    reject();
                    // addEventlist 不是个对象时
                    throw console.error('The addEventlist is not Object');
                }
            }
            tempMarker.events.on(obj);
            resolve(tempMarker);
        });
        return promise;
    }

    // 构建聚合图标并落点
    drawConverge(key, data, ImgInfo, addEventlist = {}) {
        return new Promise((resolve, reject) => {
            let clusterLayer = this.converge[key];
            // 防止出现一个图层重复构建
            if (!clusterLayer) {
                clusterLayer = new SuperMap.Layer.ClusterLayer(key, {
                    // 设置clusterStyles属性
                    clusterStyles: [{
                            count: 2, // 子节点小于等于2的聚散点
                            // style的详情参见 SuperMap.Feature.Vector.style
                            style: {
                                fontColor: '#00ECFF',
                                fontSize: '20px',
                                graphic: true,
                                externalGraphic: ImgInfo.img,
                                graphicWidth: ImgInfo.width,
                                graphicHeight: ImgInfo.height,
                                labelXOffset: 0,
                                labelYOffset: 5,
                            },
                        },
                        {
                            count: 'moreThanMax', // 子节点大于2的聚散点
                            style: {
                                fontColor: '#00ECFF',
                                fontSize: '20px',
                                graphic: true,
                                externalGraphic: ImgInfo.img,
                                graphicWidth: ImgInfo.width,
                                graphicHeight: ImgInfo.height,
                                labelXOffset: 0,
                                labelYOffset: 0,
                            },
                        },
                    ],
                });
                this.map.addLayer(clusterLayer);
                this.converge[key] = clusterLayer;
                this.allCoverage[key] = clusterLayer;
                // 创建聚散选择控件。该控件实现了聚散图层的鼠标事件。
                clusterLayer.events.on({
                    moveend(e) {
                        // 注册moveend缩放事件
                        addEventlist.moveend && addEventlist.moveend();
                    },
                });
                clusterLayer.events.on({
                    clusterend(e) {
                        // 子样式统一时使用统一的子样式，否则使用大体样式
                        e.clusterPoints.forEach(ele => {
                            if (ele.children.length !== 0) {
                                let num = 0;
                                const leg = ele.children.length;
                                const styleImg = ele.children[0].style.externalGraphic;
                                ele.children.forEach(x => {
                                    if (x.style.externalGraphic === styleImg) {
                                        num += 1;
                                    }
                                });
                                // console.log(ele, num);
                                if (num === leg) {
                                    ele.style.externalGraphic = styleImg;
                                }
                            }
                        });
                        // e包含了聚散完成所需要的信息，其结构如下e={clusterPoints:[],displayedPoints:[],element:null,object:null,type:"clusterEnd"}
                        // 其中，clusterMaps是包含了聚散点映射关系集合，clusterPoints[i]则表示第i个聚散点映射关系，其类型为{SuperMap.Feature.Vector}，其内的children属性包含有对应的实际点坐标
                        // 而displayedPoints则是用户所设定的某一范围内不需要被聚散的点集合
                        // console.log(e);
                        e.clusterPoints.forEach(ele => {
                            ele.style.label = ''; // 不显示聚合数量
                        });
                        // label:name,
                        // 设置样式和颜色
                        // let polymerization = document.getElementById(`${e.object.id}_root`);
                        // let allText = polymerization.getElementsByTagName('text');
                        // let alltspan = polymerization.getElementsByTagName('tspan');
                        // setTimeout(() => {
                        //     Array.from(alltspan).forEach(e => {
                        //         e.style.cssText = "font-size:20px;";
                        //     })
                        // })
                        // setTimeout(() => {
                        //     Array.from(allText).forEach(e => {
                        //         e.setAttribute('fill', 'red')
                        //     })
                        // })
                        addEventlist.clusterend && addEventlist.clusterend(e);
                    },
                });
            }
            this.createConverge(data, ImgInfo).then(res => {
                clusterLayer.addFeatures(res);
            });
            clusterLayer.eventListener = addEventlist;
            this.coverageAddEventlist();
            resolve(clusterLayer);
        });
    }

    // 聚合数据筛查
    dataScreening(key, condition, conditionData) {
        const promise = new Promise((resolve, reject) => {
            if (this.converge[key]) {
                let ContainerLayer = '';
                let layer = '';

                this.map.layers.forEach(ele => {
                    if (ele.CLASS_NAME === 'SuperMap.Layer.Vector.RootContainer') {
                        ContainerLayer = ele;
                    }
                });
                ContainerLayer.layers.forEach(ele => {
                    if (ele.name === key) {
                        layer = ele;
                    }
                });
                if (!layer) {
                    layer = this.converge[key];
                }
                if (!condition || !conditionData) {
                    console.error('The condition or conditionData is not definde');
                    return;
                }
                // console.log(layer);
                // 源数据，无法通过id获取它的元素 数据不受显示条件影响
                const sourceData = layer.clusterPoints.filter(ele => ele.info[condition] === conditionData);
                const sourceData2 = layer.features.filter(ele => {
                  if(ele.info || ele.data) {
                    (ele.info || ele.data)[condition] === conditionData
                  }
                });
                const arr = [...sourceData, ...sourceData2];
                const elArr = arr.reduce((pre, x) => {
                    const el = document.getElementById(x.geometry.id)
                    if (el) {
                        pre.push(x);
                    }
                    return pre
                }, []);
                // 绘制中的数据，可以通过id获取元素 但是数据不在显示条件时为空
                const { toDrawFeatures } = layer;
                const data = toDrawFeatures.filter(ele => {
                    if (ele.info) {
                        return ele.info[condition] === conditionData;
                    }
                });
                resolve(elArr);
            } else {
                reject();
                throw console.error('The polymerization converge is not definde');
            }
        });
        return promise;
    }

    // 聚合根据数据修改样式
    modifyStyle(key, condition, conditionData, ImgInfo) {
        const promise = new Promise((resolve, reject) => {
            if (this.converge[key]) {
                if (!condition || !conditionData || !ImgInfo) {
                    console.error('The condition or conditionData or ImgInfo is not definde');
                    return;
                }
                this.dataScreening(key, condition, conditionData).then(res => {
                    console.log(res);
                    res.forEach(ele => {
                        ele.style.externalGraphic = ImgInfo.img;
                        ele.style.graphicHeight = ImgInfo.height;
                        ele.style.graphicWidth = ImgInfo.width;
                        this.converge[key].redraw();
                    });
                    // res.data.forEach((ele) => {
                    // let handel = document.getElementById(ele.geometry.id);
                    // handel.href.baseVal = ImgInfo.img;
                    //     // handel.setAttribute('width', ImgInfo.width);
                    //     // handel.setAttribute('height', ImgInfo.height);
                    //     ele.style.externalGraphic = ImgInfo.img;
                    //     ele.style.graphicHeight = ImgInfo.height;
                    //     ele.style.graphicWidth = ImgInfo.width;
                    //     this.converge[key].redraw();
                    // });
                    resolve([...res]);
                });
            } else {
                reject();
                throw console.error('The polymerization converge is not definde');
            }
        });
        return promise;
    }

    // 聚合图层点击时设置样式
    clickAggregation(e, t, ImgInfo) {
        const promise = new Promise((resolve, reject) => {
            const el = document.getElementById(t.geometry.id);
            if (e && t) {
                if (typeof e !== 'undefined') {
                    t.style.original = t.style.externalGraphic;
                    el.href.baseVal = ImgInfo.img;
                    el.style.width = `${ImgInfo.width}px`;
                    el.style.height = `${ImgInfo.height}px`;
                    t.style.externalGraphic = ImgInfo.img;
                    t.style.graphicHeight = ImgInfo.width;
                    t.style.graphicWidth = ImgInfo.height;
                } else {
                    el.style.display = 'none';
                }
                resolve(e);
            } else {
                reject();
                throw console.error('The e or t is not definde');
            }
        });
        return promise;
    }

    // 清除聚合图层数据
    clearDrawConvergeData(key) {
        const promise = new Promise((resolve, reject) => {
            if (this.converge[key]) {
                this.converge[key].removeAllFeatures();
            }
            resolve();
        });
        return promise;
    }

    // Mark 数据筛查
    markScreening(coverageName, id) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                const data = this.allCoverage[coverageName].markers;
                const filterData = data.filter(x => x.icon.imageDiv.id === id);
                resolve(filterData[0]);
            } else {
                // 发现没有这个图层，退出代码块并抛出语法错误
                resolve();
                console.error('the coverage is not defined');
            }
        });
        return promise;
    }

    // 开启指定Mark的拖拽
    oepnMarkDrop(that) {
        const promise = new Promise((resolve, reject) => {
            console.log(that.lonlat);
            this.portPxFromLonLat({
                x: that.lonlat.lon,
                y: that.lonlat.lat,
            }).then(res => {
                console.log(res);
            });
            if (that.icon && that.icon.imageDiv) {
                this.clickState = false;
                const el = that.icon.imageDiv;
                // 隐藏图上显示的
                el.style.display = 'none';
                // 用icon 中的px{x，y}也可以做top 和 left
                const left = `${el.parentElement.parentElement.offsetLeft + parseFloat(el.style.left)}px`;
                const top = `${el.parentElement.parentElement.offsetTop + parseFloat(el.style.top)}px`;
                const id = `${el.id}dropDiv`;
                let dropDiv = document.getElementById(id);
                if (!dropDiv) {
                    // 创建新的元素进行拖动
                    dropDiv = document.createElement('div');
                    dropDiv.id = id;
                    dropDiv.style.top = top;
                    dropDiv.style.left = left;
                    dropDiv.style.width = el.style.width;
                    dropDiv.style.height = el.style.height;
                    dropDiv.style.whiteSpace = 'nowrap';
                    dropDiv.style.cursor = 'pointer';
                    dropDiv.style.position = 'absolute'; // absolute fixed
                    dropDiv.style.textAlign = 'center';
                    dropDiv.style.zIndex = 10010;
                    dropDiv.innerHTML = el.innerHTML;
                    this.mapEl.parentElement.appendChild(dropDiv);
                }
                // 设置所有的图片为不可拖拽的
                const allImg = dropDiv.getElementsByTagName('img');
                Array.from(allImg).forEach(e => {
                    e.style['-webkit-user-drag'] = 'none';
                });
                // 点击按下时绑定事件
                dropDiv.onmousedown = function(ev) {
                    let oldx = ev.x;
                    let oldy = ev.y;
                    this.dropFlag = true;
                    const self = this;
                    window.onmousemove = function(e) {
                        if (self.dropFlag) {
                            const newx = e.x;
                            const newy = e.y;
                            const t = parseFloat(self.style.top);
                            const l = parseFloat(self.style.left);
                            const movex = newx - oldx + l;
                            const movey = newy - oldy + t;
                            self.style.top = `${movey}px`;
                            self.style.left = `${movex}px`;
                            oldx = newx;
                            oldy = newy;
                        }
                    };
                };
                // 抬起时关闭事件 采用二级事件
                window.addEventListener(
                    'mouseup',
                    ev => {
                        dropDiv.dropFlag = false;
                    },
                    false,
                );
                resolve(dropDiv);
            }
        });
        return promise;
    }

    // 关闭拖拽
    closeMarkDrop(that) {
        const promise = new Promise((resolve, reject) => {
            if (that && that.icon && that.icon.imageDiv) {
                const el = that.icon.imageDiv;
                // 删除拖拽的元素
                const div_Id = `${el.id}dropDiv`;
                if (document.getElementById(div_Id)) {
                    document.getElementById(div_Id).remove();
                }
                // 显示图上显示的
                el.style.display = 'block';
                resolve();
            }
            this.clickState = true;
            resolve();
        });
        return promise;
    }

    // 获取拖拽后的经纬度
    getAfterDragging(that) {
        const promise = new Promise((resolve, reject) => {
            if (that.icon && that.icon.imageDiv) {
                const el = that.icon.imageDiv;
                const div_Id = `${el.id}dropDiv`;
                const nodeEl = document.getElementById(div_Id);
                if (nodeEl) {
                    // 宽度要取中心点 高度取全部
                    const x = parseFloat(nodeEl.style.width) / 2 + parseFloat(nodeEl.style.left);
                    const y = parseFloat(nodeEl.style.height) / 1.65 + parseFloat(nodeEl.style.top);
                    const obj = {
                        x,
                        y,
                    };
                    resolve(this.pixelToLatAndLon(obj));
                } else {
                    resolve();
                }
            }
        });
        return promise;
    }

    // 获取当个
    // mark ----------------------------------- end

    // vector --------------------------------- stated
    // 生成vector图层
    createdVectorCoverage(coverageName, style) {
        const promise = new Promise((resolve, reject) => {
            // 检查图层容器是否包含这个图层
            const that = this;
            this.examineRepetition(coverageName, () => {
                // 没有包含图层，进行图层定义
                that.allCoverage[coverageName] = new SuperMap.Layer.Vector(coverageName);
                that.allCoverage[coverageName].style = style || that.vectorStyle;
                that.allVectorStyleObj[coverageName] = style || that.vectorStyle;
                // 拖拽的图层
                that.dragFeature[coverageName] = new SuperMap.Control.DragFeature(
                    that.allCoverage[coverageName],
                );
                that.plottingEdit[coverageName] = new SuperMap.Control.PlottingEdit(
                    that.allCoverage[coverageName],
                );
                that.map.addLayer(that.allCoverage[coverageName]);
                that.map.addControl(that.dragFeature[coverageName]);
                that.map.addControl(that.plottingEdit[coverageName]);
                this.setMarkerAndPolymerizationZindex(9999);
                this.coverageAddEventlist();
                resolve(that.allCoverage[coverageName]);
            });
        });
        return promise;
    }

    // 实例化绘制控件
    newDrawFeature(coverageName, TypeStr, addEventlist = '', repeate = false) {
        const promise = new Promise((resolve, reject) => {
            // 判断类型是否是vector
            const str = TypeStr;
            if (this.allCoverage[coverageName].CLASS_NAME.toLowerCase().indexOf('vector') != -1) {
                if (
                    str === 'Path' ||
                    str === 'CircleEx' ||
                    str === 'PolygonEx' ||
                    str === 'Rectangle' ||
                    str === 'PolyLineEx' ||
                    str === 'DoubleArrow' ||
                    str === 'DiagonalArrow'
                ) {
                    const edit = new SuperMap.Control.DrawFeature(
                        this.allCoverage[coverageName],
                        eval(`SuperMap.Handler.${str}`),
                    );
                    // console.log(edit);
                    this.drawFeature[coverageName] = edit;
                    this.drawFeaturebindingMonitorEvent(coverageName, addEventlist, repeate);
                    this.map.addControl(this.drawFeature[coverageName]);
                    this.drawFeature[coverageName].deactivate();
                    resolve();
                } else {
                    reject();
                    throw console.error("This type doesn't fit");
                }
            } else {
                reject();
                throw console.error("This layer doesn't match");
            }
        });
        return promise;
    }

    // 绑定监听事件
    drawFeaturebindingMonitorEvent(coverageName, addEventlist = '', repeate) {
        const that = this;
        const promise = new Promise((resolve, reject) => {
            const that = this;
            let featureadded = '';
            let beforefeatureadded = '';
            let activate = '';
            let deactivate = '';
            // console.log(addEventlist);
            if (addEventlist) {
                featureadded = addEventlist.featureadded;
                beforefeatureadded = addEventlist.beforefeatureadded;
                activate = addEventlist.activate;
                deactivate = addEventlist.deactivate;
            }
            // console.log(deactivate);
            const eventObj = {
                featureadded(e) {
                    if (!repeate) {
                        this.deactivate();
                    }
                    // eslint-disable-next-line no-unused-expressions
                    that.setMarkerAndPolymerizationZindex(9999);
                    featureadded && featureadded(e);
                },
                beforefeatureadded(e) {
                    this.style = that.allVectorStyleObj[coverageName];
                    // eslint-disable-next-line no-unused-expressions
                    beforefeatureadded && beforefeatureadded(e);
                },
                activate(e) {
                    activate && activate(e);
                },
                deactivate(e) {
                    deactivate && deactivate(e);
                },
            };
            this.drawFeature[coverageName].eventListener = addEventlist;
            this.drawFeature[coverageName].events.on(eventObj);
            resolve();
        });
        return promise;
    }

    // 设置图形样式
    setVectorCoverage(coverageName, style) {
        const promise = new Promise((resolve, reject) => {
            if (this.drawFeature[coverageName]) {
                // console.log(style);
                // this.drawFeature[coverageName].style = style
                this.allVectorStyleObj[coverageName] = style;
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 激活标绘图层控件
    activateDrawFeature(coverageName) {
        const promise = new Promise((resolve, reject) => {
            // 查看是否存在这个图层
            if (this.drawFeature[coverageName]) {
                for (const key in this.drawFeature) {
                    this.drawFeature[key].deactivate();
                }
                this.vectorEventName = coverageName;
                console.log(this.allCoverage[coverageName]);
                // this.allCoverage[coverageName].setZIndex(10000);
                this.clickState = false;
                this.map.layers[this.map.layers.length - 1].setZIndex(10000);
                this.drawFeature[coverageName].activate();
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 关闭激活图层控件
    closeActivateDrawFeature(coverageName) {
        const promise = new Promise((resolve, reject) => {
            this.clickState = true;
            // 查看是否存在这个图层
            if (this.drawFeature[coverageName]) {
                this.drawFeature[coverageName].deactivate();
                resolve();
            }
            // else {
            //   reject();
            //   throw console.error('The coverage is not defined');
            // }
        });
        return promise;
    }

    // 打开指定vector图层进行图层中的图形编辑
    openVectorCoverageEdit(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.plottingEdit[coverageName]) {
                this.plottingEdit[coverageName].activate();
                this.setMapCovzIndex(coverageName);
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 关闭指定vector图层进行图层中的图形编辑
    closeVectorCoverageEdit(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.plottingEdit[coverageName]) {
                this.plottingEdit[coverageName].deactivate();
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 删除选中图形
    delectSelectGraph(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.plottingEdit[coverageName]) {
                this.plottingEdit[coverageName].deleteSymbol();
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 清空当前图层
    clearAtPresentVectorData(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                this.allCoverage[coverageName].removeAllFeatures();
            }
            setTimeout(() => {
                resolve();
            }, 20);
        });
        return promise;
    }

    // 渲染图形
    renderGraph(coverageName, data, label = 'textLabel', addEventList = '') {
        const promise = new Promise((resolve, reject) => {
            const that = this;
            if (this.allCoverage[coverageName]) {
                if (data && data.length !== 0) {
                    const fs = [];
                    data.forEach(ele => {
                        const { type } = ele;
                        if (type) {
                            const typeStr = type.substring(type.lastIndexOf('.') + 1);
                            if (typeStr) {
                                fs.push(this.createdGraph(typeStr, ele, label));
                            }
                        }
                    });
                    // this.allCoverage[coverageName].removeAllFeatures();
                    this.allCoverage[coverageName].addFeatures(fs);
                    if (addEventList) {
                        this.allCoverage[coverageName].eventListener = addEventList;
                        this.coverageAddEventlist();
                    }
                }
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 渲染多边形
    renderPolygon(coverageName, data, addOrRemoveFlag = false) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                if (data && data.length !== 0) {
                    const fs = [];
                    const lineArr = [];
                    // data [[],[]] 2维数组
                    data.forEach((x, index) => {
                        x.forEach(y => {
                            if (!fs[index]) {
                                fs[index] = [];
                            }
                            fs[index].push(new SuperMap.Geometry.Point(y[0], y[1]));
                        });
                    });
                    fs.forEach(ele => {
                        const line = new SuperMap.Geometry.LinearRing(ele);
                        lineArr.push(line);
                    });
                    const polygonData = new SuperMap.Geometry.Polygon(lineArr);
                    const polygon = new SuperMap.Feature.Vector(polygonData);
                    if (addOrRemoveFlag && this.allCoverage[coverageName].features.length > 2) {
                        const leg = this.allCoverage[coverageName].features.length - 1;
                        const lastArr = this.allCoverage[coverageName].features[leg];
                        this.allCoverage[coverageName].removeAllFeatures();
                        this.allCoverage[coverageName].addFeatures(lastArr);
                    }
                    this.allCoverage[coverageName].addFeatures(polygon);
                    // console.log(this.allCoverage[coverageName]);
                }
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 处理缓冲区数据
    handleRenderBufferData(data, value, coverageName, addOrRemoveFlag) {
        const promise = new Promise((resolve, reject) => {
            const val = value / 1000;
            const dataArr = data.reduce((pre, ele) => {
                const arr = [ele.x, ele.y];
                pre.push(arr);
                return pre;
            }, []);
            // 自定义的坐标系先转换成大地2000再进行数据的计算
            const line = turf.lineString(dataArr);
            const buffered = turf.buffer(line, val, {
                units: 'kilometers',
            });
            const CovgData = buffered.geometry.coordinates;
            // 绘制时使用当前系统的坐标系
            // 删除上次绘制的图形
            if (addOrRemoveFlag && this.allCoverage[coverageName].features.length > 1) {
                const leg = this.allCoverage[coverageName].features.length - 1;
                const lastArr = this.allCoverage[coverageName].features.slice(0, leg);
                this.allCoverage[coverageName].removeAllFeatures();
                this.allCoverage[coverageName].addFeatures(lastArr);
            }
            const custom = batchTransfrom.isCustom();
            if (custom) {
                // 大地2000转换成自定义
                CovgData.forEach(e => {
                    const trArrs = [];
                    e.forEach(x => {
                        const str = `${x[0]},${x[1]}`;
                        trArrs.push(str);
                    })
                    trAllArr.push(batchTransfrom.batchGPSTFCustom(trArrs))
                });
                // 大地2000转自定义
                Promise.all(trAllArr).then(r => {
                    const CovgDatas = r.reduce((pre, x) => {
                        const arrData = x.reduce((p, e) => {
                            const a = [e.x, e.y];
                            p.push(a);
                            return p;
                        }, [])
                        pre.push(arrData);
                        return pre;
                    }, []);
                    // 转成自定义坐标系之后的数据
                    this.renderPolygon(coverageName, CovgDatas);
                    resolve({ CovgData, sourceData: CovgDatas });
                });
            } else {
                this.renderPolygon(coverageName, CovgData);
                resolve({ CovgData, sourceData: CovgData });
            }
            // 大地2000
        });
        return promise;
    }

    // 渲染缓冲区
    renderBuffer(coverageName, data, value = 20, addOrRemoveFlag = false) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                if (!data || !Array.isArray(data)) {
                    reject();
                    return console.error('The data is not Array');
                }
                const reg = /^[0-9]+.?[0-9]*$/;
                if (!reg.test(value)) {
                    reject();
                    return console.error('The value is not Number');
                }
                const custom = batchTransfrom.isCustom();
                if (custom) {
                    const tfArr = data.reduce((pre, ele) => {
                        const str = `${ele.x},${ele.y}`;
                        pre.push(str);
                        return pre;
                    }, []);
                    // 向上取整
                    const leg = Math.ceil(tfArr.length / 1000);
                    const num = 0;
                    const sliceArr = [];
                    for (let i = 0; i < leg; i++) {
                        sliceArr.push(batchTransfrom.batchCustomTfGPS(tfArr.slice(num, num + 1000)));
                        num += 1000;
                    }
                    // 自定义转大地2000
                    Promise.all(sliceArr).then((res) => {
                        const handleArrData = res.reduce((pre, x) => {
                            pre = pre.concat(x);
                            return pre;
                        }, []);
                        // 进行缓冲区计算
                        this.handleRenderBufferData(handleArrData, value, coverageName, addOrRemoveFlag).then(resData => {
                            resolve(resData);
                        });
                    });
                    // batchTransfrom.batchCustomTfGPS(tfArr).then((res) => {

                    // });
                } else {
                    this.handleRenderBufferData(data, value, coverageName, addOrRemoveFlag).then(res => {
                        resolve(res);
                    });
                }
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 通过一个经纬度和距离，获取圆圈另外的点
    getCirLonAndLat(data) {
        const promise = new Promise((resolve, reject) => {
            if (!data.r || !data.longitude || !data.latitude) {
                return new Error('data error');
            }
            let r = 0;
            if (this.map.units === 'dd' || this.map.units === 'degree') {
                r = data.r / (110000 * Math.cos((data.latitude / 180) * Math.PI));
            }
            const origin = new SuperMap.Geometry.Point(data.longitude, data.latitude);
            const circleP = SuperMap.Geometry.Polygon.createRegularPolygon(origin, r, 3, 360);
            const obj = {
                longitude: circleP.components[0].components[0].x,
                latitude: circleP.components[0].components[0].y,
                rDeg: r,
            };
            resolve(obj);
        });
        return promise;
    }

    // 绘制圆圈
    vectorDrawCir(coverageName, data, style, eventListener = '') {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                const datas = data;
                this.getCirLonAndLat(data).then(res => {
                    // console.log(res,datas);
                    const typeStr = 'GeoCircle';
                    const data = {
                        cps: {
                            controlPoints: [{
                                    x: datas.longitude,
                                    y: datas.latitude,
                                },
                                {
                                    x: res.longitude,
                                    y: res.latitude,
                                },
                            ],
                        },
                        style: {
                            strokeColor: 'yellow',
                            strokeWidth: 4,
                        },
                    };
                    if (style) {
                        Object.assign(data, {
                            style,
                        });
                    }
                    data.style.fillColor ? '' : (data.style.fillColor = '#fff');
                    data.style.fillOpacity ? '' : (data.style.fillOpacity = 0.01);
                    this.allCoverage[coverageName].addFeatures(this.createdGraph(typeStr, data));
                });
                if (eventListener) {
                    // 绑定事件
                    this.allCoverage[coverageName].eventListener = eventListener;
                }
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 绘制线
    vectorDrawLine(coverageName, stated, end, style = '') {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                const points = [
                    new SuperMap.Geometry.Point(stated.longitude, stated.latitude),
                    new SuperMap.Geometry.Point(end.longitude, end.latitude),
                ];
                const line = new SuperMap.Geometry.LineString(points);
                const plotLine = new SuperMap.Feature.Vector(line);
                // 线对象样式
                plotLine.style = style;
                if (!style) {
                    plotLine.style = {
                        strokeColor: '#fff',
                        strokeWidth: 1,
                        strokeDashstyle: 'solid',
                    };
                }
                // 添加标绘划线图层
                this.allCoverage[coverageName].addFeatures(plotLine);
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 批量绘制线
    batchDrawVectorLine(coverageName, data) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                if (data && Array.isArray(data) && data.length != 0) {
                    data.forEach(ele => {
                        this.vectorDrawLine(coverageName, ele.stated, ele.end, ele.style);
                    });
                }
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 绘制可编辑的线、面图形 如果用来绘制圆和矩形，将会报错
    drawLinePolyg(coverageName, addEventlist = {}, style = {}) {
        const that = this;
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                const vecotrLayer = this.allCoverage[coverageName];
                const drawPoint = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.Point, {
                    multi: true,
                });
                const drawLine = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.Path, {
                    multi: true,
                });
                const drawPolygon = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.Polygon);
                const modifyCtrl = new SuperMap.Control.ModifyFeature(vecotrLayer); // 拿到 Vector图形
                // 给图层添加事件
                if (addEventlist.hasOwnProperty('Line')) {
                    drawLine.events.on(addEventlist.Line);
                    drawLine.events.on({
                        featureadded() {
                            that.setMarkerAndPolymerizationZindex(9999);
                        },
                    });
                }
                if (addEventlist.hasOwnProperty('Polygon')) {
                    drawPolygon.events.on(addEventlist.Polygon);
                    drawPolygon.events.on({
                        featureadded() {
                            that.setMarkerAndPolymerizationZindex(9999);
                        },
                    });
                }
                if (addEventlist.hasOwnProperty('Modify')) {
                    modifyCtrl.events.on(addEventlist.Modify);
                    modifyCtrl.events.on({
                        featureadded() {
                            that.setMarkerAndPolymerizationZindex(9999);
                        },
                    });
                }
                // 给每个图层添加标记名字
                drawPoint.name = coverageName;
                drawLine.name = coverageName;
                drawPolygon.name = coverageName;
                modifyCtrl.name = coverageName;
                this.ModifyFeature[coverageName] = {
                    point: drawPoint,
                    line: drawLine,
                    polygon: drawPolygon,
                    modifyCtrl,
                }; // 把可编辑图层的control 放入 对象中进行存储
                this.map.addControl(this.ModifyFeature[coverageName].point);
                this.map.addControl(this.ModifyFeature[coverageName].line);
                this.map.addControl(this.ModifyFeature[coverageName].polygon);
                this.map.addControl(this.ModifyFeature[coverageName].modifyCtrl);
                vecotrLayer.style = {
                    fillColor: 'blue',
                    fillOpacity: 0.3,
                    strokeColor: 'blue',
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    strokeLinecap: 'round',
                    strokeDashstyle: 'solid',
                    hoverFillColor: 'white',
                    hoverFillOpacity: 0.8,
                    hoverStrokeColor: 'red',
                    hoverStrokeOpacity: 1,
                    hoverStrokeWidth: 0.2,
                    pointRadius: 6,
                    hoverPointRadius: 1,
                    hoverPointUnit: '%',
                    pointerEvents: 'visiblePainted',
                    cursor: 'inherit',
                    fontColor: '#000000',
                    labelAlign: 'cm',
                    labelOutlineColor: 'white',
                    labelOutlineWidth: 3,
                    ...style,
                };
                this.allVectorStyleObj[coverageName].style = vecotrLayer.style;
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 开启线、面的绘制
    openLinePolygon(coverageName, type, falg) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                if (this.ModifyFeature[coverageName]) {
                    const obj = this.ModifyFeature[coverageName];
                    // 关闭其他的绘制项
                    for (const key in obj) {
                        obj[key].deactivate();
                    }
                    const nodeEl = this.allCoverage[coverageName].div;
                    const { className } = nodeEl;
                    if (falg) {
                        if (className.indexOf('superMapZindex') == -1) {
                            nodeEl.className = `${nodeEl.className} ` + 'superMapZindex';
                        }
                        this.clickState = false;
                        // 激活type 项
                        this.ModifyFeature[coverageName][type].activate();
                    } else if (className.indexOf('superMapZindex') != -1) {
                        nodeEl.className = nodeEl.className.replace('superMapZindex', '');
                    }
                    if (!falg) {
                        this.clickState = true;
                    }
                    resolve();
                } else {
                    reject();
                    throw console.error('The ModifyFeature Coverage is not defined');
                }
            } else {
                // reject();
                // throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 控制可编辑图层的开启和关闭
    activeACloseLinePolyg(coverageName, flag) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                if (this.ModifyFeature[coverageName]) {
                    if (flag) {
                        this.openLinePolygon(coverageName, 'modifyCtrl', true);
                    } else {
                        this.ModifyFeature[coverageName].modifyCtrl.deactivate();
                    }
                    // console.log(this.ModifyFeature[coverageName],this.map);
                    resolve();
                } else {
                    reject();
                    throw console.error('The ModifyFeature Coverage is not defined');
                }
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 删除constrol
    deleteConstrol(coverageName) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                const arr = this.map.controls;
                arr.forEach((ele, index) => {
                    if (
                        ele.name &&
                        ele.name.indexOf(coverageName) != -1 &&
                        (ele.id.indexOf('ModifyFeature') != -1 || ele.id.indexOf('DrawFeature') != -1)
                    ) {
                        // console.log(index);
                        this.map.controls[index] = '';
                    }
                });
                this.map.controls = arr.reduce((pre, ele) => {
                    if (ele) {
                        pre.push(ele);
                    }
                    return pre;
                }, []);
                if (this.ModifyFeature[coverageName]) {
                    delete this.ModifyFeature.coverageName;
                }
                resolve();
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 根据条件 获取指定的数据
    getSpecifiedData(coverageName, geometryId) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                let features = {};
                this.allCoverage[coverageName].features.forEach((e, i) => {
                    if (e.geometry && e.geometry.id === geometryId) {
                        features = e;
                    }
                });
                resolve(features);
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 根据条件删除某个指定的数据
    deleteSpecifiedData(coverageName, geometryId) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                let features = {};
                this.allCoverage[coverageName].features.forEach((e, i) => {
                    if (e.geometry && e.geometry.id === geometryId) {
                        features = e;
                        e.destroy();
                    }
                });
                resolve(features);
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 生成单个features
    createFeatures(dataObj) {
        const promise = new Promise((resolve, reject) => {
            console.log(dataObj);
            console.log(dataObj.type);
            if (dataObj.type) {
                const typeStr = dataObj.type.substring(dataObj.type.lastIndexOf('.') + 1);
                if (typeStr) {
                    resolve(this.createdGraph(typeStr, dataObj, ''));
                }
            } else {
                resolve('');
            }
        });
        return promise;
    }

    // 给指定vector图层 添加单个数据
    specifyVectorLayerAdd(coverageName, features) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                this.allCoverage[coverageName].addFeatures(features);
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // 设置单个vector样式
    setSingleStyle(that, st, editFlag = false) {
        const promise = new Promise((resolve, reject) => {
            if (that && that.geometry) {
                let { id } = that.geometry;
                if (editFlag === true) {
                    const elID = that.geometry.components[0].id;
                    const parentId = that.geometry.components[0].parent.id;
                    id = document.getElementById(elID) ?
                        elID :
                        document.getElementById(parentId) ?
                        parentId :
                        elID;
                }
                const el = document.getElementById(id);
                const style = {
                    ...st,
                };
                style.strokeColor = st.strokeColor ? st.strokeColor : '#87ceeb';
                style.fillColor = st.fillColor ? st.fillColor : '#87ceeb';
                style.fillOpacity = st.fillOpacity ? st.fillOpacity : 0;
                style.lineHeight = st.lineHeight ? st.lineHeight : 2;
                style.strokeWidth = st.strokeWidth || st.lineHeight;
                if (el.nodeName === 'path' || el.nodeName === 'polyline') {
                    el.setAttribute('fill', style.fillColor);
                    el.setAttribute('fill-opacity', style.fillOpacity);
                    el.setAttribute('stroke', style.strokeColor);
                    el.setAttribute('stroke-opacity', style.strokeOpacity || 1);
                    el.setAttribute('stroke-width', style.strokeWidth);
                    el.setAttribute('stroke-dasharray', style.strokeDashstyle === 'dash' ? '40,40' : 0);
                }
                that.style = style;
                // console.log(style, st);
                resolve();
            } else {
                reject('that or geometry is not definde');
            }
        });
        return promise;
    }

    // 设置单个点 point
    setPoint(coverageName, data) {
        const promise = new Promise((resolve, reject) => {
            if (this.allCoverage[coverageName]) {
                // 生成点对象 lon, lat
                const point = new SuperMap.Geometry.Point(
                    data.lon || data.longitude,
                    data.lat || data.latitude,
                );
                // 生成图形对象 在这里时可以设置style
                const vetor = new SuperMap.Feature.Vector(point);
                vetor.style = data.style;
                // 添加到layer中
                this.allCoverage[coverageName].addFeatures(vetor);
                resolve(vetor);
            } else {
                reject();
                throw console.error('The coverage is not defined');
            }
        });
        return promise;
    }

    // vector --------------------------------- end

    // 热力图

    // 初始化生成热力图图层
    initHeatMapLayer(coverageName) {
        const promise = new Promise((resolve, reject) => {
            const heatMapLayer = new SuperMap.Layer.HeatMapLayer(coverageName, {
                radius: 1,
                featureWeight: 'value',
                // featureRadius: 'geoRadius',
            });
            this.allCoverage[coverageName] = heatMapLayer;
            this.map.addLayer(heatMapLayer);
            if (heatMapLayer.div) {
                // 把热力图层级调低
                heatMapLayer.div.style.zIndex = '300';
            }
            // this.coverageAddEventlist();
            resolve();
        });
        return promise;
    }

    // 生成热力图上的热点
    createHeatPoints(coverageName, data, radius = 1) {
        const promise = new Promise((resolve, reject) => {
            this.allCoverage[coverageName].radius = radius;
            const heatPoints = data.reduce((pre, e) => {
                const poit = new SuperMap.Feature.Vector(
                    new SuperMap.Geometry.Point(e.longitude, e.latitude), {
                        value: e.value,
                        geoRadius: radius,
                    },
                );
                pre.push(poit);
                return pre;
            }, []);
            // 根据设置的点的数量，随机生成热力点
            this.allCoverage[coverageName].addFeatures(heatPoints);
            resolve();
        });
        return promise;
    }

    // 清除热力图数据
    clearHeatPoints(coverageName) {
        const promise = new Promise((resolve, reject) => {
            this.allCoverage[coverageName].removeAllFeatures();
            this.clearDeleteCoverage(coverageName);
            resolve();
        });
        return promise;
    }

    // popup  --------------------------------- stated
    // 打开弹窗
    mapPopup(data) {
        // mapInstance.mapPopup({longitude,latitude,id,class:this.$refs.dialog})
        const promise = new Promise((resolve, reject) => {
            if (data.longitude && data.latitude && data.class) {
                this.closeClearPopup();
                let nodeEle = '';
                if (typeof data.class === 'string') {
                    if (data.class.indexOf('.') || data.class.indexOf('#')) {
                        nodeEle = document.querySelector(data.class);
                    }
                } else if (data.class) {
                    nodeEle = data.class;
                } else {
                    console.error('classSelect is not defined');
                    reject();
                    return;
                }
                const popup = new SuperMap.Popup(
                    data.id,
                    new SuperMap.LonLat(data.longitude, data.latitude),
                    new SuperMap.Size(0, 0),
                    null,
                    false,
                );
                // console.log(popup);
                popup.isShowShadow = false; // 去除弹窗阴影
                this.map.addPopup(popup);
                if (document.getElementById(data.id)) {
                    // console.log(nodeEle);
                    document.getElementById(data.id).appendChild(nodeEle);
                    document.getElementById(data.id).style.zIndex = 9999;
                }
                this.popupInfowin[data.id] = popup;
                resolve(nodeEle);
            } else {
                reject();
                throw console.error('The longitude or latitude is not defined');
            }
        });
        return promise;
    }

    // 随机生成弹窗名

    // 关闭、清除弹窗
    closeClearPopup(id) {
            const promise = new Promise((resolve, reject) => {
                if (this.popupInfowin[id]) {
                    this.popupInfowin[id].hide();
                    this.popupInfowin[id].destroy();
                    this.map.removePopup(this.popupInfowin[id]);
                    delete this.popupInfowin[id];
                }
                resolve();
            });
            return promise;
        }
        // popup  --------------------------------- end

    // transform  ------------------------------ stated
    // 高德转天地图
    gdTrTdt(lng, lat) {
            return new Promise((resolve, reject) => {
                        const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'GD').split(',');
			const obj = {
				longitude: Number(data[0]),
				latitude: Number(data[1]),
			};
			resolve(obj);
		});
	}

	// 百度转天地图
	bdTrTdt(lng, lat) {
		return new Promise((resolve, reject) => {
			const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'BD').split(',');
			const obj = {
				longitude: Number(data[0]),
				latitude: Number(data[1]),
			};
			resolve(obj);
		});
	}

	// 天地图转百度
	tdtTrBd(lng, lat) {
		return new Promise((resolve, reject) => {
			const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'TTB').split(',');
			const obj = {
				longitude: Number(data[0]),
				latitude: Number(data[1]),
			};
			resolve(obj);
		});
	}

	// 天地图转高德
	tdtTrGd(lng, lat) {
		return new Promise((resolve, reject) => {
			const data = LonLatT.LonLatTransform(`${`${lng},${lat}`}`, 'TTG').split(',');
			const obj = {
				longitude: Number(data[0]),
				latitude: Number(data[1]),
			};
			resolve(obj);
		});
	}
	// transform  ------------------------------ end
}

export default handleMap;
