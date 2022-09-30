/**
 * @description 判断年份是否为闰年（闰年是能被4整除且不能被100整除，或能被400整除）
 * @param {number | string} year 目标年份
 * @returns {boolean} result  返回true | false；true为闰年，false为不是闰年
 */
function judgeLeapYear(year) {
  const target_year = Number(year);
  const result = (target_year % 4 === 0 && target_year % 100 !== 0) || target_year % 400 === 0;
  return result;
}

/**
 * @description 获取每个月份的天数
 * @param {number | string} month 月份 目标月份
 * @returns {number} day 返回月份的天数
 */
function getDaysOfMonth(month) {
  const oDate = new Date(); // 获取当前日期时间
  const year = oDate.getFullYear(); //通过时间来获取年份
  const newDate = new Date(year, month - 1, 32); // 根据月份设置日期
  const day = 32 - newDate.getDate(); // 根据设置的日期来获取当前月份的天数。
  return day;
}

/**
 * @description 获取每个月的天数（闰年2月29天.平年2月28天。闰年共有366天(1-12月分别为31天,29天,31天,30天,31天,30天,31天,31天,30天,31天,30天,31天)）
 * @param {number | string} year 目标年份
 * @returns 数组 每年月份天数的数组
 */
function getDaysOfEachMonth(year) {
  if (judgeLeapYear(year)) {
    return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  } else {
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }
}

/**
 * @description 处理日期:  时间格式为'2021-05-11 20' 转换返回 “今天10:00” | “昨天10:00” | “月+日” | “年+月+日”
 * @param {string} datetime 时间格式：'2021-05-11 20'
 * @return 目标时间与今天的时间对比: 如果目标时间是属于今天，返回的时间是“今天10:00”，昨天就“昨天10:00”，其他时间就返回“月+日”
 */
function formatterDate(datetime) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const target_year = Number(datetime.split(' ')[0].split('-')[0]); // 2021 - 年
  const target_month = Number(datetime.split(' ')[0].split('-')[1]); // 5 - 月
  const target_day = Number(datetime.split(' ')[0].split('-')[2]); // 11 - 天
  const target_minute = Number(datetime.split(' ')[1]); // 20 - 时

  // 返回的数据
  let result = '';

  // 获取目标年份每个月的天数
  const daysArr = getDaysOfEachMonth(target_year);
  // 目标月份的天数
  const daysOfMonth = daysArr[target_month - 1];

  // 判断年
  if (target_year < year) {
    result =
      target_year + '年' + target_month + '月' + target_day + '日 ' + target_minute + ':00';
  } else if (target_year === year) {
    // 判断月
    if (month === target_month) {
      // 判断天
      if (day === target_day) {
        result = '今天' + target_minute + ':00';
      } else if (day > target_day) {
        if (day - target_day === 1) {
          result = '昨天' + target_minute + ':00';
        } else {
          result = target_month + '月' + target_day + '日 ' + target_minute + ':00';
        }
      }
    } else if (month > target_month) {
      // 判断目标的天数是不是每月的最后一天，并且现在时间是1号
      if (daysOfMonth === target_day && day === 1) {
        result = '昨天' + target_minute + ':00';
      } else {
        result =
          target_year +
          '年' +
          target_month +
          '月' +
          target_day +
          '日 ' +
          target_minute +
          ':00';
      }
    }
  }
  return result;
}

export default {
  judgeLeapYear,
  getDaysOfMonth,
  getDaysOfEachMonth,
  formatterDate
};
