import { useStore } from 'vuex';
import {
  ref,
  Ref,
} from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

export interface RoutesRecordItem {
  contactorId: number,
  deviceId: number,
  eventId: number
  id: number
  latitude: number
  longitude: number
  platformId: number
  reportTime: string
  resultId: number
  type: number
  deviceType: number
}

export const today = `${
  (new Date()).getFullYear()
}-${
  String((new Date()).getMonth() + 1).padStart(2, '0')
}-${
  String((new Date()).getDate()).padStart(2, '0')
}`;

// 全局单例的 Ajax 请求参数
export const requestOptions = ref<{
  date?: string,
  contactorId?: number,
  eventId?: number,
  deviceId?: number,
}>({});

/**
 * 获取记录项的任务反馈详情
 */
export const getRoutesRecordTaskDetail = (resultId: number | string): Promise<any> => new Promise((resolve) => {
  const request = {
    method: 'POST',
    service: 'eoc',
    url: '/event/task/getTaskDistributionResultDetail',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      resultId,
    },
  } as const;
  $http(request).then((response) => {
    if (response.errorcode === 0 || response.code === 0) {
      resolve(response.data);
    } else {
      $message.error(`获取任务详情失败，错误代码${response.errorcode ?? response.code}，错误信息：${response.msg ?? response.message}`);
    }
  }).catch((error: Error) => {
    $message.error(`获取任务详情失败，错误信息：${error}`);
  });
});

export default (): [
  routesRecord: Ref<RoutesRecordItem[]>,
  getRoutesRecord: (options: {
    date?: string,
    contactorId?: number,
    eventId?: number,
    deviceId?: number,
  }) => void,
] => {
  const store = useStore();
  const routesRecord = ref<RoutesRecordItem[]>([]);
  function getRoutesRecord(options: {
    date?: string,
    contactorId?: number,
    eventId?: number,
    deviceId?: number,
  } = {}): void {
    const request = {
      method: 'post',
      service: 'eoc',
      url: '/reportLoaction/getLocationTrace',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        // 轨迹类型，0-人员，1-设备
        type: requestOptions.value.contactorId || options.contactorId ? 0 : 1,
        date: today,
        eventId: store.state.event?.id,
        ...requestOptions.value,
        ...options,
        // TODO 测试写死的数据
        // type: 0,
        // date: '2021-07-29',
        // // contactorId: 18736,
        // contactorId: 18731,
        // eventId: 851,
      },
    } as const;
    $http(request).then((response) => {
      if (response.code === 0 || response.errorcode === 0) {
        routesRecord.value = response.data || [];
      } else {
        $message.error(`获取轨迹记录失败，错误代码${
          response.code ?? response.errorcode
        }，错误信息：${
          response.msg ?? response.message
        }`);
      }
    }).catch((error: Error) => {
      $message.error(`获取轨迹记录失败，错误信息：${error}`);
    });
  }
  return [
    routesRecord,
    getRoutesRecord,
  ];
};
