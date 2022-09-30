const locationInfo = window.location;
const agreementStr = locationInfo.protocol.replace(':', '');
const agreement = agreementStr === 'https' ? 'https' : 'http';

function getBaseMap(pmapContainer, MAP_TYPE, mapConfig, initVis) {
    const mapContainer = pmapContainer || 'superMap';
    let map;
    let mapType;
    let retData;
    const { tk } = mapConfig;
    switch (MAP_TYPE) {
        case 'SZ':
            retData = getTDT84Map(mapContainer, tk, initVis);
            // map = getTDTMap(mapContainer);
            // map = getSZMap(mapContainer);
            break;
        case 'SD_LC':
            retData = getSD_LCMap(mapContainer, initVis);
            break;
        case 'CL':
            map = getCLMap(mapContainer);
            break;
        case 'BD':
            map = getBDMap(mapContainer);
            break;
        case 'TDT84':
            retData = getTDT84Map(mapContainer, tk, initVis);
            break;
        case 'LZ':
            map = getLZMap(mapContainer);
            break;
        case 'GM':
            map = getGMMap(mapContainer);
            break;
        case 'GD':
            map = getGDMap(mapContainer);
            break;
        case 'OFFLINE':
            map = getOffLineMap(mapContainer);
            break;
        case 'SuZhou':
            map = getSuZhouMap(mapContainer);
            break;
        case 'ST':
            map = getGaoDeMap(mapContainer);
            break;
        case 'SC':
            retData = getTDT84Map(mapContainer, tk, initVis);
            break;
        case 'ShenShan':
            retData = getShenShanMap(mapContainer, tk);
            // map = getShenShanWMTSMap(mapContainer)
            break;
        case 'ZengCheng':
            retData = getTDT84Map(mapContainer, tk, initVis);
            break;
        case 'SJS':
            map = getSJSMap(mapContainer);
            break;
        case 'EGIS':
            retData = getEgisMap(mapContainer, initVis);
            break;
        case 'YZ':
            retData = getEgisMap(mapContainer, initVis);
            break;
        case 'TDT':
            map = getTDTMap(mapContainer, tk);
            break
        case 'JN':
            retData = getJNMap(mapContainer);
            break
        case 'NH':
            retData = getNanHaiMap(mapContainer, initVis);
            break
        case 'CC':
            retData = getCCMap(mapContainer, initVis);
            break
        default:
            retData = getTDT84Map(mapContainer, tk, initVis);
            break;
    }
    map = retData.map;
    mapType = retData.mapType;
    if (mapConfig && mapConfig.center) {
        map.setCenter(new SuperMap.LonLat(mapConfig.center.longitude, mapConfig.center.latitude), mapConfig.center.level);
    }
    // map 地图对象 mapType 地图类型
    return retData;
}

// function screenshot() {
//     SuperMap.Tile.CanvasImage.prototype.loadTileImage = function() {
//         const me = this;
//         const image = new Image();
//         image.setAttribute('crossOrigin', 'anonymous');
//         image.firstInView = true;
//         me.lastImage = image;
//         const context = {
//             image,
//             tile: me,
//             viewRequestID: me.layer.map.viewRequestID,
//             newImgTag: me.newImgTag,
//         };
//         const onLoadFunctionProxy = function() {
//             if (this.tile.newImgTag === this.newImgTag) {
//                 this.tile.onLoadFunction(this);
//             }
//         };
//         const onErrorFunctionProxy = function() {
//             this.tile.onErrorFunction(this);
//         };
//         image.onload = SuperMap.Function.bind(onLoadFunctionProxy, context);
//         image.onerror = SuperMap.Function.bind(onErrorFunctionProxy, context);
//         const request = new XMLHttpRequest();
//         request.responseType = 'blob';
//         request.open('get', me.url, true);
//         request.onreadystatechange = function(e) {
//             if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
//                 image.src = URL.createObjectURL(request.response);
//             }
//         };
//         request.send(null);
//     };
// }

function getOffLineMap(mapContainer) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:3857',
        maxZoom: 16,
        minZoom: 9,
    });
    const wmsLayer = new SuperMap.Layer.Tianditu();
    wmsLayer.url = `${OFFLINE_MAP_HOST}/satellite/\${z}/\${x}/\${y}.jpg`;
    wmsLayer.isLabel = false;
    wmsLayer.layerType = 'img';
    const zjLayer = new SuperMap.Layer.Tianditu();
    zjLayer.url = `${OFFLINE_MAP_HOST}/overlay/\${z}/\${x}/\${y}.png`,
        zjLayer.isLabel = true;
    zjLayer.layerType = 'img';
    // zjLayer.layerType = "eia"; //英文注记
    zjLayer.isBaseLayer = false;
    map.addLayer(wmsLayer);
    map.addLayer(zjLayer);

    // var baseLayers = [];
    // var imgLayer = {name:"影像",baseLayer:wmsLayer,otherLayers:[zjLayer]};
    // baseLayers.push(imgLayer);

    // var wmsVecLayer = new SuperMap.Layer.Tianditu();
    // wmsVecLayer.url = "https://t${num}.tianditu.gov.cn/DataServer?T=${type}_${proj}&x=${x}&y=${y}&l=${z}&tk=815233bc58d602a04377c6a2d30a3a51";
    // wmsVecLayer.isLabel = false;
    // wmsVecLayer.layerType = "vec";
    // wmsVecLayer.setVisibility(false);
    // var zjVecLayer = new SuperMap.Layer.Tianditu();
    // zjVecLayer.url = "https://t${num}.tianditu.gov.cn/DataServer?T=${type}_${proj}&x=${x}&y=${y}&l=${z}&tk=815233bc58d602a04377c6a2d30a3a51",
    //     zjVecLayer.isLabel = true;
    // zjVecLayer.layerType = "vec";
    // // zjVecLayer.layerType = "eva"; // 英文注记
    // zjVecLayer.isBaseLayer = false;
    // zjVecLayer.setVisibility(false);
    // map.addLayer(wmsVecLayer);
    // map.addLayer(zjVecLayer);
    // var vecLayer = {name:"矢量",baseLayer:wmsVecLayer,otherLayers:[zjVecLayer]};
    // baseLayers.push(vecLayer);

    // map.baseLayers = baseLayers;
    map.setCenter(new SuperMap.LonLat(12695937, 2578224), 12); // 定义中心点
    return map;
}

function getTDTMap(mapContainer, tk) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:3857',
    });
    const wmsLayer = new SuperMap.Layer.Tianditu();
    wmsLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    console.log(wmsLayer.url);
    wmsLayer.isLabel = false;
    wmsLayer.layerType = 'img';
    const zjLayer = new SuperMap.Layer.Tianditu();
    zjLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    zjLayer.isLabel = true;
    zjLayer.layerType = 'img';
    // zjLayer.layerType = "eia"; //英文注记
    zjLayer.isBaseLayer = false;
    map.addLayer(wmsLayer);
    map.addLayer(zjLayer);

    const baseLayers = [];
    const imgLayer = { name: '影像', baseLayer: wmsLayer, otherLayers: [zjLayer] };
    baseLayers.push(imgLayer);

    const wmsVecLayer = new SuperMap.Layer.Tianditu();
    wmsVecLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    wmsVecLayer.isLabel = false;
    wmsVecLayer.layerType = 'vec';
    wmsVecLayer.setVisibility(false);
    const zjVecLayer = new SuperMap.Layer.Tianditu();
    zjVecLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    zjVecLayer.isLabel = true;
    zjVecLayer.layerType = 'vec';
    // zjVecLayer.layerType = "eva"; // 英文注记
    zjVecLayer.isBaseLayer = false;
    zjVecLayer.setVisibility(false);
    map.addLayer(wmsVecLayer);
    map.addLayer(zjVecLayer);
    const vecLayer = { name: '矢量', baseLayer: wmsVecLayer, otherLayers: [zjVecLayer] };
    baseLayers.push(vecLayer);
    map.baseLayers = baseLayers;
    map.setCenter(new SuperMap.LonLat(12695937, 2578224), 12); // 定义中心点
    return map;
}

function getTDT84Map(mapContainer, tk, initVis) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            // new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        minZoom: 3,
        maxZoom: 17,
    });
    // screenshot();
    const wmsLayer = new SuperMap.Layer.Tianditu();
    wmsLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    wmsLayer.isLabel = false;
    wmsLayer.layerType = 'img';
    const zjLayer = new SuperMap.Layer.Tianditu();
    zjLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    zjLayer.isLabel = true;
    zjLayer.layerType = 'img';
    // zjLayer.layerType = "eia"; //英文注记
    zjLayer.isBaseLayer = false;
    const baseLayers = [];

    const wmsVecLayer = new SuperMap.Layer.Tianditu();
    wmsVecLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    wmsVecLayer.isLabel = false;
    wmsVecLayer.layerType = 'vec';
    const zjVecLayer = new SuperMap.Layer.Tianditu();
    zjVecLayer.url = `${agreement}://t\${num}.tianditu.gov.cn/DataServer?T=\${type}_\${proj}&x=\${x}&y=\${y}&l=\${z}&tk=${tk}`;
    zjVecLayer.isLabel = true;
    zjVecLayer.layerType = 'vec';
    // zjVecLayer.layerType = "eva"; //英文注记
    zjVecLayer.isBaseLayer = false;
    if (initVis === '矢量') {
        wmsLayer.setVisibility(false);
        zjLayer.setVisibility(false);
        map.addLayer(wmsVecLayer);
        map.addLayer(zjVecLayer);
        map.addLayer(wmsLayer);
        map.addLayer(zjLayer);
    } else {
        wmsVecLayer.setVisibility(false);
        zjVecLayer.setVisibility(false);
        map.addLayer(wmsLayer);
        map.addLayer(zjLayer);
        map.addLayer(wmsVecLayer);
        map.addLayer(zjVecLayer);
    }
    const vecLayer = { name: '矢量', baseLayer: wmsVecLayer, otherLayers: [zjVecLayer] };
    baseLayers.push(vecLayer);
    const imgLayer = { name: '影像', baseLayer: wmsLayer, otherLayers: [zjLayer] };
    baseLayers.push(imgLayer);
    map.baseLayers = baseLayers;
    // map.setCenter(new SuperMap.LonLat(119.50598, 25.96342),12);//长乐中心点
    // map.setCenter(new SuperMap.LonLat(113.88256,22.68067),12);//光明新区中心点
    // map.setCenter(new SuperMap.LonLat(113.25568, 23.13012), 10); // 省应急中心点
    const mapType = {
        type: 'TDT',
        projection: 'EPSG:4326',
    };
    // map.baseLayer.zoomDuration = 1500;
    // map.baseLayer.bufferImgCount = 100000;
    return { map, mapType };
}

