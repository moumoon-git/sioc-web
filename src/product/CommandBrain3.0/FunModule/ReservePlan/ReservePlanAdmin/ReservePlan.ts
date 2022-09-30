import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

/**
 * 获得类型
 * @returns 返回promise
 */
export async function getLatestEventDeal(
  eventId: number,
  ignoreFirst = 0
): Promise<any> {
  const request = {
    method: 'get',
    url: '/event/info/getLatestEventDeal', // 最新续报
    service: 'eoc',
    params: {
      eventId: eventId,
      ignoreFirst: ignoreFirst,
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获得类型数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取事件类型相关预案，即头部下拉列表
 * @returns 返回promise
 */
export async function getPreplanByCaseId(caseid: number): Promise<any> {
  const request = {
    method: 'POST',
    url: '/eos/event/preplan/getPreplanByCaseId',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      caseId: caseid, // 事件类型id
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取事件类型数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取当前case下默认预案
 * @returns 返回promise
 */
export async function getDefault(
  eventId: number,
  caseid: number,
): Promise<any> {
  const request = {
    method: 'POST',
    url: '/eos/event/preplan/getDefault',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      eventId: eventId, // 事件id
      caseId: caseid, // 类型id
      type: 1,
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取当前case下默认预案数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取预案版本信息
 * @returns 返回promise
 */
export async function getPreplanInfo(
  id: number,
): Promise<any> {
  const request = {
    method: 'POST',
    url: '/emergency/preparation/preplan/getPreplanInfo',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: id, // 预案id
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取预案版本信息数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取预案历史
 * @returns 返回promise
 */
export async function eventPreplanHistory(
  eventId: number,
): Promise<any> {
  const request = {
    method: 'POST',
    url: '/event/preplan/eventPreplanHistory',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      eventId: eventId, // 事件id
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取预案历史数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取预警信号
 * @returns 返回promise
 */
export async function getWarnSign(
  versionid: number
): Promise<any> {
  const request = {
    method: 'POST',
    url: '/emergency/preparation/preplan/getLevels',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      type: 0,
      versionId: versionid, // 预案版本id
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取预警信号数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取响应流程
 * @returns 返回promise
 */
export async function getRespondFlow(
  versionid: number
): Promise<any> {
  const request = {
    method: 'POST',
    url: '/emergency/preparation/preplan/getLevels',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      type: 1,
      versionId: versionid, // 预案版本id
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取响应流程数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取事件等级
 * @returns 返回promise
 */
 export async function getEventLevel(
): Promise<any> {
  const request = {
    method: 'POST',
    url: '/eos/basics/basicsSettingController/eventClass',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      data:{
        parameter: {
          countPage: 0
        },
        type: 'select',
      }
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取事件等级数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取现场指挥部
 * @returns 返回promise
 */
export async function getManager(
  eventId: number,
  store: any,
): Promise<any> {
  const request = {
    method: 'get',
    url: '/eventconduct/geteventSceneConduct',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      eventId: eventId, // 事件id
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      // 存数据
      store.commit('reservePlan/setSceneMsg', response?.data);
      // 清图层
      if ((window as any).map) {
        (window as any).map.clearAtPresentMarkData('AdminMarker');
      }
      // 画落点
      if (response.data) {
        (window as any).map.setOneMarker('AdminMarker', {
          longitude: response.data?.longitude,
          latitude: response.data?.latitude,
          wd: 30,
          hg: 50,
          src: require('../PublicComponents/assets/marker.svg'),
        }, {
          click: () => {
            store.commit('CHANGE_MODULES', {
              name: '现场指挥部',
              icon: 'reservePlan',
            });
          },
        });
      }
      return response;
    }
    throw response.msg ?? response.message ?? '获取现场指挥部数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * copy现场指挥部到现场指挥部
 * @returns 返回promise
 */
export async function copy(
  eventId: number,
  preplanId: number,
): Promise<any> {
  const request = {
    method: 'post',
    url: '/eventSceneConduct/copyPlanStructToEventStruct',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      eventId: eventId,
      preplanId: preplanId,
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? 'copy现场指挥部数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取专项和现场的领导小组成员单位
 * structType: 1,type: 1, 专项领导小组
 * structType: 1,type: 2, 专项成员单位
 * structType: 2,type: 1, 现场领导小组
 * structType: 2,type: 2, 现场成员单位
 * @returns 返回promise
 */
export async function getGroupResponseAndContactor(
  versionId: number,
  structType: number,
  type: number,
): Promise<any> {
  const request = {
    method: 'get',
    url: '/mail/mailgroup/getGroupResponseAndContactor',
    service: 'soc',
    params: {
      versionId: versionId,
      structType: structType,
      type: type,
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取指挥部数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取非预案管理的现场指挥部
 * @returns 返回promise
 */
export async function getStructTreeEventPC(
  eventId: number,
  type: number,
  deptOnly = ''
): Promise<any> {
  const request = {
    method: 'get',
    url: '/eventconduct/eventSceneonductSign/getStructTreeEventPC',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      eventId: eventId,
      type: type,
      deptOnly: deptOnly,
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取现场指挥部数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 获取成员单位
 * @returns 返回promise
 */
export async function getGroupManageEventTypeAndPeople(
  groupId: number,
  versionId: number,
): Promise<any> {
  const request = {
    method: 'post',
    url: '/mail/mailgroup/getGroupManageEventTypeAndPeople',
    service: 'soc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      Ids: [groupId], // 为联系人分组id的数组
      preplandVersionId: versionId,
    },
  } as const;
  try {
    const response = await $http(request);
    if (response.code === 0 || response.errorcode === 0) {
      return response;
    }
    throw response.msg ?? response.message ?? '获取成员单位数据不正确';
  } catch (error) {
    $message.error(error);
  }
}

/**
 * 定位
 */
 export function location(
  lon: number,
  lat: number,
  map: String,
) {
  (window as any).map.setCentent(
    {
      longitude: lon,
      latitude: lat,
    },
    17,
  );
  (window as any).map.setOneMarker(
    map,
    {
      longitude: lon,
      latitude: lat,
      wd: 30,
      hg: 50,
      src: require('../PublicComponents/assets/locationActive.svg'),
    },
  );
}
