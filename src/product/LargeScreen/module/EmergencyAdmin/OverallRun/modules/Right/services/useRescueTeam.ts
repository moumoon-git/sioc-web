import { ref } from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

type listItem = {
  name: string,
  peopleNum: number,
  percent?: number,
  value?: number,
  uuid?: number,
}

const request = {
  method: 'GET',
  service: 'soc',
  url: '/resoure/resoureteam/queryTeamPeopleStatistic',
} as const;

export default () => {
  const list = ref<listItem[]>([]);
  const getList = () => {
    $http(request).then((response) => {
      if (response.code === 0 || response.errorcode === 0) {
        const data = response.data || [];
        data.sort((a: listItem, b: listItem) => b.peopleNum - a.peopleNum);
        const base = data?.[0]?.peopleNum || 1;
        for (let i = 0; i < data.length; i += 1) {
          data[i].percent = ((data[i].peopleNum / base) * 100).toFixed(2);
          data[i].value = data[i].peopleNum;
          data[i].uuid = i;
        }
        list.value = data;
      } else {
        $message.error(`获取救援队伍列表失败，错误代码${response.code ?? response.errorcode}，错误信息：${response.msg ?? response.message}`);
      }
    }).catch((error: Error) => {
      $message.error(`获取救援队伍列表失败，错误信息：${error}`);
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
