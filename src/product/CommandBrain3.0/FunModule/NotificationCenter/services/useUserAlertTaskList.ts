import { ref } from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

export type UnalertTask = {
  address: string,
  id: number,
  title: string,
};

export default function () {
  const list = ref<UnalertTask[]>([]);

  const getList = async () => {
    const request = {
      method: 'GET' as const,
      service: 'eoc',
      url: '/event/task/getUserUnalertTask',
    };
    try {
      const rsp = await $http(request);
      if (rsp.code === 0) {
        list.value.push(...(rsp.data ?? []));
        return list.value;
      } else {
        throw Error(`代码${rsp.code}，${rsp.msg}`);
      }
    } catch (err) {
      $message.error(`获取任务提醒失败：${err}`);
    }
  };

  return [list, getList] as const;
}
