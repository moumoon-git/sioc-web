// global.d.ts
import { ComponentInternalInstance } from 'vue';
import MQClient from '@/product/CommandBrain3.0/mainCapacity/uds/MQClient';

interface RequestDataDto {
  id: number;
  eventId?: number;
}
interface OpenProps {
  responseData?: any;
  requestData?: RequestDataDto;
  lat?: number;
  lon?: number;
}

declare global {
  interface IGlobalAPI {
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
     * ```js
     * //调用方式
     *  const mapDialogInstance = $mapDialog({
     *    modle: 'NoTabNormal',
     *  },'domElement'); //可传 可不传 定义弹窗插入的位置 默认是地图弹窗类型
     *  mapDialogInstance.open({
     *     responseData?: any
     *     requestData?: RequestDataDto
     *  });
     * ```
     */
    $mapDialog: (
      options: {
        modle: string;
      },
      el?: HTMLElement,
    ) => {
      open: (props: OpenProps, callBack?: any) => Promise<string | unknown>;
    };

    $http(request: AxiosRequestConfig): any;
    $message: {
      info(message: string): void;
      error(message: string): void;
      (message: string): void;
    };
    $MessageBox(options: {
      type?: string;
      title?: string;
      message?: string;
      tips?: string;
      remark?: boolean;
      placeholder?: string;
    }): Promise<string>;

    $ws: MQClient;
  }
  // 继承 ComponentInternalInstance 接口
  interface ICurrentInstance extends ComponentInternalInstance {
    appContext: {
      config: { globalProperties: IGlobalAPI };
    };
  }
}
export {};
