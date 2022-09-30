import dialogConfigMap from './configMap';
import * as requestApis from '../services/index';

interface ResponceType {
  title: string;
  modle?: string;
  footerBtn: any;
  responseData: any[];
}

interface RequestDataDto {
  id: string;
  eventId?: string | any;
}

const mapIterator = <T>(
  dialogType: string,
  config: Map<string | RegExp, any>,
): Record<string, T> => {
  let dialogMapValue = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of config) {
    // 判断key是否是正则
    if (key instanceof RegExp) {
      if (key.test(dialogType)) {
        dialogMapValue = value(dialogType);
        break;
      }
    } else if (key === dialogType) {
      dialogMapValue = value();
      break;
    }
  }

  return dialogMapValue;
};

/**
 * 切换modle 并请求对应数据 此处作为中间层
 * @date 2021-06-11
 * @param {any} dialogType:string
 * @param {any} requestData:Record<string,any>
 * @returns {any}
 */
export async function useTransformModelAndRequest(
  dialogType: string,
  requestData: RequestDataDto,
): Promise<ResponceType> {
  const dialogMapValue = mapIterator<any>(dialogType, dialogConfigMap);
  const { title, modle, footerBtn, requestApi, dataProcessing } = dialogMapValue;
  // [...requestApi(requestData)] 这种语法不支持 不能用promise.all 可惜
  // 一定要await 外层的reduce 因为返回的是一个promise
  // const responseData = await requestApi.reduce(async (acc:any, cur:string) => {
  //   const res = await (requestApis as any)[cur](requestData);
  //   return [{ ...res }];
  // }, Promise.resolve([]));

  const _responseData = await (requestApis as any)[requestApi](requestData);

  const responseData = await dataProcessing(_responseData);

  return {
    title: responseData.title ? responseData.title : title,
    modle,
    footerBtn,
    responseData,
  };
}

/**
 * 切换modle 对responseData数据处理 此处作为中间层
 * @date 2021-06-23
 * @param {any} dialogType:string
 * @param {any} data:any
 * @returns {any}
 */
export async function useTransformResponseData(
  dialogType: string,
  data: any,
): Promise<ResponceType> {
  const dialogMapValue = mapIterator<any>(dialogType, dialogConfigMap);
  const { modle, title, footerBtn, noRequestdataProcessing } = dialogMapValue;

  const responseData = await noRequestdataProcessing(data);

  return {
    title: responseData.title ? responseData.title : title,
    modle,
    footerBtn,
    responseData,
  };
}
