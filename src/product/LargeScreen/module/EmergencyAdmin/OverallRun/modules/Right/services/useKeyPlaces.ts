import { ref } from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

type listItem = {
  name: string,
  num: number,
  value?: number,
  uuid?: number,
}

const request = {
  method: 'GET',
  service: 'soc',
  url: '/resoure/resoureProtectTarget/queryProtectTargetStatistic',
} as const;

export default () => {
  const list = ref<listItem[]>([]);
  const getList = () => {
    $http(request).then((response) => {
      if (response.code === 0 || response.errorcode === 0) {
        const data = response.data || [];
        data.sort((a: listItem, b: listItem) => b.num - a.num);
        for (let i = 0; i < data.length; i += 1) {
          data[i].value = data[i].num;
          data[i].uuid = i;
        }
        list.value = data;
      } else {
        $message.error(`获取重点场所列表失败，错误代码${response.code ?? response.errorcode}，错误信息：${response.msg ?? response.message}`);
      }
    }).catch((error: Error) => {
      $message.error(`获取重点场所列表失败，错误信息：${error}`);
    });
  };
  getList();
  return [
    list,
    getList,
  ] as [
    typeof list,
    () => void
  ];
};
