import {
  ref,
  onMounted,
  watch,
} from 'vue';
import { Store, useStore } from 'vuex';

let $http: any;
let $message: any;
let store: Store<any>;

// 通讯录分组树形数据
const contactTreeData = ref([]);
// 获取通讯录分组树形数据
function getContactTree() {
  const request = {
    method: 'get',
    service: 'soc',
    url: '/mail/mailgroup/list',
  };
  $http(request).then((response: any) => {
    if (response.code === 0) {
      contactTreeData.value = response.data || [];
    } else {
      $message.error(`获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`);
    }
  }).catch((error: Error) => {
    $message.error(`获取分组数据失败，错误信息：${error}`);
  });
}
// 通讯录分组成员列表
const contactListData = ref([]);
// 获取通讯录分组成员列表
function getContactList(node: any) {
  const request = {
    method: 'post',
    service: 'soc',
    url: '/mail/mailgroup/getGroupManageEvent',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      Ids: [node.id],
    },
  };
  $http(request).then((response: any) => {
    if (response.code === 0) {
      contactListData.value = response.data || [];
      /* eslint-disable */
      contactListData.value.forEach((i: any) => {
        i?.groupContactorTypeList?.forEach((j: any) => {
          j?.malicontactorList?.forEach((k: any) => {
            k.memberType = 1;
            k.workUnit = k.workUnit || node.name;
          });
        });
        i?.groupResponsibleTypeList?.forEach((j: any) => {
          j?.malicontactorList?.forEach((k: any) => {
            k.memberType = 1;
            k.workUnit = k.workUnit || node.name;
          });
        });
        i?.groupContactor?.forEach((j: any) => {
          j.memberType = 1;
          j.workUnit = j.workUnit || node.name;
        })
      });
      /* eslint-enable */
    } else {
      $message.error(`获取分组详情失败，错误代码${response.code}，错误信息：${response.msg}`);
    }
  }).catch((error: Error) => {
    $message.error(`获取分组详情失败，错误信息：${error}`);
  });
}

/**
 * 获取专项指挥部和现场指挥部的数据流程：
 * 1. 获取默认预案的版本id
 * 2. 根据版本id获取专项指挥部和现场指挥部数据
 */
// 专项指挥部
const specialCommandDepData = ref([
  { id: -1, name: '领导班子', list: [] as any },
  {
    id: -2,
    name: '成员单位',
    children: [] as any,
    list: [] as any,
  },
]);
// 现场指挥部
const onSceneCommandDepData = ref([
  { id: -1, name: '领导班子', list: [] as any },
  {
    id: -2,
    name: '成员单位',
    children: [] as any,
    list: [] as any,
  },
]);
function getStructureData(versionId: number) {
  /* eslint-disable */
  const request = {
    method: 'get',
    service: 'soc',
    url: '/mail/mailgroup/getGroupResponseAndContactor',
    params: {
      versionId,
      // 1-专项指挥部，2-现场指挥部
      structType: 1,
      // 1-领导班子，2-成员单位
      type: 1,
    },
  };
  // 专项 > 领导班子
  $http(request).then((response: any) => {
    specialCommandDepData.value[0].list = response.data || [];
    specialCommandDepData.value[0].list._isLeader = true;
    specialCommandDepData.value[0].list.forEach((job: any) => {
      job.list = job?.children?.map((child: any) => {
        const res = child?.mailContactorList || [];
        res.forEach((i: any) => {
          i.memberType = 1;
          i.workUnit = i.workUnit || child.name;
          i.groupName = i.groupName || child.name;
        });
        return res;
      })?.flat(Infinity);
    });
  });
  // 专项 > 成员单位
  request.params.type = 2;
  $http(request).then((response: any) => {
    const idMap = new Map();
    specialCommandDepData.value[1].children = response.data || [];
    specialCommandDepData.value[1].children.forEach((dep: any) => {
      dep.list = [
        ...(dep?.mailContactorList || []),
        ...(dep?.mailResponseList || []),
      ];
      dep.list.forEach((i: any) => {
        idMap.set(i.id, i);
        i.memberType = 1;
        i.workUnit = i.workUnit || dep.name;
        i.groupName = i.groupName || dep.name;
      })
    })
    specialCommandDepData.value[1].list = Array.from(idMap, (entry) => entry[1]);
    idMap.clear();
  });
  // 现场 > 成员单位
  request.params.structType = 2;
  $http(request).then((response: any) => {
    const idMap = new Map();
    onSceneCommandDepData.value[1].children = response.data || [];
    onSceneCommandDepData.value[1].children.forEach((unit: any) => {
      unit?.children?.forEach((child: any) => {
        child.list = [...(child?.mailContactorList || []), ...(child?.mailResponseList || [])];
        child.list.forEach((i: any) => {
          idMap.set(i.id, i);
          i.memberType = 1;
          i.workUnit = i.workUnit || child.name;
          i.groupName = i.groupName || child.name;
        })
      })
      unit.list = unit?.children?.map((child: any) => child?.list || [])?.flat(Infinity) || [];
    })
    onSceneCommandDepData.value[1].list = Array.from(idMap, (entry) => entry[1]);
    idMap.clear();
  });
  // 现场 > 领导班子
  request.params.type = 1;
  $http(request).then((response: any) => {
    onSceneCommandDepData.value[0].list = response.data || [];
    onSceneCommandDepData.value[0].list._isLeader = true;
    onSceneCommandDepData.value[0].list.forEach((job: any) => {
      job.list = job?.children?.map((child: any) => {
        const res = child?.mailContactorList || [];
        res.forEach((i: any) => {
          i.memberType = 1;
          i.workUnit = i.workUnit || child.name;
          i.groupName = i.groupName || child.name;
        });
        return res;
      })?.flat(Infinity);
    });
  });
  /* eslint-enable */
}
// 获取默认预案的版本ID
function getDefaultContingencyPlan() {
  const request = {
    method: 'get',
    service: 'eoc',
    url: '/eos/event/preplan/getDefault',
    params: {
      eventId: store.state.event?.id,
      caseId: store.state.event?.caseClassId,
      type: 1,
    },
  };
  $http(request).then((response: any) => {
    if (response.errorcode === 0) {
      const vid = response.data?.preplans?.versionId;
      // 存在版本ID说明启动了预案，查询预案对应的指挥部数据
      if (vid) {
        getStructureData(vid);
      }
    }
  });
}
// 设备分组
const deviceGroup = ref({
  // 视频监控
  video: [],
  // 会场终端
  assembly: [],
  // 集群
  cluster: [],
  // 手持终端
  mobile: [],
});
const deviceList = ref([]);
// 获取设备分组
function getDeviceGroup(deviceType: number, key?: string, groupId?: number, node?: any) {
  const request = {
    method: 'get',
    service: 'flight',
    url: '/device/appdevicegroup/tree',
    params: {
      groupId: key ? undefined : groupId,
      deviceType,
      key: key || undefined,
    },
  };
  $http(request).then((response: any) => {
    deviceList.value = response.data.devices || [];
    deviceList.value.forEach((i: any) => {
      let tmp;
      if (deviceType === 0) { tmp = 5; }
      if (deviceType === 1) { tmp = 6; }
      if (deviceType === 2) { tmp = 8; }
      if (deviceType === 3) { tmp = 7; }
      i.memberType = tmp;
    });
    if (!groupId) {
      switch (deviceType) {
        case 0: {
          deviceGroup.value.video = response.data.groups || [];
          break;
        }
        case 1: {
          deviceGroup.value.assembly = response.data.groups || [];
          break;
        }
        case 2: {
          deviceGroup.value.cluster = response.data.groups || [];
          break;
        }
        case 3: {
          deviceGroup.value.mobile = response.data.groups || [];
          break;
        }
        default:
      }
    } else {
      // 存在分组，表示获取的数据是子分组
      if (response.data.groups?.length && node) {
        node.children = response.data.groups;
      }
    }
  });
}

