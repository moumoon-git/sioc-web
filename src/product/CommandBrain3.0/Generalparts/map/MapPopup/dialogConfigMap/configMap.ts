import { InformationListDto, FooterBtnDto } from './configMapType';

// 脚部按钮映射
// type 摄像头0  会场终端1   集群终端2   手持终端WeComm 3
const deviceFooterMap: Record<string, string[]> = {
  device_0: ['邀请会议', '预览', '附近监控', '周边检索'],
  device_1: ['邀请会议', '语音点呼', '视频点呼', '附近监控', '周边检索'],
  device_2: ['邀请会议', '语音点呼', '视频点呼', '轨迹跟踪', '附近监控', '周边检索'],
  device_3: ['邀请会议', '轨迹跟踪', '附近监控', '周边检索'],
};

const footerFn = (arr: any[]): FooterBtnDto[] => {
  const footerBtn: Record<string, FooterBtnDto> = {
    电话呼叫: {
      type: 'phone',
      icon: 'phone',
      dec: '电话呼叫',
      activeClass: '',
    },
    短信呼叫: {
      type: 'msg',
      icon: 'msg',
      dec: '短信呼叫',
      activeClass: '',
    },
    语音点呼: {
      type: 'chat',
      icon: 'chat',
      dec: '语音点呼',
      activeClass: '',
    },
    预览: {
      type: 'preview',
      icon: 'preview',
      dec: '预览',
      activeClass: '',
    },
    视频点呼: {
      type: 'vedio',
      icon: 'vedio',
      dec: '视频点呼',
      activeClass: '',
    },
    现场直播: {
      type: 'play',
      icon: 'play',
      dec: '现场直播',
      activeClass: '',
    },
    轨迹跟踪: {
      type: 'track',
      icon: 'track',
      dec: '轨迹跟踪',
      activeClass: '',
    },
    邀请会议: {
      type: 'conf',
      icon: 'conf',
      dec: '邀请会议',
      activeClass: '',
    },
    周边检索: {
      type: 'rim',
      icon: 'rim',
      dec: '周边检索',
      activeClass: '',
    },
    附近监控: {
      type: 'camera',
      icon: 'camera',
      dec: '附近监控',
      activeClass: '',
    },
    详细信息: {
      type: 'detail',
      icon: 'detail',
      dec: '详细信息',
      activeClass: '',
    },
    应急物资库详细信息: {
      type: 'articleStoreHouseDetail',
      icon: 'detail',
      dec: '详细信息',
      activeClass: '',
    },
  };
  return arr.map((item: any) => (item = footerBtn[item]));
};

// app是否在线
const isAppOnline = (appStatus: number) => appStatus;
// 默认设备返回
const deviceDefault = (deviceList: any[]) => {
  let _deviceDefault = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of deviceList) {
    if (item.isDefault) {
      _deviceDefault = item;
      break;
    }
  }
  return _deviceDefault;
};
// 是否下线15分钟
const timeout15Min = (lastTime: any) => {
  if (!lastTime) return true;
  const lastLoginTime: any = new Date(lastTime).getTime();
  const now = Date.now();
  const min15 = 0.15 * 60 * 60 * 1000;
  return now - lastLoginTime > min15;
};

