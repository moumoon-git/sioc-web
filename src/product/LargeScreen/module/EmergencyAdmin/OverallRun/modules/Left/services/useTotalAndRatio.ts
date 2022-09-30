import { ref, Ref } from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

type Count = {
  all?: number,
  tbDelta?: number,
  tbNum?: number,
  hbDelta?: number,
  hbNum?: number,
}

export default (): [
  Ref<Count>,
  (params?: { year: number, quarter: number}) => void,
] => {
  const countData = ref<Count>({});
  const getData = (params?: { year: number, quarter: number}): void => {
    const request = {
      method: 'GET',
      service: 'soc',
      url: '/risk/riskdanger/statisticAll',
      params: params ?? { year: '', quarter: '' },
    } as const;
    $http(request).then((response) => {
      if (response.code === 0 || response.errorcode === 0) {
        countData.value = response.data || {};
      } else {
        $message.error(`获取总数统计失败，错误代码${response.code ?? response.errorcode}，错误信息：${response.msg ?? response.message}`);
      }
    }).catch((error: Error) => {
      $message.error(`获取总数统计失败，错误信息：${error}`);
    });
  };
  getData();
  return [
    countData,
    getData,
  ];
};
