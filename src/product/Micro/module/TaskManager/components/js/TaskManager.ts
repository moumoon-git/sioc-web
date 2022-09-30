import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

/**
 * 获得事件列表
 * @returns 返回promise
 */
export async function getEventList(
  size: number,
  page: number,
  name: string,
): Promise<any> {
  const request: any = {
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: '/eos/event/listBy',
    data: {
      size: size,
      page: page,
      name: name,
      reportType: 0,
    },
  };
  const response: any = await $http(request);
  if (response.code === 0 || response.errorcode === 0) {
    return response;
  }
}

/**
 * 获得任务类型
 * @returns 返回promise
 */
export async function getTaskType(
): Promise<any> {
  const request: any = {
    method: 'post',
    url: '/emergency/preparation/dictionary/getByParentCode',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      pcode: 'event_task_type',
    },
  };
  const response: any = await $http(request);
  if (response.code === 0 || response.errorcode === 0) {
    return response;
  }
}

/**
 * 获得任务列表
 * @returns 返回promise
 */
export async function getTaskList(
  params: any
): Promise<any> {
  const request: any = {
    method: 'post',
    url: '/event/task/getTaskList',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  };
  const response: any = await $http(request);
  if (response.code === 0 || response.errorcode === 0) {
    return response;
  }
}

/**
 * 上传附件
 * @returns 返回promise
 */
 export async function uploadFile(
  formData: any
): Promise<any> {
  const request: any = {
    method: 'post',
    url: '/appAttachment/fileUploadAttachments',
    service: 'file',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };
  const response: any = await $http(request);
  if (response.code === 0 || response.errorcode === 0) {
    response.data.forEach((el: any) => {
      el.name = el.title;
    });
    return response;
  }
}