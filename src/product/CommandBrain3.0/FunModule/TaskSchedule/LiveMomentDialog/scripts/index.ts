import { onMounted, ref, Ref } from 'vue';

type LiveMomentDialogConfig = {
  // 任务坐标
  longitude: number,
  latitude: number,
  // 任务地点
  address: string,
  // 上报时间
  reportTime: string,
  // 任务内容
  content: string,
  // 任务标题
  appEventTask: {
    title: string,
  },
  // 任务附件
  appAttachments: {
    // 扩展名
    extension: string,
    // 文件名
    filename: string,
    // 路径
    path: string,
  }[]
}

type MapDialog = {
  init(param: {
    longitude: number,
    latitude: number,
  }): void
}

// MapDialog 组件实例
const dialog = ref<MapDialog | null>(null);

// 当前数据
const currentDetail = ref<LiveMomentDialogConfig | null>(null);

/**
 * 打开弹窗
 *
 * @param config 弹窗参数：经纬度、地图实例
 */
const open = function open(config: LiveMomentDialogConfig) {
  currentDetail.value = config;
  if (
    config.longitude
    && config.latitude
    && dialog.value?.init
  ) {
    dialog.value.init({
      longitude: config.longitude,
      latitude: config.latitude,
    });
  }
};

export default (): {
  dialog: Ref<MapDialog | null>,
  open: (config: LiveMomentDialogConfig) => void,
  currentDetail: Ref<LiveMomentDialogConfig | null>,
} => {
  onMounted(() => {
    // 开发时测试用，直接显示弹窗
    // setTimeout(() => {
    //   const mapInstance = window.map.map;
    //   const center = mapInstance.getCenter();
    //   open({
    //     longitude: center.lon,
    //     latitude: center.lat,
    //     address: '地址',
    //     reportTime: '2021-04-19 15:37:41',
    //     content: '内容',
    //     appEventTask: {
    //       title: '标题',
    //     },
    //     appAttachments: [{
    //       path: 'www.baidu.com',
    //       filename: '123',
    //       extension: '.doc',
    //     }],
    //   });
    // }, 0);
  });
  return {
    dialog,
    open,
    currentDetail,
  };
};
