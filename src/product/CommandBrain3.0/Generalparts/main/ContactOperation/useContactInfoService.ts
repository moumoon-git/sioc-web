import { Ref, ref } from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

/**
 * 性别
 */
export const enum SEX {
  MALE,
  FEMALE,
  UNKNOWN,
}

/**
 * APP 在线状态
 */
export const enum APP_STATUS {
  OFFLINE,
  ONLINE,
}

/**
 * 联系人
 */
export interface Contact {
  id: number,
  name: string,
  age: number,
  // 性别
  sex: SEX,
  // 工作单位
  workUnit: string,
  // 职务
  position: string,
  // 办公室号码
  officeTel: number,
  // 手机号码
  mobile: number,
  mobile1: number,
  mobile2: number,
  // 家庭号码
  homeTel: number,
  // 传真号码
  fax: number,
  // 其他号码
  otherTel: number,
  // 电子邮箱
  email: string,
  // 经度
  longitude: number,
  // 纬度
  latitude: number,
  // 地址
  address: string,
  // APP 在线状态
  appStatus: APP_STATUS,
  // 是否激活 APP 用户, 0-否 1-是
  appUser: 0 | 1,
}

/**
 * 关联设备
 */
export type RelatedDevice = {
  code: string,
  data: {
    entity: {
      id: number,
      code: string | number,
      name: string,
      // 0 - 设备在线
      status: null | 0 | 1 | '0' | '1',
      longitude?: number,
      latitude?: number,
    },
    id: number,
    isDefault: number,
  }[] | null,
  name: string,
  // 9 - 摄像头
  // 10 - 会场终端
  // 11 - 集群终端
  // 12 - 手持终端
  // 13 - App 终端
  type: number,
};

/**
 * 接口 ${soc}/mail/mailcontactor/info/${id} 返回的响应对象
 */
export type ContactInfoResponse = {
  code?: number,
  errorcode?: number,
  msg?: string,
  message?: string,
  mailContactor: Contact,
  resources: RelatedDevice[]
}

export default (contactID: number): [
  Ref<ContactInfoResponse | null>,
  (_contactID?: number) => void,
] => {
  const contactInfo = ref<ContactInfoResponse | null>(null);

  /**
   * 获取联系人详情信息
   * @param contactID 联系人 id
   */
  const getContactInfo = (_contactID: number = contactID): void => {
    contactInfo.value = null;

    const request = {
      method: 'POST',
      service: 'soc',
      url: `/mail/mailcontactor/info/${_contactID}`,
    } as const;

    $http(request).then((response) => {
      if (response.code === 0 || response.errorcode === 0) {
        contactInfo.value = response;
      } else {
        $message.error(`获取联系人信息失败，错误代码${response.code ?? response.errorcode
          }，错误信息：${response.msg ?? response.message
          }`);
      }
    }).catch((error: Error) => {
      $message.error(`获取联系人信息失败，错误信息：${error}`);
    });
  };

  if (contactID) {
    getContactInfo();
  }

  return [
    contactInfo,
    getContactInfo,
  ];
};