// const createPosition = (isAppOnlineFn: any) => (deviceDefaultItem: any) => (
//   timeout15MinFn: any,
// ) => (appData: any, deviceData: any) => {
//   // 判断条件优先写在顶层，优化代码
//   const _deviceDefault = deviceDefaultItem(deviceData);
//   const _isAppOnline = !!isAppOnlineFn(appData.appStatus); // 0不在线 1 在线
//   const isDeViceOnline = !(_deviceDefault?.status || 0); // 0在线 1不在线
//   console.log(_deviceDefault, '_deviceDefault');
//   // app在线
//   if (_isAppOnline) {
//     return {
//       status: 'currentPosition',
//       positionText: appData.address,
//       latitude: appData.latitude,
//       longitude: appData.longitude,
//     };
//   }
//   // app不在线 设备在线
//   else if (!_isAppOnline && _deviceDefault && isDeViceOnline) {
//     return {
//       status: 'currentPosition',
//       positionText: _deviceDefault.address,
//       latitude: _deviceDefault.latitude,
//       longitude: _deviceDefault.longitude,
//     };
//   }
//   // app不在线 设备不在线且下线不超过15分钟
//   else if (
//     !_isAppOnline &&
//     _deviceDefault &&
//     !isDeViceOnline &&
//     !timeout15MinFn(_deviceDefault.lastLoginTime)
//   ) {
//     return {
//       status: 'lastPosition',
//       positionText: _deviceDefault.address,
//       latitude: _deviceDefault.latitude,
//       longitude: _deviceDefault.longitude,
//     };
//   }
//   // 离线
//   else {
//     return {
//       status: 'offlinePosition',
//       positionText: '暂无定位信息',
//     };
//   }
// };

const createPosition = (isAppOnlineFn: any) => (timeout15MinFn: any) => (
  appData: any,
  deviceData?: any,
) => {
  console.log(
    '%c [ xxx ]',
    'font-size:13px; background:pink; color:#bf2c9f;',
    timeout15MinFn(appData.locationUpdateTime),
  );
  // 判断条件优先写在顶层，优化代码
  const _isAppOnline = !!isAppOnlineFn(appData.appStatus); // 0不在线 1 在线
  // app在线
  if (_isAppOnline) {
    return {
      status: 'currentPosition',
      positionText: appData.address || '暂无位置',
      latitude: appData.latitude,
      longitude: appData.longitude,
    };
  }
  // app不在线 且app下线不超过15分钟
  else if (!_isAppOnline && !timeout15MinFn(appData.locationUpdateTime)) {
    return {
      status: 'lastPosition',
      positionText: appData.address || '暂无位置',
      latitude: appData.latitude,
      longitude: appData.longitude,
    };
  }
  // 离线
  else {
    return {
      status: 'offlinePosition',
      positionText: appData.address || '暂无位置',
      latitude: appData.latitude,
      longitude: appData.longitude,
    };
  }
};

// 判断定位弹窗信息 太复杂了 这逻辑 优先级 isAppOnline => deviceDefault => timeout15Min
// const position = createPosition(isAppOnline)(deviceDefault)(timeout15Min);
const position = createPosition(isAppOnline)(timeout15Min);

// 设备行数据处理
const relatedEquipmentListProcess = (device: any[]) =>
  device.map((item: any) => {
    let title = '';
    switch (item.type) {
      case 0:
        title = '监控视频';
        break;
      case 1:
        title = '会场终端';
        break;
      case 2:
        title = '集群终端';
        break;
      case 3:
        title = 'WeComm';
        break;
      default:
        break;
    }
    return {
      title,
      dec: item.name,
      ...item,
    };
  });

// 防护等级映射
// eslint-disable-next-line no-shadow
enum ProtectLevelMap {
  '特别重要防护' = 1,
  '重要防护',
  '较高防护',
  '一般防护',
}

// 风险隐患可控程度映射
// eslint-disable-next-line no-shadow
enum ControllabilityMap {
  '可控' = 1,
  '基本可控',
  '较难控制',
  '基本失控',
}

// 风险隐患程度映射
// eslint-disable-next-line no-shadow
enum DangerLevelMap {
  '一般' = 1,
  '较大',
  '重大',
  '特别重大',
}

/**
 * ver2.0改版 mapValue改为工厂函数返回对象 解决浅拷贝带来的问题
 * 并新增外层传进来的Modelkey 可以在正则那边做下映射
 * 定义弹窗modle 本来定义成树的 但是考虑到查询比较慢
 * 并且map数据结构支持正则为key 对象不支持
 * 快速折叠 ctrl+k 再 ctrl+0
 */
const dialogMap: Map<string | RegExp, any> = new Map();

