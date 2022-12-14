/*
 * @Author: el
 * @Date: 2020-11-16 11:01:26
 * @LastEditTime: 2021-04-02 16:14:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import axios from 'axios';

const $axios = function(options) {
    const promise = new Promise((resolve, reject) => {
        // 创建一个axios实例
        const obj = {
            baseURL: options.baseURL ? options.baseURL : window.config.baseURL,
            withCredentials: true,
            headers: options.headers ? options.headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformResponse: [],
            ...options,
            url: options.service ? window.config.service[options.service] + options.url : options.url,
            // timeout:3000
        };
        const instance = axios.create(obj);
        // console.log(obj);
        //   拦截器
        instance.interceptors.request.use(
            (config) => {
                const c = config;
                const cookieVal = (document.cookie.match(/token=([^;]*)/) ? document.cookie.match(/token=([^;]*)/)[1] : '')
                console.log(cookieVal);
                c.headers.token = c.headers.token || cookieVal && cookieVal !== 'undefined' ? cookieVal : "" || window.TOKEN;
                return c;
            }, // console.log(config);
            //   config.headers['token'] = this.$store.state.token
            (error) => reject(error), // console.log(error)
        );
        //  响应头拦截器
        instance.interceptors.response.use(
            (response) => {
                // console.log(response);
                // 不是二进制流、文件类型的
                if (!response.headers['content-disposition']) {
                    const responseBody = JSON.parse(response.request.response);
                    // console.log(responseBody);
                    // 未登录或登录失效，跳转登录页面
                    if ('errorcode' in responseBody && responseBody.errorcode === 10002) {
                        window.location.href = window.config.loginURL;
                    }
                }
                return response;
            }, (error) => {
                // 未登录或登录失效，跳转登录页面
                if (String(error).includes('401')) {
                    window.location = window.config.loginURL;
                }
                reject(error);
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