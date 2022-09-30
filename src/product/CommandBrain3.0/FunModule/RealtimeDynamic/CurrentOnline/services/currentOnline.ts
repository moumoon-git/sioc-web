import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

/**
 * 在线人员
 * @returns 返回promise
 */
export async function getOnLineContactorApi(eventId: number): Promise<any> {
  const request = {
    method: 'post',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/mail/mailcontactor/onLineContactorList',
    data: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response.list;
    }
    throw response.msg ?? response.message;
  } catch (error) {
    $message.error(`${error}`);
  }
}

/**
 * 在线队伍
 * @returns 返回promise
 */
export async function getOnLineTeamApi(eventId: number): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/resoure/resoureteam/onLineTeamList',
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response.list;
    }
    throw response.msg ?? response.message;
  } catch (error) {
    $message.error(`${error}`);
  }
}

/**
 * 设备在线
 * @returns 返回promise
 */
export async function getonlineDeviceApi(eventId: number): Promise<any> {
  const request = {
    method: 'post',
    service: 'device',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/device/appdevice/onlineDevice',
    data: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response.data.list;
    }
    throw response.msg ?? response.message;
  } catch (error) {
    $message.error(`${error}`);
  }
}

/**
 * 获取订阅设备
 * @returns 返回promise
 */
export async function getSubscriptionDevice(eventId: number): Promise<any> {
  const request = {
    method: 'post',
    service: 'device',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/device/appdevice/getSubscriptionDevice',
    data: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response.data.list;
    }
    throw response.msg ?? response.message;
  } catch (error) {
    $message.error(`${error}`);
  }
}
