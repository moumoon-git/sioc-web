import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

/**
 * 获取物资应急库弹窗
 * @date 2021-06-15
 * @param {any} {id
 * @param {any} eventId=null}:Record<string
 * @param {any} number|any>
 * @returns {any}
 */
export async function getProductLibraryDetails({
  id,
  eventId = null,
}: Record<string, number | any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resourearticlestorehouse/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '物资应急库详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取避难场所弹窗
 * @returns 返回promise
 */
export async function getResoureAreaDetails({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resourearea/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '避难场所详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取应急装备弹窗
 * @returns 返回promise
 */
export async function getResoureEquipmentDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resoureequipment/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '应急装备详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取任务详情弹窗
 * @returns 返回promise
 */
export async function getTaskDetail({ id, eventId = null }: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: '',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/event/event/task/getTaskDetail',
    params: { taskId: id, eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '任务详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取设备详情
 * type 摄像头0  会场终端1   集群终端2   手持终端WeComm 3
 * @returns 返回promise
 */
export async function getDeviceDetail({ id, eventId = null }: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'device',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/device/appdevice/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '设备详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取防护目标详情
 * @returns 返回promise
 */
export async function getResoureProtectDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/resoure/resoureProtectTarget/info',
    params: { id, eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '防护目标详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取联系人详情
 * @returns 返回promise
 */
export async function getMailContactorDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'post',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/mail/mailcontactor/info/${id}?eventId=${eventId}`,
    data: {},
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '联系人详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取应急队伍详情
 * @returns 返回promise
 */
export async function getResoureTeamDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resoureteam/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '应急队伍详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取应急专家详情
 * @returns 返回promise
 */
export async function getResoureExpertDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resourexpert/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '应急专家详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取应急装备库详情
 * @returns 返回promise
 */
export async function getResoureEquipmentgroupDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resoureequipmentgroup/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '应急装备库详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取应急物资详情
 * @returns 返回promise
 */
export async function getResoureArticleDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resourearticle/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '应急物资详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取事件详情
 * @returns 返回promise
 */
export async function getEventDetail({ id, eventId = null }: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: '/response/getEventDetail',
    params: { eventId: id },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '事件详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取风险隐患详情
 * @returns 返回promise
 */
export async function getRiskDangerDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'get',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/risk/riskdanger/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '风险隐患详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取医疗机构详情
 * @returns 返回promise
 */
export async function getHealthDeptDetail({
  id,
  eventId = null,
}: Record<string, any>): Promise<any> {
  const request = {
    method: 'post',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/resoure/resourcehealthdept/info/${id}`,
    params: { eventId },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      console.log(response);
      return response;
    }
    throw response.msg ?? response.message ?? '医疗机构详情数据不正确';
  } catch (error) {
    $message.error(error);
  }
  return null;
}
