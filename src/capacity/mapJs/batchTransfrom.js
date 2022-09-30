import axios from 'axios';
/*
  根据项目确定坐标系是否是自定义的
  需不需要进行坐标转换
*/
function isCustom() {
  const str = window.config.project;
  if (str === 'CC') {
    return true;
  }
  return false;
}

// 禅城地图鉴权
function FSMAPServerGetToken() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: 'http://19.134.197.207:9955/GISAPIService/api/Authorization/Token',
      params: {
        clientId: '2000398620000031472',
        clientSecret: '8525c40e3c1252b999fe059449cf1a8b',
      },
    }).then(res => {
      // console.log(res.data.data, '禅城地图鉴权');
      resolve(res.data.data);
    });
  });
  return promise;
}

// 禅城经纬度转换
function FS2kToGPS2k(params, type) {
  const promise = new Promise((resolve, reject) => {
    FSMAPServerGetToken().then(token => {
      axios({
        method: 'post',
        url: 'http://19.134.197.207:9955/GISAPIService/api/Coordinate/PointTransfrom',
        params: {
          x: params.lon || params.longitude,
          y: params.lat || params.latitude,
          transfromMode: type,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        // console.log(res.data.data, '逆地理请求回来的数据');
        const { data } = res.data;
        const obj = {
          lon: data.x,
          longitude: data.x,
          lat: data.y,
          latitude: data.y,
        };
        resolve(obj);
      });
    });
  });
  return promise;
}

// 禅城批量转换
function batchFS2kToGPS2k(params, type) {
  const promise = new Promise((resolve, reject) => {
    FSMAPServerGetToken().then(token => {
      const points = params.join('|');
      const fd = new FormData();
      fd.append('points', points);
      fd.append('transfromMode', type);
      axios({
        method: 'post',
        url: 'http://19.134.197.207:9955/GISAPIService/api/Coordinate/PointListTransfrom',
        data: fd,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        console.log(res.data.data, '请求回来的数据');
        resolve(res.data.data);
      });
    });
  });
  return promise;
}

// 单次转换
function singleTrans(params) {
  const str = window.config.project;
  switch (str) {
    case 'CC':
      return FS2kToGPS2k(params, 6);
    default:
      break;
  }
}

// 批量转换自定义转大地
function batchCustomTfGPS(params) {
  const str = window.config.project;
  switch (str) {
    case 'CC':
      return batchFS2kToGPS2k(params, 6);
    default:
      break;
  }
}

// 批量转换大地转自定义
function batchGPSTFCustom(params) {
  const str = window.config.project;
  switch (str) {
    case 'CC':
      return batchFS2kToGPS2k(params, 4);
    default:
      break;
  }
}

export default {
  isCustom,
  batchCustomTfGPS,
  batchGPSTFCustom,
  singleTrans,
};