export default function (http: any, message: any) {
  $http = http;
  $message = message;
  store = useStore();
  onMounted(() => {
    // getDefaultContingencyPlan();
    getDeviceGroup(0, undefined, 0);
  });
  // 将对预案是否启动的判断改为在index初始化，在文件里监听
  watch(
    () => store.state.reservePlan?.currentReservePlan?.versionId,
    (val: any) => {
      getStructureData(val);
    }
  );

  // 专家
  const platformId = ref(Number(document.cookie.match(/platformId=([^;]*)/)?.[1]));
  const platformList = ref([]);
  function getPlatform() {
    const request = {
      method: 'GET',
      service: 'soc',
      url: '/sys/platform/getPlatformTree',
    };
    $http(request).then((response: any) => {
      platformList.value = response.data || [];
    });
  }
  const expertGroup = ref([]);
  const expertList = ref([]);
  function getExpertGroup() {
    const request = {
      method: 'GET',
      service: 'soc',
      url: '/resoure/expertGroup/listTree',
      params: {
        platformId: Number(platformId.value),
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0) {
        expertGroup.value = response.data || [];
        if (expertGroup.value.length) {
          getExpertList(expertGroup.value[0]);
        }
      } else {
        $message.error(`获取专家分组失败，错误代码${response.code}，错误信息：${response.msg}`);
      }
    }).catch((error: Error) => {
      $message.error(`获取专家分组失败，错误信息：${error}`);
    });
  }
  function getExpertList(group: any) {
    const request = {
      method: 'POST',
      service: 'soc',
      url: '/resoure/resourexpert/list',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        page: 1,
        limit: 9999,
        platformId: Number(platformId.value),
        search: '',
        groupIds: [group.id],
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0) {
        expertList.value = response.page?.list || [];
        expertList.value.forEach((expert: any) => { expert.memberType = 10; });
      }
    });
  }
  const searchExpertList = ref([]);
  function searchExpert(search: string) {
    if (search) {
      const request = {
        method: 'POST',
        service: 'soc',
        url: '/resoure/resourexpert/list',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          page: 1,
          limit: 9999,
          platformId: Number(platformId.value),
          search,
          groupIds: [],
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          searchExpertList.value = response.page?.list || [];
          searchExpertList.value.forEach((expert: any) => { expert.memberType = 10; });
        }
      });
    } else {
      searchExpertList.value = [];
    }
  }
  getPlatform();
  return {
    contactTreeData,
    getContactTree,
    contactListData,
    getContactList,
    specialCommandDepData,
    onSceneCommandDepData,
    getDeviceGroup,
    deviceGroup,
    deviceList,
    platformId,
    platformList,
    expertGroup,
    expertList,
    getExpertGroup,
    getExpertList,
    searchExpert,
    searchExpertList,
  };
}
