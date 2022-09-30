import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

interface HTTPRequestConfig extends AxiosRequestConfig {
  service?: string,
}

function $axios(_config: HTTPRequestConfig): AxiosPromise<any> {
  const request = {
    baseURL: window.microProps.baseURL,
    headers: {
      token: window.microProps.token,
    },
    ..._config,
  };
  if (!request.headers.token) {
    request.headers.token = window.microProps.token;
  }
  return axios(request);
}

export default $axios;