// 1.物资应急库弹窗 resource_articleStorehouse
dialogMap.set('resource_articleStorehouse', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '应急物资库',
  // 脚部按钮
  footerBtn: footerFn(['应急物资库详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getProductLibraryDetails',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resoureArticleStorehouse, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '物资库名称',
          dec: resoureArticleStorehouse.name,
        },
        {
          title: '所在地址',
          dec: resoureArticleStorehouse.address,
          hasLocationBtn: true,
          latitude: resoureArticleStorehouse.latitude,
          longitude: resoureArticleStorehouse.longitude,
        },
        {
          title: '物资种类',
          dec: resoureArticleStorehouse.typeSize,
        },
      ],
      _moreInfo: [
        {
          title: '仓库面积',
          dec: resoureArticleStorehouse.acreage,
        },
        {
          title: '负责人',
          contactorList: resoureArticleStorehouse.contactorList,
        },
        {
          title: '主管单位',
          dec: resoureArticleStorehouse.groupName,
        },
        {
          title: '主管单位地址',
          dec: resoureArticleStorehouse.responsibleUnitAddress,
        },
        {
          title: '周边交通',
          dec: resoureArticleStorehouse.aroundTraffic,
        },
        {
          title: '备注',
          dec: resoureArticleStorehouse.remark,
        },
      ],
    };

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    return {
      dialogType: 'articleStorehouse',
      keyId: `articleStorehouse_${resoureArticleStorehouse.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...resoureArticleStorehouse,
    };
  },
}));

// 2.避难场所弹窗
dialogMap.set('resource_area', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '避难场所',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getResoureAreaDetails',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resoureArea, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '避难场所名称',
          dec: resoureArea.name,
        },
        {
          title: '行政区划',
          dec: resoureArea.townName,
        },
        {
          title: '所在地址',
          dec: resoureArea.address,
          hasLocationBtn: true,
          latitude: resoureArea.latitude,
          longitude: resoureArea.longitude,
        },
        {
          title: '场所功能',
          dec: resoureArea.feature,
        },
        {
          title: '联系人',
          contactorList: resoureArea.contactorList || resoureArea.contactorlist,
        },
        {
          title: '负责人',
          contactorList: resoureArea.principalList,
        },
      ],
      _moreInfo: [
        {
          title: '面积(㎡)',
          dec: resoureArea.acreage,
        },
        {
          title: '可容纳人数',
          dec: resoureArea.peopleNum,
        },
        {
          title: '抗震设防程度',
          dec: resoureArea.level,
        },
        {
          title: '使用时间',
          dec: resoureArea.useTime,
        },
        {
          title: '设计使用年限',
          dec: resoureArea.useYear,
        },
        {
          title: '主管单位',
          dec: resoureArea.competentUnit,
        },
        {
          title: '应急标识',
          dec:
            resoureArea.emergencyFlag === 1
              ? '专职'
              : resoureArea.emergencyFlag === 2
              ? '兼职'
              : '专业志愿者',
        },
        {
          title: '给排水情况',
          dec: resoureArea.waterDetails,
        },
        {
          title: '供电状况',
          dec: resoureArea.electricityDetails,
        },
        {
          title: '通电状况',
          dec: resoureArea.competentUnit,
        },
        {
          title: '通风状况',
          dec: resoureArea.windDetails,
        },
        {
          title: '应急器材',
          dec: resoureArea.emergencyEquipment,
        },
        {
          title: '储备物资',
          dec: resoureArea.storeMaterials,
        },
        {
          title: '备注',
          dec: resoureArea.remark,
        },
      ],
    };

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    return {
      dialogType: 'area',
      keyId: `area_${resoureArea.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...resoureArea,
    };
  },
}));

// 3.应急装备弹窗
dialogMap.set('resource_equipment', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '应急装备',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getResoureEquipmentDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resoureEquipment, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '装备名称',
          dec: resoureEquipment.name,
        },
        {
          title: '所属装备库',
          dec: resoureEquipment.groupId,
        },
        {
          title: '装备类别',
          dec: resoureEquipment.className,
        },
      ],
      _moreInfo: [
        {
          title: '装备数量',
          dec: resoureEquipment.number,
        },
      ],
    };

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'equipment',
      keyId: `equipment_${resoureEquipment.id}`,
      informationList,
      labelList,
      ...resoureEquipment,
    };
  },
}));