function getSZMap(mapContainer) {
    // var maxExtent = new SuperMap.Bounds(-406309.9413999999,-224367.33579999954,522437.19849999994,367956.1770000009);
    const maxExtent = new SuperMap.Bounds(84133.43767273339, 3572.235341082269, 173239.66431572003, 55231.01529319327);
    // 创建dispatchMap对象和动态图层
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:2435',
        maxExtent,
    });
    const resolutions = [152.70291900634768, 76.35145950317384, 38.17572975158692, 19.08786487579346, 9.54393243789673, 4.771966218948365, 2.3859531094741826, 1.1929915547370913, 0.5964957773685456, 0.2982478886842728, 0.1491239443421364]; // 分辨率
    // var wmsLayer = new SuperMap.Layer.WMTS({
    //     name: "basemap_szmap_basemap_201803_01",
    //     url: "http://192.168.37.152:82/arcgis/rest/services/basemap/szmap_basemap_201803_01/MapServer/WMTS",
    //     layer: "basemap_szmap_basemap_201803_01",
    //     style: "default",
    //     matrixSet: "default028mm",
    //     format: "image/jpgpng",
    //     resolutions:resolutions,
    //     opacity: 1,
    //     tileFullExtent:maxExtent,     //瓦片设置的最大范围
    //     tileOrigin:new SuperMap.LonLat(-5123300.0,10002300),   //瓦片矩阵左上角
    //     requestEncoding:"KVP"
    //
    // });
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'image_AVI_image_201612_01',
        url: 'http://192.168.37.152:83/arcgis/rest/services/image/AVI_image_201612_01/MapServer/WMTS',
        layer: 'image_AVI_image_201612_01',
        style: 'default',
        matrixSet: 'default028mm',
        format: 'image/jpgpng',
        resolutions,
        opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-5123300.0, 10002300), // 瓦片矩阵左上角
        requestEncoding: 'KVP',

    });
    const zjmaxExtent = new SuperMap.Bounds(4846.055599999614, -25954.669800000265, 506785.3421, 338933.3730999995);
    const zjLayer = new SuperMap.Layer.WMTS({
        name: 'basemap_sznno_basemap_201803_01',
        url: 'http://192.168.37.152:82/arcgis/rest/services/basemap/szanno_basemap_201803_01/MapServer/WMTS',
        layer: 'basemap_sznno_basemap_201803_01',
        style: 'default',
        matrixSet: 'default028mm',
        format: 'image/jpgpng',
        resolutions,
        opacity: 1,
        tileFullExtent: zjmaxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-5123300.0, 10002300), // 瓦片矩阵左上角
        requestEncoding: 'KVP',

    });
    zjLayer.isBaseLayer = false;
    map.addLayer(wmsLayer);
    map.addLayer(zjLayer);
    map.setCenter(new SuperMap.LonLat(130000, 26860), 2);

    return map;
}

function getCLMap(mapContainer) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4326',
        maxZoom: 20,
        minZoom: 9,
        numZoomLevels: 21,
    });
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'a',
        url: 'http://10.131.1.51:9081/PGIS_S_TileMapServerTDT/Maps/zj',
        layer: 'a',
        style: 'default',
        matrixSet: 'a',
        format: 'tiles',
        opacity: 1,
        requestEncoding: 'KVP',
    });
    map.addLayer(wmsLayer);
    map.setCenter(new SuperMap.LonLat(119.50598, 25.96342), 12);
    return map;
}

function getLZMap(mapContainer) {
    const maxExtent = new SuperMap.Bounds(103.53983427857908, 36.422764642136869, 103.7819826226619, 36.676730205179751);
    const resolutions = [0.0013732910156250004, 0.00068664550781250022, 0.00034332275390625011, 0.00017166137695312505, /* 0.000085830688476562527, */ 0.000042915344238281264, 0.000021457672119140632, 0.000010728836059570316, 0.0000053644180297851579, 0.000002682209014892579];

    const maxExtent2 = new SuperMap.Bounds(103.43903419600008, 36.205666016000066, 103.96647798300006, 36.878500668000072);
    const resolutions2 = [0.0013732910156250004, 0.00068664550781250022, 0.00034332275390625011, 0.00017166137695312505, /* 0.000085830688476562527, */ 0.000042915344238281264, 0.000021457672119140632, 0.000010728836059570316, 0.0000053644180297851579, 0.000002682209014892579];

    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4326',
        maxExtent: maxExtent2,
    });

    const wmsLayer = new SuperMap.Layer.WMTS({
        name: '20190312_ioc:20190312',
        // url: "http://59.219.104.66:5071/gisserver/wmtsService/gwc/service/wmts/20190312:20190312/wmts",
        url: 'http://10.123.192.32:1080/gisserver/wmtsService/gwc/service/wmts-hp',
        layer: '20190312_ioc:20190312',
        style: 'default',
        matrixSet: 'EPSG:4490',
        format: 'PNG',
        opacity: 1,
        resolutions,
        tileFullExtent: maxExtent,
        maxExtent,
        tileOrigin: new SuperMap.LonLat(-400, 399.99999999999977), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
        params: {
            'X-HW-ID': 'skxx.lzxq',
            'X-HW-APPKEY': 'i0XXRZUxAA7/Txv3dOEp/w==',
        },
    });
    wmsLayer.isBaseLayer = false;
    wmsLayer.getURL = function(bounds) {
        bounds = this.adjustBounds(bounds);
        let url = '';
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {
            const center = bounds.getCenterLonLat();
            const info = this.getTileInfo(center);
            const matrixId = this.matrix.identifier;

            if (this.requestEncoding.toUpperCase() === 'REST') {
                // include 'version', 'layer' and 'style' in tile resource url
                // 注掉关于version的信息var path = this.version + "/" + this.layer + "/" + this.style + "/";
                let path = `${this.layer}/${this.style}/`;

                // append optional dimension path elements
                if (this.dimensions) {
                    for (let i = 0; i < this.dimensions.length; i++) {
                        if (this.params[this.dimensions[i]]) {
                            path = `${path + this.params[this.dimensions[i]]}/`;
                        }
                    }
                }

                // append other required path elements
                path = `${path + this.matrixSet}/${this.matrix.identifier
        }/${info.row}/${info.col}.${this.formatSuffix}`;

                if (SuperMap.Util.isArray(this.url)) {
                    url = this.selectUrl(path, this.url);
                } else {
                    url = this.url;
                }
                if (!url.match(/\/$/)) {
                    url += '/';
                }
                url += path;
            } else if (this.requestEncoding.toUpperCase() === 'KVP') {
                // assemble all required parameters
                const params = {
                    SERVICE: 'WMTS',
                    REQUEST: 'GetTile',
                    VERSION: this.version,
                    LAYER: this.layer,
                    STYLE: this.style,
                    TILEMATRIXSET: this.matrixSet,
                    TILEMATRIX: this.matrix.identifier > 3 ? (this.matrix.identifier + 1) : this.matrix.identifier,
                    TILEROW: info.row,
                    TILECOL: info.col,
                    FORMAT: this.format,
                };
                if (SuperMap.Credential.CREDENTIAL) {
                    params[SuperMap.Credential.CREDENTIAL.name] = SuperMap.Credential.CREDENTIAL.getValue();
                }
                url = SuperMap.CanvasLayer.prototype.getFullRequestString.apply(this, [params]);
            }
        }
        if (this.tileProxy) {
            url = this.tileProxy + encodeURIComponent(url);
        } else if (this.proxy) {
            url = this.proxy + encodeURIComponent(url);
        }
        return url;
    };

    const wpLayer = new SuperMap.Layer.WMTS({
        name: 'lz_weipian_service:lz_weipian',
        // url: "http://59.219.104.66:5071/gisserver/wmtsService/gwc/service/wmts/lz_weipian_service:lz_weipian/wmts",
        url: 'http://10.123.192.32:1080/gisserver/wmtsService/gwc/service/wmts-wp',
        layer: 'lz_weipian_service:lz_weipian',
        style: 'default',
        matrixSet: 'EPSG:4490',
        format: 'PNG',
        opacity: 1,
        resolutions: resolutions2,
        tileFullExtent: maxExtent2,
        tileOrigin: new SuperMap.LonLat(-180, 90), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
        params: {
            'X-HW-ID': 'skxx.lzxq',
            'X-HW-APPKEY': 'i0XXRZUxAA7/Txv3dOEp/w==',
        },
    });
    map.addLayer(wpLayer);
    map.addLayer(wmsLayer);

    map.setCenter(new SuperMap.LonLat(103.67164, 36.47404), 6);
    return map;
}

