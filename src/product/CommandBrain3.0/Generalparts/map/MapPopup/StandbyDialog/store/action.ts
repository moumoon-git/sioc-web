/* eslint-disable guard-for-in */
import { IState } from './State';

const initState: IState = {
  // 控制弹窗的footer按钮的详细信息点击
  isExpand: false,
  isArticleStoreHouseDetail: false,
  promiseResolve: null,
};

const reducers: Record<string, any> = {
  // 点击弹窗详细信息后展开详情
  isExpandAction: (state: IState) => ({ uid, status }: Record<string, any>) => {
    console.log(uid, status);
    (state as any)[uid].isExpand = status;
  },

  // 打开弹窗后 以uid为键 初始化属于自己这个弹窗的state
  initDialogStateAction: (state: IState) => ({ uid }: Record<string, string>) => {
    (state as any)[uid] = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in initState) {
      (state as any)[uid][key] = (initState as any)[key];
    }
  },

  // 物资应急库详细信息点击切换model
  articleStoreHouseDetailAction: (state: IState) => ({ uid, status }: Record<string, string>) => {
    (state as any)[uid].isArticleStoreHouseDetail = status;
  },

  // 关闭弹窗后 删除这个弹窗的state
  cleanUpCurrentStateAction: (state: IState) => ({ uid }: Record<string, string>) => {
    delete (state as any)[uid];
  },

  // 加入打开的弹窗列表
  addDialogOpenedStack: (state: IState) => ({
    keyId,
    uid,
    prevBodyDom,
  }: Record<string, string>) => {
    state.dialogOpenedStack!.add(keyId);
    state.dialogPrevEl = uid;
    state.prevBodyDom = prevBodyDom;
  },

  // 删除对应打开的弹窗列表
  delDialogOpenedStack: (state: IState) => ({ keyId }: Record<string, string>) => {
    state.dialogOpenedStack!.delete(keyId);
  },

  // 关闭所有弹窗
  closeAllDialog: (state: IState) => ({ map }: Record<string, any>) => {
    if (state.dialogPrevEl) {
      // 如果上一个是body弹窗需要执行使用原生dom操作删除
      if (state.prevBodyDom) {
        try {
          document.body.removeChild(state.prevBodyDom);
        } catch {}
      } else {
        try {
          (map || (window as any).map).closeClearPopup(state.dialogPrevEl);
        } catch {}
      }
      reducers.cleanUpCurrentStateAction(state)({
        uid: state.dialogPrevEl,
      });
      reducers.delDialogOpenedStack(state)({
        keyId: Array.from(state.dialogOpenedStack as Set<string>)[0],
      });
    }
  },

  // 赋值promise.resolve
  setPromiseResolve: (state: IState) => ({ resolve }: Record<string, string>) => {
    state.promiseResolve = resolve;
  },
};

/**
 * 描述 创建 Action
 * @param {any} state:IState
 * @returns {actionCollection}
 */
const createAction = (state: IState): Record<string, any> => ({
  isExpandAction: reducers.isExpandAction(state),
  initDialogStateAction: reducers.initDialogStateAction(state),
  articleStoreHouseDetailAction: reducers.articleStoreHouseDetailAction(state),
  cleanUpCurrentStateAction: reducers.cleanUpCurrentStateAction(state),
  addDialogOpenedStack: reducers.addDialogOpenedStack(state),
  delDialogOpenedStack: reducers.delDialogOpenedStack(state),
  closeAllDialog: reducers.closeAllDialog(state),
  setPromiseResolve: reducers.setPromiseResolve(state),
});

export default createAction;
