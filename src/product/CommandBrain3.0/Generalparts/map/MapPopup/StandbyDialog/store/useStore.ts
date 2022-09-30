import { shallowReadonly } from 'vue';
import createAction from './action';
import { createState, IState } from './state';

interface DispatchParams {
  type: string;
  payload: Record<string, any>;
}

const myState = createState();
const action = createAction(myState);

// 用dispath派发action 参考dva的dispatch 支持promise调用
// eslint-disable-next-line max-len
const createDispatch = <T>(actionType: any) => ({ type, payload }: DispatchParams): Promise<T> =>
  new Promise(resolve => {
    resolve(actionType[type](payload));
  });

interface StoreDto {
  state: IState;
  dispatch: any;
}

/** 小型的状态管理库 主要是为了在弹窗中各个组合的组件通信
 * 也是观察者模式的一种 利用watch监听state的变化
 * 组件中不允许直接修改state 应该使用action 再通过reducer去修改state
 * @returns {store,dispatch}
 */
const useStore = (): StoreDto => {
  const state = shallowReadonly(myState);

  /**
   * 使用md这种代码块可以使ts得到很好的提示，例子：
   * ```js
   * dispatch({
   *  type: 'ActionType',
   *  payload: payload参数
   * }).then(() => {
   *  // 成功后的回调todo
   * })
   * ```
   */
  const dispatch = createDispatch<any>(action);

  return {
    state,
    dispatch,
  };
};

export default useStore;
