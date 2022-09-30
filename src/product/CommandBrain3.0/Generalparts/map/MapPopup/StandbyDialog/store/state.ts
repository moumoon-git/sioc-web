import { reactive } from 'vue';

export interface IState {
  isExpand: boolean;

  isArticleStoreHouseDetail: boolean;

  dialogPrevEl?: any;
  dialogOpenedStack?: Set<string>;
  prevBodyDom?: any;
  promiseResolve: any;
}
export const state: IState = {
  // 控制弹窗的footer按钮的详细信息点击
  isExpand: false,
  // 控制弹窗只允许点击后出最新的那个
  dialogPrevEl: null,
  // 是否是物资应急库详情
  isArticleStoreHouseDetail: false,

  // 已打开的弹窗列表
  dialogOpenedStack: new Set(),
  // body弹窗的
  prevBodyDom: null,

  // 关闭弹窗时，promise.resolve
  promiseResolve: null,
};

const _createState = (stateObj: IState) => () => reactive(stateObj);

export const createState = _createState(state);
