import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

export const addTaskDynamic = async (
  taskId: number,
  attachmentIds: number[],
  content: string,
  replyId?: number,
): Promise<void> => {
  const request = {
    method: 'POST' as const,
    service: 'eoc',
    url: '/event/task/reportDistributionResult',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      taskId,
      data: {
        address: Cookies.get(decodeURIComponent('platformTitle') || '暂无地理位置信息'),
        attachmentIds,
        content,
        replyId,
        latitude: '',
        longitude: '',
      },
    },
  };
  try {
    const rsp = await $http(request);
    if (rsp.code === 0) {
      return;
    } else {
      ElMessage.error(`新增任务动态失败，错误代码${rsp.code}，错误信息：${rsp.msg}`);
    }
  } catch (error) {
    ElMessage.error(`新增任务动态发生错误，错误信息：${error}`);
  }
};

export default {
  addTaskDynamic,
};
