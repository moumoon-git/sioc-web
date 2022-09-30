/*
 * @Author: el
 * @Date: 2020-11-16 11:01:26
 * @LastEditTime: 2021-05-05 10:20:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import axios from 'axios';
import { Notify } from 'vant';
const androidToken = window.task?.getToken();
console.log('从安卓获取到的token', androidToken)
const $axios = function (options) {
  const promise = new Promise((resolve, reject) => {
    // 创建一个axios实例
    const obj = {
      baseURL: options.baseURL ? options.baseURL : window.config.baseURL,
      withCredentials: true,
      headers: options.headers ? options.headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformResponse: [],
      ...options,
      url: options.service ? window.config.service[options.service] + options.url : options.url,
      timeout: 30000
    };
    const instance = axios.create(obj);
    // console.log(obj);
    //   拦截器
    instance.interceptors.request.use(
      (config) => {
        const c = config;
        c.headers.token = localStorage.getItem('token') || androidToken || '';
        return c;
      }, // console.log(config);
      //   config.headers['token'] = this.$store.state.token
      (error) => reject(error), // console.log(error)
    );
    //  响应头拦截器
    instance.interceptors.response.use(
      (response) => {
        return response;
      }, (error) => {
        const responseBody = JSON.parse(error.request.response);
        // 未登录或登录失效，跳转登录页面
        if ('errorcode' in responseBody && (responseBody.errorcode === 401 || responseBody.code === 401)) {
          Notify({
            type: 'warning',
            message: `您未登录，请先登录`,
          });
          setTimeout(() => {
            window.location = window.config.loginURL;
          }, 800);
        } else {
          reject(error)
        }
      },
    );
    // 发送请求
    instance(obj)
      .then((res) => {
        // console.log(res)
        if (res.request) {
          if (res.request.readyState !== 4 || !res.request.readyState) {
            return reject(new Error('请求失败'));
          }
        }
        return resolve(JSON.parse(res.request.response));
      })
      .catch((err) => reject(new Error(err)));
  });
  return promise;
};

export default $axios;
