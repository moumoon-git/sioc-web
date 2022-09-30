/*
 * @Author: el
 * @Date: 2020-11-16 11:01:26
 * @LastEditTime: 2021-04-26 21:49:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \增城大屏\exhibition\src\utils\apiRequest.js
 */
import axios from 'axios';

// leiweijie的本地环境
if (process.env.VUE_APP_LOCAL_ENV === 'phy') {
  window.config.baseURL = 'http://192.168.1.189:8055';
  // window.config.baseURL = 'http://192.168.3.217:8055';
  // window.config.baseURL = 'http://192.168.3.43:8055';
}

const $axios = function(options) {
  const promise = new Promise((resolve, reject) => {
    // 创建一个axios实例
    const obj = {
      baseURL: options.baseURL ? options.baseURL : window.config.baseURL,
      withCredentials: true,
      headers: options.headers
        ? options.headers
        : { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformResponse: [],
      ...options,
      url: options.service ? window.config.service[options.service] + options.url : options.url,
      // timeout:3000
    };
    const instance = axios.create(obj);
    // console.log(obj);
    //   拦截器
    instance.interceptors.request.use(
      config => {
        const c = config;
        c.headers.token = window.globalToken || document.cookie.match(/token=([^;]*)/)?.[1];
        return c;
      }, // console.log(config);
      //   config.headers['token'] = this.$store.state.token
      error => reject(error), // console.log(error)
    );
    //  响应头拦截器
    instance.interceptors.response.use(
      response => {
        const responseBody = JSON.parse(response.request.response);
        // 未登录或登录失效，跳转登录页面
        if ('errorcode' in responseBody && responseBody.errorcode === 10002) {
          window.location = window.config.loginURL;
        }
        return response;
      },
      error => {
        // 未登录或登录失效，跳转登录页面
        if (String(error).includes('401')) {
          window.document.body.innerHTML = `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.15);padding:10px;border-radius:5px;">登录失效，正在重定向至<a href="${window.config.loginURL}">登录页</a>...</div>`;
          window.location = window.config.loginURL;
        }
        reject(error);
      },
    );
    // 发送请求
    instance(obj)
      .then(res => {
        if (res.request) {
          if (res.request.readyState !== 4 || !res.request.readyState) {
            return reject(new Error('请求失败'));
          }
        }
        return resolve(JSON.parse(res.request.response));
      })
      .catch(err => reject(new Error(err)));
  });
  return promise;
};

export default $axios;
