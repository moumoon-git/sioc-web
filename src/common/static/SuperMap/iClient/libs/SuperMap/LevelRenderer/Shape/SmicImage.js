/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * Class: SuperMap.LevelRenderer.Shape.SmicImage
 * 图片绘制。
 *
 * Inherits from:
 *  - <SuperMap.LevelRenderer.Shape>
 *
 * (code)
 *   var shape = new SuperMap.LevelRenderer.Shape.SmicImage({
 *         style: {
 *             image: 'test.jpg',
 *             x: 100,
 *             y: 100
 *         }
 *   });
 *   levelRenderer.addShape(shape);
 * (end)
 *
 */
SuperMap.LevelRenderer.Shape.SmicImage = SuperMap.Class(SuperMap.LevelRenderer.Shape, {

    /**
     * Property: style
     * {Object} 绘制样式。
     *
     * Symbolizer properties:
     * x - {Number} 左上角横坐标，必设参数。
     * y - {Number} 左上角纵坐标，必设参数。
     * image - {String/Cavans} 图片地址或cavans对象，必设参数。
     * width - {Number} 绘制到画布上的宽度，默认为图片高度。
     * height - {Number} 绘制到画布上的高度，默认为图片高度。
     * sx - {Number} 从图片中裁剪的左上角横坐标。
     * sy - {Number} 从图片中裁剪的左上角纵坐标。
     * sWidth - {Number} 从图片中裁剪的宽度，默认为图片高度。
     * sHeight - {Number} 绘制到画布上的高度，默认为图片高度。
     * opacity - {Number} 绘制透明度。默认值：1。
     * shadowBlur - {Number} 阴影模糊度，大于0有效。默认值：0。
     * shadowColor - {Number} 阴影颜色。默认值："#000000'"。
     * shadowOffsetX - {Number} 阴影横向偏移。默认值：0。
     * shadowOffsetY - {Number} 阴影纵向偏移。默认值：0。
     * text - {String} 图形中的附加文本。默认值：""。
     * textColor - {String} 文本颜色。默认值："#000000'"。
     * textFont - {String} 附加文本样式。示例:'bold 18px verdana'。
     * textPosition - {String} 附加文本位置。可设值："inside", "left", "right", top", "bottom", "end"。默认值："end"。
     * textAlign - {String} 附加文本水平对齐。可设值："start", "end", "left", "right", "center"。默认根据 textPosition 自动设置。
     * textBaseline - {String} 附加文本垂直对齐。可设值："top", "bottom", "middle", "alphabetic", "hanging", "ideographic"。默认根据 textPosition 自动设置。
     */
    //打开接口 style

    /**
     * Property: type
     * {String} 图形类型。
     */
    type: 'smicimage',

    /**
     * Property: _imageCache
     * {String} 图片缓存。
     */
    _imageCache: null,

    /**
     * Constructor: SuperMap.LevelRenderer.Shape.SmicImage
     * 构造函数。
     *
     * Parameters:
     * options - {Array} shape 的配置（options）项，可以是 shape 的自有属性，也可以是自定义的属性。
     *
     */
    initialize: function(options) {
        SuperMap.LevelRenderer.Shape.prototype.initialize.apply(this, arguments);
        if(!this.refOriginalPosition || this.refOriginalPosition.length !== 2) this.refOriginalPosition = [0, 0];
        this._imageCache = {};
    },

    /**
     * APIMethod: destroy
     * 销毁对象，释放资源。调用此函数后所有属性将被置为 null。
     */
    destroy: function() {
        this.type = null;
        this._imageCache = null;
        SuperMap.LevelRenderer.Shape.prototype.destroy.apply(this, arguments);
    },

    /**
     * APIMethod: buildPath
     * 创建图片。
     *
     * Parameters:
     * ctx - {CanvasRenderingContext2D} Context2D 上下文。
     * style - {Object} style。
     *
     */
    brush: function(ctx, isHighlight, refresh) {
        if(!this.refOriginalPosition || this.refOriginalPosition.length !== 2) this.refOriginalPosition = [0, 0];;
        var __OP = this.refOriginalPosition;

        var style = this.style || {};

        if (isHighlight) {
            // 根据style扩展默认高亮样式
            style = this.getHighlightStyle(
                style, this.highlightStyle || {}
            );
        }

        var image = style.image;
        var me = this;

        if (typeof(image) === 'string') {
            var src = image;
            if (this._imageCache[src]) {
                image = this._imageCache[src];
            } else {
                image = new Image();
                image.setAttribute('crossOrigin', 'anonymous');
                image.onload = function () {
                    image.onload = null;
                    clearTimeout(SuperMap.LevelRenderer.Shape.SmicImage._refreshTimeout);
                    SuperMap.LevelRenderer.Shape.SmicImage._needsRefresh.push(me);
                    // 防止因为缓存短时间内触发多次onload事件
                    SuperMap.LevelRenderer.Shape.SmicImage._refreshTimeout = setTimeout(function () {
                        refresh && refresh(SuperMap.LevelRenderer.Shape.SmicImage._needsRefresh);
                        // 清空 needsRefresh
                        SuperMap.LevelRenderer.Shape.SmicImage._needsRefresh = [];
                    }, 10);
                };

                image.src = src;
                this._imageCache[src] = image;
            }
        }
        if (image) {
            // 图片已经加载完成
            if (image.nodeName.toUpperCase() == 'IMG') {
                if (window.ActiveXObject) {
                    if (image.readyState != 'complete') {
                        return;
                    }
                }
                else {
                    if (!image.complete) {
                        return;
                    }
                }
            }
            // Else is canvas
            var width = style.width || image.width;
            var height = style.height || image.height;
            var x = style.x + __OP[0];
            var y = style.y + __OP[1];

            // 图片加载失败
            if (!image.width || !image.height) {
                return;
            }

            ctx.save();

            this.doClip(ctx);

            this.setContext(ctx, style);

            // 设置transform
            this.setTransform(ctx);

            if (style.sWidth && style.sHeight) {
                var sx = (style.sx + __OP[0]) || 0;
                var sy = (style.sy + __OP[1]) || 0;
                image.setAttribute('crossOrigin', 'anonymous');
                ctx.drawImage(
                    image,
                    sx, sy, style.sWidth, style.sHeight,
                    x, y, width, height
                );
            }
            else if (style.sx && style.sy) {
                var sx = style.sx  + __OP[0];
                var sy = style.sy  + __OP[1];
                var sWidth = width - sx;
                var sHeight = height - sy;
                image.setAttribute('crossOrigin', 'anonymous');
                ctx.drawImage(
                    image,
                    sx, sy, sWidth, sHeight,
                    x, y, width, height
                );
            }
            else {
                image.setAttribute('crossOrigin', 'anonymous');
                ctx.drawImage(image, x, y, width, height);
            }
            // 如果没设置宽和高的话自动根据图片宽高设置
            if (!style.width) {
                style.width = width;
            }
            if (!style.height) {
                style.height = height;
            }
            if (!this.style.width) {
                this.style.width = width;
            }
            if (!this.style.height) {
                this.style.height = height;
            }

            this.drawText(ctx, style, this.style);

            ctx.restore();
        }
    },

    /**
     * APIMethod: getRect
     * 计算返回图片的包围盒矩形。
     *
     * Parameters:
     * style - {Object} style
     *
     * Returns:
     * {Object} 边框对象。包含属性：x，y，width，height。
     */
    getRect: function(style) {
        if(!this.refOriginalPosition || this.refOriginalPosition.length !== 2) this.refOriginalPosition = [0, 0];;
        var __OP = this.refOriginalPosition;

        return {
            x: style.x  + __OP[0],
            y: style.y + __OP[1],
            width: style.width,
            height: style.height
        };
    },

    /**
     * APIMethod: clearCache
     * 清除图片缓存。
     *
     * Parameters:
     * style - {Object} style
     *
     * Returns:
     * {Object} 边框对象。包含属性：x，y，width，height。
     */
    clearCache: function() {
        this._imageCache = {};
    },

    CLASS_NAME: "SuperMap.LevelRenderer.Shape.SmicImage"
});

SuperMap.LevelRenderer.Shape.SmicImage._needsRefresh = [];
SuperMap.LevelRenderer.Shape.SmicImage._refreshTimeout = null;