function getGMMap(mapContainer) {
    const maxExtent = new SuperMap.Bounds(12674176.818028068, 2594199.4861729294, 12691029.954997186, 2612177.6988590127);
    const baoanmaxExtent = new SuperMap.Bounds(12654914.40289378, 2561902.9756192695, 12702917.219091805, 2614575.1668371);
    const resolutions = [156543.033928, 78271.5169639999, 39135.7584820001, 19567.8792409999, 9783.93962049996, 4891.96981024998, 2445.98490512499, 1222.99245256249, 611.49622628138, 305.748113140558, 152.874056570411, 76.4370282850732, 38.2185141425366, 19.1092570712683, 9.55462853563415, 4.77731426794937, 2.38865713397468, 1.19432856685505, 0.597164283559817, 0.298582141647617];
    const maxExtent_0918 = new SuperMap.Bounds(12674160.42112793, 2594431.237580901, 12690865.224364536, 2612177.8477446837);
    const resolutions_0918 = [559082264.0285016, 279541132.01425034, 139770566.00712562, 69885283.00356235, 34942641.50178117, 17471320.750890587, 8735660.375445293, 4367830.187722647, 2183915.0938617955, 1091957.5469304253, 545978.7734656851, 272989.38673237007, 136494.69336618503, 68247.34668309252, 34123.67334154626, 17061.836671245605, 8530.918335622802, 4265.459167338929, 2132.729584141936, 1066.3647915984968];
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:3857',
        minZoom: 12,
        numZoomLevels: 20,
    });
    const wmsLayer = new SuperMap.Layer.WMTS({
        // name: "GuangMing",
        // url: "http://10.143.4.53:81/services/8c74e80a-4de3-469b-adee-bc5109d9434a/Jdw6k-7qhcyXzw4vbLwn1T7FkbwFvoP-CogJUJaULUVL2FGV8vEaWgVo400vWIei93e0tYm8bw0MUjBnZ0l1IJWEQqC5dUC9",
        // layer: "GuangMing",
        // style: "default",
        // matrixSet: "default028mm",
        // format: "image/jpgpng",
        // opacity: 1,
        // resolutions:resolutions,
        // tileFullExtent:maxExtent,
        // tileOrigin:new SuperMap.LonLat(-20037508.3427877,20037508.342787),//瓦片矩阵左上角
        // requestEncoding:"KVP"

        // name: "baoan",
        // url: "http://10.143.4.53:81/services/101711f6-9b00-4888-8a59-85d71777e129/Jdw6k-7qhcyXzw4vbLwn1UUKCut68o36niwoZhfZVa7XQ2YgAHBg9FWWyE-_8Ha1v7bZgi1K1jrIam1vpsjMV6GP0GYqHcq7",
        // layer: "baoan",
        // style: "default",
        // matrixSet: "default028mm",
        // format: "image/jpgpng",
        // opacity: 1,
        // resolutions:resolutions,
        // tileFullExtent:baoanmaxExtent,
        // tileOrigin:new SuperMap.LonLat(-20037508.3427877,20037508.342787),//瓦片矩阵左上角
        // requestEncoding:"KVP"

        name: 'gm2019_yxt',
        url: 'http://10.143.4.53:81/services/43b21d3a-1d57-448c-aa4f-a33d10812c6e/Jdw6k-7qhcyXzw4vbLwn1diE0Nn42fAJ4_7ItZRhzfdQO0ACk2tdlvwCo763Df_G-Vuj7poeTAW2Hjw0v2Im_DWzYHEJQZ3A',
        layer: 'gm2019_yxt',
        style: 'default',
        matrixSet: 'default028mm',
        format: 'image/jpgpng',
        opacity: 1,
        // resolutions:resolutions_0918,
        // tileFullExtent:maxExtent_0918,
        tileOrigin: new SuperMap.LonLat(-20037508.34278925, 20037508.34278925), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
    });
    map.addLayer(wmsLayer);

    vector_style_select = new SuperMap.Style({
        fillColor: '#000',
        fillOpacity: 0.9,
        fontColor: '#232323',
        strokeColor: '#ffffff',
    });
    vector_style = new SuperMap.Style({ // 道路
        fillColor: '#009900',
        fillOpacity: 0.8,
        pointRadius: 8,
        strokeColor: '#009900',
        strokeWidth: 3,
    });
    vector_build = new SuperMap.Style({ // 建筑
        fillColor: '#26c6da',
        fillOpacity: 0.5,
        pointRadius: 8,
        strokeColor: '#26c6da',
        strokeWidth: 3,
    });
    vector_style1 = new SuperMap.Style({ // 边界、街道
        fillColor: '#8e9df3',
        fillOpacity: 0,
        pointRadius: 8,
        strokeColor: '#8e9df3',
        strokeWidth: 3,
    });
    vector_style2 = new SuperMap.Style({ // 社区
        fillColor: '#8e9df3',
        fillOpacity: 0,
        pointRadius: 8,
        strokeColor: '#FEF200',
        strokeWidth: 3,
    });
    // var maxResolution=[
    // {featureType:'省道_04_F1234_RH',Resolution:resolutions[12]},
    // {featureType:'省道_04_F5_RH',Resolution:resolutions[12]},
    // {featureType:'省道_125N_F5',Resolution:resolutions[12]},
    // {featureType:'高速路_T2',Resolution:resolutions[14]},
    // {featureType:'高速路_T1_04_RH',Resolution:resolutions[14]},
    // {featureType:'其他道路',Resolution:resolutions[17]},
    // {featureType:'县道_04_F5_RH',Resolution:resolutions[17]},
    // {featureType:'县道_04_F1234_RH',Resolution:resolutions[17]},
    // {featureType:'县道_125N_F5',Resolution:resolutions[17]},
    // {featureType:'县道_125N_F1234',Resolution:resolutions[17]},
    // {featureType:'乡镇村道_04_F5',Resolution:resolutions[17]},
    // {featureType:'乡镇村道_04_F1234_RH',Resolution:resolutions[17]},
    // {featureType:'乡镇村道_125N',Resolution:resolutions[17]}
    // ];

    // 重写wfs服务的调用方法，
    // console.log(SuperMap.Protocol.WFS.v1.prototype);
    SuperMap.Protocol.WFS.v1.prototype.read = function(options) {
        SuperMap.Protocol.prototype.read.apply(this, arguments);
        options = SuperMap.Util.extend({}, options);
        SuperMap.Util.applyDefaults(options, this.options || {});
        const response = new SuperMap.Protocol.Response({ requestType: 'read' });

        const data = SuperMap.Format.XML.prototype.write.apply(
            this.format, [this.format.writeNode('wfs:GetFeature', options)],
        );
        if (SuperMap.Credential.CREDENTIAL) {
            options.url += options.url.indexOf('?') > -1 ? '&' : '?';
            options.url += SuperMap.Credential.CREDENTIAL.getUrlParameters();
        }
        response.priv = SuperMap.Request.POST({
            url: options.url,
            callback: this.createCallback(this.handleRead, response, options),
            params: options.params,
            headers: options.headers,
            data,
            withCredentials: true,
        });

        return response;
    };

    const maxResolution = [
        { featureType: 'dlzxx1000', Resolution: resolutions[15] }, { featureType: 'dlzxx10000', Resolution: resolutions[14] }, { featureType: 'dlzxx50000', Resolution: resolutions[13] }, { featureType: 'dlzxx250000', Resolution: resolutions[12] },
    ];

    vectorLayers = [];
    for (const i in maxResolution) {
        let vectorLayer = {};
        vectorLayer = new SuperMap.Layer.Vector('road', {
            maxResolution: maxResolution[i].Resolution,
            strategies: [new SuperMap.Strategy.BBOX()],
            protocol: new SuperMap.Protocol.WFS({
                version: '1.1.0',
                url: `${SINVIE_HOST}/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/29a84646-0c81-4fcd-9139-790d4e3a0263/Jdw6k-7qhcyXzw4vbLwn1a1VeMCXZc9Yh8oCslMP6VY8KMRItuk_LjTgoExb-2Yq_GCfVK1Nk041vRupsEktkUYbxbIyBYWE`,
                srsName: 'urn:ogc:def:crs:EPSG:6.9:4326',
                featureType: maxResolution[i].featureType,
                featureNS: `${SINVIE_HOST}/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/29a84646-0c81-4fcd-9139-790d4e3a0263/Jdw6k-7qhcyXzw4vbLwn1a1VeMCXZc9Yh8oCslMP6VY8KMRItuk_LjTgoExb-2Yq_GCfVK1Nk041vRupsEktkUYbxbIyBYWE`,
                featurePrefix: 'dlzxx',
            }),
            projection: new SuperMap.Projection('EPSG:4326'),
            styleMap: new SuperMap.StyleMap({
                default: vector_style,
            }),
        });
        vectorLayer.setVisibility(false);
        vectorLayers.push(vectorLayer);
        vectorLayer.isBaseLayer = false;
        map.addLayer(vectorLayer);
    }

    // 光明边界
    vectorLayer2 = new SuperMap.Layer.Vector('side', {
        strategies: [new SuperMap.Strategy.BBOX()],
        protocol: new SuperMap.Protocol.WFS({
            version: '1.0.0',
            url: `${SINVIE_HOST}/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/2df92c98-188e-4c89-8bc5-5d01ca835b5a/Jdw6k-7qhcyXzw4vbLwn1RnlpvCIc-LWLGFMGMN76lPPRyctpRSz8xrFIJ4dbCTAwhJIwQWpN5LtBy-XCsaTAzP1ZBCCfOtB`,
            srsName: 'EPSG:0',
            featureType: '光明边界_1',
            featureNS: 'http://www.supermap.com/xingzhengquhua',
            featurePrefix: 'xingzzhengquhua',

        }),
        projection: new SuperMap.Projection('EPSG:4326'),
        styleMap: new SuperMap.StyleMap({
            default: vector_style1,
        }),
    });
    vectorLayer2.isBaseLayer = false;
    map.addLayer(vectorLayer2);

    // 深圳区划
    /* vectorLayer3 = new SuperMap.Layer.Vector("area", {
          strategies: [new SuperMap.Strategy.BBOX()],
          protocol: new SuperMap.Protocol.WFS({
              version: "1.0.0",
              url: SINVIE_HOST + "/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/ca726f8a-8725-440b-b557-8bb599fdc718/Jdw6k-7qhcyXzw4vbLwn1XmkzILVBnViDikpo2ffdB8ZUjN1hk2SPqrRFBnTXiqPGIKDfmFs6qoZLFn-UcM0urefWpKb_B0R",
              // url: "http://192.168.180.217:8090/iserver/services/map-DaoLuWangZhuanTiTu/wfs100/utf-8",
              srsName:"EPSG:4326",
              featureType: "shequ_1",
              featureNS: "http://www.supermap.com/shenzhenshequ",
              featurePrefix: "shenzzhenshequ",

          }),
          projection: new SuperMap.Projection("EPSG:4326"),
          styleMap: new SuperMap.StyleMap({
              'default': vector_style1
          })
      });
      vectorLayer3.isBaseLayer=false;
      map.addLayer(vectorLayer3); */

    // 光明街道
    vectorLayer4 = new SuperMap.Layer.Vector('jiedao', {
        maxResolution: resolutions[13],
        minResolution: resolutions[14],
        strategies: [new SuperMap.Strategy.Fixed()],
        protocol: new SuperMap.Protocol.WFS({
            version: '1.0.0',
            url: `${SINVIE_HOST}/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/7401d84b-457a-4280-a6e6-746c64055c6f/Jdw6k-7qhcyXzw4vbLwn1cqLzxzIbrsE-vMu3YDNvPrNs6Ivvqs5JJ2kcnBeVFmPdkEGfrTGN_ihDe8q9FJoK4pN3dRwreGD`,
            srsName: 'EPSG:4326',
            featureType: '街道_1',
            featureNS: 'http://www.supermap.com/shequjiedao',
            featurePrefix: 'shequjiedao',

        }),
        projection: new SuperMap.Projection('EPSG:4326'),
        styleMap: new SuperMap.StyleMap({
            default: vector_style1,
        }),
    });
    vectorLayer4.isBaseLayer = false;
    map.addLayer(vectorLayer4);

    const strategy_jiedao = new SuperMap.Strategy.GeoText();
    jiedaoNameLayer = new SuperMap.Layer.Vector('Label', {
        strategies: [strategy_jiedao],
        maxResolution: resolutions[13],
        minResolution: resolutions[14],
    });
    strategy_jiedao.style = { // 街道名称颜色
        fontColor: '#FFFFFF',
        fontWeight: 'bolder',
        fontSize: '14px',
        fill: true,
        fillColor: '#D78E6E',
        fillOpacity: 1,
        stroke: true,
        strokeColor: '#8B7B8B',
    };
    // 街道标注
    vectorLayer4.events.on({
        featuresadded(e) {
            let add = true;
            const { features } = e.object;
            const geotextFeatures_jiedao = [];
            if (features.length > 0) {
                for (const i in features) {
                    const f = features[i];
                    if (f.geometry !== null && f.data !== null) {
                        for (const j in jiedaoNameLayer.features) {
                            if (jiedaoNameLayer.features[j].geometry.text == f.data.JDNAME) {
                                add = false;
                                break;
                            } else {
                                add = true;
                            }
                        }
                        if (add) {
                            const bound = f.geometry.bounds;
                            const bounds = new SuperMap.Bounds(bound.left, bound.bottom, bound.right, bound.top);
                            const lonlat = bounds.getCenterLonLat();
                            const geoText = new SuperMap.Geometry.GeoText(lonlat.lon, lonlat.lat, f.data.JDNAME);
                            const geotextFeature = new SuperMap.Feature.Vector(geoText);
                            geotextFeatures_jiedao.push(geotextFeature);
                        }
                    }
                }
                jiedaoNameLayer.addFeatures(geotextFeatures_jiedao);
                jiedaoNameLayer.isBaseLayer = false;
            }
        },
    });
    map.addLayer(jiedaoNameLayer);

    // 光明社区
    vectorLayer5 = new SuperMap.Layer.Vector('shequ', {
        maxResolution: resolutions[15],
        // strategies: strategies: [new SuperMap.Strategy.BBOX()],//需移动地图出现名称
        strategies: [new SuperMap.Strategy.Fixed()],
        protocol: new SuperMap.Protocol.WFS({
            version: '1.0.0',
            url: `${SINVIE_HOST}/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/7401d84b-457a-4280-a6e6-746c64055c6f/Jdw6k-7qhcyXzw4vbLwn1cqLzxzIbrsE-vMu3YDNvPrNs6Ivvqs5JJ2kcnBeVFmPdkEGfrTGN_ihDe8q9FJoK4pN3dRwreGD`,
            srsName: 'EPSG:4326',
            featureType: '社区_1',
            featureNS: 'http://www.supermap.com/shequjiedao',
            featurePrefix: 'shequjiedao',

        }),
        projection: new SuperMap.Projection('EPSG:4326'),
        styleMap: new SuperMap.StyleMap({
            default: vector_style2,
        }),
    });
    vectorLayer5.isBaseLayer = false;
    map.addLayer(vectorLayer5);

    const strategy_shequ = new SuperMap.Strategy.GeoText();
    shequNameLayer = new SuperMap.Layer.Vector('Label', { strategies: [strategy_shequ], maxResolution: resolutions[15] });
    strategy_shequ.style = { // 社区名称颜色
        fontColor: '#FFFFFF',
        fontWeight: 'bolder',
        fontSize: '14px',
        fill: true,
        fillColor: '#D78E6E',
        fillOpacity: 1,
        stroke: true,
        strokeColor: '#8B7B8B',
    };

    // 社区标注
    vectorLayer5.events.on({
        featuresadded(e) {
            let add = true;
            const { features } = e.object;
            const geotextFeatures_shequ = [];
            if (features.length > 0) {
                for (const i in features) {
                    const f = features[i];
                    if (f.geometry !== null && f.data !== null) {
                        for (const j in shequNameLayer.features) {
                            if (shequNameLayer.features[j].geometry.text == f.data.SQNAME) {
                                add = false;
                                break;
                            } else {
                                add = true;
                            }
                        }
                        if (add) {
                            // var bound=f.geometry.bounds;
                            // var bounds = new SuperMap.Bounds(bound.left,bound.bottom,bound.right,bound.top);
                            const bound = f.data;
                            const bounds = new SuperMap.Bounds(bound.SMSDRIW, bound.SMSDRIS, bound.SMSDRIE, bound.SMSDRIN);
                            const lonlat = bounds.getCenterLonLat();
                            const areaLonLat = new SuperMap.LonLat(lonlat.lon, lonlat.lat);
                            areaLonLat.transform('EPSG:4326', dispatchMap.projection);
                            // var geoText = new SuperMap.Geometry.GeoText(lonlat.lon, lonlat.lat,f.data.SQNAME);
                            const geoText = new SuperMap.Geometry.GeoText(areaLonLat.lon, areaLonLat.lat, f.data.SQNAME);
                            const geotextFeature = new SuperMap.Feature.Vector(geoText);
                            geotextFeatures_shequ.push(geotextFeature);
                        }
                    }
                }
                shequNameLayer.addFeatures(geotextFeatures_shequ);
                shequNameLayer.isBaseLayer = false;
            }
        },
    });
    map.addLayer(shequNameLayer);

    // 建筑
    vectorLayer_building = new SuperMap.Layer.Vector('building', {
        maxResolution: resolutions[16],
        strategies: [new SuperMap.Strategy.BBOX()], // 需移动地图出现名称
        // strategies: [new SuperMap.Strategy.Fixed()],
        protocol: new SuperMap.Protocol.WFS({
            version: '1.0.0',
            url: `${SINVIE_HOST}/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/db4dc058-f9b6-4e7e-b7b6-c5d7b77d94c3/Jdw6k-7qhcyXzw4vbLwn1dx6-hOqiVFAvUkmJVYido78RyqNWkzAk9exHbtGojRxkvUtLom9_0AYeQwDj3dsMjguWkmThcEu`,
            srsName: 'EPSG:4326',
            featureType: '建筑物_1',
            featureNS: 'http://www.supermap.com/jianzhu',
            featurePrefix: 'jianzzhu',

        }),
        projection: new SuperMap.Projection('EPSG:4326'),
        styleMap: new SuperMap.StyleMap({
            default: vector_build,
        }),
    });
    vectorLayer_building.setVisibility(false);
    vectorLayer_building.isBaseLayer = false;
    map.addLayer(vectorLayer_building);

    const DiMing_style = new SuperMap.Style({
        fillColor: '#FF0000',
        fillOpacity: 0.8,
        pointRadius: 0,
        strokeColor: '#FF0000',
        strokeWidth: 0,
    });
    /* var vectorLayer = new SuperMap.Layer.Vector("diming", {
        strategies: [new SuperMap.Strategy.Fixed()],
        maxResolution:resolutions[15],
        protocol: new SuperMap.Protocol.WFS({
            version: "1.0.0",
            url: SINVIE_HOST + "/proxy/common/wfs?targetUrl=http://10.143.4.53:81/services/148330d2-7b84-488f-bc36-acb7b737b934/Jdw6k-7qhcyXzw4vbLwn1YUQV6Igo8hSYT8QdBnhSeWvxzT_5upjwNhT_oc_rEaniypRKfJ9FWuV-YmWaapBef0ijNyf6_dn",
            srsName:"EPSG:4326",
            featureType: "dimingdizzhi_Intersect",
            featureNS: "http://www.supermap.com/shenzhen",
            featurePrefix: "shenzzhen",
            //maxFeatures: "200",
            //geometryName: "the_geom"

        }),
		filter: new SuperMap.Filter.Logical({
           type: SuperMap.Filter.Logical.AND,
           filters: [
               new SuperMap.Filter.Comparison({
                   type: SuperMap.Filter.Comparison.NOT_EQUAL_TO,
                   property: "TYPECODE",
                   value: "190401"
               }),
			   new SuperMap.Filter.Comparison({
                   type: SuperMap.Filter.Comparison.NOT_EQUAL_TO,
                   property: "TYPECODE",
                   value: "190402"
               }),
			   new SuperMap.Filter.Comparison({
                   type: SuperMap.Filter.Comparison.NOT_EQUAL_TO,
                   property: "TYPECODE",
                   value: "190403"
               }),
               // new SuperMap.Filter.Comparison({
                   // type: SuperMap.Filter.Comparison.NOT_EQUAL_TO,
                   // property: "TYPECODE",
                   // value: "190301"
               // }),
               new SuperMap.Filter.Comparison({
                   type: SuperMap.Filter.Comparison.NOT_EQUAL_TO,
                   property: "TYPECODE",
                   value: "190302"
               })
           ]
        }),
        projection: new SuperMap.Projection("EPSG:4326"),
        styleMap: new SuperMap.StyleMap({
            'default': DiMing_style
        })
    }); */

    // 服务器读取地名数据
    // 新建一个策略并使用在矢量要素图层(vector)上。
    const strategy = new SuperMap.Strategy.GeoText();
    strategy.style = {
        fontColor: '#FF7F00',
        fontWeight: 'bolder',
        fontSize: '14px',
        fill: true,
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        stroke: true,
        strokeColor: '#8B7B8B',
    };
    strategy.setStyle = function(fea) {
        const feature = fea;
        // 将style赋给标签
        if (this.style && this.style.fontSize && parseFloat(this.style.fontSize) < 12) this.style.fontSize = '12px';
        feature.style = SuperMap.Util.copyAttributes(feature.style, this.style);
        if (this.groupField && this.styleGroups && feature.attributes) {
            const Sf = this.groupField;
            const Attrs = feature.attributes;
            const Gro = this.styleGroups;
            let isSfInAttrs = false; // 指定的 groupField 是否是geotext的属性字段之一
            let attr = null; // 属性值

            for (const property in Attrs) {
                if (Sf === property) {
                    isSfInAttrs = true;
                    attr = Attrs[property];
                    break;
                }
            }

            // 判断属性值是否属于styleGroups的某一个范围，以便对标签分组
            if (isSfInAttrs) {
                for (let i = 0, len = Gro.length; i < len; i++) {
                    if ((attr >= Gro[i].start) && (attr < Gro[i].end)) {
                        // feature.style = SuperMap.Util.copyAttributes(feature.style, this.defaultStyle);
                        const sty1 = Gro[i].style;
                        if (sty1 && sty1.fontSize && parseFloat(sty1.fontSize) < 12) sty1.fontSize = '12px';
                        feature.style = SuperMap.Util.copyAttributes(feature.style, sty1);
                    }
                }
            }
        }

        // if(feature.isLabelRotationWithLine && feature.isLabelRotationWithLine == true) {
        //    this.setLabelRotationByLine(feature);
        // }

        // 将文本内容赋到标签要素的style上
        feature.style.label = feature.geometry.text;
        return feature;
    };

    const diMingNameLayer = new SuperMap.Layer.Vector('Label', { strategies: [strategy] });
    $.ajax({
        url: `${SINVIE_HOST}/gm/diming/all`,
        type: 'post',
        // async:false,
        success(res) {
            const geotextFeatures = [];

            for (const i in res.data) {
                const roadFeature = res.data[i];
                const lonlat = new SuperMap.LonLat(roadFeature.x, roadFeature.y);
                lonlat.transform('EPSG:4326', map.projection);
                const geoText = new SuperMap.Geometry.GeoText(lonlat.lon, lonlat.lat, roadFeature.NAME);
                const geotextFeature = new SuperMap.Feature.Vector(geoText);
                geotextFeature.style = SuperMap.Util.copyAttributes(geotextFeature.style, strategy.defaultStyle);
                geotextFeature.style.labelRotation = roadFeature.ROTATION;
                geotextFeatures.push(geotextFeature);
            }

            diMingNameLayer.addFeatures(geotextFeatures);
            diMingNameLayer.isBaseLayer = false;
            diMingNameLayer.setVisibility(false);
            map.addLayer(diMingNameLayer);
        },
    });

    const baseLayers = [];
    const roadnetWork = { name: '路网', baseLayer: vectorLayers };
    const placeName = { name: '地名', baseLayer: [diMingNameLayer] };
    const building = { name: '建筑', baseLayer: [vectorLayer_building] };

    baseLayers.push(roadnetWork);
    baseLayers.push(placeName);
    baseLayers.push(building);
    map.dataLayers = baseLayers;

    map.setCenter(new SuperMap.LonLat(12695937, 2578224), 12); // 定义中心点
    return map;
}

