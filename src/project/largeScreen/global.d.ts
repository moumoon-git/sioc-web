// global.d.ts
import { ComponentInternalInstance } from 'vue';

interface RequestDataDto {
  id: number,
  eventId?: number
}
interface OpenProps {
  responseData?: any
  requestData?: RequestDataDto
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
     */
    $mapDialog: (options: {
      modle: string,
    }) => {
      open: (props: OpenProps, callBack?:any) => Promise<string | unknown>
    };

    $http(request: AxiosRequestConfig): any;
    $message: {
      info(message: string): void
      error(message: string): void
      (message: string): void
    };
    $MessageBox(options: {
      type?: string;
      title?: string;
      message?: string;
      tips?: string;
      remark?: boolean;
      placeholder?: string;
    }): Promise<string>
  }
  // 继承 ComponentInternalInstance 接口
  interface ICurrentInstance extends ComponentInternalInstance {
    appContext: {
      config: { globalProperties: IGlobalAPI };
    };
  }
}
export {};
