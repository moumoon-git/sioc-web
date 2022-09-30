import { onMounted, ref, onBeforeUnmount, watch } from 'vue';

type MapDialogInitConfig = {
  longitude?: number;
  latitude?: number;
  map?: any;
  info?: any;
  http?: any;
};

type MapDialog = {
  init(param: MapDialogInitConfig): any;
};
// 标题
const title = ref('cs');
const $http = ref<any>({});
// MapDialog 组件实例
const MapDialogs = ref<MapDialog | null>(null);
// 当前模块
const selfModule = ref<string>('');
// 显示的数据
const visData = ref<any>({});
/**
 * 打开弹窗
 *
 * @param config 弹窗参数：经纬度、地图实例
 */
const open = function open(config: MapDialogInitConfig) {
  const promise = new Promise((resolve, reject) => {
    if (MapDialogs?.value?.init) {
      MapDialogs.value.init(config).then((r: any) => {
        resolve(r);
      });
      let request = {};
      const { info } = config;
      console.log(info);
      if (info) {
        $http.value = config.http;
        selfModule.value = info.handleType;
        switch (info.handleType) {
          case 'wecomm':
            request = {
              method: 'post',
              url: `/device/appdevice/info/${info.deviceId}`,
              headers: {
                'Content-Type': 'application/json',
              },
              service: 'device',
              data: {},
            };
            $http.value(request).then((r: any) => {
              console.log(r);
            });
            break;
          case 'camera':
            break;
          case 'wecomm':
            break;
          case 'event':
            visData.value = info;
            title.value = info.title;
            break;
          case 'protect':
            const formData = new FormData();
            formData.append('id', info.id);
            request = {
              method: 'post',
              url: '/resoure/resoureProtectTarget/info',
              service: 'soc',
              data: formData,
            };
            $http.value(request).then((r: any) => {
              if (r.code === 0) {
                console.log(r.ResoureProtectTargetEntity);
              }
            });
            break;
          default:
            break;
        }
      }
    }
  });
  return promise;
};
let activeComponent = '';

// 定义补充弹窗的数组
const supplementDialog: Set<string> = new Set(['NotabLocation', 'NoTabNormal', 'MaterialsTab']);
/*
 task           任务
 contact        联系人
 MaterialsTab   资源信息切换
 NotabLocation  当前定位
 NoTabNormal    资源信息
 other          其他
*/
function setModle(modle: string) {
  // console.log(modle);
  switch (modle) {
    case 'task':
      activeComponent = 'TaskDialog';
      break;
    case 'contact':
      activeComponent = 'ContactInfoDialog';
      // activeComponent.value = 'StandbyDialog'
      break;
    case 'other':
      activeComponent = 'OtherDialog';
      break;
    case 'publicPopup':
      activeComponent = 'publicPopup';
      break;
    case 'taskTrack':
      activeComponent = 'TaskTrackDialog';
      break;
    // 事件弹窗
    case 'event':
      activeComponent = 'Event';
      break;
    default:
      activeComponent = '';
      break;
  }
  if (supplementDialog.has(modle)) {
    activeComponent = 'StandbyDialog';
  }
  // console.log(activeComponent.value);
}
export default (props: any, instance: any) => {
  const activeSupplementDialog = props.modle;
  setModle(props.modle);
  onMounted(() => {
    // 开发时测试用，直接显示弹窗
    // setTimeout(() => {
    //   const mapInstance = window.map.map;
    //   const center = mapInstance.getCenter();
    // open({
    //   longitude: center.lon,
    //   latitude: center.lat,
    // });
    // }, 0);
  });
  onBeforeUnmount(() => {
    // set数据结构需要手动垃圾回收
    supplementDialog.clear();
  });

  return {
    // 标题
    title,
    // 激活的模块
    activeComponent,
    // 地图弹窗的元素
    MapDialogs,
    // 打开弹窗的参数
    open,
    // 补充弹窗的模块
    activeSupplementDialog,
    // 当前模块
    selfModule,
    // 显示的数据
    visData,
  };
};
