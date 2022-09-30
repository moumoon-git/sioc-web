/*
 * @Author: el
 * @Date: 2021-01-06 10:52:58
 * @LastEditTime: 2021-02-24 10:26:37
 * @LastEditors: Please set LastEditors
 * @Description:
 *      集成了百度、高德、天地图   POI搜索、逆地理解析、路劲规划
 *    考虑到项目可能会用到token，为了确保请求头的纯洁性，在这个js下的请求统一使用最原始的axios，
 *    不进行其他限制操作，完全按照集成的第三方数据接口文档进行请求
 *
 *      POI搜索文档：
 *          百度    http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi#service-page-anchor-1-0
 *          高德    https://lbs.amap.com/api/webservice/guide/api/search#text
 *          天地图  http://lbs.tianditu.gov.cn/server/search.html
 *
 *      逆地理解析
 *          百度    http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding-abroad
 *          高德    https://lbs.amap.com/api/webservice/guide/api/georegeo#regeo
 *          天地图  http://lbs.tianditu.gov.cn/server/geocoding.html
 *      路劲规划
 *          百度    http://lbsyun.baidu.com/index.php?title=webapi/directionlite-v1 公交、驾车、步行、骑行
 *                  http://lbsyun.baidu.com/index.php?title=webapi/direction-api-truck 货车
 *          高德    https://lbs.amap.com/api/webservice/guide/api/direction 公交、驾车、步行、骑行、货车
 *          天地图  http://lbs.tianditu.gov.cn/server/guide.html 公交、驾车
 *
 * @FilePath: \exhibition2\src\assets\js\mapJs\integration.js
 */
import axios from 'axios';
import { jsonp } from 'vue-jsonp';
import LonLatT from './LonLatTransform';
// 国家大地2000坐标系的全国范围
const scope = '73.11358842147085,2.7709995440642428,135.50964026896452, 53.77444985520712';
let counts = 0;
const locationInfo = window.location;
const agreementStr = locationInfo.protocol.replace(':', '');
const agreement = agreementStr === 'https' ? 'https' : 'http';
/**
 * @Description: el
 * @Date: 2021-01-06 16:16:27
 * @param {*} data Array
 * @description: 处理数据格式,并且进行坐标转换
 * @LastEditors: Seven
 * @LastEditTime: Do not edit
 */
function handleMapPOISearchData(data, mapType) {
    const resultsData = data.reduce((pre, ele, i) => {
        const lonlat = typeof ele.location === 'object' ? `${ele.location ? ele.location.lng : ''},${ele.location ? ele.location.lat : ''}` : ele.location ? ele.location : ele.lonlat ? ele.lonlat.split(' ').join(',') : '';
        const transFromLonLat = LonLatT.LonLatTransform(lonlat, mapType);
        // console.log(transFromLonLat);
        const obj = {
            address: ele.address,
            name: ele.name,
            location: lonlat,
            transFromLonLat,
            area: ele.area ? ele.area : (ele.adname ? ele.adname : ''),
            city: ele.city ? ele.city : (ele.cityname ? ele.cityname : ''),
            province: ele.province ? ele.province : (ele.pname ? ele.pname : ''),
            tel: ele.tel ? ele.tel : '',
            phone: ele.phone ? ele.phone : '',
            photos: ele.photos ? ele.photos : [],
            id: (i + 1),
        };
        pre.push(obj);
        return pre;
    }, []);
    return resultsData;
}
// 百度搜索接口
function bdPOISearch(key) {
    return new Promise((resolve, reject) => {
        jsonp('http://api.map.baidu.com/place/v2/search', {
            ak: window.config.mapConfig.mapBusinessAkey,
            query: key,
            region: '全国',
            output: 'json',
            scope: 2,
            page_size: 20,
        }).then((res) => {
            resolve(res);
        });
    });
}
// 高德搜索接口
function gdPOISearch(key, city = '', num = 0, obj) {
    return new Promise((resolve, reject) => {
        axios({
            url: agreement + '://restapi.amap.com/v3/place/text',
            method: 'get',
            params: {
                key: window.config.mapConfig.mapBusinessAkey,
                city,
                keywords: key,
                children: 1,
                offset: 40,
                page: obj.page || 1,
                extensions: 'all',
            },
        }).then((res) => {
            const data = res.data || [];
            if (data.pois && data.pois.length === 0 && data.suggestion.cities.length !== 0 && num === 0) {
                // 020
                resolve(gdPOISearch(key, obj.city, num + 1, obj));
            } else {
                resolve(data);
            }
        });
    });
}
// 高德范围搜索接口
function rangeSearch(key, polygon = '') {
    return new Promise((resolve, reject) => {
        axios({
            url: agreement + '://restapi.amap.com/v3/place/polygon',
            method: 'get',
            params: {
                key: window.config.mapConfig.mapBusinessAkey,
                polygon,
                keywords: key,
                children: 1,
                offset: 40,
                page: 1,
                extensions: 'all',
            },
        }).then((res) => {
            const data = res.data || [];
            resolve(data);
        });
    });
}
// 天地图搜索接口
function tdtPOISearch(key, mapBound, obj) {
    return new Promise((resolve, reject) => {
        counts++;
        axios({
            url: agreement + '://api.tianditu.gov.cn/search',
            method: 'get',
            params: {
                postStr: {
                    keyWord: key,
                    level: '7',
                    mapBound,
                    queryType: '1',
                    count: '40',
                    start: '0',
                },
                type: 'query',
                tk: window.config.mapConfig.mapBusinessAkey,
            },
        }).then((res) => {
            if (res.data.pois) {
                resolve(res.data);
            } else {
                if (counts >= 2) {
                    resolve(res.data);
                } else {
                    // 没有结果时进行全局检索
                    resolve(tdtPOISearch((obj.city + key), scope, obj));
                }
            }
        });
    });
}

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

