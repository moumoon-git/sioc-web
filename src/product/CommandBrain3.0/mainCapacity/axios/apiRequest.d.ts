import { AxiosRequestConfig } from 'axios';

export interface AxiosRequestConfigWithService extends AxiosRequestConfig {
  service?: string,
}

const $axios: (options: AxiosRequestConfigWithService) => Promise<any>;

export default $axios;
