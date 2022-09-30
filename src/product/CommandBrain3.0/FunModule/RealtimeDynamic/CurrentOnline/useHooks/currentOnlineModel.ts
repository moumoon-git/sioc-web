import { ref, Ref, reactive, computed, watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import useCurrentOnlineList from './useCurrentOnlineList';
import OnLineContactorApiDto from '../services/currenOnlineDto';
import useMapDrawing from './useMapDrawing';

interface TitleDto {
  label: string;
  count: string;
}

interface CommunicateDto {
  title: TitleDto;
  memberList: Partial<OnLineContactorApiDto>[];
}

// 人员在线列表
const OnlinePersonnelList = reactive<CommunicateDto[]>([
  {
    title: {
      label: '联系人',
      count: '',
    },
    memberList: [],
  },
  {
    title: {
      label: '应急队伍',
      count: '',
    },
    memberList: [
      // {
      //   icon: 'single_no',
      //   name: '张三（xxx区xxx科员）',
      //   address: '广州市xxx区xxx号',
      //   contact: false,
      // },
      // {
      //   icon: 'single_no',
      //   name: '张三（xxx区xxx科员）',
      //   address: '广州市xxx区xxx号',
      //   contact: false,
      // },
    ],
  },
]);

// 设备在线列表
const EquipmentOnlineList = reactive<CommunicateDto[]>([
  {
    title: {
      label: '监控设备',
      count: '',
    },
    memberList: [],
  },
  {
    title: {
      label: '会场终端',
      count: '',
    },
    memberList: [],
  },
  {
    title: {
      label: '集群终端',
      count: '',
    },
    memberList: [],
  },
  {
    title: {
      label: 'WeComm',
      count: '',
    },
    memberList: [],
  },
  // {
  //   title: {
  //     label: 'APP终端',
  //     count: '',
  //   },
  //   memberList: [],
  // },

  // {
  //   title: {
  //     label: '无人机',
  //     count: '(3)',
  //   },
  //   memberList: [
  //     {
  //       name: '张三（xxx区xxx科员）',
  //       address: '广州市xxx区xxx号',
  //     },
  //     {
  //       name: '张三（xxx区xxx科员）',
  //       address: '广州市xxx区xxx号',
  //     },
  //   ],
  // },
]);

// 总列表 包含着上面2个的
const tabsList = reactive<Record<string, any>[]>([
  {
    label: '人员在线',
    activatePane: 'OnlinePersonnel',
    count: '',
    list: OnlinePersonnelList,
  },
  {
    label: '设备清单',
    activatePane: 'EquipmentOnline',
    count: '',
    list: EquipmentOnlineList,
  },
]);

interface UseTabsDto {
  tabsList: Record<string, any>[];
  currentPane: Ref<number>;
  activateComponent: any;
  tabChange: (i: number) => void;
  refreshData: () => void;
}
export const useTabs = (): UseTabsDto => {
  const store = useStore();
  const eventId = store.state.event?.id;
  const paneMap: string[] = ['OnlinePersonnel', 'EquipmentOnline'];
  const currentPane = ref<number>(0);
  const activateComponent = computed(() => paneMap[currentPane.value]);

  // 人员在线列表合并后的一维数组
  let mergePersonnelList: Record<string, any>[] = [];

  // 设备列表合并后的一维数组
  let mergeEquipmentlList: Record<string, any>[] = [];

  const { getOnLinePersonList, getOnLineTeamList, getonlineDeviceList } = useCurrentOnlineList();
  const { drawMarkers } = useMapDrawing();
  const tabChange = (i: number): void => {
    currentPane.value = i;
  };

  /**
   * 地图落点合并
   * @date 2021-06-22
   * @param {any} list:T[]
   * @returns {any}
   */
  async function drawMarkersListConcat<T>(list: T[]) {
    const result: any = [];
    list.forEach((item: any, index) => {
      OnlinePersonnelList[index].title.count = `(${item.length})`;
      OnlinePersonnelList[index].memberList.push(...item);
      result.push(...item);
    });

    return result;
  }

  /**
   * 中转处理equipmentList
   * @date 2021-06-22
   * @param {any} arr:Record<string
   * @param {any} any>[]
   * @param {any} targert:CommunicateDto[]
   * @returns {any}
   */
  const equipmentListTransfer = (arr: Record<string, any>[], targert: CommunicateDto[]) => {
    arr.forEach(item => {
      targert[item.deviceType].memberList.push(item);
    });
    targert.forEach(item1 => {
      item1.title.count = `(${item1.memberList.length})`;
    });
  };

  // 每分钟刷新一次的定时器
  let refreshTimer: number;
  onBeforeUnmount(() => {
    if (refreshTimer) {
      window.clearTimeout(refreshTimer);
    }
  });

  // 初始化渲染人员在线列表
  const requestInitRender = (activeRequestList: any, evId: number) => {
    OnlinePersonnelList.forEach(item => {
      item.memberList.length = 0;
    });
    EquipmentOnlineList.forEach(item => {
      item.memberList.length = 0;
    });

    Promise.all([getOnLinePersonList(evId), getOnLineTeamList(evId)]).then(async res => {
      console.log(res);

      // 合并人员在线列表
      mergePersonnelList = await drawMarkersListConcat<any>(res);

      tabsList[0].count = `(${(activeRequestList[0]?.memberList.length ?? 0) +
        (activeRequestList[1]?.memberList.length ?? 0)})`;
      drawMarkers(mergePersonnelList);

      // todo 请求设备列表 存起来 一次性全部数据请求过来 tabChange就不再请求接口了
      const equipmentList = await getonlineDeviceList(evId);
      const _equipmentList = equipmentList.filter(item => item.deviceType !== 4);
      tabsList[1].count = `(${_equipmentList.length})`;
      mergeEquipmentlList = _equipmentList;
      equipmentListTransfer(_equipmentList, EquipmentOnlineList);
    });

    // 每分钟刷新一次列表
    if (refreshTimer) {
      window.clearTimeout(refreshTimer);
    }
    refreshTimer = window.setTimeout(() => requestInitRender(activateComponent, evId), 1000 * 60);
  };

  // 刷新数据
  const refreshData = () => {
    requestInitRender(OnlinePersonnelList, eventId);
  };

  // watch初始化时不执行所以比较适合这里tabchangge下图
  watch(
    () => currentPane.value,
    (activePaneIndex: number) => {
      // 由于只有2个tabPane 懒得写映射了 凑合着用吧
      if (activePaneIndex === 0) {
        drawMarkers(mergePersonnelList);
      } else if (activePaneIndex === 1) {
        drawMarkers(mergeEquipmentlList);
      }
    },
  );

  // 切换事件，重新请求数据
  watch(
    () => store.state.event?.id,
    () => requestInitRender(OnlinePersonnelList, eventId),
    { immediate: true },
  );

  return {
    tabsList,
    currentPane,
    activateComponent,
    tabChange,
    refreshData,
  };
};

export const usePerson = () => {
  // 鼠标移入移出事件
  const mouseHover = (index: number, i: number, status: boolean) => {
    OnlinePersonnelList[index].memberList[i].contact = status;
  };

  return {
    OnlinePersonnelList,
    mouseHover,
  };
};

export const useEquipment = () => ({
  EquipmentOnlineList,
});