// EGIS搜索
function egisPOISearch(key, bounds, obj) {
    return new Promise((resolve, reject) => {
        counts++;
        getAccessToken().then((res) => {
            axios({
                url: `${window.config.mapConfig.MAPServerUrl}/egis/base/v1/wpss/keydatapoi`,
                method: 'get',
                params: {
                    keyword: key,
                    bounds,
                    page_size: 40,
                    page_num: obj.page || 0,
                    level: 1,
                    query_type: 2,
                    client_id: window.config.mapConfig.CLIENT_ID,
                    access_token: res.access_token,
                },
            }).then((r) => {
                if (r.data && r.data.result) {
                    const data = r.data.result ? r.data.result.pois : [];
                    if (data.length !== 0) {
                        data.forEach(e => {
                            e.phone = e.telephone;
                        });
                        resolve(r.data.result);
                    } else if (!r.data.result.pois) {
                        resolve(egisPOISearch((obj.city + key), scope, obj));
                    }
                } else {
                    if (counts >= 2) {
                        resolve([]);
                    } else {
                        // 没有结果时进行全局检索
                        resolve(egisPOISearch((obj.city + key), scope, obj));
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    });
}

/**
 * @Description: el
 * @Date: 2021-01-06 15:10:30
 * @param {*} key       // 搜索关键字
 * @param {*} mapType   // 地图类型
 * @description:
 * @LastEditors: Seven
 * @LastEditTime: Do not edit
 */
function mapPOISearchHandleData(key, mapType, bounds, obj) {
    counts = 0;
    const reg = /(省|市|区|县|镇)/gi;
    const diffArr = key.match(reg);
    let bound = bounds;
    // 包含省市区县镇字符的切换范围为全国范围,否则进行范围检索
    if (diffArr && diffArr.length !== 0) {
        bound = scope;
    }
    switch (mapType) {
        case 'BD':
            // 百度
            return bdPOISearch(key);
        case 'TDT':
            // 天地图
            return tdtPOISearch(key, bound, obj);
        case 'EGIS':
            // EGIS
            return egisPOISearch(key, (window.config.mapConfig.bounds || bounds), obj);
        default:
            // 默认高德
            return gdPOISearch(key, '', 0, obj);
    }
}

/**
 * 范围搜索
 * @Description: el
 * @Date: 2021-01-06 15:10:30
 * @param {*} key       // 搜索关键字
 * @param {*} mapType   // 地图类型
 * @param {*} bounds    // 搜索范围
 * @param {*} obj       // 城市或者其他参数
 * @description:
 * @LastEditors: Seven
 * @LastEditTime: Do not edit
 */
function mapRangeSearchHandleData(key, mapType, bounds, obj) {
    switch (mapType) {
        case 'EGIS':
            return egisPOISearch(key, bounds, obj);
        default:
            // 默认高德
            return rangeSearch(key, bounds);
    }
}

/**
 * 范围搜索
 * @Description: el
 * @Date: 2021-01-06 15:10:30
 * @param {*} key       // 搜索关键字
 * @param {*} mapType   // 地图类型
 * @param {*} bounds    // 搜索范围
 * @param {*} obj       // 城市或者其他参数
 * @description:
 * @LastEditors: Seven
 * @LastEditTime: Do not edit
 */
function mapRangeSearch(key, mapType, bounds, obj) {
    return new Promise((resolve, reject) => {
        mapRangeSearchHandleData(key, mapType, bounds, obj).then((res) => {
            console.log(res);
            let data = [];
            if (res.results && res.results.length !== 0) {
                data = res.results;
            }
            if (res.pois && res.pois.length !== 0) {
                data = res.pois;
            }
            if (data.length === 0 || !data) {
                resolve(data);
                return;
            }
            const resData = handleMapPOISearchData(data, mapType);
            resolve(resData);
        }).catch(() => {
            reject();
        });
    });
}

/**
 * @Description: el
 * @Date: 2021-01-06 15:10:08
 * @param {*} key       // 搜索关键字
 * @param {*} mapType   // 地图类型
 * @description:
 * @LastEditors: Seven
 * @LastEditTime: Do not edit
 */
function mapPOISearch(key, mapType, bounds, obj) {
    return new Promise((resolve, reject) => {
        mapPOISearchHandleData(key, mapType, bounds, obj).then((res) => {
            console.log(res);
            let data = [];
            if (res.results && res.results.length !== 0) {
                data = res.results;
            }
            if (res.pois && res.pois.length !== 0) {
                data = res.pois;
            }
            if (data.length === 0 || !data) {
                resolve(data);
                return;
            }
            const resData = handleMapPOISearchData(data, mapType);
            resolve(resData);
        }).catch(() => {
            reject();
        });
    });
}



export default {
    mapPOISearch,
    mapRangeSearch,
};
