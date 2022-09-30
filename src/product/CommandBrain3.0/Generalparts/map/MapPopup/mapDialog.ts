import { createVNode, render } from 'vue';
import MapPopupConstructor from './MapPopup.vue';
import useStore from './StandbyDialog/store/useStore';
import {
  useTransformModelAndRequest,
  useTransformResponseData,
} from './dialogConfigMap/useTransformModel';

interface RequestDataDto {
  id: string;
  eventId?: string;
  info?: any;
}

// 新增外部传的经纬度，若传优先使用该经纬度作为弹窗的打开
interface OpenProps {
  responseData?: any;
  requestData?: RequestDataDto;
  lat?: number;
  lon?: number;
}

let uids = 0;

const isDOM =
  typeof HTMLElement === 'object'
    ? (obj: any): boolean => obj instanceof HTMLElement
    : (obj: any): boolean =>
        obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';

// 默认弹窗配置 基本是在开发环境下 为了调试 关于这个默认弹窗 目前暂时用的otherDialog
const defaultDialog = (uid: number, options: any, vm: any, container: any) => {
  options.modle = 'other';
  render(vm, container);
  const data = {
    id: uid,
    class: container.firstElementChild,
    latitude: 23,
    longitude: 113.41,
  };
  window.map.mapPopup(data);
};

// 处理资源检索的弹窗
const deviceModle: Record<string, string> = {
  camera: 'device_0',
  device: 'device_1',
  colony: 'device_2',
  wecomm: 'device_3',
  refuge: 'resource_area',
  personnel: 'contactor_contactor',
  team: 'team_team',
  material: 'resource_articleStorehouse',
  equipment: 'resource_equipment',
  risk: 'riskDanger_0',
};

/** 升阶处理全局属性
 * 描述
 * @date 2021-06-11
 * @param {any} app:any
 * @returns {any}
 * ```js
 * //调用方式
 *  const mapDialogInstance = $mapDialog({
 *    modle: 'NoTabNormal',
 *  },'domElement'); //可传 可不传 定义弹窗插入的位置 默认是地图弹窗类型);
 *  mapDialogInstance.open({
 *     responseData?: any
 *     requestData?: RequestDataDto
 *  });
 * ```
 */
