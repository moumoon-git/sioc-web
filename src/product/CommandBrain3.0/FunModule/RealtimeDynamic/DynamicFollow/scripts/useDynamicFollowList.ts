import {
  ref,
  computed,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import { DynamicFollowList } from './useDynamicFollowList.type';

const keyNameMap: { [key: string]: string} = {
  contactor: '人员',
  resource: '资源',
  riskDanger: '风险',
  task: '任务',
  team: '队伍',
  device: '设备',
};

export default () => {
  // vuex store
  const store = useStore();
  // 动态关注列表
  const dynamicFollowList = ref<DynamicFollowList>({});
  // 类型列表
  const dynamicFollowTypeList = computed(() => {
    const res: { name: string, value: number, key: string }[] = [];
    Object.keys(dynamicFollowList.value).forEach((key: string) => {
      res.push({
        key,
        name: keyNameMap[key],
        value: dynamicFollowList.value[key].length,
      });
    });
    res.unshift({
      key: '',
      name: '全部',
      value: res.reduce((acc, cur) => acc + cur.value, 0),
    });
    return res;
  });
  // 类型列表下标，当前选中的类型
  const dynamicFollowTypeListIndex = ref(0);
  /**
   * 获取动态关注列表
   * @returns 返回promise
   */
  function getDynamicFollowList() {
    return new Promise((resolve, reject) => {
      const request = {
        method: 'post',
        service: 'soc',
        url: '/event/attention/list',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          eventId: store.state.event?.id,
        },
      } as const;
      $http(request).then((response) => {
        if (response.code === 0) {
          dynamicFollowList.value = response.data || {};
          dynamicFollowTypeListIndex.value = 0;
          resolve(response);
        } else {
          $message.error(`获取动态关注列表失败，错误代码${response.code}，错误信息：${response.msg ?? response.message}`);
          reject(response);
        }
      }).catch((error: Error) => {
        $message.error(`获取动态关注列表失败，错误信息：${error}`);
        reject(error);
      });
    });
  }
  // 切换事件，重新请求数据
  watch(() => store.state.event?.id, getDynamicFollowList, { immediate: true });
  return {
    dynamicFollowList,
    dynamicFollowTypeList,
    dynamicFollowTypeListIndex,
    getDynamicFollowList,
  };
};
