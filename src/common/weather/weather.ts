import {ref} from 'vue';


/** 天气现象描述
 * positionX, positionY 是根据雪碧图进行的定位
 */
const SkyconData = [
  {
    code: 'CLEAR_DAY',
    value: '晴（白天）',
    icon: 'sunny'
  },
  {
    code: 'CLEAR_NIGHT',
    value: '晴（夜间）',
    icon: 'night'
  },
  {
    code: 'PARTLY_CLOUDY_DAY',
    value: '多云（白天）',
    icon: 'day_cloudy'
  },
  {
    code: 'PARTLY_CLOUDY_NIGHT',
    value: '多云（夜间）',
    icon: 'night_cloudy'
  },
  {
    code: 'CLOUDY',
    value: '阴',
    icon: 'cloudy'
  },
  {
    code: 'LIGHT_HAZE',
    value: '轻度雾霾',
    icon: 'foggy'
  },
  {
    code: 'MODERATE_HAZE',
    value: '中度雾霾',
    icon: 'foggy'
  },
  {
    code: 'HEAVY_HAZE',
    value: '重度雾霾',
    icon: 'foggy'
  },
  {
    code: 'LIGHT_RAIN',
    value: '小雨',
    icon: 'sprinkle'
  },
  {
    code: 'MODERATE_RAIN',
    value: '中雨',
    icon: 'moderate_rain'
  },
  {
    code: 'HEAVY_RAIN',
    value: '大雨',
    icon: 'heavyRain'
  },
  {
    code: 'STORM_RAIN',
    value: '暴雨',
    icon: 'heavyRain'
  },
  {
    code: 'FOG',
    value: '雾',
    icon: 'foggy'
  },
  {
    code: 'LIGHT_SNOW',
    value: '小雪',
    icon: 'sprinkle'
  },
  {
    code: 'MODERATE_SNOW',
    value: '中雪',
    icon: 'moderate_rain'
  },
  {
    code: 'HEAVY_SNOW',
    value: '大雪',
    icon: 'heavyRain'
  },
  {
    code: 'STORM_SNOW',
    value: '暴雪',
    icon: 'heavyRain'
  },
  {
    code: 'DUST',
    value: '浮尘',
    icon: 'foggy'
  },
  {
    code: 'SAND',
    value: '沙尘',
    icon: 'foggy'
  },
  {
    code: 'WIND',
    value: '大风',
    icon: 'foggy'
  },
]
/**
 * 天气现象	      代码	              备注
 * 晴（白天）	    CLEAR_DAY	          cloudrate < 0.2
 * 晴（夜间）	    CLEAR_NIGHT	        cloudrate < 0.2
 * 多云（白天）	  PARTLY_CLOUDY_DAY	  0.8 >= cloudrate > 0.2
 * 多云（夜间）	  PARTLY_CLOUDY_NIGHT	0.8 >= cloudrate > 0.2
 * 阴	           CLOUDY	             cloudrate > 0.8
 * 轻度雾霾	      LIGHT_HAZE	        PM2.5 100~150
 * 中度雾霾	      MODERATE_HAZE	      PM2.5 150~200
 * 重度雾霾	      HEAVY_HAZE	        PM2.5 > 200
 * 小雨	          LIGHT_RAIN	
 * 中雨	          MODERATE_RAIN	
 * 大雨	          HEAVY_RAIN	
 * 暴雨	          STORM_RAIN	
 * 雾	            FOG	                能见度低，湿度高，风速低，温度低
 * 小雪	          LIGHT_SNOW	
 * 中雪	          MODERATE_SNOW	
 * 大雪	          HEAVY_SNOW	
 * 暴雪	          STORM_SNOW	
 * 浮尘	          DUST	              aqi > 150，pm10 > 150，湿度 < 30%，风速 < 6 m/s
 * 沙尘	          SAND	              aqi > 150，pm10 > 150，湿度 < 30%，风速 > 6 m/s
 * 大风	          WIND	
 * @param {string} code 天气代码
 * @returns 返回天气现象
 */
function getSkycon(code: string) {
  SkyconData.filter((el: any) => el.code === code)
  return SkyconData.filter((el: any) => el.code === code)[0]
}

/**
 * 风力风速等级对照表
 * 风力等级	风速范围 （km/h）	自然语言描述
 * 0级	    <1	            无风
 * 1级	    1-5	            微风徐徐
 * 2级	    6-11	          清风
 * 3级	    12-19	          树叶摇摆
 * 4级	    20-28	          树枝摇动
 * 5级	    29-38	          风力强劲
 * 6级	    39-49	          风力强劲
 * 7级	    50-61	          风力超强
 * 8级	    62-74	          狂风大作
 * 9级	    75-88	          狂风呼啸
 * 10级	    89-102	        暴风毁树
 * 11级	    103-117	        暴风毁树
 * 12级	    118-133	        飓风
 * 13级	    134-149	        台风
 * 14级	    150-166	        强台风
 * 15级	    167-183	        强台风
 * 16级	    184-201	        超强台风
 * 17级	    202-220	        超强台风
 */