const MapDialog = (app: any): any => (options: any = {}, el: any, map: any) => {
  const { state, dispatch } = useStore();
  const container: any = document.createElement('div');

  const vm: any = createVNode(MapPopupConstructor, options, null);
  // 是否是地图弹窗
  if (el) {
    vm.props.isMapDialog = false;
  } else {
    vm.props.isMapDialog = true;
  }
  // 移除弹窗
  vm.props.destroy = () => {
    console.dir(vm.el);
    el && el.removeChild(vm.el);
  };

  // 存储上下文对象 须在render之前 不然组件内获取须在mounted里
  vm.appContext = app._context;

  // 是否是我自己的弹窗
  vm.props.visible = true;

  /**
   * 打开弹窗时 请求会在useTransformModelAndRequest进行弹窗数据获取
   * @date 2021-06-11
   * @param {any} props:Record<string,any> 这里规则是：
   * 有可能调用者是在外面请求好数据传过来的那就需要传responseData
   * 有可能调用者需要这里请求数据在处理，那就需要传requesetData 我目前都是用这种
   * 优先级是responseData > requesetData
   * @param {any} any>
   * @param {any} callBack:any 回调函数 额外配置 如需要 自定义规则
   * @returns {any}
   */
  vm.open = async (props: OpenProps, callBack: any): Promise<string | unknown> => {
    if (props.requestData && props.responseData) {
      console.warn('requestData and responseData does not exist on the same time');
      return Promise.resolve();
    }
    if (!props.requestData && !props.responseData) {
      // 开发环境下 简单打开弹窗
      // eslint-disable-next-line no-plusplus
      uids++;
      defaultDialog(uids, options, vm, container);
      console.warn('requestData and responseData pass in any one of them');
      return Promise.resolve(uids);
    }

    const translateReturnData: any = {};

    // 由于目前这个弹窗功能格式还未统一 try一下 不然程序卡死
    try {
      // 转化下设备modle
      if (deviceModle[options.modle]) {
        options.modle = deviceModle[options.modle];
      }
      let _translateReturnData: any = {};
      if (props.requestData) {
        _translateReturnData = await useTransformModelAndRequest(options.modle, props.requestData);
      } else if (props.responseData) {
        _translateReturnData = await useTransformResponseData(options.modle, props.responseData);
      }

      // 读取栈中存在的弹窗列表，是否已存在，是：不处理，否：打开
      if (state.dialogOpenedStack?.has(_translateReturnData.responseData.keyId)) {
        return Promise.resolve();
      }

      // 关闭上一个弹窗
      dispatch({
        type: 'closeAllDialog',
        payload: {
          map,
        },
      });
      // if (state.dialogPrevEl) {
      //   // 调用地图的方法卸载组件
      //   const mapObj = map || window.map;
      //   // 如果上一个是body弹窗需要执行使用原生dom操作删除
      //   if (state.prevBodyDom) {
      //     try {
      //       document.body.removeChild(state.prevBodyDom);
      //     } catch {}
      //   } else {
      //     mapObj.closeClearPopup(state.dialogPrevEl);
      //   }
      //   dispatch({
      //     type: 'cleanUpCurrentStateAction',
      //     payload: {
      //       uid: state.dialogPrevEl,
      //     },
      //   }).then(() => {
      //     // 删除打开的弹窗keyId
      //     dispatch({
      //       type: 'delDialogOpenedStack',
      //       payload: {
      //         keyId: Array.from(state.dialogOpenedStack as Set<string>)[0],
      //       },
      //     });
      //   });
      // }

      // 简单赋值操作
      Object.assign(translateReturnData, _translateReturnData);
      if (translateReturnData.modle) {
        options.modle = translateReturnData.modle;
      }
    } catch (error) {
      console.log(error);
      // 暂时出默认弹窗
      // eslint-disable-next-line no-plusplus
      uids++;
      // 默认modle
      // defaultDialog(uids, options, vm, container);
      return Promise.resolve(uids);
    }

    // 自定义规则配置 暂时没有什么特殊规则
    if (callBack) {
      callBack();
    }
    // eslint-disable-next-line no-plusplus
    uids++;
    options.uid = uids;
    if (props.requestData && props.requestData.info) {
      translateReturnData.responseData.handleType = props?.requestData?.info.handleType;
    }
    // 合并请求数据
    Object.assign(options, {
      options: translateReturnData,
    });
    // 初始化属于自己这个弹窗的state
    dispatch({
      type: 'initDialogStateAction',
      payload: {
        uid: uids,
      },
    });

    // render后 组件是已经处于挂载状态了 不要再render后对数据处理 不然需要在mounted里获取
    render(vm, container);

    // 打开的弹窗加入打开后的弹窗列表 解决重复点击弹窗继续打开弹窗 由于这里需要在render后才能拿到vm.el
    dispatch({
      type: 'addDialogOpenedStack',
      payload: {
        keyId: translateReturnData.responseData.keyId,
        uid: uids,
        prevBodyDom: el ? vm.el : null, // 如果是body弹窗就存起来 删除上一个弹窗需要
      },
    });

    const data = {
      id: uids,
      class: container.firstElementChild,
      // latitude: 23,
      // longitude: 113.41,
      latitude: props.lat || translateReturnData.responseData.latitude,
      longitude: props.lon || translateReturnData.responseData.longitude,
    };

    // 如果传了el的话就证明不是地图弹窗
    if (el) {
      if (isDOM(el)) {
        el.appendChild(container.firstElementChild);
        vm.el.childNodes[0].childNodes[0].style.position = 'fixed';
      } else {
        console.warn('el is not a HTMLElement');
      }
    } else {
      (map || (window as any).map).mapPopup(data);
    }
    console.log('%c [ vm ]', 'font-size:13px; background:pink; color:#bf2c9f;', vm);

    return Promise.resolve(uids);
  };

  return vm;
};

export default MapDialog;
