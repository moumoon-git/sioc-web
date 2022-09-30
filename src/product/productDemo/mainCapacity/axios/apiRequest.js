/*
 * @Author: el
 * @Date: 2020-11-16 11:01:26
 * @LastEditTime: 2021-04-02 16:14:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import axios from 'axios';

const $axios = function (options) {
  const promise = new Promise((resolve, reject) => {
    // 创建一个axios实例
    const obj = {
      baseURL: options.baseURL ? options.baseURL : window.config.baseURL,
      withCredentials: true,
      headers: options.headers ? options.headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformResponse: [],
      // timeout:3000
    };
    const instance = axios.create(obj);
    // console.log(obj);
    //   拦截器
    instance.interceptors.request.use(
      (config) => {
        const c = config;
        c.headers.token = 'PC_756bb5a0edb7bd2959b89a1e376ae49b';
        return c;
      }, // console.log(config);
      //   config.headers['token'] = this.$store.state.token
      (error) => reject(error), // console.log(error)
    );
    //  响应头拦截器
    instance.interceptors.response.use(
      (response) => {
        const responseBody = JSON.parse(response.request.response);
        if (responseBody.code === 401) {
          console.log('请求错误');
        }
        return response;
      }, (error) => reject(error),
    );
    // 发送请求
    instance(options)
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
