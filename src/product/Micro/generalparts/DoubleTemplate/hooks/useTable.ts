import {
  ref,
} from 'vue';
import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import type { AxiosRequestConfigWithService } from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

export type TableSetting = {
  url: string,
  beforeRequest?: (request: AxiosRequestConfigWithService) => AxiosRequestConfigWithService,
  afterResponse?: (response: any) => {
    data: any[],
    totalPage: number,
  },
};

export default <T extends any>(tableSetting: TableSetting) => {
  const {
    url,
    beforeRequest,
    afterResponse,
  } = tableSetting;

  // 表格数据列表
  const tableData = ref<T[]>([]);

  // 请求参数
  // 请求节流
  const isLoading = ref(false);
  // 分组 id
  const groupIds = ref<number[]>([]);
  // 搜索关键词
  const keyword = ref('');
  // 每页数量
  const pageSize = ref(10);
  // 当前页码
  const curPage = ref(1);
  // 总数
  const totalCount = ref(0);

  const getTable = async (): Promise<void> => {
    const rawRequest = {
      method: 'POST' as const,
      service: 'soc',
      url,
      headers: { 'Content-Type': 'application/json' },
      data: {
        page: curPage.value,
        size: pageSize.value,
        limit: pageSize.value,
        name: keyword.value,
        search: keyword.value,
        groupIds: groupIds.value,
      },
    };
    const request = beforeRequest ? beforeRequest(rawRequest) : rawRequest;
    try {
      isLoading.value = true;
      const response = await $http(request);
      if (response.code === 0) {
        const rawData = afterResponse ? afterResponse(response) : response;
        tableData.value = rawData.data ?? [];
        totalCount.value = rawData.totalCount || 0;
      } else {
        throw Error(`代码${response.code}，${response.msg ?? response.message}`);
      }
    } catch (err) {
      ElMessage.error(`获取表格数据失败：${err}`);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    getTable,
    groupIds,
    tableData,
    keyword,
    pageSize,
    curPage,
    totalCount,
    isLoading,
  } as const;
};
