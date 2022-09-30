import {
  ref,
} from 'vue';
import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import type { AxiosRequestConfigWithService } from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

export type TreeSetting = {
  url: string,
  beforeRequest?: (request: AxiosRequestConfigWithService) => AxiosRequestConfigWithService,
  afterResponse?: (response: any) => {
    data: any[],
  },
};

export default <T extends any>(treeSetting: TreeSetting) => {
  const {
    url,
    beforeRequest,
    afterResponse,
  } = treeSetting;

  // 树形数据列表
  const treeData = ref<T[]>([]);

  // 请求参数
  // 请求节流
  const isLoading = ref(false);

  const getTree = async (): Promise<void> => {
    const rawRequest = {
      method: 'GET' as const,
      service: 'soc',
      url,
    };
    const request = beforeRequest ? beforeRequest(rawRequest) : rawRequest;
    try {
      isLoading.value = true;
      const response = await $http(request);
      if (response.code === 0) {
        const rawData = afterResponse ? afterResponse(response) : response;
        treeData.value = [{ name: '全部', id: 0 }, ...(rawData.data ?? [])];
      } else {
        throw Error(`代码${response.code}，${response.msg ?? response.message}`);
      }
    } catch (err) {
      ElMessage.error(`获取树形数据失败：${err}`);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    getTree,
    treeData,
    isLoading,
  } as const;
};