function getBDMap(mapContainer) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:3857',
    });
    const wmsLayer = new SuperMap.Layer.Baidu();
    map.addLayer(wmsLayer);
    map.setCenter(new SuperMap.LonLat(12695937, 2578224), 12); // 定义中心点
    return map;
}

function getGDMap(mapContainer) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4326',
        maxZoom: 19,
        minZoom: 7,
        numZoomLevels: 21,
    });
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'GDDOM_arcgis2000',
        url: 'https://yztfw.gdgov.cn/geostar/GDDOM/wmts',
        layer: 'GDDOM_arcgis2000',
        style: 'GDDOM_arcgis2000',
        matrixSet: 'Matrix_GDDOM_arcgis2000_0',
        format: 'image/png',
        opacity: 1,
        requestEncoding: 'KVP',
    });
    map.addLayer(wmsLayer);
    const zjLayer = new SuperMap.Layer.Tianditu();
    // https://webst04.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&l=${z}
    zjLayer.url = `${agreement}://t${num}.tianditu.gov.cn/DataServer?T=${type}_${proj}&x=${x}&y=${y}&l=${z}&tk=815233bc58d602a04377c6a2d30a3a51`,
        zjLayer.isLabel = true;
    zjLayer.layerType = 'img';
    zjLayer.isBaseLayer = false;
    map.addLayer(zjLayer);
    zjLayer.zOffset = 0;
    map.setCenter(new SuperMap.LonLat(113.25568, 23.13012), 10);
    return map;
}

