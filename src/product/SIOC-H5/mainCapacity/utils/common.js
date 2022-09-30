/* eslint-disable no-plusplus */
/**
 * @param {Array} arr 目标数组
 * @param {Array} relationKey 关联字段
 * @param {Array} findKey 要查找的字段
 * @param {Array} findValue 目标值
 * @returns {Array} 数组
 * @description 根据值查找在数组级联关系
 * @usage 用法：
    const ids = getRelations({
        arr: data,
        relationKey: ['id'],
        findKey: 'name',
        findValue: '9'
    })
 */
function getRelations({
  arr = [],
  relationKey = ['id'],
  findKey = 'key',
  findValue,
}) {
  if (findValue !== 0 && !findValue) {
    // throw 'Missing parameter 'findvalue''
    return [];
  }
  let isFind = false; // 是否找到目标
  let relations = []; // 最终返回值
  // tagArr 目标数组；process 级联数组
  const find = (tagArr, process = []) => {
    const tagArrLen = tagArr.length; // 数组长度
    for (let j = 0; j < tagArrLen; j++) {
      // 已经找到目标，跳出循环
      if (isFind) {
        break;
      }
      const tagItem = tagArr[j];
      const newProcess = process.concat([tagItem]); // 拼接上级数组
      if (tagItem[findKey] === findValue) {
        // 找到目标，标记一下
        isFind = true;
        relations = newProcess;
        break;
      } else {
        // 上级没找到，往下级找
        if (tagItem.children && tagItem.children.length > 0) {
          find(tagItem.children, newProcess);
        }
      }
    }
  };
  find(arr);
  return relations;
}

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
 function throttle(func, wait, type) {
  if (type === 1) {
    let previous = 0;
  } else if (type === 2) {
    let timeout;
  }
  return function() {
    let context = this;
    let args = arguments;
    if (type === 1) {
        let now = Date.now();
 
        if (now - previous > wait) {
          func.apply(context, args);
          previous = now;
        }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args)
        }, wait)
      }
    }
  }
}

  /**
   * @desc 函数防抖
   * @param func 目标函数
   * @param wait 延迟执行毫秒数
   * @param immediate true - 立即执行， false - 延迟执行
   */
 function debounce(func, wait, immediate) {
  let timer;
  return function() {
    let context = this,
        args = arguments;
         
    if (timer) clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer  = setTimeout(() => {
        func.apply(context, args);
      }, wait)
    }
  }
}

export default {
  getRelations,
  throttle,
  debounce
}