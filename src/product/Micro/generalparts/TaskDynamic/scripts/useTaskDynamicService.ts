import {
  ref,
  Ref,
} from 'vue';
import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

export interface TaskDynamicListItem {
  id: number,
  // 地址
  address: string,
  // 附件
  appAttachments: {
    id: number,
    title: string,
    url: string,
  }[],
  // 上报人 ID
  contactorId: number,
  // 上报人类型
  contactorType: string,
  // 上报人类型名称
  contactorTypeName: string,
  // 上报内容
  content: string,
  // 上报时间
  reportTime: string,
  // 类型
  operateTypeName: string,
  // 管理员用户
  user: {
    username: string,
    id: number,
  },
  // 非管理员用户
  mailcontactorVo: {
    username: string,
    id: number,
  },
  // 未读人数
  unreadNum: number,
  // 回复的记录
  replyResult?: Omit<TaskDynamicListItem, 'replyResult'>,
}

export async function getRawTaskList(taskId: number, page = 1, size = 10): Promise<any> {
  const request = {
    method: 'POST' as const,
    service: 'eoc',
    url: '/event/task/getTaskDistributionResult',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      taskId,
      page,
      size,
    },
  };
  return $http(request);
}

export default (taskId: number) => {
  const totalPage = ref(1);
  const currentPage = ref(1);
  const data = ref<TaskDynamicListItem[]>([]);
  const getData = (): Promise<TaskDynamicListItem[]> => new Promise((resolve, reject) => {
    const request = {
      method: 'POST' as const,
      service: 'eoc',
      url: '/event/task/getTaskDistributionResult',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        taskId,
        page: currentPage.value,
        size: 10,
      },
    };
    $http(request).then((rsp) => {
      if (rsp.code === 0) {
        totalPage.value = rsp.data?.totalPages || 1;
        const res = rsp.data?.data || [];
        data.value.unshift(...res);
        resolve(res);
      } else {
        ElMessage.error(`获取任务动态列表失败，错误代码${rsp.code}，错误信息：${rsp.msg}`);
      }
    }).catch((error) => {
      ElMessage.error(`获取任务动态列表发生错误，错误信息：${error}`);
    });
  });
  return [
    data,
    getData,
    currentPage,
    totalPage,
  ] as const;
};