/** 风力风速等级对照数据 */
const windSpeedScale = [
  {
    min: 0,
    max: 1,
    level: 0,
    description: '无风'
  },
  {
    min: 1,
    max: 5,
    level: 1,
    description: '微风徐徐'
  },
  {
    min: 5,
    max: 12,
    level: 2,
    description: '清风'
  },
  {
    min: 12,
    max: 19,
    level: 3,
    description: '树叶摇摆'
  },
  {
    min: 19,
    max: 28,
    level: 4,
    description: '树枝摇动'
  },
  {
    min: 28,
    max: 38,
    level: 5,
    description: '风力强劲'
  },
  {
    min: 38,
    max: 49,
    level: 6,
    description: '风力强劲'
  },
  {
    min: 49,
    max: 61,
    level: 7,
    description: '风力超强'
  },
  {
    min: 61,
    max: 74,
    level: 8,
    description: '狂风大作'
  },
  {
    min: 74,
    max: 88,
    level: 9,
    description: '狂风呼啸'
  },
  {
    min: 88,
    max: 102,
    level: 10,
    description: '暴风毁树'
  },
  {
    min: 102,
    max: 117,
    level: 11,
    description: '暴风毁树'
  },
  {
    min: 117,
    max: 133,
    level: 12,
    description: '飓风'
  },
  {
    min: 133,
    max: 149,
    level: 13,
    description: '台风'
  },
  {
    min: 149,
    max: 166,
    level: 14,
    description: '强台风'
  },
  {
    min: 166,
    max: 183,
    level: 15,
    description: '强台风'
  },
  {
    min: 183,
    max: 201,
    level: 16,
    description: '超强台风'
  },
  {
    min: 201,
    max: 220,
    level: 17,
    description: '超强台风'
  },
]
/**
 * @description 获取风力风速等级
 */
function getWindLevel(speed: number) {
  const arr = windSpeedScale.filter((item:any) => {
    if (speed >= item.min && speed < item.max) {
      return item;
    }
  })
  return arr[0];
}

/**
 * 风向代码对照表
 * 风向	    符号	    中心角度	    角度
 * 北	      N	        0	          348.76-11.25
 * 北东北	  NNE	      22.5	      11.26-33.75
 * 东北	    NE	      45	        33.76-56.25
 * 东东北	  ENE	      67.5	      56.26-78.75
 * 东	      E	        90	        78.76-101.25
 * 东东南	  ESE	      112.5	      101.26-123.75
 * 东南	    SE	      135	        123.76-146.25
 * 南东南	  SSE	      157.5	      146.26-168.75
 * 南	      S	        180	        168.76-191.25
 * 南西南	  SSW	      202.5	      191.26-213.75
 * 西南	    SW	      225	        213.76-236.25 
 * 西西南	  WSW	      247.5	      236.26-258.75
 * 西	      W	        270	        258.76-281.25
 * 西西北	  WNW	      295.5	      281.26-303.75
 * 西北	    NW	      315	        303.76-326.25
 * 北西北	  NNW	      337.5	      326.26-348.75
 */
const windDirection = [
  {
    direction: '北',
    symbol: 'N',
    centerAngle: 0,
    maxAngle: 11.25,
    minAngle: 348.76
  },
  {
    direction: '北东北',
    symbol: 'NNE',
    centerAngle: 22.5,
    maxAngle: 33.75,
    minAngle: 11.26
  },
  {
    direction: '东北',
    symbol: 'NE',
    centerAngle: 45,
    maxAngle: 56.25,
    minAngle: 33.76
  },
  {
    direction: '东东北',
    symbol: 'ENE',
    centerAngle: 67.5,
    maxAngle: 78.75,
    minAngle: 56.26
  },
  {
    direction: '东',
    symbol: 'E',
    centerAngle: 90,
    maxAngle: 101.25,
    minAngle: 78.76
  },
  {
    direction: '东东南',
    symbol: 'ESE',
    centerAngle: 112.5,
    maxAngle: 123.75,
    minAngle: 101.26
  },
  {
    direction: '东南',
    symbol: 'SE',
    centerAngle: 135,
    maxAngle: 146.25,
    minAngle: 123.76
  },
  {
    direction: '南东南',
    symbol: 'SSE',
    centerAngle: 157.5,
    maxAngle: 168.75,
    minAngle: 146.26
  },
  {
    direction: '南',
    symbol: 'S',
    centerAngle: 180,
    maxAngle: 191.25,
    minAngle: 168.76
  },
  {
    direction: '南西南',
    symbol: 'SSW',
    centerAngle: 202.5,
    maxAngle: 213.75,
    minAngle: 191.26
  },
  {
    direction: '西南',
    symbol: 'SW',
    centerAngle: 225,
    maxAngle: 236.25,
    minAngle: 213.76
  },
  {
    direction: '西西南',
    symbol: 'WSW',
    centerAngle: 247.5,
    maxAngle: 258.75,
    minAngle: 236.26
  },
  {
    direction: '西',
    symbol: 'W',
    centerAngle: 270,
    maxAngle: 281.25,
    minAngle: 258.76
  },
  {
    direction: '西西北',
    symbol: 'WNW',
    centerAngle: 295.5,
    maxAngle: 303.75,
    minAngle: 281.26
  },
  {
    direction: '西北',
    symbol: 'NW',
    centerAngle: 315,
    maxAngle: 326.25,
    minAngle: 303.76
  },
  {
    direction: '北西北',
    symbol: 'NNW',
    centerAngle: 337.5,
    maxAngle: 348.75,
    minAngle: 326.26
  },
]