function getSuZhouMap(mapContainer) {
    $('#dispatchMap').css('backgroundColor', '#fff');
    let token = '';
    let encodedToken = '';
    const minX = 13227676.0;
    const minY = 1661754.0;
    const maxX = 13556380.0;
    const maxY = 3890458.0;
    const maxExtent = new SuperMap.Bounds(minX, minY, maxX, maxY);
    $.ajax({
        type: 'POST',
        async: false,
        // url: suZhouMapUrl + "/SIPGIS/auth/jwt/token",
        url: `${suZhouMapUrl}/iocgateway/auth/jwt/token`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            username: 'guest',
            password: 'guest',
            appId: 'BASE-ADMIN',
        }),
        dataType: 'json',
        success(message) {
            token = message.token;
            encodedToken = encodeURI(token);
        },
        error(e) {
            console.log(e);
        },
    });
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: false,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:3857',
    });
    const wmsLayer = new SuperMap.Layer.Tianditu();
    // wmsLayer.url = "http://172.28.76.22/SIPGIS/esri-tile/layerTileService/SIPSD_sipmap2019/rest/services/MapServer/tile/${z}/${y}/${x}?sipsdToken=" + encodedToken;
    // wmsLayer.url = "http://58.210.9.131:5080/SIPGIS/tmsService/tmsXmlService/SIPIOC/${z}/${x}/${y}.png?sipsdToken="+token;
    wmsLayer.getTileUrl = function(xyz) {
        // xy稍有不对就会导致放大缩小偏移
        // return suZhouMapUrl + "/SIPGIS/tmsService/tmsXmlService/IOCSIPMAP/" + (xyz.z) + "/" + xyz.x + "/" + ((Math.pow(2, xyz.z) - xyz.y) - 1) + ".png?sipsdToken=" + token;
        return `${suZhouMapUrl}/iocgateway/tmsService/tmsXmlService/ioctms/${xyz.z}/${xyz.x}/${(Math.pow(2, xyz.z) - xyz.y) - 1}.png?sipsdToken=${token}`;
    };
    const resolutions = [
        268.375,
        134.1875,
        67.09375,
        33.546875,
        16.7734375,
        8.38671875,
        4.193359375,
        2.0966796875,
        1.04833984375,
        0.524169921875,
        0.2620849609375,
        0.13104248046875,
        0.065521240234375,
        0.0327606201171875,
    ];
    wmsLayer.isLabel = false;
    wmsLayer.layerType = 'img';
    wmsLayer.setTiandituParam = function(projection) {
        const lt = this.layerType;
        const resLen = 18;
        const resStart = 0;
        this.zOffset = 10;
        this.numZoomLevels = 14; // 此参数设置不对就会底图偏移

        // var maxResolution = 156543.0339;
        // var minResolution = 0.5971642833709717;
        this.units = 'm';
        this.projection = new SuperMap.Projection('EPSG:3857');
        this.maxExtent = maxExtent;
        // 8935.15549
        // 40226.11043
        // 13418260.24477985, 3650499.165054149
        // 13427195.40026985, 3690725.275484149
        this.tileOrigin = new SuperMap.LonLat(13407226, 3710758.0);
        this.resolutions = resolutions;
    };
    wmsLayer.isBaseLayer = true;
    const baseLayers = [];
    const imgLayer = { name: '矢量', baseLayer: wmsLayer, otherLayers: [] };
    map.addLayer(wmsLayer);
    baseLayers.push(imgLayer);
    console.log(baseLayers);
    const wmsVecLayer = new SuperMap.Layer.Tianditu();
    wmsVecLayer.url = `${agreement}://t${num}.tianditu.gov.cn/DataServer?T=${type}_${proj}&x=${x}&y=${y}&l=${z}&tk=815233bc58d602a04377c6a2d30a3a51`;
    wmsVecLayer.isLabel = false;
    wmsVecLayer.layerType = 'img';
    wmsVecLayer.setTiandituParam = function(projection) {
        this.zOffset = 0;
        this.maxExtent = maxExtent;
        this.numZoomLevels = 14;
        this.units = 'm';
        this.projection = new SuperMap.Projection('EPSG:3857');
        this.tileOrigin = new SuperMap.LonLat(13407226, 3710758.0);
    };
    const zjVecLayer = new SuperMap.Layer.Tianditu();
    zjVecLayer.url = `${agreement}://t${num}.tianditu.gov.cn/DataServer?T=${type}_${proj}&x=${x}&y=${y}&l=${z}&tk=815233bc58d602a04377c6a2d30a3a51`,
        zjVecLayer.isLabel = true;
    zjVecLayer.layerType = 'img';
    zjVecLayer.isBaseLayer = false;
    zjVecLayer.setTiandituParam = function(projection) {
        this.zOffset = 0;
        this.maxExtent = maxExtent;
        this.numZoomLevels = 14;
        this.units = 'm';
        this.projection = new SuperMap.Projection('EPSG:3857');
        this.tileOrigin = new SuperMap.LonLat(13407226, 3710758.0);
    };
    const vecLayer = { name: '影像', baseLayer: wmsVecLayer, otherLayers: [zjVecLayer] };
    if (location.href.indexOf('location') == -1) {
        map.addLayer(wmsVecLayer);
        map.addLayer(zjVecLayer);
        baseLayers.push(vecLayer);
    }
    console.log(baseLayers);
    map.baseLayers = baseLayers;
    map.setCenter(new SuperMap.LonLat(13440693.92645, 3675382.84863), 4); // 定义中心点
    return map;
}

function getGaoDeMap(mapContainer) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:3857',
    });

    const wmsLayer = new SuperMap.Layer.Tianditu();
    wmsLayer.url = 'https://webst02.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}';
    console.log(wmsLayer.url);
    wmsLayer.isLabel = false;
    wmsLayer.layerType = 'img';
    const zjLayer = new SuperMap.Layer.Tianditu();
    zjLayer.url = 'https://wprd03.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scl=1&style=8&ltype=11';
    zjLayer.isLabel = true;
    zjLayer.layerType = 'img';
    // zjLayer.layerType = "eia"; //英文注记
    zjLayer.isBaseLayer = false;
    map.addLayer(wmsLayer);
    map.addLayer(zjLayer);

    const baseLayers = [];
    const imgLayer = { name: '影像', baseLayer: wmsLayer, otherLayers: [zjLayer] };
    baseLayers.push(imgLayer);

    const wmsVecLayer = new SuperMap.Layer.Tianditu();
    wmsVecLayer.url = 'https://wprd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x=${x}&y=${y}&z=${z}&scl=1&ltype=3';
    wmsVecLayer.isLabel = false;
    wmsVecLayer.layerType = 'vec';
    wmsVecLayer.setVisibility(false);
    map.addLayer(wmsVecLayer);
    const vecLayer = { name: '矢量', baseLayer: wmsVecLayer, otherLayers: [] };
    baseLayers.push(vecLayer);

    map.baseLayers = baseLayers;
    map.setCenter(new SuperMap.LonLat(12697062.84884, 2576956.02425), 7); // 定义中心点
    return map;
}

/*
    @authorName: el
    @param: mapContainer (地图标签的ID)
    @annotation:
        对接增城区地图
        坐标系：国家大地2000
*/

function getZengChengMap(mapContainer) {
    $('#dispatchMap').css({ background: '#fff' });
    // var maxExtent = new SuperMap.Bounds(2577635.178503271,421627.4649722092,2622402.76803845,515925.1535675863);
    const maxExtent = new SuperMap.Bounds(443514.51064, 2550675.74829, 512177.02027, 2613670.34336);
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        projection: 'EPSG:4547',
        maxZoom: 8,
        minZoom: 0,
        numZoomLevels: 5,
        allOverlays: false,
        maxExtent,
    });
    const resolutions = [
        132.2919312505292,
        66.1459656252646,
        33.0729828126323,
        16.933367200067735,
        8.466683600033868,
        4.233341800016934,
        2.116670900008467,
        1.0583354500042335,
        0.5291677250021167,
        0.26458386250105836,
    ];
    // 遥感影像
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'yxcgcs2000_2019n12ycgcs2000',
        url: 'http://172.27.40.154:8888/NServiceAdapter/WMTS/ZC_2019N12YYGYXWMTS_2020_5_WMTS/c6509f736fdf9deccd5d2d4a9dfc793f', // WMTS服务地址
        layer: 'yxcgcs2000_2019n12ycgcs2000', // 图层名称
        style: 'default', // 图层样式
        matrixSet: 'default028mm',
        format: 'image/png', // 图像的MIME类型，默认为 "image/png"
        tileOrigin: new SuperMap.LonLat(-5123200, 10002100), // 瓦片矩阵左上角
        resolutions, // 地图分辨率
        // matrixIds: ["0","1","2","3","4","5","6","7","8","9"],
        tileFullExtent: maxExtent,
        opacity: 1,
        requestEncoding: 'KVP',
    });
    wmsLayer.setVisibility(true);
    // 重写请求地址
    wmsLayer.getURL = function(bounds) {
        bounds = this.adjustBounds(bounds);
        let url = '';
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {
            const center = bounds.getCenterLonLat();
            const info = this.getTileInfo(center);
            const matrixId = this.matrix.identifier;
            const params = {
                VERSION: '1.0.0',
                TILEMATRIX: matrixId,
                SERVICE: 'WMTS',
                REQUEST: 'GetTile',
                LAYER: this.layer,
                STYLE: this.style,
                TILEMATRIXSET: this.matrixSet,
                TILEROW: info.row,
                TILECOL: info.col,
                FORMAT: this.format,
            };
            if (SuperMap.Credential.CREDENTIAL) {
                params[SuperMap.Credential.CREDENTIAL.name] = SuperMap.Credential.CREDENTIAL.getValue();
            }
            url = SuperMap.CanvasLayer.prototype.getFullRequestString.apply(this, [params]);
        }
        if (this.tileProxy) {
            url = this.tileProxy + encodeURIComponent(url);
        } else if (this.proxy) {
            url = this.proxy + encodeURIComponent(url);
        }
        return url;
    };
    const baseLayers = [];
    const vecLayer = {
        name: '遥感影像',
        baseLayer: wmsLayer,
        otherLayers: [],
    };
    baseLayers.push(vecLayer);
    map.baseLayers = baseLayers;
    map.addLayer(wmsLayer);
    map.setCenter(new SuperMap.LonLat(475963.511, 2587000.5546), 1);
    return map;
}

function getSJSMap(mapContainer) {
    const maxExtent = new SuperMap.Bounds(116.10230704953678, 39.8719021884532, 116.25597354700005, 39.99391508432881);
    // 创建dispatchMap对象和动态图层
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4326',
        maxExtent,
    });
    const resolutions = [0.00015228550437313792, 0.00007614275218656896, 0.00003807137609328448, 0.00001903568804664224, 0.00000951784402332112, 0.00000475892201166056, 0.00000237946100583028]; // 分辨率

    const yxLayer = new SuperMap.Layer.WMTS({
        name: 'sjsimg84',
        url: `${MAP_Servie_URL}/arcgis/rest/services/sjsimg84/MapServer/WMTS`,
        layer: 'sjsimg84',
        style: 'default',
        matrixSet: 'default028mm',
        format: 'image/jpgpng',
        resolutions,
        opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-400.0, 399.9999999999998), // 瓦片矩阵左上角
        requestEncoding: 'KVP',

    });
    const baseLayers = [];
    const imgLayer = { name: '影像', baseLayer: yxLayer, otherLayers: [] };
    baseLayers.push(imgLayer);

    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'bjsjs_cache_84_xzqh',
        url: `${MAP_Servie_URL}/arcgis/rest/services/bjsjs_cache_84_xzqh/MapServer/WMTS`,
        layer: 'bjsjs_cache_84_xzqh',
        style: 'default',
        matrixSet: 'default028mm',
        format: 'image/png',
        resolutions,
        opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-400.0, 399.9999999999998), // 瓦片矩阵左上角
        requestEncoding: 'KVP',

    });
    wmsLayer.setVisibility(false);
    const vectorLayer = { name: '矢量', baseLayer: wmsLayer, otherLayers: [] };
    baseLayers.push(vectorLayer);
    map.baseLayers = baseLayers;
    map.addLayer(yxLayer);
    map.addLayer(wmsLayer);
    map.setCenter(new SuperMap.LonLat(116.17914029826841, 39.9550590774229325), 4);
    return map;
}

