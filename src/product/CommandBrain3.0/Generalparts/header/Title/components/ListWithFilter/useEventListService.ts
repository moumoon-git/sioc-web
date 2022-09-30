import {
  ref,
  watch,
  nextTick,
} from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

// 响应状态
export const enum RES_STATUS {
  // 全部
  ALL = -1,
  // 未响应
  UN,
  // 正在响应
  ING,
  // 响应结束
  END,
}

export default () => {
  // 事件列表
  const eventList = ref<any[]>([]);

  // 事件总数
  const eventTotalCount = ref(0);

  // 事件类型 ID
  const eventTypeID = ref(0);

  // 事件列表总页数
  const totalPageCount = ref(0);

  // 当前事件列表页码
  const pageIndex = ref(1);

  // 搜索关键词
  const searchKeyword = ref('');

  // 响应状态
  const responseStatus = ref<RES_STATUS>(-1);

  const startTime = ref('');

  const endTime = ref('');

  // 是否需要清空列表
  const isPolluted = ref(false);

  // 筛选条件变更，重置参数
  watch([
    searchKeyword,
    responseStatus,
    startTime,
    endTime,
    eventTypeID,
  ], () => { isPolluted.value = true; });

  // 请求中
  const isLoading = ref(0);

  // 获取事件列表
  const getEventList = () => new Promise((resolve, reject) => {
    nextTick(() => {
      if (isPolluted.value) {
        eventList.value.length = 0;
        eventTotalCount.value = 0;
        totalPageCount.value = 0;
        pageIndex.value = 1;
        isPolluted.value = false;
      }
      const request = {
        method: 'POST',
        service: 'eoc',
        url: '/eos/event/listBy',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          page: pageIndex.value,
          name: searchKeyword.value,
          responseStatus: responseStatus.value,
          beginTime: startTime.value ? `${startTime.value} 00:00:00` : '',
          endTime: endTime.value ? `${endTime.value} 24:00:00` : '',
          caseClassId: eventTypeID.value ?? 0,
          reportType: 0,
          size: 12,
        },
      } as const;
      isLoading.value += 1;
      $http(request)
        .then((response) => {
          if (response.errorcode === 0) {
            eventList.value.push(...(response.data?.data ?? []));
            eventTotalCount.value = response.data?.totalElements ?? 0;
            totalPageCount.value = response.data?.totalPages ?? 0;
            resolve(response);
          } else {
            $message.error(`获取事件列表失败，错误代码${response.errorcode}，错误信息：${response.msg}`);
            reject(response);
          }
        })
        .catch((error: Error) => {
          $message.error(`获取事件列表失败，错误信息：${error}`);
          reject(error);
        })
        .finally(() => { isLoading.value -= 1; });
    });
  });

  // 初始执行一次
  getEventList();

  // 加载下一页数据
  const loadEventList = () => {
    if (pageIndex.value < totalPageCount.value) {
      pageIndex.value += 1;
      getEventList();
    }
  };

  const resetState = () => {
    eventList.value.length = 0;
    eventTypeID.value = 0;
    eventTotalCount.value = 0;
    totalPageCount.value = 1;
    pageIndex.value = 1;
    searchKeyword.value = '';
    responseStatus.value = -1;
    startTime.value = '';
    endTime.value = '';
    isLoading.value = 0;
  };

  return {
    searchKeyword,
    eventTotalCount,
    eventList,
    eventTypeID,
    isLoading,
    getEventList,
    loadEventList,
    responseStatus,
    startTime,
    endTime,
    resetState,
  };
};
