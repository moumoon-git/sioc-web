/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2019-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2019-7-2 8:9:4.18
 * @param {string} time 时间
 * @param {string} fmt 要得到的时间格式
 * @returns 返回指定的时间格式
 */
 function formatDate(fmt: any, time: any) {
  const date = new Date(time);
  const o: any = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
  return fmt;
}

/**
 * @param {string} time 格式化的时间对象
 * @description 格式化时间  00:01:00 改为1分
 * @returns 返回 xx时xx分xx秒 | xx时xx分 | xx分xx秒 | xx秒
 */
function formateTime(time: string) {
  const targetTime = time.split(':');
  if (targetTime[0] === '00') {
    targetTime.splice(0, 1)
    if (targetTime[0] === '00') {
      targetTime.splice(0, 1)
      if (targetTime[0] === '00') {
        targetTime.splice(0, 1)
      } else {
        targetTime[0] = Number(targetTime[0]) + '秒' // 返回 xx秒
      }
    } else {
      targetTime[0] = Number(targetTime[0]) + '分'
      if (targetTime[1] === '00') {
        targetTime.splice(1, 1)
      } else {
        targetTime[1] = Number(targetTime[1]) + '秒' // 返回 xx分xx秒
      }
    }
  } else {
    targetTime[0] = Number(targetTime[0]) + '时'
    if (targetTime[1] === '00' && targetTime[2] === '00') {
      targetTime.splice(1, 2)
    } else {
      if (targetTime[2] === '00') {
      targetTime.splice(2, 1)
      targetTime[1] = Number(targetTime[1]) + '分' // 返回 xx时xx分
      } else {
        targetTime[1] = Number(targetTime[1]) + '分'
        targetTime[2] = Number(targetTime[2]) + '秒' // 返回 xx时xx分xx秒
      }
    }
  }
  return targetTime.join('');
}

export default {
  formatDate,
  formateTime
}