// 4.任务详情弹窗
dialogMap.set(/task_\d?/, (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'task',
  // 标题
  title: '',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getTaskDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => ({
    dialogType: 'task',
    keyId: `task_${data.data.id}`,
    title: data.data.title,
    ...data.data,
  }),

  // 处理不经请求的数据 也就是不传requestData
  noRequestdataProcessing: (data: any) => ({
    dialogType: 'task',
    keyId: `task_${data.id}`,
    title: data.title,
    ...data,
  }),
}));

// 5.设备弹窗
dialogMap.set(/device_\d?/, (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NotabLocation',
  // 标题
  title: '会场终端',
  // 脚部按钮 这里改为getter
  get footerBtn() {
    return footerFn(deviceFooterMap[wrapKey]);
  },
  // 请求接口
  requestApi: 'getDeviceDetail',
  // 数据处理转化成组件需要的数据 type 摄像头0  会场终端1   集群终端2   手持终端3
  dataProcessing: (data: any) => {
    const { appDevice, label, resources } = data.data;
    let type = '';
    let title = '';
    switch (appDevice.type) {
      case 0:
        type = '监控视频';
        title = '监控详情';
        break;
      case 1:
        type = '会场终端';
        title = '会场终端';
        break;
      case 2:
        type = '集群终端';
        title = '集群终端';
        break;
      case 3:
        type = 'WeComm';
        title = 'WeComm';
        break;
      default:
        break;
    }
    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '设备名称',
          dec: appDevice.name,
        },
        {
          title: '设备类型',
          dec: type,
        },
        {
          title: '设备地址',
          dec: appDevice.address,
        },
      ],
      _moreInfo: [],
    };

    // 关联资源行
    const relatedResourcesList =
      resources &&
      resources.map((resource: any) => ({
        title: resource.name,
        dec: resource.data && resource.data[0]?.entity?.name,
        hasContactBtn: resource.type === 1,
        ...resource?.data[0],
      }));

    // 假设备行 为了处理会场终端及集群终端可以 视频点呼 语音点呼
    const relatedEquipmentList = [];
    if (appDevice.type === 1 || appDevice.type === 2) {
      relatedEquipmentList.push({
        type: 3, // 这个我也不知道为什么定义为3 看看FooterOperation.vue的hasWecomm那个computed是拿的3
        id: appDevice.id,
        name: appDevice.name,
        code: appDevice.code,
      });
    }

    // 轨迹跟踪的标识 0-人员，1-设备
    appDevice.isDevice = 1;

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'device',
      keyId: `device_${appDevice.id}`,
      title,
      relatedEquipmentList,
      informationList,
      relatedResourcesList,
      labelList,
      ...appDevice,
    };
  },
}));

