import axios from 'axios';
import { getCurrentInstance } from 'vue';
//引用AES源码js
const CryptoJS = require('crypto-js');
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

/**
 * @param {string | number} url  录音地址
 * @param {string | number} eventId  事件Id
 * @param {string | number} phoneHistoryId  电话Id
 * @param {callback} successCallback 成功回调
 * @param {callback} errorCallback 失败回调
 * @returns 录音转文字结果
 * @description 录音转文字
 */
function audioTurnToText() {
  // 获取全局参数
  const instance = getCurrentInstance();
  const { $http, $downFile, $message } = instance?.appContext.config.globalProperties;

  // 转写配置（科大讯飞）
  const config = {
    hostURL: 'http://raasr.xfyun.cn', // 请求地址 正式环境没用到
    appId: '', // 讯飞开放平台应用ID-测试使用（在控制台-我的应用-语音转写获取）
    secretKey: '', // 语音转写秘钥-测试使用（在控制台-我的应用-语音转写获取）
  };
  
  // 文件分片大小 10M
  const FILE_PIECE_SICE = 10485760;
  // 时间戳
  const ts = parseInt(new Date().getTime() / 1000);
  // 文件长度
  var file_len = 0;
  // 分片名字列表
  var fileNameList = [];
  // 分片文件列表
  var fileList = [];
  // 初始silce_id
  var init_silce_id = 'aaaaaaaaa`';
  // 转写文件名
  var fileName = '';
  var eventId = 0;
  /**
   * @return {String} signa 返回加密签名
   * @descripttion 获取鉴权签名
   */
  function getSigna() {
    let md5 = CryptoJS.MD5(config.appId + ts).toString(); // md5加密
    let sha1 = CryptoJS.HmacSHA1(md5, config.secretKey); // HmacSHA1加密
    let signa = CryptoJS.enc.Base64.stringify(sha1); // Base64加密
    return signa; // 返回加密签名
  }

  /**
   * @return {String} signa 返回加密签名
   * @descripttion slice_id 生成器(科大讯飞提供的方法)
   */
  function getNextSliceId() {
    let i = init_silce_id.length - 1;
    while (i >= 0) {
      let ci = init_silce_id[i];
      if (ci !== 'z') {
        init_silce_id =
          init_silce_id.slice(0, i) +
          String.fromCharCode(ci.charCodeAt(0) + 1) +
          init_silce_id.slice(i + 1);
        break;
      } else {
        init_silce_id = init_silce_id.slice(0, i) + 'a' + init_silce_id.slice(i + 1);
        i--;
      }
    }
    // console.log('分片序号：init_silce_id', init_silce_id);
    return init_silce_id;
  }

  /**
   * @param {String} url 录音地址
   * @descripttion 获取文件名字
   */
  function getFileName(url) {
    var pos = url.lastIndexOf('/');
    fileName = url.substring(pos + 1); // 文件名带后缀
    // console.log('文件名字', fileName);
  }

  /**
   * @param {String} id 录音数据的id
   * @descripttion 切割文件 获取分片
   */
  function getSplitRecord(id, url) {
    return new Promise((resolve, reject) => {
      let data = new FormData();
      // data.append('recordName', 'split_test.wav'); // 文件名
      data.append('recordName', url); // 文件名
      data.append('splitSize', '5'); // 分片的大小
      $http({
        method: 'post',
        service: 'file',
        url: '/phone/splitRecord',
        contentType: 'application/x-www-from-urlencoded',
        data: data,
      })
        .then(response => {
          if (!response.data) {
            $message.error('音频文件不存在');
          } else {
            fileNameList = response.data; // 获取到后端切割的分片名字
          }
          // console.log('获取分片->', response, fileNameList);
          resolve(fileNameList);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * @param {String} id 录音数据id
   * @param {String} fileName 文件名
   * @descripttion 下载文件流
   */
  function getFile(id, fileName) {
    return new Promise((resolve, reject) => {
      let data = new FormData();
      data.append('fileName', fileName); // 文件名
      let req = {
        method: 'post',
        baseURL: window.config.baseURL,
        url: window.config.service.file + '/phone/record',
        contentType: 'application/x-www-from-urlencoded',
        responseType: 'blob',
        data: data,
        headers: {
          token: window.globalToken || document.cookie.match(/token=([^;]*)/)?.[1],
          // token: 'PC_e740e862dcb3e8ec0d2fb9cf9d1d62b5',
        },
      };
      $downFile(req, false)
        .then(response => {
          // console.log(response);
          let data = {};
          data.size = response.headers['content-length'];
          file_len = response.headers['content-length'];
          let blob = new Blob([response.data], { type: response.data.type });
          data.file = blob;
          fileList.push(data); // 将文件存入数组
          // console.log('文件分片', response, data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * @param {array} fileNameList 文件名
   * @param {String} id 录音数据id
   * @descripttion 根据文件名传给后端下载文件流 队列
   */
  function getFileQueue(fileNameList, id) {
    let promise = Promise.resolve();
    fileNameList.forEach((fileName, index) => {
      promise = promise.then(() => {
        return getFile(id, fileName);
      });
    });
    return promise;
  }

  /**
   * @param {String} id 录音数据id
   * @descripttion 根据文件名传给后端下载文件流
   */
  async function getFileList(id) {
    if (fileNameList.length === 0) {
      return;
    }
    // console.log('3.获取文件流->', fileNameList);
    return await getFileQueue(fileNameList, id);
  }

  /**
   * @param {String} id 录音数据id
   * @param {String} data 录音数据
   * @descripttion 更新录音
   */
  async function updateRecord(id, result) {
    let params = new FormData();
    params.append('id', id); // 当前录音数据id
    params.append('voiceTxt', result); // 转写结果
    params.append('eventId', eventId); // 事件Id
    $http({
      method: 'post',
      service: 'eoc',
      url: '/eos/history/phone/updateCdr',
      contentType: 'application/x-www-from-urlencoded',
      data: params,
    }).then(res => {
      if (res.errorcode === 0) {
        // console.log('更新录音成功', res);
      }
    });
  }

  /**
   * @param {String} url 录音地址
   * @descripttion 预处理接口
   */
  function prepare(url) {
    // console.log('4.文件列表：', fileList);
    config.filePath = url;
    let sliceNum = Math.ceil(file_len / FILE_PIECE_SICE); // 文件分片数目（建议分片大小为10M，若文件<10M，则slice_num=1）
    // console.log('-------录音地址-------', config.filePath);
    // console.log('文件名：', fileName);
    let params = new FormData();
    params.append('app_id', config.appId); // 文件名
    params.append('signa', getSigna()); // 文件名
    params.append('ts', ts); // 文件名
    params.append('file_len', file_len); // 文件名
    params.append('file_name', fileName); // 文件名
    params.append('slice_num', sliceNum); // 文件名
    return new Promise((resolve, reject) => {
      axios({
        // url: '/raasr' + '/api/prepare', // 开发环境使用。开发环境请求第三方接口会跨域，所以要用代理的写法
        url: environment === 'production' ? (window.config.proxyURL || config.hostURL) + '/api/prepare' : '/raasr' + '/api/prepare', // 生产环境使用
        method: 'post',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
        .then(res => {
          if (res.data.ok === 0) {
            // 成功
            resolve(res.data.data);
          } else {
            // 失败
            $message.error(res.data.failed);
          }
          // console.log('预处理结果：', res);
        })
        .catch(err => {
          $message.error(err.failed);
        });
    });
  }

  /**
   * @param {array} fileList 录音分片后的文件流
   * @param {String} task_id 任务id
   * @param {number} id 录音数据id
   * @description 上传分片 队列
   */
  function loopUploadQueue(fileList, task_id, id) {
    let promise = Promise.resolve();
    fileList.forEach((file, index) => {
      promise = promise.then(() => {
        return upload(task_id, id, file.file);
      });
    });
    return promise;
  }

  /**
   * @param {String} task_id 任务id
   * @param {String} id 录音数据id
   * @descripttion 分片上传
   */
  async function loopUpload(task_id, id) {
    return await loopUploadQueue(fileList, task_id, id);
  }

  /**
   * @param {String} task_id 任务id
   * @param {String} id 录音数据id
   * @param {String} file 二进制流
   * @descripttion 文件分片上传接口
   */
  function upload(task_id, id, file) {
    let slice_id = getNextSliceId(init_silce_id);
    let params = {
      app_id: config.appId, // 讯飞开放平台应用ID
      signa: getSigna(), // 加密数字签名
      ts: ts, // 时间戳
      task_id: task_id, // 任务ID
      slice_id: slice_id, // 分片序号
    };
    let formData = new FormData();
    formData.append('app_id', params.app_id);
    formData.append('signa', params.signa);
    formData.append('ts', params.ts);
    formData.append('task_id', params.task_id);
    formData.append('slice_id', params.slice_id);
    formData.append('content', file); // content 分片文件内容
    return new Promise((resolve, reject) => {
      axios({
        // url: '/raasr' + '/api/upload', // 开发环境使用。开发环境请求第三方接口会跨域，所以要用代理的写法
        url: environment === 'production' ? (window.config.proxyURL || config.hostURL) + '/api/upload' : '/raasr' + '/api/upload', // 生产环境使用
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(res => {
          if (res.data.ok === 0) {
            // 成功
            resolve(res);
          } else {
            // 失败
            $message.error(res.data.failed);
            reject(res.data.failed);
          }
          // console.log('文件分片上传接口：', res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * @param {String} task_id 任务id
   * @param {String} id 录音数据id
   * @descripttion 合并文件接口
   */
  function merge(task_id, id) {
    let params = new FormData();
    params.append('app_id', config.appId);
    params.append('signa', getSigna());
    params.append('ts', ts);
    params.append('task_id', task_id);
    return new Promise((resolve, reject) => {
      axios({
        // url: '/raasr' + '/api/merge', // 开发环境使用。开发环境请求第三方接口会跨域，所以要用代理的写法
        url: environment === 'production' ? (window.config.proxyURL || config.hostURL) + '/api/merge' : '/raasr' + '/api/merge', // 生产环境使用
        method: 'post',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
        .then(res => {
          if (res.data.ok === 0) {
            // 成功
            // console.log('合并文件接口', res);
            return loopGetProgress(task_id, id);
          } else {
            // 失败
            $message.error(res.data.failed);
            return null;
          }
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }

  /**
   * @param {String} task_id 任务id
   * @param {String} id 录音数据id
   * @descripttion 循环获取转写进度
   */
  async function loopGetProgress(task_id, id) {
    let { data } = await getProgress(task_id); // 获取转写进度
    let res = JSON.parse(data.data);
    // console.log('获取进度：', res);
    if (res.status == 9) {
      let result = await getResult(task_id, id);
      return result;
    } else {
      return sleep(30000).then(() => loopGetProgress(task_id, id));
    }
  }

  /**
   * @param {String} task_id 任务id


   * @descripttion 获取转写进度
   */
  function getProgress(task_id) {
    let params = new FormData();
    params.append('app_id', config.appId);
    params.append('signa', getSigna());
    params.append('ts', ts);
    params.append('task_id', task_id);
    return new Promise((resolve, reject) => {
      axios({
        // url: '/raasr' + '/api/getProgress', // 开发环境使用。开发环境请求第三方接口会跨域，所以要用代理的写法
        url: environment === 'production' ? (window.config.proxyURL || config.hostURL) + '/api/getProgress' : '/raasr' + '/api/getProgress', // 生产环境使用
        method: 'post',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
        .then(res => {
          if (res.data.ok === 0) {
            // 成功
            resolve(res);
          } else {
            // 失败
            $message.error(res.data.failed);
            reject(res.data.failed);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * @param {String} task_id 任务id
   * @param {String} id 录音数据id


   * @descripttion 获取结果接口
   */
  function getResult(task_id, id) {
    let params = new FormData();
    params.append('app_id', config.appId);
    params.append('signa', getSigna());
    params.append('ts', ts);
    params.append('task_id', task_id);
    return new Promise((resolve, reject) => {
      axios({
        // url: '/raasr' + '/api/getResult', // 开发环境使用。开发环境请求第三方接口会跨域，所以要用代理的写法
        url: environment === 'production' ? (window.config.proxyURL || config.hostURL) + '/api/getResult' : '/raasr' + '/api/getResult', // 生产环境使用
        method: 'post',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      }).then(res => {
        let result = '';
        let data = JSON.parse(res.data.data);
        if (data.length > 1) {
          data.forEach(val => {
            result += val.onebest + '\n';
          });
        } else if (data.length === 1) {
          result = data[0].onebest;
        }
        // console.log('---获取结果接口', res, data, result);
        // console.log('----录音结果：', store.getters.getAudioText);
        updateRecord(id, result); // 更新录音
        resolve(result);
      });
    });
  }

  /**
   * @descripttion 初始化数据
   */
  function initData() {
    file_len = 0; // 文件长度
    fileNameList = []; // 分片名字列表
    fileList = []; // 分片文件列表
    init_silce_id = 'aaaaaaaaa`'; // 初始silce_id
    fileName = ''; // 文件名
  }
/**
 * @param {String} id 录音数据id
 * @param {String} url data 录音数据 替换为直接传url author:xuchuangxing lastUpdateTime:2021/1/8 10:20
 * @descripttion 华为语音转写-huaweiAsr方法 （深圳项目）
 */
 async function huaweiAsr(id, src) {
  // 重新拼接成代理语音地址
  const url = `${window.config.HWASR}${src}`;
  const res = await axios({
    url: `${window.config.baseURL}${window.config.service.file}/huaweiCloud/huaweiAsr`,
    method: 'get',
    params: {
      url,
      // url: 'http://222.189.189.181:9998/rec/20210724165738_6014_15819249242_CALLOUT.wav', // 测试录音文件地址
    },
  });
  let result = '';
  if (res.data.data) {
    const sentenceList = [...res.data.data.sentenceList]; // 转写完的数据
    // 拼接录音数据
    if (sentenceList.length > 1) {
      sentenceList.forEach((val) => {
        result += `${val.text}\n`;
      });
    } else if (sentenceList.length === 1) {
      result = sentenceList[0].text;
    }
  }
  await updateRecord(id, result); // 更新录音
  console.log('华为录音转文字结果：', result);
  return result; // 返回渲染识别文字 author:xuchuangxing lastUpdateTime:2021/1/8 10:20
}

  /**
   * @param {String} url 录音地址
   * @param {String} audioData 录音数据
   * @descripttion 语音转写
   */
  async function allApiRequests(url, audioData) {
    try {
      let result = '';
      // if (!!config.appId && !!config.secretKey) {
      //   eventId = audioData.eventId;
      //   initData(); // 初始化数据
      //   getFileName(url); // 获取文件名
      //   await getSplitRecord(audioData.id, url); // 获取分片名字
      //   await getFileList(audioData.id); // 获取分片文件
      //   if (fileList.length === 0) {
      //     $message.error('音频文件不存在');
      //     return;
      //   }
      //   let taskId = await prepare(url, audioData); // 预处理
      //   await loopUpload(taskId, audioData.id); // 上传文件
      //   result = await merge(taskId, audioData.id); // 合并，获取结果
      //   // console.log('----录音结果：', result);
      //   return result;
      // }

      // 华为asr
      // 扬州项目录音转文字用华为云的
      result = await huaweiAsr(audioData.id, url);
      return result
    } catch (err) {
      // console.log(err);
    }
  }
  return {
    allApiRequests,
  };
}

export default audioTurnToText;
