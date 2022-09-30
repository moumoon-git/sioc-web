import {
  ref,
  Ref,
} from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

interface EventTypeListItem {
  id: number,
  code: string,
  level: number,
  name: string,
  remark: string | null,
  domain: string,
  children: EventTypeListItem[],
}

export default (): [
  Ref<EventTypeListItem[]>,
  () => void,
] => {
  const eventTypeList = ref<EventTypeListItem[]>([]);
  // 获取事件类型列表
  const getEventTypeList = () => {
    const request = {
      method: 'POST' as const,
      url: '/eos/caseClass/getTree',
      service: 'eoc',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {},
    };
    $http(request).then((response) => {
      if (response.errorcode === 0) {
        eventTypeList.value = response.data || [];
      } else {
        $message.error(`获取事件类型失败，错误代码${response.errorcode}，错误信息：${response.msg}`);
      }
    }).catch((error) => {
      $message.error(`获取事件类型失败，错误信息：${error}`);
    });
  };

  // 初始化获取
  getEventTypeList();

  return [
    eventTypeList,
    getEventTypeList,
  ];
};
