/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * Class: SuperMap.LevelRenderer.Painter
 * Painter 绘图模块。
 */
SuperMap.LevelRenderer.Painter = SuperMap.Class({

    /**
     * APIProperty: root
     * {HTMLElement} 绘图容器。
     *
     */
    root: null,

    /**
     * APIProperty: storage
     * {Array} 图形仓库。
     *
     */
    storage: null,

    /**
     * Property: _domRoot
     * {HTMLElement} 容器根 dom 对象。
     *
     */
    _domRoot: null,

    /**
     * Property: _layers
     * {Object} 绘制层对象。
     *
     */
    _layers: null,

    /**
     * Property: _zlevelList
     * {Array} 层列表。
     *
     */
    _zlevelList: null,

    /**
     * Property: _layerConfig
     * {Object} 绘制层配置对象。
     *
     */
    _layerConfig: null,

    /**
     * Property: _bgDom
     * {Object} 背景层 Canvas （Dom）。
     *
     */
    _bgDom: null,

    /**
     * Property: shapeToImage
     * {Function} 形状转图像函数。
     *
     */
    shapeToImage: null,

    /**
     * Constructor: SuperMap.LevelRenderer.Painter
     * 构造函数。
     *
     * Parameters:
     * root - {HTMLElement} 绘图区域（DIV）。
     * storage - {<SuperMap.LevelRenderer.Storage>} Storage 实例。
     *
     */
    initialize: function(root, storage){
        this.root = root;
        this.storage = storage;

        root.innerHTML = '';
        this._width = this._getWidth(); // 宽，缓存记录
        this._height = this._getHeight(); // 高，缓存记录

        var domRoot = document.createElement('div');
        this._domRoot = domRoot;

        // domRoot.onselectstart = returnFalse; // 避免页面选中的尴尬
        domRoot.style.position = 'relative';
        domRoot.style.overflow = 'hidden';
        domRoot.style.width = this._width + 'px';
        domRoot.style.height = this._height + 'px';
        root.appendChild(domRoot);

        this._layers = {};

        this._zlevelList = [];

        this._layerConfig = {};

        this.shapeToImage = this._createShapeToImageProcessor();

        // 创建各层canvas
        // 背景
        //this._bgDom = SuperMap.LevelRenderer.Painter.createDom('bg', 'div', this);
        this._bgDom = SuperMap.LevelRenderer.Painter.createDom(SuperMap.Util.createUniqueID("SuperMap.Theme_background_"), 'div', this);
        domRoot.appendChild(this._bgDom);
        this._bgDom.onselectstart = returnFalse;
        this._bgDom.style['-webkit-user-select'] = 'none';
        this._bgDom.style['user-select'] = 'none';
        this._bgDom.style['-webkit-touch-callout'] = 'none';

        // 高亮
        //var hoverLayer = new SuperMap.LevelRenderer.Painter.Layer('_hoverLayer_', this);
        var hoverLayer = new SuperMap.LevelRenderer.Painter.Layer(SuperMap.Util.createUniqueID("_highLightLayer_"), this);
        this._layers['hover'] = hoverLayer;
        domRoot.appendChild(hoverLayer.dom);
        hoverLayer.initContext();

        hoverLayer.dom.onselectstart = returnFalse;
        hoverLayer.dom.style['-webkit-user-select'] = 'none';
        hoverLayer.dom.style['user-select'] = 'none';
        hoverLayer.dom.style['-webkit-touch-callout'] = 'none';

        var me = this;
        this.updatePainter = function (shapeList, callback) {
            me.refreshShapes(shapeList, callback);
        };

        // 返回false的方法，用于避免页面被选中
        function returnFalse() { return false;}

        // 什么都不干的空方法
        function doNothing() {}
    },

    /**
     * APIMethod: destroy
     * 销毁对象，释放资源。调用此函数后所有属性将被置为 null。
     */
    destroy: function() {
        this.dispose();
        this._zlevelList = null;
        this._layerConfig = null;
        this._bgDom = null;
        this.shapeToImage = null;
    },

    /**
     * APIMethod: render
     * 渲染。
     *
     * 首次绘图，创建各种 dom 和 context。
     *
     * Parameters:
     * callback - {Function} 绘画结束后的回调函数。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    render: function(callback){
        // TODO
        this.refresh(callback, true);

        return this;
    },

    /**
     * APIMethod: refresh
     * 刷新。
     *
     * Parameters:
     * callback - {Function} 刷新结束后的回调函数。
     * paintAll - {Boolean} 强制绘制所有 shape。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    refresh: function(callback, paintAll){
        var list = this.storage.getShapeList(true);
        this._paintList(list, paintAll);

        if (typeof callback == 'function') {
            callback();
        }

        return this;
    },

    /**
     * Method: _paintList
     * 按列表绘制图形。
     */
    _paintList: function(list, paintAll){
        if (typeof(paintAll) == 'undefined') {
            paintAll = false;
        }

        this._updateLayerStatus(list);

        var currentLayer;
        var currentZLevel;
        var ctx;

        for (var id in this._layers) {
            if (id !== 'hover') {
                this._layers[id].unusedCount++;
                this._layers[id].updateTransform();
            }
        }

        var invTransform = [];

        for (var i = 0, l = list.length; i < l; i++) {
            var shape = list[i];

            if (currentZLevel !== shape.zlevel) {
                if (currentLayer && currentLayer.needTransform) {
                    ctx.restore();
                }

                currentLayer = this.getLayer(shape.zlevel);
                ctx = currentLayer.ctx;
                currentZLevel = shape.zlevel;

                // Reset the count
                currentLayer.unusedCount = 0;

                if (currentLayer.dirty || paintAll) {
                    currentLayer.clear();
                }

                if (currentLayer.needTransform) {
                    ctx.save();
                    currentLayer.setTransform(ctx);
                }
            }

            // Start group clipping
            if (shape.__startClip) {
                var clipShape = shape.__startClip;
                ctx.save();
                // Set transform
                if (clipShape.needTransform) {
                    var m = clipShape.transform;
                    SuperMap.LevelRenderer.Util_matrix.invert(invTransform, m);
                    ctx.transform(
                        m[0], m[1],
                        m[2], m[3],
                        m[4], m[5]
                    );
                }

                ctx.beginPath();
                clipShape.buildPath(ctx, clipShape.style);
                ctx.clip();

                // Transform back
                if (clipShape.needTransform) {
                    var m = invTransform;
                    ctx.transform(
                        m[0], m[1],
                        m[2], m[3],
                        m[4], m[5]
                    );
                }
            }

            if ((currentLayer.dirty || paintAll) && !shape.invisible) {
                if (
                    !shape.onbrush
                        || (shape.onbrush && !shape.onbrush(ctx, false))
                    ) {
                    if (SuperMap.LevelRenderer.Config.catchBrushException) {
                        try {
                            shape.brush(ctx, false, this.updatePainter);
                        }
                        catch (error) {
                            SuperMap.LevelRenderer.Util_log(
                                error,
                                'brush error of ' + shape.type,
                                shape
                            );
                        }
                    }
                    else {
                        shape.brush(ctx, false, this.updatePainter);
                    }
                }
            }

            // Stop group clipping
            if (shape.__stopClip) {
                ctx.restore();
            }

            shape.__dirty = false;
        }

        if (currentLayer && currentLayer.needTransform) {
            ctx.restore();
        }

        for (var id in this._layers) {
            if (id !== 'hover') {
                var layer = this._layers[id];
                layer.dirty = false;
                // 删除过期的层
                // PENDING
                // if (layer.unusedCount >= 500) {
                //     this.delLayer(id);
                // }
                if (layer.unusedCount == 1) {
                    layer.clear();
                }
            }
        }

    },

    /**
     * APIMethod: getLayer
     * 获取 zlevel 所在层，如果不存在则会创建一个新的层。
     *
     * Parameters:
     * zlevel - {Number} zlevel。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    getLayer: function(zlevel){
        // Change draw layer
        var currentLayer = this._layers[zlevel];
        if (!currentLayer) {
            var len = this._zlevelList.length;
            var prevLayer = null;
            var i = -1;
            if (len > 0 && zlevel > this._zlevelList[0]) {
                for (i = 0; i < len - 1; i++) {
                    if (
                        this._zlevelList[i] < zlevel
                            && this._zlevelList[i + 1] > zlevel
                        ) {
                        break;
                    }
                }
                prevLayer = this._layers[this._zlevelList[i]];
            }
            this._zlevelList.splice(i + 1, 0, zlevel);

            // Create a new layer
            //currentLayer = new SuperMap.LevelRenderer.Painter.Layer(zlevel, this);
            currentLayer = new SuperMap.LevelRenderer.Painter.Layer(SuperMap.Util.createUniqueID("_levelLayer_" + zlevel), this);
            var prevDom = prevLayer ? prevLayer.dom : this._bgDom;
            if (prevDom.nextSibling) {
                prevDom.parentNode.insertBefore(
                    currentLayer.dom,
                    prevDom.nextSibling
                );
            }
            else {
                prevDom.parentNode.appendChild(
                    currentLayer.dom
                );
            }
            currentLayer.initContext();

            this._layers[zlevel] = currentLayer;

            if (this._layerConfig[zlevel]) {
                SuperMap.LevelRenderer.Util.merge(currentLayer, this._layerConfig[zlevel], true);
            }

            currentLayer.updateTransform();
        }

        return currentLayer;
    },

    /**
     * Method: getLayers
     * 获取所有已创建的层。
     *
     * Returns:
     * {Array{<SuperMap.LevelRenderer.Painter.Layer>}} 已创建的层
     */
    getLayers: function(){
        return this._layers;
    },

    /**
     * Method: _updateLayerStatus
     * 更新绘制层状态。
     */
    _updateLayerStatus: function(list){
        var layers = this._layers;

        var elCounts = {};
        for (var z in layers) {
            if (z !== 'hover') {
                elCounts[z] = layers[z].elCount;
                layers[z].elCount = 0;
            }
        }

        for (var i = 0, l = list.length; i < l; i++) {
            var shape = list[i];
            var zlevel = shape.zlevel;
            var layer = layers[zlevel];
            if (layer) {
                layer.elCount++;
                // 已经被标记为需要刷新
                if (layer.dirty) {
                    continue;
                }
                layer.dirty = shape.__dirty;
            }
        }

        // 层中的元素数量有发生变化
        for (var z in layers) {
            if (z !== 'hover') {
                if (elCounts[z] !== layers[z].elCount) {
                    layers[z].dirty = true;
                }
            }
        }
    },

    /**
     * APIMethod: refreshShapes
     * 更新的图形元素列表。
     *
     * Parameters:
     * shapeList - {Number} 需要更新的图形元素列表。
     * callback - {Number} 视图更新后回调函数。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    refreshShapes: function(shapeList, callback){
        for (var i = 0, l = shapeList.length; i < l; i++) {
            var shape = shapeList[i];
            this.storage.mod(shape.id);
        }

        this.refresh(callback);
        return this;
    },

    /**
     * APIMethod: clear
     * 清除 hover 层外所有内容。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    clear: function(){
        for (var k in this._layers) {
            if (k == 'hover') {
                continue;
            }
            this._layers[k].clear();
        }

        return this;
    },

    /**
     * APIMethod: modLayer
     * 修改指定 zlevel 的绘制参数。
     *
     * Parameters:
     * zlevel - {String} zlevel。
     * config - {Object} 配置对象。可用属性如下：
     *
     * Symbolizer properties:
     * clearColor - {String} 每次清空画布的颜色。默认值：0。
     * motionBlur - {Boolean} 是否开启动态模糊。默认值：false。
     * lastFrameAlpha - {Number}  在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显。默认值：0.7。
     * position - {Array{Number}}  层的平移。
     * rotation - {Array{Number}}  层的旋转。
     * scale - {Array{Number}}  层的缩放。
     * zoomable - {Boolean} 层是否支持鼠标缩放操作。默认值：false。
     * panable - {Boolean} 层是否支持鼠标平移操作。默认值：false。
     *
     */
    modLayer: function(zlevel, config){
        if (config) {
            if (!this._layerConfig[zlevel]) {
                this._layerConfig[zlevel] = config;
            }
            else {
                SuperMap.LevelRenderer.Util.merge(this._layerConfig[zlevel], config, true);
            }

            var layer = this._layers[zlevel];

            if (layer) {
                SuperMap.LevelRenderer.Util.merge(layer, this._layerConfig[zlevel], true);
            }
        }
    },

    /**
     * APIMethod: delLayer
     * 删除指定层。
     *
     * Parameters:
     * zlevel - {Ntring} 层所在的 zlevel。
     *
     */
    delLayer: function(zlevel){
        var layer = this._layers[zlevel];
        if (!layer) {
            return;
        }
        // Save config
        this.modLayer(zlevel, {
            position: layer.position,
            rotation: layer.rotation,
            scale: layer.scale
        });
        layer.dom.parentNode.removeChild(layer.dom);
        delete this._layers[zlevel];

        this._zlevelList.splice(SuperMap.LevelRenderer.Util.indexOf(this._zlevelList, zlevel), 1);
    },

    /**
     * APIMethod: refreshHover
     * 刷新 hover 层。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    refreshHover: function(){
        this.clearHover();
        var list = this.storage.getHoverShapes(true);
        for (var i = 0, l = list.length; i < l; i++) {
            this._brushHover(list[i]);
        }
        this.storage.delHover();

        return this;
    },

    /**
     * APIMethod: clearHover
     * 清除 hover 层所有内容。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    clearHover: function(){
        var hover = this._layers.hover;
        hover && hover.clear();

        return this;
    },

    /**
     * APIMethod: resize
     * 区域大小变化后重绘。
     *
     * Returns:
     * {<SuperMap.LevelRenderer.Painter>} this。
     */
    resize: function(){
        var domRoot = this._domRoot;
        domRoot.style.display = 'none';

        var width = this._getWidth();
        var height = this._getHeight();

        domRoot.style.display = '';

        // 优化没有实际改变的resize
        if (this._width != width || height != this._height) {
            this._width = width;
            this._height = height;

            domRoot.style.width = width + 'px';
            domRoot.style.height = height + 'px';

            for (var id in this._layers) {

                this._layers[id].resize(width, height);
            }

            this.refresh(null, true);
        }

        return this;
    },

    /**
     * APIMethod: clearLayer
     * 清除指定的一个层。
     *
     * Parameters:
     * zLevel - {Number} 层。
     */
    clearLayer: function(zLevel){
        var layer = this._layers[zLevel];
        if (layer) {
            layer.clear();
        }
    },

    /**
     * APIMethod: dispose
     * 释放。
     *
     */
    dispose: function(){
        this.root.innerHTML = '';

        this.root = null;
        this.storage = null;
        this._domRoot = null;
        this._layers = null;
    },

    /**
     * Method: getDomHover
     * 获取 Hover 层的 Dom。
     *
     */
    getDomHover: function(){
        return this._layers.hover.dom;
    },

    /**
     * APIMethod: toDataURL
     * 图像导出。
     *
     * Parameters:
     * type - {String} 图片类型。
     * backgroundColor - {String} 背景色。默认值：'#fff'。
     * args - {Object}。
     *
     * Returns:
     * {String} 图片的Base64 url。
     */
    toDataURL: function(type, backgroundColor, args){
        //var imageDom = SuperMap.LevelRenderer.Painter.createDom('image', 'canvas', this);
        var imageDom = SuperMap.LevelRenderer.Painter.createDom(SuperMap.Util.createUniqueID("SuperMap.Theme.image_"), 'canvas', this);
        this._bgDom.appendChild(imageDom);
        var ctx = imageDom.getContext('2d');
        SuperMap.LevelRenderer.Painter.devicePixelRatio != 1
        && ctx.scale(SuperMap.LevelRenderer.Painter.devicePixelRatio, SuperMap.LevelRenderer.Painter.devicePixelRatio);

        ctx.fillStyle = backgroundColor || '#fff';
        ctx.rect(
            0, 0,
            this._width * SuperMap.LevelRenderer.Painter.devicePixelRatio,
            this._height * SuperMap.LevelRenderer.Painter.devicePixelRatio
        );
        ctx.fill();

        var self = this;
        // 升序遍历，shape上的zlevel指定绘画图层的z轴层叠

        this.storage.iterShape(
            function (shape) {
                if (!shape.invisible) {
                    if (!shape.onbrush // 没有onbrush
                        // 有onbrush并且调用执行返回false或undefined则继续粉刷
                        || (shape.onbrush && !shape.onbrush(ctx, false))
                        ) {
                        if (SuperMap.LevelRenderer.Config.catchBrushException) {
                            try {
                                shape.brush(ctx, false, self.updatePainter);
                            }
                            catch (error) {
                                SuperMap.LevelRenderer.Util_log(
                                    error,
                                    'brush error of ' + shape.type,
                                    shape
                                );
                            }
                        }
                        else {
                            shape.brush(ctx, false, self.updatePainter);
                        }
                    }
                }
            },
            { normal: 'up', update: true }
        );
        var image = imageDom.toDataURL(type, args);
        ctx = null;
        this._bgDom.removeChild(imageDom);
        return image;
    },

    /**
     * APIMethod: getWidth
     * 获取绘图区域宽度。
     *
     * Returns:
     * {Number} 绘图区域宽度。
     */
    getWidth: function(){
        return this._width;
    },

    /**
     * APIMethod: getHeight
     * 获取绘图区域高度。
     *
     * Returns:
     * {Number} 绘图区域高度。
     */
    getHeight: function(){
        return this._height;
    },

    /**
     * Method: _getWidth
     *
     */
    _getWidth: function(){
        var root = this.root;
        var stl = root.currentStyle
            || document.defaultView.getComputedStyle(root);

        return ((root.clientWidth || parseInt(stl.width, 10))
            - parseInt(stl.paddingLeft, 10) // 请原谅我这比较粗暴
            - parseInt(stl.paddingRight, 10)).toFixed(0) - 0;
    },

    /**
     * Method: _getHeight
     *
     */
    _getHeight: function(){
        var root = this.root;
        var stl = root.currentStyle
            || document.defaultView.getComputedStyle(root);

        return ((root.clientHeight || parseInt(stl.height, 10))
            - parseInt(stl.paddingTop, 10) // 请原谅我这比较粗暴
            - parseInt(stl.paddingBottom, 10)).toFixed(0) - 0;
    },

    /**
     * Method: _brushHover
     *
     */
    _brushHover: function(shape){
        var ctx = this._layers.hover.ctx;

        if (!shape.onbrush // 没有onbrush
            // 有onbrush并且调用执行返回false或undefined则继续粉刷
            || (shape.onbrush && !shape.onbrush(ctx, true))
            ) {
            var layer = this.getLayer(shape.zlevel);
            if (layer.needTransform) {
                ctx.save();
                layer.setTransform(ctx);
            }
            // Retina 优化
            if (SuperMap.LevelRenderer.Config.catchBrushException) {
                try {
                    shape.brush(ctx, true, this.updatePainter);
                }
                catch (error) {
                    SuperMap.LevelRenderer.Util_log(
                        error, 'hoverBrush error of ' + shape.type, shape
                    );
                }
            }
            else {
                shape.brush(ctx, true, this.updatePainter);
            }
            if (layer.needTransform) {
                ctx.restore();
            }
        }

    },

    /**
     * Method: _shapeToImage
     *
     */
    _shapeToImage: function(id, shape, width, height, devicePixelRatio){
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var devicePixelRatio = window.devicePixelRatio || 1;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.setAttribute('width', width * devicePixelRatio);
        canvas.setAttribute('height', height * devicePixelRatio);

        ctx.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);

        var shapeTransform = {
            position : shape.position,
            rotation : shape.rotation,
            scale : shape.scale
        };
        shape.position = [ 0, 0, 0 ];
        shape.rotation = 0;
        shape.scale = [ 1, 1 ];
        if (shape) {
            shape.brush(ctx, false);
        }

        var imgShape = new SuperMap.LevelRenderer.Shape.SmicImage({
            id : id,
            style : {
                x : 0,
                y : 0,
                image : canvas
            }
        });

        if (shapeTransform.position != null) {
            imgShape.position = shape.position = shapeTransform.position;
        }

        if (shapeTransform.rotation != null) {
            imgShape.rotation = shape.rotation = shapeTransform.rotation;
        }

        if (shapeTransform.scale != null) {
            imgShape.scale = shape.scale = shapeTransform.scale;
        }

        return imgShape;
    },

    /**
     * Method: _createShapeToImageProcessor
     *
     */
    _createShapeToImageProcessor: function(){
        var me = this;

        return function (id, e, width, height) {
            return me._shapeToImage(
                id, e, width, height, SuperMap.LevelRenderer.Painter.devicePixelRatio
            );
        };
    },

    // SMIC-方法扩展 - start
    /**
     * APIMethod: updateHoverLayer
     * 更新设置显示高亮图层。
     *
     * Parameters:
     * shapes - {Array} 图形数组。
     */
    updateHoverLayer: function(shapes){
        if(!(shapes instanceof Array)) return this;

        //清除高亮
        this.clearHover();
        this.storage.delHover();

        for(var i = 0; i < shapes.length; i++){
            this.storage.addHover(shapes[i]);
            this._brushHover(shapes[i]);
        }
    },

    CLASS_NAME: "SuperMap.LevelRenderer.Painter"
});

