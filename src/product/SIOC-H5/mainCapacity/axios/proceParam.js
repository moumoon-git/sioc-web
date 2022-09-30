/*
 * @Author: your name
 * @Date: 2020-11-16 14:59:00
 * @LastEditTime: 2021-04-26 14:09:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \增城大屏\exhibition\src\utils\proceParam.js
 */
import qs from 'qs';
import merge from 'lodash/merge';

const proceParam = {};
/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
proceParam.adornParams = (params = {}, openDefultParams = true) => {
  const defaults = {
    t: new Date().getTime(),
  };
  return openDefultParams ? merge(defaults, params) : params;
};

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
proceParam.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  let datas = data;
  const defaults = {
    t: new Date().getTime(),
  };
  datas = openDefultdata ? merge(defaults, datas) : datas;
  return contentType === 'json' ? JSON.stringify(datas) : qs.stringify(datas);
};

export default proceParam;