// 6.防护目标弹窗
dialogMap.set('protect', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '防护目标',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getResoureProtectDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { ResoureProtectTargetEntity, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '防护名称',
          dec: ResoureProtectTargetEntity.name,
        },
        {
          title: '防护类型',
          dec: ResoureProtectTargetEntity.className,
        },
        {
          title: '所在地址',
          dec: ResoureProtectTargetEntity.location,
          hasLocationBtn: true,
          latitude: ResoureProtectTargetEntity.latitude,
          longitude: ResoureProtectTargetEntity.longitude,
        },
        {
          title: '防护等级',
          dec: ProtectLevelMap[ResoureProtectTargetEntity.protectLevel],
        },
        {
          title: '主体单位',
          dec: ResoureProtectTargetEntity.chargeUnit,
        },
        {
          title: '联系人',
          contactorList:
            ResoureProtectTargetEntity.contactorList || ResoureProtectTargetEntity.contactsList,
        },
        {
          title: '负责人',
          contactorList: ResoureProtectTargetEntity.responsiblesList,
        },
      ],
      _moreInfo: [
        {
          title: '面积(㎡)',
          dec: ResoureProtectTargetEntity.areaSize,
        },
        {
          title: '当前人数',
          dec: ResoureProtectTargetEntity.nowNumber,
        },
        {
          title: '可容纳人数',
          dec: ResoureProtectTargetEntity.canuseNumber,
        },
        {
          title: '成立时间',
          dec: ResoureProtectTargetEntity.useTime,
        },
        {
          title: '行政区划',
          dec: ResoureProtectTargetEntity.areaName,
        },
        {
          title: '防护措施',
          dec: ResoureProtectTargetEntity.conservatoryMeasure,
        },

        {
          title: '应急通讯方式',
          dec: ResoureProtectTargetEntity.communicationMode,
        },
        {
          title: '备注',
          dec: ResoureProtectTargetEntity.remark,
        },
      ],
    };

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'protect',
      keyId: `protect_${ResoureProtectTargetEntity.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...ResoureProtectTargetEntity,
    };
  },
}));

// 7.联系人详情弹窗
dialogMap.set('contactor_contactor', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '联系人信息',
  // 脚部按钮
  footerBtn: footerFn([
    '电话呼叫',
    '短信呼叫',
    '语音点呼',
    '视频点呼',
    '现场直播',
    '轨迹跟踪',
    '邀请会议',
    '周边检索',
    '附近监控',
    '详细信息',
  ]),
  // 请求接口
  requestApi: 'getMailContactorDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { mailContactor, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '姓名',
          dec: `${mailContactor.name}${
            mailContactor.sex === 0 ? '（男）' : mailContactor.sex === 1 ? '（女）' : ''
          }`,
        },
        {
          title: '单位',
          dec: mailContactor.workUnit,
        },
        {
          title: '职务',
          dec: mailContactor.position,
        },
      ],
      _moreInfo: [
        {
          title: '手机号码',
          dec: mailContactor.mobile1 ? mailContactor.mobile1 : '-',
        },
        {
          title: '办公电话',
          dec: mailContactor.officeTel ? mailContactor.officeTel : '-',
        },
        {
          title: '家庭电话',
          dec: mailContactor.homeTel ? mailContactor.homeTel : '-',
        },
        {
          title: '备注',
          dec: mailContactor.remark ? mailContactor.remark : '-',
        },
      ],
    };

    // 头像
    const profilePic = mailContactor.images
      ? mailContactor.images?.startsWith('http')
        ? mailContactor.images
        : `${(window as any).config.baseURL}${mailContactor.images}`
      : '';

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    // 定位信息
    const locationInfo = position(mailContactor, device);
    console.log(locationInfo, 'resss');

    // 轨迹跟踪的标识 0-人员，1-设备
    mailContactor.isDevice = 0;
    return {
      dialogType: 'contactor',
      keyId: `contactor_${mailContactor.id}`,
      profilePic,
      informationList,
      relatedEquipmentList,
      labelList,
      locationInfo,
      ...mailContactor,
    };
  },
}));

// 8.应急队伍详情弹窗
dialogMap.set('team_team', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '应急队伍',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getResoureTeamDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resoureTeam, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '队伍名称',
          dec: resoureTeam.name,
        },
        {
          title: '队伍类型',
          dec: resoureTeam.teamTypeName,
        },
        {
          title: '队伍单位',
          dec: resoureTeam.groupName,
        },
        {
          title: '队伍人数',
          dec: resoureTeam.peopleNumber,
        },
        {
          title: '队伍联系人',
          contactorList: resoureTeam.contactsList,
        },
        {
          title: '队伍负责人',
          contactorList: resoureTeam.responsiblesList,
        },
      ],
      _moreInfo: [
        {
          title: '队伍地址',
          dec: resoureTeam.address ? resoureTeam.address : '-',
          hasLocationBtn: true,
          latitude: resoureTeam.latitude,
          longitude: resoureTeam.longitude,
        },
        {
          title: '成立时间',
          dec: resoureTeam.creationTime,
        },
        {
          title: '传真',
          dec: resoureTeam.fax,
        },
        {
          title: '值班电话',
          dec: resoureTeam.telephoneNum,
        },
        {
          title: '应急通讯方式',
          dec: resoureTeam.communicationMethod,
        },
        {
          title: '邮政编码',
          dec: resoureTeam.postalCode,
        },
        {
          title: '应急准备时间(分钟)',
          dec: resoureTeam.preparationTime,
        },
        {
          title: '资质等级',
          dec: resoureTeam.qualificationLevel,
        },
        {
          title: '性质',
          dec: resoureTeam.nature === 1 ? '专职' : resoureTeam.nature === 2 ? '兼职' : '专业志愿者',
        },
        {
          title: '职责',
          dec: resoureTeam.duties,
        },
        {
          title: '装备',
          dec: resoureTeam.equipment,
        },
        {
          title: '专长',
          dec: resoureTeam.specialty,
        },
        {
          title: '经历',
          dec: resoureTeam.rescueExperience,
        },
        {
          title: '备注',
          dec: resoureTeam.remark,
        },
      ],
    };

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'team',
      keyId: `team_${resoureTeam.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...resoureTeam,
    };
  },
}));

