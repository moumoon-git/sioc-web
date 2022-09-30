import axios from 'axios';
let locationInfo = window.location;
let agreementStr = locationInfo.protocol.replace(':', '');
let agreement = agreementStr === 'https' ? 'https' : 'http';

function getAccessToken() {
    return new Promise((resolve, reject) => {
        axios({
            url: `${window.config.mapConfig.mapApiERIVCE_URL}/oauth/token`,
            method: 'get',
            params: {
                client_id: window.config.mapConfig.CLIENT_ID,
                client_secret: window.config.mapConfig.CLIENT_SCRECT,
            },
        }).then((res) => {
            // console.log(res);
            resolve(res.data);
        });
    });
}
/*
*      路劲规划
           百度需要服务端支持，高德API比较完善、webAPI直接前端调用就能使用，天地图只支持驾车和公交，20210407 11：11 公交示例接口500。
           将以高德作为主要数据来源
*          百度    http://lbsyun.baidu.com/index.php?title=webapi/directionlite-v1 公交、驾车、步行、骑行
*                  http://lbsyun.baidu.com/index.php?title=webapi/direction-api-truck 货车
*          高德    https://lbs.amap.com/api/webservice/guide/api/direction 公交、驾车、步行、骑行、货车
*          天地图  http://lbs.tianditu.gov.cn/server/guide.html 公交、驾车
*/
// 高德路径规划
let GDPath = {
        // 驾车规划
        drivePathFun(obj) {
            /*
            {
                origin:116.481028,39.989643       起点
                destination:116.434446,39.90816   终点
                waypoints:116.357483,39.907234    途径点
            }
            */
            let data = {
                key: window.config.mapConfig.mapBusinessAkey,
                extensions: 'all',
                strategy: 10 // 返回结果会躲避拥堵，路程较短，尽量缩短时间
            }
            Object.assign(data, obj)
            return axios({
                url: agreement + '://restapi.amap.com/v3/direction/driving',
                method: 'get',
                params: data
            })
        },
        // 公交规划
        transitPathFun(obj) {
            /*
                origin:116.481499,39.990475,
                destination:116.465063,39.999538,
                city:北京
            */
            let data = {
                key: window.config.mapConfig.mapBusinessAkey,
                output: 'JSON'
            }
            Object.assign(data, obj)
            return axios({
                url: agreement + '://restapi.amap.com/v3/direction/transit/integrated',
                method: 'get',
                params: data
            })
        },
        // 步行规划
        walkPathFun(obj) {
            /*
                origin:116.481499,39.990475,
                destination:116.465063,39.999538,
            */
            let data = {
                key: window.config.mapConfig.mapBusinessAkey,
                output: 'JSON'
            }
            Object.assign(data, obj)
            console.log(data);
            return axios({
                url: agreement + '://restapi.amap.com/v3/direction/walking',
                method: 'get',
                params: data
            })
        },
        // 骑行规划
        cyclingPathFun(obj) {
            /*
                origin:116.481499,39.990475,
                destination:116.465063,39.999538,
            */
            let data = {
                key: window.config.mapConfig.mapBusinessAkey,
                output: 'JSON'
            }
            Object.assign(data, obj)
            console.log(data);
            return axios({
                url: agreement + '://restapi.amap.com/v4/direction/bicycling',
                method: 'get',
                params: data
            })
        },
        // 货车规划
        truckPathFun(obj) {
            /*
                origin:116.481499,39.990475,
                destination:116.465063,39.999538,
                size:2  // 1：微型车，2：轻型车（默认值），3：中型车，4：重型车
            */
            let data = {
                key: window.config.mapConfig.mapBusinessAkey,
                output: 'JSON',
                size: 2
            }
            Object.assign(data, obj)
            console.log(data);
            return axios({
                url: agreement + '://restapi.amap.com/v4/direction/truck',
                method: 'get',
                params: data
            })
        }
    }
    /*
        http://restapi.amap.com/v3/direction/driving?
        key=2300898618f6ce0fa1527f4e76866162&
        origin=116.481028,39.989643&
        destination=116.434446,39.90816&
        waypoints=116.357483,39.907234&
    */
    // 天地图路径规划
let TDTPath = {
    // 驾车规划
    drivePathFun(obj) {
        /*
        {
            origin:116.481028,39.989643       起点
            destination:116.434446,39.90816   终点
            waypoints:116.357483,39.907234    途径点 "116.36506,39.91277;116.37506,39.92077"
            "style":"0" // 最快路线
        }
        */
        let data = {
            tk: window.config.mapConfig.tk,
            type: 'search',
            postStr: { "orig": obj.origin, "dest": obj.destination, "mid": obj.waypoints, "style": "0" }
        }
        Object.assign(data, obj)
        return axios({
            url: agreement + '://api.tianditu.gov.cn/drive',
            method: 'get',
            params: data
        })
    }
}