/**
 * @description 获取风力风向
 * @param direction 风力
 * @returns 风力风向
 */
function getWindDirection(direction: any) {
  const arr = windDirection.filter((item: any) => {
    if ((item.minAngle >= direction && item.maxAngle <= direction) || (item.minAngle <= direction && item.maxAngle >= direction)) {
      return item;
    } else if ((direction >= 0 && direction <= 11.25) || (direction >= 348.76 && direction <= 360) ) {
      return windDirection[0];
    }
  })
  return arr[0]
}


/**
 * 雷达降水强度
 * 雷达降水强度是在雷达回波反照率基础上由彩云科技定义的一个度量值，它可以简单的描述降雨的相对强弱。
 * 雷达降水强度	       降水量 mm／h	    天气现象
 * <0.031	            <0.08	          无雨／雪
 * 0.031～0.25	      0.08~3.44 	    小雨／雪
 * 0.25～0.35	        3.44~11.33	    中雨／雪
 * 0.35～0.48	        11.33~51.30	    大雨／雪
 * >=0.48	            >=51.30	        暴雨／雪
 */
const precipitationIntensity = [
  {
    // 降水强度
    precipitationIntensity: {
      min: 0,
      max: 0.031
    },
    // 降水量
    precipitation: {
      min: 0,
      max: 0.08
    },
    // 天气现象
    phenomena: [
      {
        skyIcon: 'RAIN',
        phenomena: '无雨'
      },
      {
        skyIcon: 'SNOW',
        phenomena: '无雪'
      },
    ]
  },
  {
    // 降水强度
    precipitationIntensity: {
      min: 0.031,
      max: 0.25
    },
    // 降水量
    precipitation: {
      min: 0.08,
      max: 3.44
    },
    // 天气现象
    phenomena: [
      {
        skyIcon: 'RAIN',
        phenomena: '小雨'
      },
      {
        skyIcon: 'SNOW',
        phenomena: '小雪'
      },
    ]
  },
  {
    // 降水强度
    precipitationIntensity: {
      min: 0.25,
      max: 0.35
    },
    // 降水量
    precipitation: {
      min: 3.44,
      max: 11.33
    },
    // 天气现象
    phenomena: [
      {
        skyIcon: 'RAIN',
        phenomena: '中雨'
      },
      {
        skyIcon: 'SNOW',
        phenomena: '中雪'
      },
    ]
  },
  {
    // 降水强度
    precipitationIntensity: {
      min: 0.35,
      max: 0.48
    },
    // 降水量
    precipitation: {
      min: 11.33,
      max: 51.30
    },
    // 天气现象
    phenomena: [
      {
        skyIcon: 'RAIN',
        phenomena: '大雨'
      },
      {
        skyIcon: 'SNOW',
        phenomena: '大雪'
      },
    ]
  },
  {
    // 降水强度
    precipitationIntensity: {
      min: 0.48,
      max: '无穷大'
    },
    // 降水量
    precipitation: {
      min: 51.30,
      max: '无穷大'
    },
    // 天气现象
    phenomena: [
      {
        skyIcon: 'RAIN',
        phenomena: '暴雨'
      },
      {
        skyIcon: 'SNOW',
        phenomena: '暴雪'
      },
    ]
  }
]
/**
 * 
 * @param direction 
 * @returns 雷达降水强度
 */
 function getRecipitation(recipitation: number, skyIcon: string) {
  const arr = precipitationIntensity.filter((item: any) => {
    if (recipitation > item.recipitation.min && recipitation <= item.recipitation.max) {
      if (skyIcon.indexOf('SNOW') > -1) {
        return item.phenomena[1].phenomena
      } else {
        return item.phenomena[0].phenomena
      }
    } else if (recipitation > item.recipitation.min) {
      if (skyIcon.indexOf('SNOW') > -1) {
        return item.phenomena[1].phenomena
      } else {
        return item.phenomena[0].phenomena
      }
    } else {
      return ''
    }
  })
  return arr[0]
}

/**
 * @description 周一到周日
 */
function getDay(day: number) {
  const str = ref('')
  switch (day) {
    case 0:
      str.value = '日'
      break;
    case 1:
      str.value = '一'
      break;
    case 2:
      str.value = '二'
      break;
    case 3:
      str.value = '三'
      break;
    case 4:
      str.value = '四'
      break;
    case 5:
      str.value = '五'
      break;
    case 6:
    str.value = '六'
  }
  return str.value;
}

export default {
  getSkycon,
  getWindLevel,
  getWindDirection,
  getRecipitation,
  getDay
}