function getShenShanWMTSMap(mapContainer) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        maxZoom: 22,
        minZoom: 9,
        numZoomLevels: 21,
        allOverlays: false,
    });
    // 天地图分辨率数组
    const resolutions = [
        1.25764139776733,
        0.628820698883665,
        0.251528279553466,
        0.125764139776733,
        0.0628820698883665,
    ];
    // 遥感影像
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'World',
        url: 'http://10.1.17.3:8091/iserver/services/map-ugcv5-rsdom202002/wmts100', // WMTS服务地址
        layer: 'rs_dom_202002', // 图层名称
        style: 'default', // 图层样式
        matrixSet: 'Custom_rs_dom_202002', // 发布的标识符矩阵集
        format: 'image/png', // 图像的MIME类型，默认为 "image/png"
        resolutions, // 地图分辨率
        opacity: 1,
        requestEncoding: 'KVP',
    }); // 请求编码 ,一般默认都是KVP
    map.addLayers([wmsLayer]);
    wmsLayer.setVisibility(false);
    // 矢量地图
    const resolutions2 = [
        0.7031249999990244,
        0.35156250000003214,
        0.17578125000001607,
        0.08789062500000804,
        0.04394531250000402,
        0.02197265624999998,
        0.01098632812499999,
        0.005493164062499995,
        0.0027465820312499974,
        0.0013732910156249987,
        6.866455078124993E-4,
        3.433227539062497E-4,
        1.7166137695312495E-4,
        8.583068847656247E-5,
        4.2915344238281236E-5,

    ];
    const wmsVecLayer = new SuperMap.Layer.WMTS({
        name: 'World',
        url: 'http://10.1.17.3:8091/iserver/services/map-ugcv5-SSBZ4490/wmts100', // WMTS服务地址
        layer: 'SSBZ4490', // 图层名称
        style: 'default', // 图层样式
        matrixSet: 'Custom_SSBZ4490', // 发布的标识符矩阵集
        format: 'image/png', // 图像的MIME类型，默认为 "image/png"
        resolutions: resolutions2, // 地图分辨率
        opacity: 1,
        requestEncoding: 'KVP',
    }); // 请求编码 ,一般默认都是KVP
    map.addLayer(wmsVecLayer);
    wmsLayer.setVisibility(true);
    const baseLayers = [];
    const vecLayer = {
        name: '遥感影像',
        baseLayer: wmsLayer,
        otherLayers: [],
    };
    const vecLayer2 = {
        name: '矢量地图',
        baseLayer: wmsVecLayer,
        otherLayers: [],
    };
    baseLayers.push(vecLayer, vecLayer2);
    map.baseLayers = baseLayers;
    map.setCenter(new SuperMap.LonLat(103.67164, 36.47404), 1);
    return map;
}

function getEgisMap(mapContainer, initVis) {
    const maxExtent = new SuperMap.Bounds(-180, -90, 180, 90);
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            // new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4326',
        maxZoom: 18,
        minZoom: 3,
    });
    // screenshot();
    // function makeBaseAuth(user, password) {
    //   const tok = `${user}:${password}`;
    //   const hash = window.btoa(tok);
    //   return `Basic ${hash}`;
    // }

    // const authHeader = makeBaseAuth(window.config.mapConfig.CLIENT_ID, window.config.mapConfig.CLIENT_SCRECT);
    // SuperMap.Tile.CanvasImage.prototype.loadTileImage = function () {
    //   const me = this;
    //   const image = new Image();
    //   image.firstInView = true;
    //   me.lastImage = image;
    //   const context = {
    //     image,
    //     tile: me,
    //     viewRequestID: me.layer.map.viewRequestID,
    //     newImgTag: me.newImgTag,
    //     // bounds: me.bounds.clone()// todo: do we still need the bounds? guess no
    //     // urls: this.layer.url.slice() // todo: for retries?
    //   };

    //   const onLoadFunctionProxy = function () {
    //     if (this.tile.newImgTag === this.newImgTag) {
    //       this.tile.onLoadFunction(this);
    //     }
    //   };
    //   const onErrorFunctionProxy = function () {
    //     this.tile.onErrorFunction(this);
    //   };

    //   image.onload = SuperMap.Function.bind(onLoadFunctionProxy, context);
    //   image.onerror = SuperMap.Function.bind(onErrorFunctionProxy, context);
    //   // 跨域请求瓦片，暂时只支持非重定向的SUPERMAP_REST服务的地图，及其他Grid图层
    //   if ((me.layer instanceof SuperMap.Layer.SimpleCachedLayer || me.layer instanceof SuperMap.Layer.TiledDynamicRESTLayer) && !SuperMap.Util.isInTheSameDomain(me.url) && (me.url.indexOf('redirect=true') < 0) && me.layer.useCORS) {
    //     image.crossOrigin = 'anonymous';
    //   } else if (me.layer instanceof SuperMap.Layer.Grid && me.layer.useCORS) {
    //     image.crossOrigin = 'anonymous';
    //   }
    //   const request = new XMLHttpRequest();
    //   request.responseType = 'blob';
    //   request.open('get', me.url, true);
    //   request.setRequestHeader('Authorization', authHeader);
    // request.setRequestHeader('Authorization', 'Basic MjJhNDJmNjVjOGM0NDcyNGI1NzAzZWZkNTRiZjU3ODI6YWE5MDAxNTMyYmQzNDI3OWE5N2UzYjAxYmY2MTczZjk=');
    //   request.onreadystatechange = function (e) {
    //     if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
    //       image.src = URL.createObjectURL(request.response);
    //       image.onload = () => {
    //         URL.revokeObjectURL(image.src);
    //       };
    //     }
    //   };
    //   request.send(null);
    //   // 图片的url赋予给image后就会从服务器获取到图片
    //   image.src = me.url;
    // };

    const resolutions = [];
    const matrixIds = [];
    for (let i = 0; i < 19; i++) {
        matrixIds[i] = { identifier: i };
        resolutions.push(1.40625 / 2 / Math.pow(2, i - 1));
    }

    // 影像图层
    const yxLayer = new SuperMap.Layer.WMTS({
        name: 'img',
        url: `${window.config.mapConfig.WMTS_URL}`,
        layer: 'img',
        style: 'default',
        matrixSet: 'c',
        format: 'tiles',
        // resolutions:resolutions,
        // opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-180, 90), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
        matrixIds,
        resolutions,

    });
    // 影像注记
    const yxzjLayer = new SuperMap.Layer.WMTS({
        name: 'cia',
        url: `${window.config.mapConfig.WMTS_URL}`,
        layer: 'cia',
        style: 'default',
        matrixSet: 'c',
        format: 'tiles',
        // resolutions:resolutions,
        // opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-180, 90), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
        matrixIds,
        resolutions,

    });
    yxLayer.layerType = 'img';
    yxzjLayer.layerType = 'img';
    // 矢量图层
    const slLayer = new SuperMap.Layer.WMTS({
        name: 'vec',
        url: `${window.config.mapConfig.WMTS_URL}`,
        layer: 'vec',
        style: 'default',
        matrixSet: 'c',
        format: 'tiles',
        // resolutions:resolutions,
        // opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-180, 90), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
        matrixIds,
        resolutions,

    });
    // 矢量注记
    const slzjLayer = new SuperMap.Layer.WMTS({
        name: 'cva',
        url: `${window.config.mapConfig.WMTS_URL}`,
        layer: 'cva',
        style: 'default',
        matrixSet: 'c',
        format: 'tiles',
        // resolutions:resolutions,
        // opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-180, 90), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
        matrixIds,
        resolutions,

    });
    slLayer.layerType = 'vec';
    slzjLayer.layerType = 'vec';
    yxzjLayer.isBaseLayer = false;
    slzjLayer.isBaseLayer = false;
    if (initVis === '矢量') {
        yxLayer.setVisibility(false);
        yxzjLayer.setVisibility(false);
        map.addLayer(slLayer);
        map.addLayer(slzjLayer);
        map.addLayer(yxLayer);
        map.addLayer(yxzjLayer);
    } else {
        slLayer.setVisibility(false);
        slzjLayer.setVisibility(false);
        map.addLayer(yxLayer);
        map.addLayer(yxzjLayer);
        map.addLayer(slLayer);
        map.addLayer(slzjLayer);
    }
    const baseLayers = [{ name: '影像', baseLayer: yxLayer, otherLayers: [yxzjLayer] },
        { name: '矢量', baseLayer: slLayer, otherLayers: [slzjLayer] }
    ];
    map.baseLayers = baseLayers;
    const mapType = {
        type: 'EGIS',
        projection: 'EPSG:4326',
        access_token: '',
    };
    const serverData = `client_id=${window.config.mapConfig.CLIENT_ID}&client_secret=${window.config.mapConfig.CLIENT_SCRECT}`;
    getAccess_token('get', `${window.config.mapConfig.mapApiERIVCE_URL}/oauth/token?${serverData}`).then((res) => {
        const response = JSON.parse(res);
        console.log(response.access_token);
        mapType.access_token = response.access_token;
    });
    return { map, mapType };
}

function getAccess_token(method, url, data) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // 请求回调函数.XMLHttpRequest标准又分为Level 1和Level 2,这是Level 1和的回调处理方式
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            const { status } = xhr;
            if ((status >= 200 && status < 300) || status === 304) {
                resolve(xhr.response);
                // console.log(xhr);
                // console.log('request success');
            } else {
                // console.log('request error');
            }
        };
        xhr.timeout = 0; // 设置超时时间,0表示永不超时
        // 初始化请求
        xhr.open(method, url, true);
        // 设置期望的返回数据类型 'json' 'text' 'document' ...
        xhr.responseType = '';
        // 设置请求头
        // xhr.setRequestHeader('', '');
        // 发送请求
        // xhr.send(null || new FormData() || 'a=1&b=2' || 'json字符串');
        xhr.send();
    });
    return promise;
}

