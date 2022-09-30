import { ref, computed, onMounted } from 'vue';

function clock_init() {
  const date = ref(new Date());
  // 小时
  const hours = computed(() => {
    const hour: number = date.value.getHours();
    const digit1: number = Math.floor(hour / 10);
    const digit2: number = hour % 10;
    return [digit1, digit2];
  });
  // 分钟
  const minutes = computed(() => {
    const minute: number = date.value.getMinutes();
    const digit1: number = Math.floor(minute / 10);
    const digit2: number = minute % 10;
    return [digit1, digit2];
  });
  // 秒
  const second = computed(() => {
    const seconds: number = date.value.getSeconds();
    const str = seconds < 10 ? '0' + seconds : seconds;
    return str;
  });
  // 星期
  const day = computed(() => {
    const days: number = date.value.getDay();
    switch (days) {
      case 0: {
        return '星期日';
      }
      case 1: {
        return '星期一';
      }
      case 2: {
        return '星期二';
      }
      case 3: {
        return '星期三';
      }
      case 4: {
        return '星期四';
      }
      case 5: {
        return '星期五';
      }
      case 6: {
        return '星期六';
      }
      default:
        return '-';
    }
  });
  // 日期
  const today = computed(() => {
    const year: number = date.value.getFullYear();
    const month: number = date.value.getMonth() + 1;
    const dates: number = date.value.getDate();
    const str = `${year}/${(month > 9 ? month : `0${month}`)}/${(dates > 9 ? dates : `0${dates}`)}`;
    return str;
  });
  function init(min: number) {
    // 每分钟刷新一次时间
    setInterval(() => {
      date.value = new Date();
    }, min * 1000);
  }
  return {
    date,
    hours,
    minutes,
    second,
    day,
    today,
    init,
  };
}

export default clock_init