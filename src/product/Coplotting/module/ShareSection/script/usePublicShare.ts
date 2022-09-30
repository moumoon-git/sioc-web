
import { Ref, ref } from 'vue'
import { ElMessage } from 'element-plus';
import QRCode from 'qrcode'; // 引入qrcode
const usePublicShare = ($http: any): {
  isShowBot: Ref<Boolean>,
  linkInfo: Ref<any>,
  publicShareData: Ref<any[]>,
  publicShareGroupData: Ref<any[]>,
  timeList: Ref<any[]>,
  ImgUrl: Ref<string>,
  savePublicShare: (
    data: any
  ) => void,
  getPublicShareLog: (
    id: number
  ) => void,
  deletePublicShareLog: (
    id: number
  ) => void,
  createQrcode:( 
    url: string,
    w:number,
    h:number
   ) => void
} => {
  const linkInfo = ref('') // 返回值信息
  const isShowBot = ref(false) // 是否显示一键生成结果
  const publicShareData = ref([]) // 分享记录
  const publicShareGroupData = ref([]) // 所有分组
  const timeList = ref([{
    value: 7,
    label: '7天',
  }, {
    value: 15,
    label: '15天',
  }, {
    value: 30,
    label: '30天',
  }, {
    value: 0,
    label: '永久',
  }]);
  // 生成一键分享链接
  const savePublicShare = (data: any) => {
    const request = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistpublicshare/save',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };
    return new Promise((resolve,reject) =>{
      $http(request)
      .then((response: any) => {
        if (response.code === 0) {
          linkInfo.value = response.data.url;
          isShowBot.value = true;
          resolve(response)
        } else {
          ElMessage.error(
            `一键分享失败，错误代码${response.code}，错误信息：${response.msg}`,
          );
        }
      })
      .catch((error: Error) => {
        reject(error)
        ElMessage.error(`获取全部平台失败，错误信息：${error}`);
      });
    })
  }
  // 获取分享记录
  // id:地图id
  const getPublicShareLog = (id: number) => {
    const request = {
      method: 'get',
      service: 'coplotting',
      url: '/assist/assistpublicshare/list',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        mapId: id
      }
    };
    $http(request)
      .then((response: any) => {
        if (response.code === 0) {
          publicShareData.value = response.data.list
          publicShareGroupData.value = response.data.groups
        } else {
          ElMessage.error(
            `获取分享记录失败，错误代码${response.code}，错误信息：${response.msg}`,
          );
        }
      })
      .catch((error: Error) => {
        ElMessage.error(`获取分享记录失败，错误信息：${error}`);
      });
  }
  // 删除分享记录
  const deletePublicShareLog =  (id: number) => {
    const request = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistpublicshare/delete',
      headers: {
        'Content-Type': 'application/json',
      },
      data: id
    };
    return new Promise((resolve,reject) => {
      $http(request)
      .then((response: any) => {
        if (response.code === 0) {
          resolve(response)
        } else {
          ElMessage.error(
            `删除分享记录失败，错误代码${response.code}，错误信息：${response.msg}`,
          );
        }
      })
      .catch((error: Error) => {
        reject(error)
        ElMessage.error(`删除分享记录失败，错误信息：${error}`);
      });
    })
  }
  // 生成二维码
  /**
  * @desc 
  * @param {
  * url:二维码扫码后要跳转的地址,也可以是文本内容，扫描后会弹出一个空白界面文本
  * w:二维码宽度
  * h:二维码高度
  * } 
  * @returns {} returns
  */
  const ImgUrl = ref('');
  const createQrcode = (url:string,w:number,h:number) =>{
    (QRCode as any).toDataURL('协作标绘移动端暂未开放', {
          version: 7, // 版本号，
          errorCorrectionLevel: 'Q', // 容错率,(建议选较低)更高的级别可以识别更模糊的二维码，但会降低二维码的容量
          width: w,
          height: h, // 设置二维码图片大小
          margin: 0,
          })
        .then((url :any) => { // 这个url是二维码生成地址，也就是相当于图片地址
          ImgUrl.value = url; // 后面会用在img的src属性上
          })
          .catch((err :any) => {
          console.error(err);
          });
  }
  return {
    linkInfo,
    isShowBot,
    publicShareData,
    publicShareGroupData,
    timeList,
    ImgUrl,
    savePublicShare,
    getPublicShareLog,
    deletePublicShareLog,
    createQrcode,
  }
}
export default usePublicShare;