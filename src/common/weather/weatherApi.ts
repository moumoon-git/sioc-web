const APIToken = 'nFe8q4YrUQeiHfQs';  // token
import axios from 'axios';
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const requestHost = 'https://api.caiyunapp.com';
/**
 * @路由传参格式 https://api.caiyunapp.com/v2.5/TAkhjf8d1nlSlspN/-74.0060,40.7128/weather.json?lang=en_US
 * @返回格式 必须，无缺省值，可选项目包括json 或者 jsonp，jsonp 需提供回调函数名
 * @param lnglat 经纬度：必须，无缺省值，经度在前，纬度在后，中间用半角逗号隔开，如 118.266637,26.150279
 * @param lang 语言选项 lang: 可选，缺省值是 zh_CN，可选项目包括简体中文（zh_CN，默认）、繁体中文（zh_TW）、美式英语（en_US）、英式英语（en_GB）、日语（ja）
 * @param unit 单位制选项 unit: 可选，缺省值是 metric，可选项目包括公制metric，英制imperial，和科学单位制 SI
 * @param hourlysteps 小时步长选项 hourlysteps: 可选，缺省值是 48，选择范围 1 ~ 360
 * @param dailysteps 天步长选项 dailysteps: 可选，缺省值是 5，选择范围 1 ~ 15
 * @param alert 预警信息 alert：可选，缺省值是 false，选择范围 true 或者 false
 */
interface params1 {
  'lnglat': string,
  'lang': string,
  'unit': string,
  'hourlysteps': number,
  'dailysteps': number,
  'alert': boolean,
}

/**
 * @description 通用预报接口
 * @url API地址： https://open.caiyunapp.com/通用预报接口/v2.5
 */
function getCommonWeather(lnglat: string, option: any) {
  return new Promise((resolve, reject) => {
    axios({
      url: environment === 'production' ? `${(window as any).config.proxyURL || requestHost}/v2.5/${APIToken}/${lnglat}/weather.json` : `/caiyun/v2.5/${APIToken}/${lnglat}/weather.json`,
      // url: `/caiyun/v2.5/${APIToken}/${lnglat}/weather.json`, // 测试环境使用
      method: 'get',
      params: option,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      responseType: 'json',
    }).then((res: any) => {
      resolve(res)
    }).catch((error: any) => {
      reject(error)
    })
  })
}

/**
 * @路由传参格式 https://api.caiyunapp.com/v2.5/TAkhjf8d1nlSlspN/-74.0060,40.7128/weather.json?lang=en_US
 * @返回格式 必须，无缺省值，可选项目包括json 或者 jsonp，jsonp 需提供回调函数名
 * 以下是option的键名
 * @param lnglat 经纬度：必须，无缺省值，经度在前，纬度在后，中间用半角逗号隔开，如 118.266637,26.150279
 * @param lang 语言选项 lang: 可选，缺省值是 zh_CN，可选项目包括简体中文（zh_CN，默认）、繁体中文（zh_TW）、美式英语（en_US）、英式英语（en_GB）、日语（ja）
 * @param unit 单位制选项 unit: 可选，缺省值是 metric，可选项目包括公制metric，英制imperial，和科学单位制 SI
 * @param dailysteps 天步长选项 dailysteps: 可选，缺省值是 5，选择范围 1 ~ 15
 * @description 天级预报接口
 * @url API地址： https://open.caiyunapp.com/天级预报接口/v2.5
 */
function getDailyWeather(lnglat: string, option: any) {
  return new Promise((resolve, reject) => {
    axios({
      url: environment === 'production' ? `${(window as any).config.proxyURL || requestHost}/v2.5/${APIToken}/${lnglat}/daily.json` : `/caiyun/v2.5/${APIToken}/${lnglat}/daily.json`,
      // url: `/caiyun/v2.5/${APIToken}/${lnglat}/daily.json`, // 测试环境使用
      method: 'get',
      params: option,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      responseType: 'json',
    }).then((res: any) => {
      resolve(res)
    }).catch((error: any) => {
      reject(error)
    })
  })
}


/**
 * 请求参数
 * @param lnglat 经纬度：必须，无缺省值，经度在前，纬度在后，中间用半角逗号隔开，如 121.6544,25.1552
 * @返回格式 必须，无缺省值，可选项目包括json 或者 jsonp，jsonp 需提供回调函数名
 * @param lang 语言选项 lang: 可选，缺省值是 zh_CN，可选项目包括简体中文（zh_CN，默认）、繁体中文（zh_TW）、美式英语（en_US）、英式英语（en_GB）、日语（ja）
 * @param unit 单位制选项 unit: 可选，缺省值是 metric， 可选项目包括公制metric，英制imperial，和科学单位制 SI
 * @param hourlysteps 小时步长选项 hourlysteps: 可选，缺省值是 48， 选择范围 1 ~ 360
 * @description 小时级预报接口
 * @url API地址： https://open.caiyunapp.com/小时级预报接口/v2.5
 */
function getHourlyWeather(lnglat: string, option: any) {
  return new Promise((resolve, reject) => {
    axios({
      url: environment === 'production' ? `${(window as any).config.proxyURL || requestHost}/v2.5/${APIToken}/${lnglat}/hourly.json` : `/caiyun/v2.5/${APIToken}/${lnglat}/hourly.json`,
      // url: `/caiyun/v2.5/${APIToken}/${lnglat}/hourly.json`, // 测试环境使用
      method: 'get',
      params: option,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      responseType: 'json',
    }).then((res: any) => {
      resolve(res)
    }).catch((error: any) => {
      reject(error)
    })
  })
}


export default {
  getCommonWeather, getDailyWeather, getHourlyWeather
}
