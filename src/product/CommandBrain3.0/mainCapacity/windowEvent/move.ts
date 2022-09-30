import {
  addFun,
  deleteFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';

const recordDis: any = {};
const moveFunArr: any = [];

export function addMoveFun(fun: any) {
  const index = moveFunArr.indexOf(fun);
  if (index === -1) {
    moveFunArr.push(fun);
  }
}

export function removeMoveFun(fun: any) {
  const index = moveFunArr.indexOf(fun);
  if (index > -1) {
    moveFunArr.splice(index, 1);
  }
}

export function mouseup(e: any) {
  if (e.xy && (window as any).xy) {
    const x = Math.abs(e.xy.x - (window as any).xy.x);
    const y = Math.abs(e.xy.y - (window as any).xy.y);
    if (x < 200 && y < 200) {
      const computeX = recordDis.x + Math.abs(x);
      const computeY = recordDis.y + Math.abs(y);
      // 计算缓存和当前的移动距离超过200也进行切片
      if (computeX > 200 || computeY > 200) {
        // 遍历运行数组中的方法
        moveFunArr.forEach((x: any) => {
          x && x();
        });
      } else {
        // 没有超过200就进行存储
        recordDis.x = Math.abs(x);
        recordDis.y = Math.abs(y);
      }
    } else {
      moveFunArr.forEach((x: any) => {
        x && x();
      });
    }
  }
}

// 在最初视口进行时间挂载
export function mouseupLoading() {
  addFun('mouseup', mouseup);
}

// 卸载方法
export function deleteMouseupFun() {
  deleteFun('mouseup', mouseup);
}

export default {
  mouseupLoading,
  deleteMouseupFun,
  addMoveFun,
  removeMoveFun,
};
