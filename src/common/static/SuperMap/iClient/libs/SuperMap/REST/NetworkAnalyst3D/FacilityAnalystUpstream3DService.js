/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/


/**
 * Class: SuperMap.REST.FacilityAnalystUpstream3DService 
 * 上游关键设施查找资源服务类
 * Inherits from:
 *  - <SuperMap.ServiceBase> 
 */
SuperMap.REST.FacilityAnalystUpstream3DService = SuperMap.Class(SuperMap.ServiceBase, {

    /**
     * Constant: EVENT_TYPES
     * {Array(String)}
     * 此类支持的事件类型。
     * - *processCompleted* 服务端返回最近设施分析结果触发该事件。 
     * - *processFailed* 服务端返回最近设施分析结果失败触发该事件。       
     */
    EVENT_TYPES: [ 
        "processCompleted", "processFailed"],
    
     /**
     * APIProperty: events
     * {<SuperMap.Events>} 在 FacilityAnalystUpstream3DService 类中处理所有事件的对象，支持两种事件 processCompleted 、processFailed ，服务端成功返回最近设施分析结果时触发 processCompleted  事件，服务端返回最近设施分析结果失败触发 processFailed 事件。
     *   
     */ 
    events: null,
    
    /**
     * APIProperty: eventListeners
     * {Object} 监听器对象，在构造函数中设置此参数（可选）
	 */
    eventListeners: null,

    /** 
     * Property: lastResult
     * {<SuperMap.REST.FacilityAnalystUpstream3DResult>} 服务端返回的结果数据。  
     */
    lastResult: null,

    /**
     * Constructor: SuperMap.REST.FacilityAnalystUpstream3DService 
     * 上游关键设施查找资源服务类构造函数。     
     *
     * Parameters:
     * url - {String} 网络分析服务地址。请求网络分析服务，URL应为：
     * http://{服务器地址}:{服务端口号}/iserver/services/{网络分析服务名}/rest/networkanalyst/{网络数据集@数据源}；
     * 例如:"http://localhost:8090/iserver/services/components-rest/rest/networkanalyst/RoadNet@Changchun"。
     * options - {Object} 参数。     
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
     
    initialize: function(url, options) {
        SuperMap.ServiceBase.prototype.initialize.apply(this, arguments);
        var me = this;
        if (options) {
            SuperMap.Util.extend(me, options);
        }
        me.events = new SuperMap.Events(
            me, null, me.EVENT_TYPES, true
        );
        if (me.eventListeners instanceof Object) {
            me.events.on(me.eventListeners);
        }
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用的资源属性置空。  
     */
    destroy: function() { 
        SuperMap.ServiceBase.prototype.destroy.apply(this, arguments); 
        var me = this;
        me.EVENT_TYPES = null;
        me.events = null;
        me.eventListeners = null;
        if (me.lastResult) {
            me.lastResult.destroy();
            me.lastResult = null;
        }
    },
    
    /**
     * APIMethod: processAsync
     * 负责将客户端的查询参数传递到服务端。
     *
     * Parameters:
     * params - {<SuperMap.REST.FacilityAnalystUpstream3DParameters>} 
     */
    processAsync: function(params) {
        if (!params) {
            return;
        }
        var me = this, jsonObject,
            end = me.url.substr(me.url.length - 1, 1);
        me.url = me.url + ((end === "/") ? "upstreamcirticalfaclilities" : "/upstreamcirticalfaclilities") + (this.isInTheSameDomain ? ".json?" : ".jsonp?");
        jsonObject = {
			sourceNodeIDs: params.sourceNodeIDs,
            edgeID: params.edgeID,
            nodeID: params.nodeID,
			isUncertainDirectionValid: params.isUncertainDirectionValid
        };    
        me.request({
            method: "GET",
            params: jsonObject,
            scope: me,
            success: me.findClosestFacilityComplete,
            failure: me.findClosestFacilityError
        });
    },
    
    /**
     * Method: findClosestFacilityComplete
     * 最近设施完成，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    findClosestFacilityComplete: function(result) {
        var me = this,
            FacilityAnalystUpstream3DResult, fe;
        result = SuperMap.Util.transformResult(result);
        FacilityAnalystUpstream3DResult = SuperMap.REST.FacilityAnalystUpstream3DResult.fromJson(result);
        me.lastResult = FacilityAnalystUpstream3DResult;
        fe = new SuperMap.REST.FacilityAnalystUpstream3DEventArgs(FacilityAnalystUpstream3DResult, result);
        me.events.triggerEvent("processCompleted", fe);
    },
    
    /**
     * Method: findClosestFacilityError
     * 最近设施失败，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    findClosestFacilityError: function(result) {
        var me = this,
            error = null,
            serviceException = null,
            se = null;
        result = SuperMap.Util.transformResult(result);
        error = result.error;
        if (!error) {
            return;
        }
        serviceException = SuperMap.ServiceException.fromJson(error);        
        se = new SuperMap.ServiceFailedEventArgs(serviceException, result);
        me.events.triggerEvent("processFailed", se);
    },
    
    CLASS_NAME: "SuperMap.REST.FacilityAnalystUpstream3DService"
});