// 对接济南底图
function getJNMap(mapContainer) {
    function getUrls(bounds) {
        bounds = this.adjustBounds(bounds);
        let url = '';
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {
            const center = bounds.getCenterLonLat();
            const info = this.getTileInfo(center);
            const tilematrix = this.matrix.identifier;
            const params = {
                width: '256',
                height: '256',
                service: 'WMTS',
                request: 'GetTile',
                version: '1.0.0',
                layer: 'Layers',
                style: 'default',
                tilematrixSet: 'Custom_Layers',
                tilematrix,
                tilerow: info.row,
                tilecol: info.col,
                format: 'image/png',
            };
            if (SuperMap.Credential.CREDENTIAL) {
                params[SuperMap.Credential.CREDENTIAL.name] = SuperMap.Credential.CREDENTIAL.getValue();
            }
            url = SuperMap.CanvasLayer.prototype.getFullRequestString.apply(this, [params]);
        }
        if (this.tileProxy) {
            url = this.tileProxy + encodeURIComponent(url);
        } else if (this.proxy) {
            url = this.proxy + encodeURIComponent(url);
        }
        return url;
    };
    const maxExtent = new SuperMap.Bounds(-180.0, -90.0, 180.0, 90.0);
    // const maxExtent = new SuperMap.Bounds(112.36716, 39.56137, 118.21189, 33.67270);
    // 创建dispatchMap对象和动态图层
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4490',
        maxExtent,
        minZoom: 7,
    });
    const resolutions = [
        1.406250000000002,
        0.703125000000001,
        0.3515625000000005,
        0.17578125000000025,
        0.08789062500000024,
        0.04394531250000012,
        0.021972656250000035,
        0.010986328125000005,
        0.005493164062500015,
        0.0027465820312500074,
        0.0013732910156250013,
        6.866455078125018E-4,
        3.433227539062509E-4,
        1.7166137695312524E-4,
        8.583068847656273E-5,
        4.291534423828124E-5,
        2.1457672119140645E-5,
        1.0728836059570333E-5,
        5.364418029785166E-6,
        2.682209014892583E-6,
        1.3411045074462916E-6,
    ]; // 分辨率
    const baseLayers = [];
    const slLayer = new SuperMap.Layer.WMTS({
        name: 'Layers',
        url: 'http://10.210.97.189:8081/geoesb/proxy/8e323a2884af4441a13875e221af853d/a649c4dd31f941e0bd812d0367efc352',
        layer: 'Layers',
        style: 'default',
        matrixSet: 'Custom_Layers',
        resolutions,
        opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-180.0, 90.0), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
    });
    slLayer.getURL = getUrls;
    slLayer.setVisibility(false);
    slLayer.isBaseLayer = false;
    const imgLayer = { name: '矢量', baseLayer: slLayer, otherLayers: [] };
    baseLayers.push(imgLayer);
    map.addLayer(slLayer);
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'Layers',
        url: ' http://10.210.97.189:8081/geoesb/proxy/4fb75f7491c94356a9dd58a44d0dc57b/a649c4dd31f941e0bd812d0367efc352',
        layer: 'Layers',
        style: 'default',
        matrixSet: 'Custom_Layers',
        resolutions,
        opacity: 1,
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-180.0, 90.0), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
    });
    wmsLayer.getURL = getUrls;
    const vecLayer = { name: '影像', baseLayer: wmsLayer, otherLayers: [] };
    baseLayers.push(vecLayer);
    map.addLayer(wmsLayer);
    map.baseLayers = baseLayers;
    const mapType = {
        type: 'ZDY',
        projection: 'EPSG:4490',
    };
    return { map, mapType };
}

/*
    @authorName: el
    @param: mapContainer (地图标签的ID)
    @annotation:
        对接深圳市规土局地图
        坐标系：墨卡托
*/
function getSZTerritory(mapContainer) {
    const gridNames = ['EPSG:900913:0', 'EPSG:900913:1', 'EPSG:900913:2', 'EPSG:900913:3', 'EPSG:900913:4', 'EPSG:900913:5', 'EPSG:900913:6', 'EPSG:900913:7', 'EPSG:900913:8', 'EPSG:900913:9', 'EPSG:900913:10', 'EPSG:900913:11', 'EPSG:900913:12', 'EPSG:900913:13', 'EPSG:900913:14', 'EPSG:900913:15', 'EPSG:900913:16', 'EPSG:900913:17', 'EPSG:900913:18', 'EPSG:900913:19', 'EPSG:900913:20', 'EPSG:900913:21', 'EPSG:900913:22', 'EPSG:900913:23', 'EPSG:900913:24', 'EPSG:900913:25', 'EPSG:900913:26', 'EPSG:900913:27', 'EPSG:900913:28', 'EPSG:900913:29', 'EPSG:900913:30'];
    const maxExtent = new SuperMap.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34);
    // var maxExtent = new SuperMap.Bounds(12630440.422583804,2525095.5155248097,12791389.302201798,2650617.3172762245);
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'm',
        maxZoom: 23,
        minZoom: 9,
        projection: 'EPSG:3857',
        displayProjection: 'EPSG:4326',
    });
    SuperMap.Tile.CanvasImage.prototype.loadTileImage = function() {
        const me = this;
        const image = new Image();
        image.firstInView = true;
        me.lastImage = image;
        const context = {
            image,
            tile: me,
            viewRequestID: me.layer.map.viewRequestID,
            newImgTag: me.newImgTag,
            // bounds: me.bounds.clone()// todo: do we still need the bounds? guess no
            // urls: this.layer.url.slice() // todo: for retries?
        };
        const onLoadFunctionProxy = function() {
            if (this.tile.newImgTag === this.newImgTag) {
                this.tile.onLoadFunction(this);
            }
        };
        const onErrorFunctionProxy = function() {
            this.tile.onErrorFunction(this);
        };
        image.onload = SuperMap.Function.bind(onLoadFunctionProxy, context);
        image.onerror = SuperMap.Function.bind(onErrorFunctionProxy, context);
        const request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open('get', me.url, true);
        request.setRequestHeader('szvsud-license-key', 'PdOyCebn0NwnwqczjtyMl+Jo3AT9nYGaqCpKQd5Si1j8gQHLDQYBbw==');
        request.onreadystatechange = function(e) {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                image.src = URL.createObjectURL(request.response);
            }
        };
        request.send(null);
    };
    const resolutions = [
        156543.03390625,
        78271.516953125,
        39135.7584765625,
        19567.87923828125,
        9783.939619140625,
        4891.9698095703125,
        2445.9849047851562,
        1222.9924523925781,
        611.4962261962891,
        305.74811309814453,
        152.87405654907226,
        76.43702827453613,
        38.218514137268066,
        19.109257068634033,
        9.554628534317017,
        4.777314267158508,
        2.388657133579254,
        1.194328566789627,
        0.5971642833948135,
        0.29858214169740677,
        0.14929107084870338,
        0.07464553542435169,
        0.037322767712175846,
        0.018661383856087923,
        0.009330691928043961,
        0.004665345964021981,
        0.0023326729820109904,
        0.0011663364910054952,
        0.0005831682455027476,
        0.0002915841227513738,
        0.0001457920613756869
    ];
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'szmap',
        // url: 'http://10.253.114.241:7763/OGC/szmap', //WMTS服务地址
        url: 'http://192.168.37.131:8842/OGC/szmap', // WMTS服务地址
        layer: 'szmap', // 图层名称
        style: '', // 图层样式
        matrixSet: 'EPSG:900913', // 发布的标识符矩阵集
        format: 'image/png', // 图像的MIME类型，默认为 "image/png"
        resolutions, // 地图分辨率
        tileFullExtent: maxExtent,
        opacity: 1,
        tileOrigin: new SuperMap.LonLat(-20037508.34, 20037508.34), // 瓦片矩阵左上角
        // tileOrigin:new SuperMap.LonLat(12630440.422583804, 2650617.3172762245),   //瓦片矩阵左上角
        requestEncoding: 'KVP',
    });

    wmsLayer.getURL = function(bounds) {
        bounds = this.adjustBounds(bounds);
        let url = '';
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {
            const center = bounds.getCenterLonLat();
            const info = this.getTileInfo(center);
            const matrixId = this.matrix.identifier;
            console.log(matrixId, this.gridResolution);
            const params = {
                Version: '1.0.0',
                TileMatrix: gridNames[this.matrix.identifier],
                Service: 'WMTS',
                Request: 'GetTile',
                layer: this.layer,
                style: this.style,
                tilematrixset: this.matrixSet,
                TileRow: info.row,
                TileCol: info.col,
                Format: this.format,
            };
            if (SuperMap.Credential.CREDENTIAL) {
                params[SuperMap.Credential.CREDENTIAL.name] = SuperMap.Credential.CREDENTIAL.getValue();
            }
            url = SuperMap.CanvasLayer.prototype.getFullRequestString.apply(this, [params]);
        }
        if (this.tileProxy) {
            url = this.tileProxy + encodeURIComponent(url);
        } else if (this.proxy) {
            url = this.proxy + encodeURIComponent(url);
        }
        return url;
    };
    map.addLayer(wmsLayer);
    const baseLayers = [];
    const imgLayer = {
        name: '影像',
        baseLayer: wmsLayer,
        otherLayers: [],
    };
    baseLayers.push(imgLayer);
    map.baseLayers = baseLayers;
    return map;
}

// 南海底图
function getNanHaiMap(mapContainer, initVis) {
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        maxZoom: 7,
        minZoom: 1,
        // numZoomLevels: 21,
    });
    // screenshot();
    const resolutions = [0.001774254722579427, 0.0008871273612897135, 0.00044356368064485673, 0.00022178184032242836, 0.00011089092016219963, 0.00005544546008109988, 0.00002772273004054994, 0.000013861365020274948, 0.00000693068251013747, 0.0000034653412550687303, 0.00000173267062753437, 8.663353137671901e-7, 4.3316765688359007e-7, 2.165838284418e-7, 1.082919142209e-7, 5.414595711045e-8, 2.707297855522e-8, 1.353648927761e-8, 6.768244638810001e-9, 3.3841223194e-9, 1.65153422815e-9]; // 分辨率
    // wms
    const sLLayer = new SuperMap.Layer.WMS(
        '矢量图层',
        // 'http://10.171.142.14:8090/iserver/services/map-ugcv5-NHDZDT2018BLCGCS2000/wms111/NH_DZDT2018BL_CGCS2000',//黑色矢量
        // 'http://10.171.142.14:8090/iserver/services/map-NH_DT2018_BZ_CGCS2000/wms111/DZDT_BZ',// 标注
        // 'http://10.171.142.14:8090/iserver/services/map-ugcv5-NHYX2020CGCS2000/wms111/NH_YX2020_CGCS2000', // 影像
        'http://10.171.142.14:8090/iserver/services/map-NH_DZDT2018_CGCS2000/wms111/DZDT', // 白色矢量
        {
            // layers: 'NH_DZDT2018BL_CGCS2000', //黑色矢量
            // layers: 'DZDT_BZ', // 标注
            // layers: 'NH_YX2020_CGCS2000', // 影像
            layers: 'DZDT', // 白色矢量
            VERSION: '1.1.1',
            TRANSPARENT: true,
            // FORMAT: "image/png",+
        }, {
            resolutions,
            projection: 'EPSG:4490',
            maxExtent: new SuperMap.Bounds(112.3845788538456, 22.64527189731598, 113.38799642026424, 23.57588157057762),
        },
    );
    sLLayer.isLabel = false;
    sLLayer.layerType = 'vec';
    // 影像
    const yXLayer = new SuperMap.Layer.WMS(
        '影像图层',
        'http://10.171.142.14:8090/iserver/services/map-ugcv5-NHYX2020CGCS2000/wms111/NH_YX2020_CGCS2000', // 影像
        {
            // layers: 'NH_DZDT2018BL_CGCS2000', //黑色矢量
            // layers: 'DZDT_BZ', // 标注
            layers: 'NH_YX2020_CGCS2000', // 影像
            // layers: 'DZDT', // 白色矢量
            VERSION: '1.1.1',
            TRANSPARENT: true,
            // FORMAT: "image/png",+
        }, {
            resolutions,
            projection: 'EPSG:4490',
            maxExtent: new SuperMap.Bounds(112.3845788538456, 22.64527189731598, 113.38799642026424, 23.57588157057762),
        },
    );
    yXLayer.isLabel = false;
    yXLayer.layerType = 'img';
    // 标注
    const bZLayer = new SuperMap.Layer.WMS(
        '标注图层',
        'http://10.171.142.14:8090/iserver/services/map-NH_DT2018_BZ_CGCS2000/wms111/DZDT_BZ', // 标注
        {
            layers: 'DZDT_BZ', // 标注
            VERSION: '1.1.1',
            TRANSPARENT: true,
        }, {
            resolutions,
            projection: 'EPSG:4490',
            maxExtent: new SuperMap.Bounds(112.3845788538456, 22.64527189731598, 113.38799642026424, 23.57588157057762),
        },
    );
    bZLayer.isLabel = true;
    bZLayer.layerType = 'img';
    bZLayer.isBaseLayer = false;

    if (initVis === '矢量') {
        yXLayer.setVisibility(false);
        bZLayer.setVisibility(false);
        map.addLayer(sLLayer);
        map.addLayer(yXLayer);
        map.addLayer(bZLayer);
    } else {
        sLLayer.setVisibility(false);
        bZLayer.setVisibility(true);
        map.addLayer(yXLayer);
        map.addLayer(sLLayer);
        map.addLayer(bZLayer);
    }

    const SLLayer = { name: '矢量', baseLayer: sLLayer, otherLayers: [] };
    const YXLayer = { name: '影像', baseLayer: yXLayer, otherLayers: [bZLayer] };
    const baseLayers = [SLLayer, YXLayer];

    map.baseLayers = baseLayers;
    const mapType = {
        type: 'ZDY',
        projection: 'EPSG:4490',
        sectionNum: 1,
    };
    return { map, mapType };
}

