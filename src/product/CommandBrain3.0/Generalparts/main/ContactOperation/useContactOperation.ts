/* eslint-disable no-nested-ternary */
import { VNode, createVNode, render, computed } from 'vue';
// 多任务管理弹窗
import {
  getStore,
  addDialog,
  mapDialog,
} from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/useDock';
// 发布任务弹窗组件
import TaskPublishDialog from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskPublishDialog/TaskPublishDialog.vue';
// 创建会议
import { openStartMeetingDialog } from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/useStartMeetingDialog';
// UDS 功能
import {
  // 电话呼叫
  makePhoneCall,
  // 视频点呼
  callVideoCluster,
  // 语音点呼
  callVoiceCluster,
  // 查询会议状态
  queryMeetingStatus,
  // 会议启动时间
  meetingStartTime,
  // 添加会议成员
  addMeetingMembers,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
// 短信弹窗
import SMSShortcut from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/components/SMSShortcut/SMSShortcut';
// 轨迹跟踪
import { openRoutesTrack } from '@/product/CommandBrain3.0/FunModule/RoutesTrack/scripts/useRoutesTrack';
// 联系人详情
import useContactInfoService, { APP_STATUS, ContactInfoResponse } from './useContactInfoService';
// 气泡组件
import ContactOperation from './ContactOperation.vue';

type ListItem = {
  id?: number;
  // 名称
  name: string;
  // 号码值
  value: number | string;
  // 类型编号
  type?: number;
  // 类型名称
  typeName?: string;
  // 设备是否在线
  isOnline?: boolean;
};

/**
 * 创建特定联系人的操作方法
 * @param contactID 联系人 ID
 * @returns 联系人操作方法集合
 *
 * contactInfo 联系人详情
 *
 * getContactInfo 更新获取联系人详情，默认会执行一遍，单例模式时可以传递新的联系人 ID 覆盖已有的联系人
 */
export function createContactOperation(contactID: number) {
  const store = getStore();

  const [contactInfo, getContactInfo] = useContactInfoService(contactID);

  // 是否有经纬度
  const hasLngLat = computed(
    () => contactInfo.value?.mailContactor.longitude && contactInfo.value?.mailContactor.latitude,
  );

  // 短信号码列表
  const smsList = computed(() => {
    const res: ListItem[] = [];
    if (contactInfo.value?.mailContactor.mobile) {
      res.push({
        name: '手机号码',
        value: contactInfo.value.mailContactor.mobile,
      });
    }
    if (contactInfo.value?.mailContactor.mobile1) {
      res.push({
        name: '手机号码1',
        value: contactInfo.value.mailContactor.mobile1,
      });
    }
    if (contactInfo.value?.mailContactor.mobile2) {
      res.push({
        name: '手机号码2',
        value: contactInfo.value.mailContactor.mobile2,
      });
    }
    if (contactInfo.value?.mailContactor.otherTel) {
      res.push({
        name: '其他电话',
        value: contactInfo.value.mailContactor.otherTel,
      });
    }
    return res;
  });

  // 电话号码列表
  const phoneList = computed(() => {
    const res = [...smsList.value];
    if (contactInfo.value?.mailContactor.officeTel) {
      res.push({
        name: '办公室电话',
        value: contactInfo.value.mailContactor.officeTel,
      });
    }
    if (contactInfo.value?.mailContactor.homeTel) {
      res.push({
        name: '家庭电话',
        value: contactInfo.value.mailContactor.homeTel,
      });
    }
    return res;
  });

  // 所有设备列表
  const deviceList = computed(() => {
    const res: ListItem[] = [];
    if (contactInfo.value) {
      contactInfo.value.resources
        // 只取设备，type 大于等于 9
        .filter((device) => device.type >= 9)
        .forEach((device) => {
          // device 可能为 null
          if (device.data) {
            device.data.forEach(item => {
              res.push({
                type: device.type,
                typeName: device.name,
                id: item.entity.id,
                name: item.entity.name,
                value: item.entity.code,
                isOnline: item.entity.status === 0 || item.entity.status === '0',
              });
            });
          }
        });
    }
    return res;
  });

  // 可以点呼的设备：集群终端、会场终端
  const clusterList = computed(() =>
    deviceList.value.filter(device => device.type === 10 || device.type === 11),
  );

  // 是否在线
  const isOnline = computed(
    () => contactInfo.value?.mailContactor.appStatus === APP_STATUS.ONLINE
     || deviceList.value.some((device) => device.isOnline),
  );

  // 是否可以轨迹跟踪，app用户 或 在线 或绑定集群终端
  const canTrack = computed(
    () =>
      contactInfo.value?.mailContactor.appUser ||
      isOnline.value ||
      deviceList.value.filter(device => device.type === 11).length,
  );

  // 状态集合
  const state = {
    isOnline,
    hasLngLat,
    smsList,
    phoneList,
    deviceList,
    clusterList,
    canTrack,
  };

  /**
   * 电话呼叫
   * @param num 手机号码(mobile1/2)，办公室电话(officeTel)，家庭电话(homeTel)，其他电话(otherTel)
   * @param options UDS 补充参数
   */
  const phone = (
    num: number | string,
    options?: {
      key: string;
      value: any;
      type: number;
    }[],
  ) => {
    if (contactInfo.value) {
      makePhoneCall(
        {
          type: 1,
          phone: Number(num),
          name: contactInfo.value.mailContactor.name,
          id: contactInfo.value.mailContactor.id,
        },
        options,
      );
    } else {
      // 调用时若没有联系人数据，则推迟 100ms 重试
      setTimeout(() => {
        phone(num, options);
      }, 100);
    }
  };

  /**
   * 短信呼叫
   * @param num 手机号码(mobile1/2)，其他电话(otherTel)
   */
  const sms = (num: number | string) => {
    if (contactInfo.value) {
      SMSShortcut(Number(num), contactInfo.value.mailContactor.id, store?.state.event?.id);
    } else {
      // 调用时若没有联系人数据，则推迟 100ms 重试
      setTimeout(() => {
        sms(num);
      }, 100);
    }
  };

  /**
   * 语音点呼
   * @param id 设备 ID
   * @param name 设备名称
   * @param num 设备号
   */
  const voice = ({ id, name, value }: { id: number; name: string; value: number }) => {
    if (contactInfo.value) {
      callVoiceCluster([
        {
          id,
          name,
          num: value,
        },
      ]);
    } else {
      // 调用时若没有联系人数据，则推迟 100ms 重试
      setTimeout(() => {
        voice({ id, name, value });
      }, 100);
    }
  };

  /**
   * 视频点呼
   * @param id 设备 ID
   * @param name 设备名称
   * @param num 设备号
   */
  const video = ({ id, name, value }: { id: number; name: string; value: number }) => {
    if (contactInfo.value) {
      callVideoCluster([
        {
          id,
          name,
          num: value,
        },
      ]);
    } else {
      // 调用时若没有联系人数据，则推迟 100ms 重试
      setTimeout(() => {
        video({ id, name, value });
      }, 100);
    }
  };

  /**
   * 轨迹跟踪
   */
  const track = () => {
    if (contactInfo.value) {
      openRoutesTrack({ contactorId: contactInfo.value.mailContactor.id });
    } else {
      // 调用时若没有联系人数据，则推迟 100ms 重试
      setTimeout(() => {
        track();
      }, 100);
    }
  };

  /**
   * 邀请会议
   *
   * 先查询 UDS 当前会议状态，已存在会议则邀请，否则创建新的会议
   */
  const meeting = (item: ListItem) => {
    queryMeetingStatus().then(() => {
      if (contactInfo.value) {
        if (meetingStartTime.value) {
          addMeetingMembers([
            {
              Type:
                item.type === undefined
                  ? // 联系人
                    1
                  : item.type === 11
                  ? // 集群
                    4
                  : item.type === 9
                  ? // 监控
                    9
                  : // 其他终端设备
                    8,
              Name: item.type === undefined ? contactInfo.value.mailContactor.name : item.name,
              Id: item.id ?? contactInfo.value.mailContactor.id,
              Number: Number(item.value),
            },
          ]);
        } else {
          openStartMeetingDialog([
            {
              memberType:
                item.type === undefined
                  ? // 联系人
                    1
                  : item.type === 11
                  ? // 集群
                    8
                  : item.type === 9
                  ? // 监控
                    5
                  : item.type === 10
                  ? // 会场终端
                    6
                  : // 其他设备
                    9,
              id: item.id ?? contactInfo.value.mailContactor.id,
              name: item.type === undefined ? contactInfo.value.mailContactor.name : item.name,
              phone: Number(item.value),
            },
          ]);
        }
      } else {
        setTimeout(() => {
          meeting(item);
        }, 100);
      }
    });
  };

  /**
   * 任务发布
   */
  const task = () => {
    addDialog('任务发布', TaskPublishDialog, {
      initSelectedResponsiblePerson: [contactInfo.value?.mailContactor],
    });
  };

  /**
   * 周边检索
   */
  const search = (type = 'peripheralSearch') => {
    const option = {
      longitude: contactInfo.value?.mailContactor.longitude,
      latitude: contactInfo.value?.mailContactor.latitude,
    };
    store.commit('retrieval/SET_peripheralSearch', {
      type,
      centerCircleData: option,
    });
    (window as any).map.setCentent(option, 12);
  };

  /**
   * 检索附近监控
   */
  const searchMonitor = () => search('nearbyMonitoring');

  /**
   * 联系人详情弹窗
   */
  const detail = () => {
    if (contactInfo.value) {
      mapDialog(
        {
          modle: 'personnel',
        },
        document.body,
      ).open({
        requestData: {
          id: contactInfo.value.mailContactor.id,
          eventId: store.state.event?.id,
        },
      });
    } else {
      setTimeout(() => {
        detail();
      }, 100);
    }
  };

  return {
    getContactInfo,
    contactInfo,
    state,
    // 方法
    phone,
    sms,
    voice,
    video,
    track,
    meeting,
    task,
    search,
    searchMonitor,
    detail,
  };
}

/**
 * 实例化气泡组件
 * @param contactID 联系人 ID
 * @param x x 坐标
 * @param y y 坐标
 * @param reducer 【扩展用】气泡组件中各种点击事件的钩子
 */
function initPopup(
  contactID: number,
  x: number,
  y: number,
  reducer?: (action: { type: string; payload?: any }) => void,
): VNode {
  const container = document.createElement('div');

  // 实例销毁方法
  const destroy = () => {
    render(null, container);
    document.body.removeChild(container);
  };

  // 实例化并渲染
  const vnode = createVNode(ContactOperation, {
    x,
    y,
    destroy,
    reducer,
    ...createContactOperation(contactID),
  });
  render(vnode, container);
  document.body.appendChild(container);

  return vnode;
}

export default initPopup;
