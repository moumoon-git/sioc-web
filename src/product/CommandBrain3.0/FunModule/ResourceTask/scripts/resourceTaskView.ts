import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import { ref } from 'vue';
export default function resourceTaskViewFun(){
    const listData = ref([]); // 现场支援列表数据
    function getListData(){
        const request = {
            method: 'get',
            service: 'eoc',
            url: '/resource/apply/list',
            headers: {
              'Content-Type': 'application/json',
            },
          } as const;
          $http(request)
            .then((response: any) => {
              if (response.errorcode === 0) {
                listData.value = response.data
              } else {
                $message.error(
                  `获取现场支援列表失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error: Error) => {
                $message.error(`获取现场支援列表失败，错误信息：${error}`);
            });
    }
    return {
        listData,
        getListData
    }
}