import http from './apiRequest';
import param from './proceParam';

const { config } = window;
const locationInfo = window.location;
const agreementStr = locationInfo.protocol.replace(':', '');
const agreement = agreementStr === 'https' ? 'https' : 'http';

const getRequire = {
    // 天地图获取点位置信息
    geocoder_default(data) {
        const reqData = {
            baseURL: agreement + '://api.tianditu.gov.cn',
            method: 'get',
            url: '/geocoder',
            params: param.adornParams(data),
            withCredentials: false,
        };
        return http(reqData);
    },
    // EGS获取秘钥信息
    geocoder_egisGetTk() {
        const reqData = {
            url: `${window.config.mapConfig.mapApiERIVCE_URL}/oauth/token`,
            method: 'get',
            params: {
                client_id: window.config.mapConfig.CLIENT_ID,
                client_secret: window.config.mapConfig.CLIENT_SCRECT,
            },
            withCredentials: false,
        };
        return http(reqData);
    },
    // EGS获取点位置信息
    geocoder_egis(data) {
        const reqData = {
            baseURL: window.config.mapConfig.MAPServerUrl,
            method: 'get',
            url: '/egis/base/v1/wrgs/regeocode',
            params: param.adornParams(data),
            withCredentials: false,
        };
        return http(reqData);
    },
    // 石景山项目获取点位置信息
    geocoder_sjs(data) {
        const reqData = {
            baseURL: 'http://172.26.60.65:6080',
            method: 'post',
            url: '/arcgis/rest/services/bjsjs_cache_84_xzqh/MapServer/Identify',
            data: param.adornData(data, true, 'data'),
            withCredentials: false,
        };
        return http(reqData);
    },
    // 高德逆地理编码
    geocoder_Gd(obj) {
        const data = {
            output: 'json',
            location: (`${obj.longitude},${obj.latitude}`),
            key: window.config.mapConfig.mapBusinessAkey,
            radius: 1000,
            extensions: 'all',
        };
        console.log('https:' === document.location.protocol ? 'https://restapi.amap.com' : 'http://restapi.amap.com')
        const reqData = {
            baseURL: 'https:' === document.location.protocol ? 'https://restapi.amap.com' : 'http://restapi.amap.com',
            method: 'get',
            url: '/v3/geocode/regeo',
            params: param.adornParams(data, true, 'data'),
            withCredentials: false,
        };
        return http(reqData);
    },
};
export default getRequire;