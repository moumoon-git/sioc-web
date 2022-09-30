import handleEvent from './handleEvent';

export const hwe = new handleEvent();

export function addFun(eventName: string, fun: object) {
  hwe.addFun(eventName, fun);
}
export function deleteFun(eventName: string, fun: object) {
  hwe.deleteFun(eventName, fun);
}

export default {
  hwe
};

