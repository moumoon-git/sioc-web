import { ref } from 'vue';

/**
 * @param {string | number} timeLimitStatus 任务时限类型
 * @description 根据任务时限类型获取对应时间单位
 */
function getTimeLimit(timeLimitStatus: string | number) {
  let type = ref('');
  switch (timeLimitStatus) {
    case 1:
      type.value = '无时限';
      break;
    case 2:
      type.value = '分钟';
      break;
    case 3:
      type.value = '小时';
      break;
    case 4:
      type.value = '天';
      break;
    case 5:
      type.value = '月';
      break;
    case 6:
      type.value = '年月日时分秒';
      break;
    default:
      type.value = '无时限';
      break;
  }
  return type.value;
}

/**
 * @param { string } endTime 截止时间
 * @returns {Object} { isOvertime, time } isOvertime: 是否超时; time: 时间差
 * @description 若任务状态是未完成，根据任务截止时间与当前时间比较，若任务时间大于当前时间，则得出剩余时间；否则的出超时时间
 */
function getTaskDeadline(endTime: any) {
  const currentDate = new Date().getTime(); // 当前时间戳
  const endDate = new Date(endTime).getTime(); // 截止时间戳
  const interval = currentDate - endDate; // 时间间隔 当前时间戳 - 截止时间戳
  const result = {
    isOvertime: !!(interval > 0), //是否超时
    time: interval > 0 ? interval : Math.abs(interval), // 时间差
  };
  // if (interval > 0) {
  //   result.value.isOvertime = true; // 超时
  // } else {
  //   result.value.time = Math.abs(result.value.time); // 将负数改为正整数
  //   result.value.isOvertime = false; // 未超时
  // }

  return result;
}

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
 *
 * @param {string} time 时间
 * @param format 要得到的时间格式
 * @returns 返回指定的时间格式
 * @description 计时器
 */
function setCalculagraph(time: any, format: any) {
  let result = getTimeDiff(time, format)
  // let result = formatDate(format, time);
  return result;
}

/**
 * @param time 时间戳
 * @returns 返回指定的时间格式
 * @description 获取时间分割线
 */
function getTimeDivision(time: any) {
  // 获取当前时间
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();

  const targetDate = new Date(time);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();
  const targetHour = targetDate.getHours();
  const targetMinute = targetDate.getMinutes();
  const targetSeconds = targetDate.getSeconds();
  const targetTime = formatDate('yyyy年MM月dd日 hh:mm', time); // 返回yyyy年MM月dd日 hh时mm分
  const targetTime2 = formatDate('MM月dd日 hh:mm', time); // 返回MM月dd日 hh时mm分
  const targetTime3 = formatDate('hh:mm', time); // 返回hh时mm分

  // 根据任务动态的业务需求，有三种时间格式：
  // 1、年月日时分
  // 2、月日时分
  // 3、时分

  // 1、目标年份与当前时间年份不一样，则返回“年月日时分”
  ///2、目标年份与当前时间年份一样，月份不同，则返回“月日时分”
  ///3、目标年份与当前时间年份一样，两者时间相差一天，则返回“昨天 时分”
  ///4、目标年份与当前时间年份一样，且是同一天，则返回“今天 时分”

  // 目标年份与当前时间年份一样，且是同一天，两者相差10分钟内，则返回“今天 时分”
  const result = ref('');
  if (targetYear !== year) {
    // result.value = targetTime; // 返回yyyy年MM月dd日 hh时mm分
    result.value = targetYear + '年' + addZero(targetMonth) + '月' + addZero(targetDay) + '日 ' + addZero(targetHour) + ':' + addZero(targetMinute); // 返回yyyy年MM月dd日 hh时mm分
  } else {
    if (targetMonth < month) {
      // result.value = targetTime2;
      result.value = addZero(targetMonth) + '月' + addZero(targetDay) + '日 ' + addZero(targetHour) + ':' + addZero(targetMinute); // 返回yyyy年MM月dd日 hh时mm分
    } else if (targetMonth == month) {
      if (day - targetDay === 1) {
        // result.value = '昨天 ' + targetTime3;
        result.value = '昨天 ' + addZero(targetHour) + ':' + addZero(targetMinute);
      } else if (day === targetDay) {
        // result.value = '今天 ' + targetTime3;
        result.value = '今天 ' + addZero(targetHour) + ':' + addZero(targetMinute);
      } else if (day !== targetDay) {
        // result.value = targetTime2;
        result.value = addZero(targetMonth) + '月' + addZero(targetDay) + '日 ' + addZero(targetHour) + ':' + addZero(targetMinute); // 返回yyyy年MM月dd日 hh时mm分
    }
    } else {
      // 暂无目标月份大于当前月份的业务
      result.value = '';
    }
  }
  return result.value;
}
const addZero = function(val: number) {
  return val >= 10 ? val : '0' + val;
};
/**
 * @description 获取当前时间
 */
function getNowTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();
  return (
    year +
    '-' +
    addZero(month) +
    '-' +
    addZero(day) +
    ' ' +
    addZero(hour) +
    ':' +
    addZero(minute) +
    ':' +
    addZero(seconds)
  );
}

/**
 * @description 格式化时间差
 * @param diffTime 时间差
 * @param format 时间差
 * @returns 
 */
function getTimeDiff(diffTime: number, format: string) {
  const diffd = Math.floor(diffTime / (1000 * 60 * 60 * 24)); //计算天数
  const diffh = Math.floor((diffTime / (1000 * 60 * 60)) % 24); //计算小时数
  const diffm = Math.floor((diffTime / (1000 * 60)) % 60); //计算分钟数
  const diffs = Math.floor((diffTime / 1000) % 60); //计算秒数
  //difftime判断如果结束时间已过返回00：00:00
  if (diffTime > 0) {
    // diffd判断如果不超过24小时，不显示天数
    return diffd > 0
      ? addZero(diffd) + '天' + addZero(diffh) + '时' + addZero(diffm) + '分' + (format.indexOf('秒') > -1 ? addZero(diffs) + '秒' : '')
      : addZero(diffh) + '时' + addZero(diffm) + '分' + (format.indexOf('秒') > -1 ? addZero(diffs) + '秒' : '');
  } else {
    return '00:00:00';
  }
}

export default {
  getTimeLimit,
  getTaskDeadline,
  formatDate,
  setCalculagraph,
  getTimeDivision,
  getNowTime,
};