// 9.应急专家详情弹窗
dialogMap.set('resource_expert', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '应急专家',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getResoureExpertDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: async (data: any) => {
    const { data: resoureExpert, label, device } = data;
    const res = await window.map.getMapCenter();
    resoureExpert.latitude = res.lat;
    resoureExpert.longitude = res.lon;
    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '专家姓名',
          dec: resoureExpert.name,
        },
        {
          title: '专业类型',
          dec: resoureExpert.majorType,
        },
        {
          title: '专家组',
          dec: resoureExpert.dutyName,
        },
      ],
      _moreInfo: [],
    };

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'expert',
      keyId: `expert_${resoureExpert.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...resoureExpert,
    };
  },
}));

// 10.应急装备库详情弹窗
dialogMap.set('resource_equipmentgroup', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '应急装备库',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getResoureEquipmentgroupDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resoureEquipmentGroup, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '装备名称',
          dec: resoureEquipmentGroup.name,
        },
        {
          title: '所在地址',
          dec: resoureEquipmentGroup.address,
          hasLocationBtn: true,
          latitude: resoureEquipmentGroup.latitude,
          longitude: resoureEquipmentGroup.longitude,
        },
        {
          title: '主管单位',
          dec: resoureEquipmentGroup.responsibleUnitAddress,
        },
      ],
      _moreInfo: [
        {
          title: '负责人',
          contactorList: resoureEquipmentGroup.contactorList,
        },
      ],
    };

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'equipmentGroup',
      keyId: `equipmentGroup_${resoureEquipmentGroup.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...resoureEquipmentGroup,
    };
  },
}));

// 11.应急物资详情弹窗
dialogMap.set('material', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '应急物资',
  // 脚部按钮
  footerBtn: footerFn(['详细信息', '附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getResoureArticleDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resoureArticle, label } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '物资名称',
          dec: resoureArticle.name,
        },
        {
          title: '物资类型',
          dec: resoureArticle.typeName,
        },
        {
          title: '设备地址',
          dec: resoureArticle.factory,
        },
      ],
      _moreInfo: [
        {
          title: '物资数量',
          dec: resoureArticle.amount,
        },
      ],
    };

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'article',
      keyId: `article_${resoureArticle.id}`,
      informationList,
      labelList,
      ...resoureArticle,
    };
  },
}));

// 12.事件详情弹窗
dialogMap.set('event', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'event',
  // 标题
  title: '事件详情',
  // 脚部按钮
  footerBtn: footerFn(['附近监控', '周边检索']),
  // 请求接口
  requestApi: 'getEventDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resoureArticle, label } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '物资名称',
          dec: resoureArticle.name,
        },
        {
          title: '物资类型',
          dec: resoureArticle.typeName,
        },
        {
          title: '设备地址',
          dec: resoureArticle.factory,
        },
      ],
      _moreInfo: [
        {
          title: '物资数量',
          dec: resoureArticle.amount,
        },
      ],
    };

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'event',
      keyId: `event_${resoureArticle.id}`,
      informationList,
      labelList,
      ...resoureArticle,
    };
  },

  // 处理不经请求的数据 也就是不传requestData
  noRequestdataProcessing: (data: any) => {
    // 标签行
    const labelList = data.label ? data.label.map((item: any) => item.labelName) : [];
    return {
      dialogType: 'event',
      keyId: `event_${data.id}`,
      title: data.title,
      labelList,
      ...data,
    };
  },
}));

