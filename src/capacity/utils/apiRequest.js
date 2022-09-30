/*
 * @Author: el
 * @Date: 2020-11-16 11:01:26
 * @LastEditTime: 2021-04-02 15:39:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \增城大屏\exhibition\src\utils\apiRequest.js
 */
import axios from 'axios'

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    // 创建一个axios实例
    const obj = {
      baseURL: options.baseURL ? options.baseURL : window.config.serverUrl,
      withCredentials: true,
      headers: options.headers ? options.headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformResponse: [function () {}]
      // timeout:3000
    }
    const instance = axios.create(obj)
    // console.log(obj);
    //   拦截器
    instance.interceptors.request.use(
      config => {
        // console.log(config);
        //   config.headers['token'] = this.$store.state.token
        return config
      },
      error => {
        // console.log(error)
        return Promise.reject(error)
      }
    )
    //  响应头拦截器
    instance.interceptors.response.use(
      response => {
        const responseBody = JSON.parse(response.request.response)
        if (responseBody.code == 401) {
          console.log('请求错误')
        }
        return response
      }, error => {
        return Promise.reject(error)
      })
    // 发送请求
    instance(options)
      .then((res) => {
        // console.log(res)
        if (res.request) {
          if (res.request.readyState != 4 || !res.request.readyState) {
            return reject('请求失败')
          }
        }
        return resolve(JSON.parse(res.request.response))
      })
      .catch((err) => {
        // console.log(err)
        return reject(err)
      })
  })
}
