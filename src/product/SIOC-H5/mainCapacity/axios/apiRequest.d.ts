import { AxiosRequestConfig } from 'axios';

interface AxiosRequestConfigWithService extends AxiosRequestConfig {
  service?: string,
}

const $axios: (options: AxiosRequestConfigWithService) => Promise<any>;

export default $axios;