// 13.风险隐患详情弹窗
dialogMap.set(/riskDanger_\d?/, (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '风险隐患',
  // 脚部按钮 这里改为getter
  get footerBtn() {
    return footerFn(['详细信息', '附近监控', '周边检索']);
  },
  // 请求接口
  requestApi: 'getRiskDangerDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { riskDanger, label, device } = data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '隐患源',
          dec: riskDanger.source,
        },
        {
          title: '隐患类型',
          dec: riskDanger.typeName,
        },
        {
          title: '所在地址',
          dec: riskDanger.address,
          hasLocationBtn: true,
          latitude: riskDanger.latitude,
          longitude: riskDanger.longitude,
        },
        {
          title: '整改期限',
          dec: riskDanger.deadlineForRectification,
        },
        {
          title: '可控程度',
          dec: ControllabilityMap[riskDanger.controllability],
        },
      ],
      _moreInfo: [
        {
          title: '隐患等级',
          dec: DangerLevelMap[riskDanger.level],
        },
        {
          title: '造成影响',
          dec: riskDanger.possibleImpact,
        },
        {
          title: '处理能力',
          dec: riskDanger.disposingCapacityOrResourceReserve,
        },
        {
          title: '整改措施',
          dec: riskDanger.rectificationMeasuresSituation,
        },
        {
          title: '联系人',
          contactorList: [
            {
              id: riskDanger.notificationObjectId,
              name: riskDanger.contacts,
              mobile1: riskDanger.contactTelephone,
            },
          ],
        },
        {
          title: '联系电话',
          dec: riskDanger.contactTelephone,
        },
        {
          title: '负责人',
          contactorList: [
            {
              id: riskDanger.principalId,
              name: riskDanger.principalName,
              mobile1: riskDanger.principalMobile,
            },
          ],
        },
        {
          title: '负责人电话',
          dec: riskDanger.principalMobile,
        },
        {
          title: '附件',
          dec: '-',
        },
      ],
    };

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'riskDanger',
      keyId: `danger_${riskDanger.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...riskDanger,
    };
  },
}));

// 14.动态轨迹任务详情弹窗
dialogMap.set('taskTrack', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'taskTrack',
  // 标题
  title: '',
  // 脚部按钮
  footerBtn: footerFn([]),
  // 请求接口
  requestApi: 'getTaskDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => ({
    dialogType: 'task',
    keyId: `task_${data.data.id}`,
    title: data.data.title,
    ...data.data,
  }),

  // 处理不经请求的数据 也就是不传requestData
  noRequestdataProcessing: (data: any) => ({
    dialogType: 'taskTrack',
    title: data.title,
    ...data,
  }),
}));

// 15.南海其他特殊弹窗
dialogMap.set(/special_\w+/, (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '内涝',
  // 脚部按钮
  footerBtn: footerFn(['附近监控', '周边检索']),

  // 处理不经请求的数据 也就是不传requestData
  noRequestdataProcessing: (data: Record<string, any>) => {
    const informationList: InformationListDto = {
      mainInfo: [],
      _moreInfo: [],
      hasAttention: false,
    };
    const englishReg = new RegExp('[A-Za-z]+');
    for (const key in data) {
      // 中文字段
      if (!englishReg.test(key)) {
        informationList.mainInfo.push({
          title: key,
          dec: data[key],
        });
      }
    }

    const titleMap: Record<string, string> = {
      special_flood: '内涝',
      special_parking: '停车场',
      special_gas: '加油站',
      special_industrial: '工业区',
    };

    return {
      title: titleMap[wrapKey],
      dialogType: wrapKey,
      keyId: `${wrapKey}_${data.SmID}`,
      informationList,
      ...data,
    };
  },
}));

// 16.医疗机构详情弹窗medical
dialogMap.set('medical', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '医疗机构',
  // 脚部按钮 这里改为getter
  get footerBtn() {
    return footerFn(['详细信息', '附近监控', '周边检索']);
  },
  // 请求接口
  requestApi: 'getHealthDeptDetail',
  // 数据处理转化成组件需要的数据
  dataProcessing: (data: any) => {
    const { resourceHealthDept, label, device } = data.data;

    // 信息行
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '名称',
          dec: resourceHealthDept.name,
        },
        {
          title: '地址',
          dec: resourceHealthDept.address || '-',
          hasLocationBtn: true,
          latitude: resourceHealthDept.latitude,
          longitude: resourceHealthDept.longitude,
        },
        {
          title: '类别',
          dec: resourceHealthDept.typeName,
        },
      ],
      _moreInfo: [
        {
          title: '分组',
          dec: resourceHealthDept.belongGroupName || '-',
        },
        {
          title: '传真',
          dec: resourceHealthDept.fax || '-',
        },
        {
          title: '值班电话',
          dec: resourceHealthDept.dutyTel || '-',
        },
        {
          title: '等级',
          dec: resourceHealthDept.levelName || '-',
        },
        {
          title: '急救车辆数',
          dec: resourceHealthDept.ambulanceNum || '-',
        },
        {
          title: '全血库存',
          dec: resourceHealthDept.wholeBlood || '-',
        },
        {
          title: '血浆库存',
          dec: resourceHealthDept.bloodPlasma || '-',
        },
        {
          title: '病床数',
          dec: resourceHealthDept.bedNum || '-',
        },
        {
          title: '血小板库存',
          dec: resourceHealthDept.bloodPlatelet || '-',
        },
        {
          title: '医生数',
          dec: resourceHealthDept.doctorNum || '-',
        },
        {
          title: '护士数',
          dec: resourceHealthDept.nurseNum || '-',
        },
        {
          title: '装备描述',
          dec: resourceHealthDept.equipDesc || '-',
        },
        {
          title: '备注',
          dec: resourceHealthDept.notes || '-',
        },
        {
          title: '联系人',
          contactorList: resourceHealthDept.contactsList || [],
        },
        {
          title: '负责人',
          contactorList: resourceHealthDept.responsiblesList || [],
        },
      ],
    };

    // 关联设备行
    const relatedEquipmentList = device && relatedEquipmentListProcess(device);

    // 标签行
    const labelList = label
      ? label.map((item: any) => ({ name: item.labelName, id: item.labelId }))
      : [];

    return {
      dialogType: 'medical',
      keyId: `medical_${resourceHealthDept.id}`,
      informationList,
      relatedEquipmentList,
      labelList,
      ...resourceHealthDept,
    };
  },
}));

// 直播 live
dialogMap.set('live', (wrapKey: string) => ({
  // 关联的弹窗
  modle: 'NoTabNormal',
  // 标题
  title: '直播',
  // 脚部按钮
  footerBtn: footerFn([]),

  // 处理不经请求的数据 也就是不传requestData
  noRequestdataProcessing: (data: Record<string, any>) => {
    data.userVo.id = data?.userVo.userId;
    data.userVo.name = `${data?.userVo.name}（${data?.userVo.department}/${data?.userVo.roleName}）` ;
    const informationList: InformationListDto = {
      mainInfo: [
        {
          title: '联系人',
          contactorList: [data.userVo],
        },
        {
          title: '地址',
          dec: data.liveAddress || '-',
          hasLocationBtn: true,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      ],
      _moreInfo: [],
      hasAttention: false,
    };
    const englishReg = new RegExp('[A-Za-z]+');
    for (const key in data) {
      // 中文字段
      if (!englishReg.test(key)) {
        informationList.mainInfo.push({
          title: key,
          dec: data[key],
        });
      }
    }

    return {
      title: '直播',
      dialogType: wrapKey,
      liveData: data,
      keyId: `${wrapKey}_${data.id}`,
      informationList,
      labelList: [],
      ...data,
    };
  },
}));

export default dialogMap;
