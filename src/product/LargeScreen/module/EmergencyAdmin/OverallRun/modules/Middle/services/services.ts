import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

/**
 * 事件类型统计
 * @returns 返回promise
 */
export async function getStatisticByClassTotal({
  year,
  quarter,
}: {
  year: number;
  quarter: number;
}): Promise<any> {
  const request = {
    method: 'get',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/event/statistic/statisticByClass?year=${year}&quarter=${quarter}`,
    params: {},
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response.data;
    }
    throw response.msg ?? response.message ?? '事件类型统计数据不正确';
  } catch (error) {
    $message.error(String(error));
  }
}

/**
 * 获取总数前10的类型的事件
 * @returns 返回promise
 */
export async function getTop10ClassEvent({
  year,
  quarter,
}: {
  year: number;
  quarter: number;
}): Promise<any> {
  const request = {
    method: 'get',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/event/statistic/top10Class?year=${year}&quarter=${quarter}`,
    params: {},
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response.data;
    }
    throw response.msg ?? response.message ?? '获取总数前10的类型的事件数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 按区域统计事件
 * @returns 返回promise
 */
export async function getEventByArea({
  year,
  quarter,
}: {
  year: number;
  quarter: number;
}): Promise<any> {
  const request = {
    method: 'get',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/event/statistic/statisticByTown?year=${year}&quarter=${quarter}`,
    params: {},
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response.data;
    }
    throw response.msg ?? response.message ?? '按区域统计事件数据不正确';
  } catch (error) {
    $message.error(String(error));
  }
}
