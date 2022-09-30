/*
  用于设置全局地图的落点
// 获取全局参数
  const instance = getCurrentInstance();
  const { $mapSetSpot }: any =instance?.appContext.config.globalProperties;
  // 设置落点的script
  const { setDrawConverge } = $mapSetSpot;
*/
import { ref } from 'vue';

type addEventlist = {
  click?: any
}
const mapDialogEl: any = ref({});
const http: any = ref({});

const spotClickFun = {

  /*
    modle 模块
    info 地图配置
    selfData 当前点的数据
  */
  open: (modle: string, info: any, eventId: number, map: any) => {
    const promise = new Promise((resolve, reject) => {
      const mapEl = mapDialogEl.value({ modle }, '', map);
      if (modle === 'flood') {
        mapEl.open({
          responseData: info
        });
      } else if (modle === 'live') {
        mapEl.open({
          responseData: info
        });
      } else{
        mapEl.open({
          requestData: {
            id: info.id,
            eventId,
            info,
          },
        });
      }
      // 弹窗组件的上下文
      // let ctx = mapEl.component.ctx;
      // ctx.open(config);
      resolve('');
    });
    return promise;
  },
};

// 设置聚合落点并添加事件
export function setDrawConver(key: string, data: any, ImgInfo: object, eventObj?: addEventlist, map?: any) {
  if (map) {
    map.drawConverge(key, data, ImgInfo, eventObj);
  } else {
    // console.log(data);
    (window as any).map.drawConverge(key, data, ImgInfo, eventObj);
  }
}

// 设置聚合落点
export function setDrawConverge(key: string, data: any, ImgInfo: object, addEventlist?: addEventlist, map?: any) {
  const eventObj: any = {
    click: (info: any, f: any) => {
      // 风险隐患: risk
      // 防护目标: protect
      // 应急物资库: material
      // 避难场所: refuge
      // 监控摄像头: camera
      // 会场终端: device
      // 集群终端: colony
      // wecomm终端: wecomm
      // 人员: personnel
      // let openModule = 'publicPopup';
      // switch (info.handleType) {
      //   case 'wecomm':
      //     openModule = 'NotabLocation';
      //     break;
      //   default:
      //     break;
      // }
      // 只有南海需要
      if (!info && (window as any).config.project === 'NH') {
        (map || (window as any).map).pixelToLatAndLon((window as any).xy).then((r: any) => {
          console.log(r);
          (map || (window as any).map).getMapMaxZoom().then((res: any) => {
            (map || (window as any).map).setCentent(r, (res - 2));
          });
        });
      }
      // 调用方法
      if (addEventlist) {
        addEventlist.click && addEventlist.click(info, f, spotClickFun);
      }
      if (info.sectionFlag) {
        return;
      }
      if (info.handleType === 'task') {
        info.handleType = 'task_';
      }
      console.log(info, 'info');
      // 打开弹窗
      spotClickFun.open(
        info.handleType,
        { ...info },
        data.eventId,
        (map || (window as any).map),
      );
    },
  };
  setDrawConver(key, data, ImgInfo, eventObj, map);
  // console.log(addEventlist, key, ImgInfo, data);
}

// 设置mark落点
export function setMark() {

}

function init(instance: any) {
  console.log(instance);
  const { $mapDialog, $http }: any = instance;
  http.value = $http;
  // 弹窗的el
  mapDialogEl.value = $mapDialog;
  return {
    // 设置聚合
    setDrawConverge,
    // 打开弹窗
    spotClickFun,
    // 设置聚合并绑定事件
    setDrawConver,
    // 设置mark
    // setMark
  };
}

export default init;