/**
 * Class: SuperMap.LevelRenderer.Painter.Layer
 * 绘制层类。
 *
 * Inherits from:
 *  - <SuperMap.LevelRenderer.Transformable>
 */
SuperMap.LevelRenderer.Painter.Layer = SuperMap.Class(SuperMap.LevelRenderer.Transformable, {

    /**
     * Property: dom
     * {Object} dom。
     */
    dom: null,

    /**
     * Property: domBack
     * {Object} domBack。
     */
    domBack: null,

    /**
     * Property: ctxBack
     * {Object} ctxBack。
     */
    ctxBack: null,

    /**
     * Property: painter
     * {<SuperMap.LevelRenderer.Painter>} painter。
     */
    painter: null,

    /**
     * Property: unusedCount
     * {Number} unusedCount。
     */
    unusedCount: null,

    /**
     * Property: config
     * {Object} config。
     */
    config: null,

    /**
     * Property: dirty
     * {Boolean} dirty。
     */
    dirty: null,

    /**
     * Property: elCount
     * {Number} elCount。
     */
    elCount: null,

    // Configs
    /**
     * Property: clearColor
     * {String} 每次清空画布的颜色。默认值：0；
     */
    clearColor: 0,

    /**
     * Property: motionBlur
     * {Boolean} 是否开启动态模糊。默认值：false；
     */
    motionBlur: false,

    /**
     * Property: lastFrameAlpha
     * {Number} 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */
    lastFrameAlpha: 0.7,

    /**
     * Property: zoomable
     * {Boolean} 层是否支持鼠标平移操作。默认值：false；
     */
    zoomable: false,

    /**
     * Property: panable
     * {Boolean} 层是否支持鼠标缩放操作。默认值：false；
     */
    panable: false,

    /**
     * Property: maxZoom
     * {Number} maxZoom。默认值：Infinity。
     */
    maxZoom: Infinity,

    /**
     * Property: minZoom
     * {Number} minZoom。默认值：0。
     */
    minZoom: 0,

    /**
     * Property: ctx
     * {Object} Cavans 上下文。
     */
    ctx: null,

    /**
     * Constructor: SuperMap.LevelRenderer.Painter.Layer
     * 构造函数。
     *
     * Parameters:
     * id - {String} id。
     * painter - {<SuperMap.LevelRenderer.Painter>} Painter 实例。
     *
     */
    initialize: function(id, painter) {
        SuperMap.LevelRenderer.Transformable.prototype.initialize.apply(this, arguments);

        this.dom = SuperMap.LevelRenderer.Painter.createDom(SuperMap.Util.createUniqueID("SuperMap.Theme" + id), 'canvas', painter);
        this.dom.onselectstart = returnFalse; // 避免页面选中的尴尬
        this.dom.style['-webkit-user-select'] = 'none';
        this.dom.style['user-select'] = 'none';
        this.dom.style['-webkit-touch-callout'] = 'none';

        this.domBack = null;
        this.ctxBack = null;

        this.painter = painter;

        this.unusedCount = 0;

        this.config = null;

        this.dirty = true;

        this.elCount = 0;

        // Configs
        this.clearColor = 0;
        this.motionBlur = false;
        this.lastFrameAlpha = 0.7;
        this.zoomable = false;
        this.panable = false;

        this.maxZoom = Infinity;    //Infinity 正无穷
        this.minZoom = 0;

        // Function
        // 返回false的方法，用于避免页面被选中
        function returnFalse() {
            return false;
        }
    },

    /**
     * Method: destroy
     * 销毁对象，释放资源。调用此函数后所有属性将被置为 null。
     */
    destroy: function() {
        this.dom = null;
        this.domBack = null;
        this.ctxBack = null;
        this.painter = null;
        this.unusedCount = null;
        this.config = null;
        this.dirty = null;
        this.elCount = null;
        this.clearColor = null;
        this.motionBlur = null;
        this.lastFrameAlpha = null;
        this.zoomable = null;
        this.panable = null;
        this.maxZoom = null;
        this.minZoom = null;
        this.ctx = null;

        SuperMap.LevelRenderer.Transformable.destroy.apply(this, arguments);
    },

    /**
     * Method: initContext
     * 初始化 Canvan 2D 上下文。
     */
    initContext: function(){
        this.ctx = this.dom.getContext('2d');
        if (SuperMap.LevelRenderer.Painter.devicePixelRatio != 1) {
            this.ctx.scale(SuperMap.LevelRenderer.Painter.devicePixelRatio, SuperMap.LevelRenderer.Painter.devicePixelRatio);
        }
    },

    /**
     * Method: createBackBuffer
     * 创建备份缓冲。
     */
    createBackBuffer: function(){
        this.domBack = SuperMap.LevelRenderer.Painter.createDom(SuperMap.Util.createUniqueID("SuperMap.Theme.back-" + this.id), 'canvas', this.painter);
        this.ctxBack = this.domBack.getContext('2d');

        if (SuperMap.LevelRenderer.Painter.devicePixelRatio != 1) {
            this.ctxBack.scale(SuperMap.LevelRenderer.Painter.devicePixelRatio, SuperMap.LevelRenderer.Painter.devicePixelRatio);
        }
    },

    /**
     * Method: resize
     * 改变大小。
     *
     * Parameters:
     * width - {Number} 宽。
     * height - {Number} 高。
     */
    resize: function(width, height){
        this.dom.style.width = width + 'px';
        this.dom.style.height = height + 'px';

        this.dom.setAttribute('width', width * SuperMap.LevelRenderer.Painter.devicePixelRatio);
        this.dom.setAttribute('height', height * SuperMap.LevelRenderer.Painter.devicePixelRatio);

        if (SuperMap.LevelRenderer.Painter.devicePixelRatio != 1) {
            this.ctx.scale(SuperMap.LevelRenderer.Painter.devicePixelRatio, SuperMap.LevelRenderer.Painter.devicePixelRatio);
        }

        if (this.domBack) {
            this.domBack.setAttribute('width', width * SuperMap.LevelRenderer.Painter.devicePixelRatio);
            this.domBack.setAttribute('height', height * SuperMap.LevelRenderer.Painter.devicePixelRatio);

            if (SuperMap.LevelRenderer.Painter.devicePixelRatio != 1) {
                this.ctxBack.scale(SuperMap.LevelRenderer.Painter.devicePixelRatio, SuperMap.LevelRenderer.Painter.devicePixelRatio);
            }
        }
    },

    /**
     * Method: clear
     * 清空该层画布。
     */
    clear: function(){
        var dom = this.dom;
        var ctx = this.ctx;
        var width = dom.width;
        var height = dom.height;

        var haveClearColor = this.clearColor;
        var haveMotionBLur = this.motionBlur;
        var lastFrameAlpha = this.lastFrameAlpha;

        if (haveMotionBLur) {
            if (!this.domBack) {
                this.createBackBuffer();
            }

            this.ctxBack.globalCompositeOperation = 'copy';
            dom.setAttribute('crossOrigin', 'anonymous');
            this.ctxBack.drawImage(
                dom, 0, 0,
                width / SuperMap.LevelRenderer.Painter.devicePixelRatio,
                height / SuperMap.LevelRenderer.Painter.devicePixelRatio
            );
        }

        if (haveClearColor) {
            ctx.save();
            ctx.fillStyle = this.config.clearColor;
            ctx.fillRect(
                0, 0,
                width / SuperMap.LevelRenderer.Painter.devicePixelRatio,
                height / SuperMap.LevelRenderer.Painter.devicePixelRatio
            );
            ctx.restore();
        }
        else {
            ctx.clearRect(
                0, 0,
                width / SuperMap.LevelRenderer.Painter.devicePixelRatio,
                height / SuperMap.LevelRenderer.Painter.devicePixelRatio
            );
        }

        if (haveMotionBLur) {
            var domBack = this.domBack;
            ctx.save();
            ctx.globalAlpha = lastFrameAlpha;
            domBack.setAttribute('crossOrigin', 'anonymous');
            ctx.drawImage(
                domBack, 0, 0,
                width / SuperMap.LevelRenderer.Painter.devicePixelRatio,
                height / SuperMap.LevelRenderer.Painter.devicePixelRatio
            );
            ctx.restore();
        }
    },

    CLASS_NAME: "SuperMap.LevelRenderer.Painter.Layer"
});

/**
 * Method: createDom
 * 创建 Dom。
 *
 * Parameters:
 * id - {String} Dom id
 * type - {String} Dom type
 * painter - {<SuperMap.LevelRenderer.Painter>} Painter 实例。
 *
 * Returns:
 * {Object} Dom
 */
SuperMap.LevelRenderer.Painter.createDom = function(id, type, painter){
    var newDom = document.createElement(type);
    var width = painter._width;
    var height = painter._height;

    // 没append呢，请原谅我这样写，清晰~
    newDom.style.position = 'absolute';
    newDom.style.left = 0;
    newDom.style.top = 0;
    newDom.style.width = width + 'px';
    newDom.style.height = height + 'px';
    newDom.setAttribute('width', width * SuperMap.LevelRenderer.Painter.devicePixelRatio);
    newDom.setAttribute('height', height * SuperMap.LevelRenderer.Painter.devicePixelRatio);

    // id不作为索引用，避免可能造成的重名，定义为私有属性
    //newDom.setAttribute('data-zr-dom-id', id);
    newDom.setAttribute('id', id);
    return newDom;
};

// retina 屏幕优化
SuperMap.LevelRenderer.Painter.devicePixelRatio =  Math.max((window.devicePixelRatio || 1), 1);