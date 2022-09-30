﻿/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/REST/NetworkAnalyst3D/FacilityAnalystSinks3DEventArgs.js
 * @requires SuperMap/REST/NetworkAnalyst3D/FacilityAnalystSinks3DResult.js
 * @requires SuperMap/REST/NetworkAnalyst3D/FacilityAnalystSinks3DParameters.js
 * @requires SuperMap/ServiceBase.js
 * @requires SuperMap/ServiceFailedEventArgs.js
 */

/**
 * Class: SuperMap.REST.FacilityAnalystSinks3DService 
 * 最近设施分析服务类(汇查找资源)
 * 最近设施分析是指在网络上给定一个事件点和一组设施点，
 * 查找从事件点到设施点(或从设施点到事件点)以最小耗费能到达的最佳路径。
 * 该类负责将客户端指定的最近设施分析参数传递给服务端，并接收服务端返回的结果数据。
 * 最近设施分析结果通过该类支持的事件的监听函数参数获取，参数类型为 {<SuperMap.REST.FacilityAnalyst3DEventArgs>}; 获取的结果数据包括 originResult 、result 两种，
 * 其中，originResult 为服务端返回的用 JSON 对象表示的最近设施分析结果数据，result 为服务端返回的最近设施分析结果数据，保存在 {<SuperMap.REST.FacilityAnalyst3DResult>} 对象中。
 * 
 * Inherits from:
 *  - <SuperMap.ServiceBase> 
 */
SuperMap.REST.FacilityAnalystSinks3DService = SuperMap.Class(SuperMap.ServiceBase, {

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
     * {<SuperMap.Events>} 在 FacilityAnalystSinks3DService 类中处理所有事件的对象，支持两种事件 processCompleted 、processFailed ，服务端成功返回最近设施分析结果时触发 processCompleted  事件，服务端返回最近设施分析结果失败触发 processFailed 事件。
     * 
     * 例如：
     * (start code)     
     * var myFacilityAnalystSinks3DService = new SuperMap.REST.FacilityAnalystSinks3DService(url); 
     * myFacilityAnalystSinks3DService.events.on({
     *     "processCompleted": facilityAnalystSinks3DCompleted,
     *	   "processFailed": facilityAnalystSinks3DError
     *	   }
     *	);
     * function facilityAnalystSinks3DCompleted(facilityAnalystSinks3DEventArgs){//todo};
     * function facilityAnalystSinks3DError(facilityAnalystSinks3DEventArgs){//todo};
     * (end)     
     */ 
    events: null,
    
    /**
     * APIProperty: eventListeners
     * {Object} 监听器对象，在构造函数中设置此参数（可选），对 FacilityAnalystSinks3DService 支持的两个事件 processCompleted 、processFailed 进行监听，相当于调用 SuperMap.Events.on(eventListeners)。
     */
    eventListeners: null,

    /** 
     * Property: lastResult
     * {<SuperMap.REST.FacilityAnalystSinks3DService>} 服务端返回的最近设施分析结果数据。
     */
    lastResult: null,

    /**
     * Constructor: SuperMap.REST.FacilityAnalystSinks3DService
     * 最近设施分析服务类构造函数。     
     *
     * 例如：
     * (start code)     
     * var myFacilityAnalystSinks3DService = new SuperMap.REST.FacilityAnalystSinks3DService(url, {
     *     eventListeners: {
     *	       "processCompleted": facilityAnalystSinks3DCompleted,
     *		   "processFailed": facilityAnalystSinks3DError
     *		   }
     * });
     * (end)     
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
     * params - {<SuperMap.REST.FacilityAnalystSinks3DParameters>} 
     */
    processAsync: function(params) {
        if (!params) {
            return;
        }
        var me = this, jsonObject,
            end = me.url.substr(me.url.length - 1, 1);
        me.url = me.url + ((end === "/") ? "sinks" : "/sinks") + (this.isInTheSameDomain ? ".json?" : ".jsonp?");
        jsonObject = {
            edgeID: params.edgeID,
            nodeID: params.nodeID,
            weightName: params.weightName,
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
            FacilityAnalystSinks3DResult, fe;
        result = SuperMap.Util.transformResult(result);
        FacilityAnalystSinks3DResult = SuperMap.REST.FacilityAnalystSinks3DResult.fromJson(result);
        me.lastResult = FacilityAnalystSinks3DResult;
        fe = new SuperMap.REST.FacilityAnalystSinks3DEventArgs(FacilityAnalystSinks3DResult, result);
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
    
    CLASS_NAME: "SuperMap.REST.FacilityAnalystSinks3DService"
});