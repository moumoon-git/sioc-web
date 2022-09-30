import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

type Contact = {
  id: number,
  name: string,
}

export interface ResponseData {
  read: Contact[],
  unread: Contact[],
}

const getTaskDynamicReadList = (resultId: number): Promise<ResponseData> => new Promise((resolve, reject) => {
  const request = {
    method: 'GET' as const,
    service: 'eoc',
    url: '/event/task/getReadStatusDetail',
    params: {
      resultId,
    },
  };
  $http(request).then((rsp) => {
    if (rsp.code === 0) {
      resolve(rsp.data || {
        read: [],
        unread: [],
      } as ResponseData);
    } else {
      ElMessage.error(`获取任务动态列表失败，错误代码${rsp.code}，错误信息：${rsp.msg}`);
      reject();
    }
  }).catch((error) => {
    ElMessage.error(`获取任务动态列表发生错误，错误信息：${error}`);
    reject();
  });
});

export default getTaskDynamicReadList;
