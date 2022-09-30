export default function() {
    const PrintMap = {};
    let LAYER_COUNT = 0;
    let toImgNum = 0;
    let LAYER_LENGTH = 0;
    const mapVayer = {};
    let afterAddVayer = [];

    PrintMap.excute = async function(map, cb, delLayerArr = []) {
        mapVayer.wrap = map.div;
        mapVayer.w = mapVayer.wrap.offsetWidth;
        mapVayer.h = mapVayer.wrap.offsetHeight;
        const canvas = document.createElement('canvas');
        const broz = SuperMap.Browser.name;
        if (!canvas.getContext || (broz == 'msie' && !canvas.msToBlob)) {
            alert('您的浏览器版本太低，请升级。');
            return;
        }
        if (document.location.toString().match(/file:\/\//)) {
            alert('该功能需要在服务器中发布出来后，方可使用');
            return;
        }
        LAYER_COUNT = 0;
        let layers = [];
        const imgUrls = [];
        // 先进行过滤，赛出特定数据
        const ClusterArr = map.layers.filter((ele) => {
            if (ele.CLASS_NAME == 'SuperMap.Layer.ClusterLayer') {
                return true;
            }
        });
        let layers1 = [];
        // 获得数据之后给map上添加新图层
        addCovg(ClusterArr, map).then(r => {
            layers = map.layers.concat([]);
            // layers排序，将markers放到最上边
            return layerSort(layers, layers1);
        }).then(res => {
            layers = map.layers.concat([]);
            layers.filter((ele, index) => {
                if (ele.CLASS_NAME == 'SuperMap.Layer.ClusterLayer') {
                    layers[index] = '';
                }
            });
            layers1.forEach((ele, index) => {
                layers.forEach((eles) => {
                    if (ele.name == eles.name) {
                        layers1[index] = '';
                    }
                });
            });
            layers = layers.filter((ele) => ele);
            layers1 = layers1.filter((ele) => ele);
            // 把marck放到最上面
            layers = layers.concat(layers1);
            LAYER_LENGTH = layers.length;
            screenshot(map, layers, imgUrls, cb).then((res) => {
                console.log(toImgNum);
                toImgNum = -1;
                console.log(toImgNum);
                afterAddVayer = afterAddVayer.concat(delLayerArr);
                afterAddVayer.forEach((ele) => {
                    ele.destroy();
                });
                afterAddVayer = [];
                cb && cb(res);
            });
        })
    };
    // 运行绘制截图
    function screenshot(map, layers, imgUrls, cb) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < layers.length; i++) {
                const layer = layers[i];
                if (layer.CLASS_NAME == 'SuperMap.Layer.TiledDynamicRESTLayer' || layer.CLASS_NAME ==
                    'SuperMap.Layer.Tianditu' || layer.CLASS_NAME ==
                    'SuperMap.Layer.WMTS' || layer.CLASS_NAME == 'SuperMap.Layer.WMS') {
                    if (layer.useCanvas == false) {
                        draw(getImgLayerData(layer, map), i, imgUrls, map, resolve, cb);
                    } else {
                        draw(getCanvasLayerData(layer), i, imgUrls, map, resolve, cb);
                    }
                } else if (layer.CLASS_NAME == 'SuperMap.Layer.Markers') {
                    draw(getImgLayerData(layer, map, resolve), i, imgUrls, map, resolve, cb);
                } else if (layer.CLASS_NAME == 'SuperMap.Layer.Vector') {
                    getVectorLayerData(layer, map, function(img) {
                        draw(img, i, imgUrls, map, resolve, cb);
                    });
                } else if (layer.CLASS_NAME == 'SuperMap.Layer.Vector.RootContainer') {
                    const imgs = new Image();
                    // 设置图片跨域访问
                    imgs.setAttribute('crossOrigin', 'anonymous');
                    imgs.src = '';
                    imgs.setAttribute('name', layer.name)
                    draw(imgs, i, imgUrls, map, resolve, cb);
                } else if (layer.CLASS_NAME == 'SuperMap.Layer.PlottingLayer') {
                    getPlottingLayerData(layer, map, function(img) {
                        draw(img, i, imgUrls, map, resolve, cb);
                    });
                }
            }
        });
    }
    // 控制层的绘制
    function getRootContainerLayerData(div, thatEl, map) {
        let promise = new Promise((resolve, reject) => {
            // 聚合图层
            if (thatEl.id.indexOf('SuperMap.Layer.ClusterLayer') !== -1) {
                const pdiv = div;
                const offsetX = parseInt(pdiv.style.left.replace(/px/, '')) * -1;
                const offsetY = parseInt(pdiv.style.top.replace(/px/, '')) * -1;
                let canvas = document.createElement('canvas');
                const size = map.getSize();
                canvas.height = size.h;
                canvas.width = size.w;
                const ctx = canvas.getContext('2d');
                canvas.style.position = 'absolute';
                canvas.style.left = '5px';
                canvas.style.top = '600px';
                canvas.style.border = '1px solid #f00';
                const childrenEl = thatEl.children;
                for (let i = 0; i < childrenEl.length; i++) {
                    const img = childrenEl[i];
                    const left = img.getAttribute('x');
                    const top = img.getAttribute('y');
                    img.setAttribute('crossOrigin', 'anonymous');
                    const imgWidth = img.getAttribute('width') + 'px';
                    const imgHeight = img.getAttribute('height') + 'px';
                    let imgW = null;
                    let imgH = null;
                    if (imgWidth != null || imgWidth != '') {
                        imgW = parseInt(imgWidth.replace(/px/, ''));
                    }
                    if (imgHeight != null || imgHeight != '') {
                        imgH = parseInt(imgHeight.replace(/px/, ''));
                    }
                    const x = left + offsetX;
                    const y = top + offsetY;
                    if (imgW != null && imgH != null) {
                        ctx.drawImage(img, x, y, imgW, imgH);
                    } else {
                        ctx.drawImage(img, x, y);
                    }
                }
                const imageUrl = canvas.toDataURL('image/png');
                const imgs = new Image();
                // 设置图片跨域访问
                imgs.setAttribute('crossOrigin', 'anonymous');
                imgs.src = imageUrl;
                canvas = null;
                canvas = '';
                resolve(imgs)
            } else {
                resolve('')
            }
        })
        return promise
    }
    // layers排序，将markers放到最上边
    function layerSort(layers, layers1) {
        let promise = new Promise((resolve, reject) => {
            for (let i = 0; i < layers.length;) {
                if (layers[i].CLASS_NAME == 'SuperMap.Layer.Markers') {
                    const templayer = layers.splice(i, 1);
                    layers1.push(templayer[0]);
                } else if (layers[i].CLASS_NAME == 'SuperMap.Layer.GOAnimationLayer' ||
                    layers[i].CLASS_NAME == 'SuperMap.Layer.PlottingLayer.Temporary' ||
                    (layers[i].CLASS_NAME == 'SuperMap.Layer.PlottingLayer' && !layers[i].getVisibility()) ||
                    layers[i].CLASS_NAME == 'SuperMap.Layer.PlottingLayer.RootContainer') {
                    // 处理标绘图层的动画图层和图层不显示
                    layers.splice(i, 1);
                } else {
                    i++;
                }
            }
            setTimeout(() => {
                resolve('')
            }, 20)
        })
        return promise;
    }
    // 添加新的图层
    function addCovg(ClusterArr, map) {
        let promise = new Promise((resolve, reject) => {
            let promiseArr = [];
            // 获得数据之后给map上添加新图层
            if (ClusterArr) {
                // 添加新的maker图层
                ClusterArr.forEach((ele, index) => {
                    if (ele.CLASS_NAME == 'SuperMap.Layer.ClusterLayer') {
                        promiseArr.push(getClusterLayerLayerData(ele, map, index));
                    }
                });
                Promise.all(promiseArr).then(r => {
                    resolve(r);
                })
            } else {
                resolve('')
            }
        });
        return promise;
    }
    // 绘制到画布
    function draw(img, i, imgUrls, map, resolve, cb) {
        imgUrls[i] = img;
        // console.log(111);
        LAYER_COUNT++;
        if (LAYER_COUNT >= LAYER_LENGTH) {
            toImgNum += 1;
            // console.log(222);
            if (toImgNum < 2) {
                return PrintMap.excute(map, cb, afterAddVayer);
            }
            const canvas = document.createElement('canvas');
            const size = mapVayer;
            canvas.height = size.h;
            canvas.width = size.w;
            const ctx = canvas.getContext('2d');
            const panel = document.createElement('div');
            panel.style.height = '100%';
            panel.style.width = '100%';
            const buttonPanel = document.createElement('div');
            panel.appendChild(buttonPanel);
            panel.appendChild(canvas);
            window.setTimeout(() => {
                for (let i = 0; i < imgUrls.length; i++) {
                    ctx.drawImage(imgUrls[i], 0, 0);
                }
                if (!cb) {
                    const aa = document.createElement('a');
                    buttonPanel.appendChild(aa);
                    aa.target = '_blank';
                    aa.download = 'mapToImg.png';
                    aa.href = canvas.toDataURL();
                    aa.click();
                    aa.remove();
                }
                if (canvas.msToBlob) {
                    console.log(window.navigator.msSaveBlob(canvas.msToBlob(), 'map.png'));
                    resolve(window.navigator.msSaveBlob(canvas.msToBlob(), 'map.png'));
                    return;
                }
                resolve(canvas.toDataURL());
                buttonPanel.remove();
                panel.remove();
                canvas.remove();
            }, 180);
        }
    }
    // 截取图片图层
    function getImgLayerData(layer, map) {
        const { div } = layer;
        const pdiv = div.parentNode;
        const offsetX = parseInt(pdiv.style.left.replace(/px/, ''));
        const offsetY = parseInt(pdiv.style.top.replace(/px/, ''));
        let canvas = document.createElement('canvas');
        const size = map.getSize();
        canvas.height = size.h;
        canvas.width = size.w;
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'absolute';
        canvas.style.left = '5px';
        canvas.style.top = '600px';
        canvas.style.border = '1px solid #f00';
        const divs = div.getElementsByTagName('div');
        for (let i = 0; i < divs.length; i++) {
            const div1 = divs[i];
            if (div1.style.display != 'none') {
                const left = parseInt(div1.style.left.replace(/px/, ''));
                const top = parseInt(div1.style.top.replace(/px/, ''));
                const img = div1.getElementsByTagName('img')[0];
                img.setAttribute('crossOrigin', 'anonymous');
                const imgWidth = img.style.width;
                const imgHeight = img.style.height;
                let imgW = null;
                let imgH = null;
                if (imgWidth != null || imgWidth != '') {
                    imgW = parseInt(imgWidth.replace(/px/, ''));
                }
                if (imgHeight != null || imgHeight != '') {
                    imgH = parseInt(imgHeight.replace(/px/, ''));
                }
                const x = left + offsetX;
                const y = top + offsetY;
                if (imgW != null && imgH != null) {
                    ctx.drawImage(img, x, y, imgW, imgH);
                } else {
                    ctx.drawImage(img, x, y);
                }
            }
        }
        const imageUrl = canvas.toDataURL('image/png');
        const imgs = new Image();
        // 设置图片跨域访问
        imgs.setAttribute('crossOrigin', 'anonymous');
        imgs.src = imageUrl;
        canvas = null;
        canvas = '';
        imgs.setAttribute('name', layer.name)
        return imgs;
    }
    // 截取canvas图层
    function getCanvasLayerData(layer) {
        const { div } = layer;
        const canvas0 = div.getElementsByTagName('canvas')[0];
        const imageUrl = canvas0.toDataURL('image/png');
        const img = new Image();
        // 设置图片跨域访问
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = imageUrl;

        return img;
    }
    // 截取Vector图层
    function getVectorLayerData(layer, map, callback) {
        let printLayer;
        const strategies = [];
        const features1 = [];
        const { features } = layer;
        const layerStrategies = layer.strategies;
        // GeoText无法截图问题修复
        if (layerStrategies) {
            for (let i = 0; i < layerStrategies.length; i++) {
                if (layerStrategies[i].CLASS_NAME === 'SuperMap.Strategy.GeoText') {
                    strategies.push(layerStrategies[i].clone());
                } else {
                    strategies.push(layerStrategies[i]);
                }
            }
            printLayer = new SuperMap.Layer.Vector('PRINT_LAYER', {
                strategies,
                visibility: true,
                renderers: ['Canvas'],
            });
        } else {
            printLayer = new SuperMap.Layer.Vector('PRINT_LAYER', {
                visibility: true,
                renderers: ['Canvas'],
            });
        }
        map.addLayer(printLayer);
        for (let j = 0; j < features.length; j++) {
            const feature = features[j];
            const feature1 = new SuperMap.Feature.Vector();
            feature1.geometry = feature.geometry;
            feature1.style = feature.style;
            features1.push(feature1);
        }
        if (layer.style) {
            printLayer.style = layer.style;
        }
        printLayer.setOpacity(0);
        printLayer.addFeatures(features1);
        window.setTimeout((function(printLayer, map, callback) {
            return function() {
                const { div } = printLayer;
                const canvas1 = div.getElementsByTagName('canvas')[0];
                const imageUrl = canvas1.toDataURL('image/png');
                map.removeLayer(printLayer);
                printLayer.destroy();
                const img = new Image();
                // 设置图片跨域访问
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = imageUrl;
                callback(img);
            };
        }(printLayer, map, callback)), 30);
    }

    // 截取Plotting图层
    function getPlottingLayerData(layer, map, callback) {
        let printLayer;
        const features1 = [];
        const { features } = layer;

        printLayer = new SuperMap.Layer.PlottingLayer('PRINT_LAYER', layer.serverUrl, {
            visibility: true,
            renderers: ['Canvas'],
        });
        map.addLayer(printLayer);
        for (let j = 0; j < features.length; j++) {
            if (features[j].geometry instanceof SuperMap.Geometry.PlottingGeometry) {
                const feature = features[j];
                const feature1 = SuperMap.Plot.PlottingUtil.copyFeature(feature);
                features1.push(feature1);
            } else {
                const feature1 = new SuperMap.Feature.Vector();
                feature1.geometry = features[j].geometry.clone();
                feature1.style = features[j].style;
                features1.push(feature1);
            }
        }
        if (layer.style) {
            printLayer.style = layer.style;
        }

        printLayer.setOpacity(0);
        printLayer.addFeatures(features1);

        window.setTimeout((function(printLayer, map, callback) {
            return function() {
                const { div } = printLayer;
                const canvas1 = div.getElementsByTagName('canvas')[0];
                // var cxt1 = canvas1.getContext("2d");
                const imageUrl = canvas1.toDataURL('image/png');

                map.removeLayer(printLayer);
                printLayer.destroy();

                const img = new Image();
                // 设置图片跨域访问
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = imageUrl;

                callback(img);
            };
        }(printLayer, map, callback)), 30);
    }
    // 聚合图层转maker图层
    function getClusterLayerLayerData(layer, map, index) {
        let promise = new Promise((resolve, reject) => {
            let printLayer;
            let features1 = [];
            let data = [];
            const { features } = layer;
            printLayer = new SuperMap.Layer.Markers(`Cluster_Tr_Mark_Layer_${index}`);
            map.addLayer(printLayer);
            data = features.reduce((pre, ele) => {
                const obj = {};
                // 坐标
                obj.longitude = ele.geometry.x;
                obj.latitude = ele.geometry.y;
                // 图标
                obj.src = ele.style.externalGraphic;
                obj.wd = ele.style.graphicWidth;
                obj.hg = ele.style.graphicHeight;
                pre.push(obj);
                return pre;
            }, []);
            features1 = data.forEach((ele) => {
                const size = new SuperMap.Size((ele.wd), (ele.hg));
                const offset = new SuperMap.Pixel(-(size.w / 2), -size.h / 1.65);
                const icon = new SuperMap.Icon((ele.src), size, offset);
                const tempMarker = new SuperMap.Marker(new SuperMap.LonLat(ele.longitude, ele.latitude), icon);
                printLayer.addMarker(tempMarker);
            });
            afterAddVayer.push(printLayer);
            resolve(printLayer);
        });
        return promise;
    }
    return PrintMap;
}