function getCCMap(mapContainer, initVis) {
    // const maxExtent = new SuperMap.Bounds(-4923200, 2505322.9103488773, 8739828.8808111851, 26083330.6711869836);
    const maxExtent = new SuperMap.Bounds(621566.65408, 2493129.64009, 753191.48007, 2612371.64272);
    // 创建dispatchMap对象和动态图层
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        maxZoom: 16,
        minZoom: 10,
        maxExtent,
        projection: 'EPSG:4490',
        displayProjection: 'EPSG:4326',
    });
    const resolutions = [
        156543.34701231902, 78271.67350615951, 39135.836754402677, 19567.91837587842, 9783.9591879392101, 4891.9795952925242, 2445.9897976462621, 1222.9948988231311, 611.49744941156553, 305.74872470578276, 152.87436235289138, 76.437179853526374, 38.218591249682497, 19.109294301921938, 9.5546471509609692, 4.7773235754804846, 2.3886631106595546, 1.1943315553297773, 0.59716577766488865, 0.29858288883244433, 0.14929144441622216
    ];
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: '基础地图_FSDOM2020_2k113',
        url: 'http://19.128.104.232:12345/ServiceAccess/MapService-T/佛山市2020年影像图_MapServiceT_2000113/59f9f93df86ad669337b411e92a1939b/WMTS/tile/1.0.0/',
        layer: '基础地图_FSDOM2020_2k113',
        style: 'default',
        matrixSet: 'default028mm',
        format: 'image/png',
        opacity: 1,
        resolutions,
        requestEncoding: 'REST',
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-4923200, 1.00021E7), // 瓦片矩阵左上角
    });
    wmsLayer.isLabel = false;
    wmsLayer.layerType = 'img';

    const sLLayer = new SuperMap.Layer.WMTS({
        name: '基础地图_FSDOM2020_2k113',
        url: 'http://19.128.104.232:12345/ServiceAccess/MapService-T/佛山市电子地图_2018_MapService-T_2000113/38ebf8646559c92c1f669a10b7d390d1/WMTS/tile/1.0.0',
        layer: '基础地图_FSDOM2020_2k113',
        style: 'default',
        matrixSet: 'default028mm',
        format: 'image/png',
        opacity: 1,
        resolutions,
        requestEncoding: 'REST',
        tileFullExtent: maxExtent, // 瓦片设置的最大范围
        tileOrigin: new SuperMap.LonLat(-4923200, 1.00021E7), // 瓦片矩阵左上角
    });
    sLLayer.isLabel = false;
    sLLayer.layerType = 'img';

    function getUrl(bounds) {
        bounds = this.adjustBounds(bounds);
        var url = "";
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {
            var center = bounds.getCenterLonLat();
            var info = this.getTileInfo(center);
            var matrixId = this.matrix.identifier;
            if (this.requestEncoding.toUpperCase() === "REST") {
                // include 'version', 'layer' and 'style' in tile resource url
                //注掉关于version的信息var path = this.version + "/" + this.layer + "/" + this.style + "/";
                var path = this.layer + "/" + this.style + "/";
                // append optional dimension path elements
                if (this.dimensions) {
                    for (var i = 0; i < this.dimensions.length; i++) {
                        if (this.params[this.dimensions[i]]) {
                            path = path + this.params[this.dimensions[i]] + "/";
                        }
                    }
                }
                // parseInt(info.col/6) (Math.pow(2, this.matrix.identifier) - info.col) - 1
                // append other required path elements
                path = path + this.matrixSet + "/" + this.matrix.identifier +
                    "/" + info.row + "/" + info.col + "." + this.formatSuffix;
                if (SuperMap.Util.isArray(this.url)) {
                    url = this.selectUrl(path, this.url);
                } else {
                    url = this.url;
                }
                if (!url.match(/\/$/)) {
                    url = url + "/";
                }
                url = url + path;
            }
        }
        if (this.tileProxy) {
            url = this.tileProxy + encodeURIComponent(url);
        } else if (this.proxy) {
            url = this.proxy + encodeURIComponent(url);
        }
        return url;
    }
    wmsLayer.getURL = getUrl;
    sLLayer.getURL = getUrl;
    // screenshot();
    if (initVis === '矢量') {
        wmsLayer.setVisibility(false);
        map.addLayer(sLLayer);
        map.addLayer(wmsLayer);
    } else {
        sLLayer.setVisibility(false);
        map.addLayer(sLLayer);
        map.addLayer(wmsLayer);
    }
    const SLLayer = { name: '矢量', baseLayer: sLLayer, otherLayers: [] };
    const wmsLayers = { name: '影像', baseLayer: wmsLayer, otherLayers: [] };
    const baseLayers = [SLLayer, wmsLayers];
    map.baseLayers = baseLayers;
    const mapType = {
        type: 'ZDY',
        projection: 'EPSG:0',
    };
    return { map, mapType };
}

// 对接深汕底图
function getShenShanMap(mapContainer) {
    // 创建dispatchMap对象和动态图层
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4326',
        minZoom: 7,
    });
    const resolutions = [
        1.25764139776733,
        0.628820698883665,
        0.251528279553466,
        0.125764139776733,
        0.0628820698883665,
        0.0251528279553466,
        0.0125764139776733,
        0.00628820698883665,
        0.00251528279553466,
        0.00125764139776733,
        6.28820698883665E-4,
        2.51528279553466E-4,
        1.25764139776733E-4,
        6.28820698883665E-5,
        2.51528279553466E-5,
        1.25764139776733E-5,
        6.28820698883665E-6,
        2.51528279553466E-6,
        1.25764139776733E-6,
        6.28820698883665E-7,
        2.51528279553466E-7,
    ]; // 分辨率
    const baseLayers = [];
    const slLayer = new SuperMap.Layer.WMTS({
        name: 'jc_2000_dll',
        url: 'http://10.1.17.3:8091/iserver/services/map-ugcv5-jc2000dll/wmts100/',
        layer: 'jc_2000_dll',
        style: 'default',
        matrixSet: 'GlobalCRS84Scale_jc_2000_dll',
        resolutions,
        opacity: 1,
        tileOrigin: new SuperMap.LonLat(-180.0, 90.0), // 瓦片矩阵左上角
        requestEncoding: 'REST',
    });
    slLayer.layerType = 'img';
    slLayer.isBaseLayer = false;
    map.addLayer(slLayer);

    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'shenshan202111',
        url: 'http://10.1.17.3:8091/iserver/services/map-ugcv5-shenshan202111/wmts100/',
        layer: 'shenshan202111',
        style: 'default',
        matrixSet: 'GlobalCRS84Scale_shenshan202111',
        resolutions,
        opacity: 1,
        tileOrigin: new SuperMap.LonLat(-180.0, 90.0), // 瓦片矩阵左上角
        requestEncoding: 'REST',
    });
    const imgLayer = {
        name: '影像',
        baseLayer: wmsLayer,
        otherLayers: [slLayer]
    };
    baseLayers.push(imgLayer);
    map.addLayer(wmsLayer);

    map.baseLayers = baseLayers;
    const mapType = {
        type: 'ZDY',
        projection: 'EPSG:4326',
    };
    return {
        map,
        mapType
    };
}

// 山东聊城
function getSD_LCMap(mapContainer, initVis) {
    // 创建dispatchMap对象和动态图层
    const map = new SuperMap.Map(mapContainer, {
        controls: [
            new SuperMap.Control.MousePosition(), // 显示经纬度坐标
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true,
                },
            }),
        ],
        units: 'dd',
        projection: 'EPSG:4326',
        minZoom: 7,
        // maxExtent: new SuperMap.Bounds(114.920000, 35.540000, 116.800000, 37.140000),
    });
    const resolutions = [
        1.40625,
        0.703125,
        0.3515625,
        0.17578125,
        0.087890625,
        0.0439453125,
        0.02197265625,
        0.010986328125001,
        0.0054931640624994,
        0.0027465820312509,
        0.0013732910156254,
        0.00068664550781272,
        0.00034332275390636,
        0.00017166137695318,
        0.000085830688475402,
        0.000042915344238889,
        0.000021457672119445,
        0.000010728836059722,
        0.0000053644180298612,
    ];
    const baseLayers = [];
    const wmsLayer = new SuperMap.Layer.WMTS({
        name: 'tiles',
        url: 'http://59.206.54.76:8000/wmts/lcimage',
        layer: 'tiles',
        style: 'default',
        format: 'image/png',
        matrixSet: 'TileMatrixSet_0',
        apikey: '',
        resolutions,
        opacity: 1,
        tileOrigin: new SuperMap.LonLat(-180.0, 90.0), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
    });
    const imgLayer = {
        name: '影像',
        baseLayer: wmsLayer,
        otherLayers: [],
    };
    const slLayer = new SuperMap.Layer.WMTS({
        name: 'tiles',
        url: 'http://59.206.54.76:8000/wmts/lcmap',
        layer: 'tiles',
        style: 'default',
        format: 'image/png',
        matrixSet: 'TileMatrixSet_0',
        apikey: '',
        resolutions,
        opacity: 1,
        tileOrigin: new SuperMap.LonLat(-180.0, 90.0), // 瓦片矩阵左上角
        requestEncoding: 'KVP',
    });
    const slImgLayer = {
        name: '矢量',
        baseLayer: slLayer,
        otherLayers: [],
    };
    if (initVis === '矢量') {
        map.addLayer(slLayer);
        map.addLayer(wmsLayer);
    } else {
        map.addLayer(wmsLayer);
        map.addLayer(slLayer);
    }
    // 添加影像
    baseLayers.push(imgLayer);
    // 添加矢量
    baseLayers.push(slImgLayer);
    map.baseLayers = baseLayers;
    const mapType = {
        type: 'ZDY',
        projection: 'EPSG:4490',
    };
    return {
        map,
        mapType,
    };
}

export default getBaseMap;