// 整理EGIS的数据
function handleEGISdata(data) {
    const promise = new Promise((resolve, reject) => {
        if (data.result) {
            let { destination } = data.result;
            let { origin } = data.result;
            const dataObj = {
                route: {
                    destination: `${destination.lng},${destination.lat}`,
                    origin: `${origin.lng},${origin.lat}`,
                    paths: [],
                }
            };
            if (data.result.routes) {
                dataObj.route.paths = data.result.routes.reduce((pre, ele) => {
                    let obj = {
                        distance: String(ele.distance),
                        duration: String(ele.duration),
                        restriction: "0",
                        tolls: String(ele.toll),
                        steps: [],
                    }
                    obj.steps = ele.steps.reduce((pres, x) => {
                        let objs = {
                            action: "",
                            assistant_action: [],
                            cities: [],
                            distance: String(x.distance),
                            duration: String(x.duration),
                            instruction: x.instruction,
                            orientation: "东",
                            polyline: x.path,
                            tmcs: [],
                            toll_distance: "0",
                            toll_road: [],
                            tolls: "0",
                            transFromLonLat: x.path,
                            transFromLonLatSpot: [],
                        };
                        let arr = x.path.split(';');
                        // 处理转换数据
                        objs.transFromLonLatSpot = arr.reduce((r, f) => {
                            let arrs = f.split(',');
                            let objx = {
                                x: Number(arrs[0]),
                                y: Number(arrs[1]),
                            }
                            r.push(objx);
                            return r
                        }, []);
                        pres.push(objs);
                        return pres;
                    }, []);
                    pre.push(obj);
                    return pre;
                }, [])
            }
            resolve({ data: dataObj });
        }
    });
    return promise;
}
// EGIS路径规划
let EGISPath = {
    // 驾车规划
    drivePathFun(obj) {
        /*
        {
            origin:116.481028,39.989643       起点
            destination:116.434446,39.90816   终点
            waypoints:116.357483,39.907234    途径点
        }
        */
        return new Promise((resolve, reject) => {
            getAccessToken().then((res) => {
                const data = {
                    client_id: window.config.mapConfig.CLIENT_ID,
                    access_token: res.access_token,
                    // key: window.config.mapConfig.mapBusinessAkey,
                    // extensions: 'all',
                    // strategy:0 // 返回结果会躲避拥堵，路程较短，尽量缩短时间
                };
                Object.assign(data, obj);
                axios({
                    url: `${window.config.mapConfig.MAPServerUrl}/egis/base/v1/wrps/driving`,
                    method: 'get',
                    params: data,
                }).then((result) => {
                    handleEGISdata(result.data).then(r => {
                        resolve(r);
                    });
                });
            });
        });
    },
    // 公交规划
    transitPathFun(obj) {
        /*
            origin:116.481499,39.990475,
            destination:116.465063,39.999538,
            city:北京
        */
        return new Promise((resolve, reject) => {
            getAccessToken().then((res) => {
                const data = {
                    client_id: window.config.mapConfig.CLIENT_ID,
                    access_token: res.access_token,
                    // key: window.config.mapConfig.mapBusinessAkey,
                    // extensions: 'all',
                    // strategy:0 // 返回结果会躲避拥堵，路程较短，尽量缩短时间
                };
                Object.assign(data, obj);
                axios({
                    url: `${window.config.mapConfig.MAPServerUrl}/egis/base/v1/wrps/transit`,
                    method: 'get',
                    params: data,
                }).then((result) => {
                    // handleEGISdata(result.data).then(r => {
                    resolve(result.data);
                    // });
                });
            });
        });
    },
    // 步行规划
    walkPathFun(obj) {
        /*
            origin:116.481499,39.990475,
            destination:116.465063,39.999538,
        */
        return new Promise((resolve, reject) => {
            getAccessToken().then((res) => {
                const data = {
                    client_id: window.config.mapConfig.CLIENT_ID,
                    access_token: res.access_token,
                    // key: window.config.mapConfig.mapBusinessAkey,
                    // extensions: 'all',
                    // strategy:0 // 返回结果会躲避拥堵，路程较短，尽量缩短时间
                };
                Object.assign(data, obj);
                axios({
                    url: `${window.config.mapConfig.MAPServerUrl}/egis/base/v1/wrps/walking`,
                    method: 'get',
                    params: data,
                }).then((result) => {
                    handleEGISdata(result.data).then(r => {
                        resolve(r);
                    });
                });
            });
        });
    },
    // 骑行规划
    cyclingPathFun(obj) {
        /*
            origin:116.481499,39.990475,
            destination:116.465063,39.999538,
        */
        return new Promise((resolve, reject) => {
            getAccessToken().then((res) => {
                const data = {
                    client_id: window.config.mapConfig.CLIENT_ID,
                    access_token: res.access_token,
                    // key: window.config.mapConfig.mapBusinessAkey,
                    // extensions: 'all',
                    // strategy:0 // 返回结果会躲避拥堵，路程较短，尽量缩短时间
                };
                Object.assign(data, obj);
                axios({
                    url: `${window.config.mapConfig.MAPServerUrl}/egis/base/v1/wrps/riding`,
                    method: 'get',
                    params: data,
                }).then((result) => {
                    handleEGISdata(result.data).then(r => {
                        resolve(r);
                    });
                });
            });
        });
    },
}



export default {
    GDPath,
    TDTPath,
    EGISPath,
}