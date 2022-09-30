const list: Array<string> = [
  'click',
  'dblclick',
  'keydown',
  'mousewheel',
  'mousedown',
  'mouseup',
  'mousemove',
];
// window绑定事件
class handleEvent {
  constructor() {
    (this as any).eventList = list;
    (this as any).eventFun = <any>{};
    this.init();
  }
  // 添加方法
  addFun(eventName: string, fun: object) {
    if (Object.prototype.hasOwnProperty.call((this as any).eventFun, eventName) && (this as any).eventFun[eventName].indexOf(fun) === -1) {
      (this as any).eventFun[eventName].push(fun);
    } else if (Object.prototype.hasOwnProperty.call((this as any).eventFun, eventName) && (this as any).eventFun[eventName].indexOf(fun) !== -1) {
      console.error('已经加载了这个方法了');
    } else {
      (this as any).eventFun[eventName] = [fun];
    }
  }
  // 删除方法
  deleteFun(eventName: string, fun: object) {
    if ((this as any).eventFun[eventName] && (this as any).eventFun[eventName].indexOf(fun) !== -1) {
      const delIndex = (this as any).eventFun[eventName].findIndex((x: any) => {
        return x === fun;
      });
      (this as any).eventFun[eventName].splice(delIndex, 1);
    }
  }
  // 初始化绑定方法
  init() {
    const that = this;
    (that as any).eventList.forEach((ele: any) => {
      console.log(ele);
      // 根据事件绑定方法
      (document as any).addEventListener(ele, function (e: any) {
        if ((that as any).eventFun[ele]) {
          (that as any).eventFun[ele].forEach((x: any) => {
            // 调用方法
            x(e);
          });
        }
      })
    });
  }
}

export default handleEvent;