import { ref } from 'vue';
// import XLSX from 'xlsx';

function upFile(
  $http: any,
  type: any,
  echos: any,
  props: any,
  $message?: any,
  upDataNum?: number,
) {
  const echo = echos;
  const types = type;
  const { result } = props;
  const { accept } = props;
  const upDataNums: any = upDataNum;
  // 上传文件的input
  const fileUpload = ref<HTMLElement | null | any>(null);

  // 点击上传文件按钮后激活上传选择
  function uploadFile() {
    fileUpload.value.value = '';
    fileUpload.value.click();
  }
  // 上传文件
  function uploadFiles(params: any) {
    const formData = new FormData(); // 每次失败要重置formdata对象
    formData.append('type', types);
    formData.append('file', params);
    const request = {
      method: 'post',
      service: 'file',
      // baseURL:'http://192.168.3.113:10374',
      url: '/appAttachment/fileUploadAttachment',
      headers: {
        'Content-Type': 'application/json',
      },
      data: formData,
    };
    return $http(request);
  }
  // 把图片和视频文件 转换成 可读取的url
  function getObjectURL(file: any) {
    let url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if ((window as any).createObjectURL !== undefined) {
      // basic
      url = (window as any).createObjectURL(file);
    } else if (window.URL !== undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }
  /*
    文件类型
    type: "application/pdf" pdf
    type: "application/msword" word
    type: "image/png"
    type: "application/vnd.ms-excel" xls
    type：'application/vnd.ms-powerpoint' ppt
    type：'text/plain' tex
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" xlsx
    */
  function getUploadFile(e: any) {
    // console.log(e);
    const filesList = e.target.files;
    // console.log(filesList);
    filesList.forEach((ele: any) => {
      console.log(ele);
      console.log(accept);
      const obj: any = {
        name: ele.name,
      };
      // 先进行文件类型判断
      if (
        ele.type.indexOf('video') !== -1 ||
        ele.type.indexOf('image') !== -1 ||
        ele.type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') !== -1 ||
        ele.type.indexOf('application/msword') !== -1 ||
        ele.type.indexOf('application/vnd.ms-excel') !== -1 ||
        ele.type.indexOf('application/pdf') !== -1
      ) {
        // 图片和视频都可以进行预览
        // 图片不超过10m
        // 视频不超过100m
        if (
          (ele.type.indexOf('video') !== -1 && ele.size < 1024 * 1024 * 100) ||
          (ele.type.indexOf('image') !== -1 && ele.size < 1024 * 1024 * 10)
        ) {
          if (echo.value.videoAndImg.length < upDataNums) {
            const newsrc = getObjectURL(ele);
            obj.src = newsrc;
            const typex = ele.type.indexOf('image') !== -1 ? 'image' : 'video';
            obj.type = typex;
            obj.addFlag = true;
            echo.value.videoAndImg.push(obj);
            uploadFiles(ele).then((res: any) => {
              obj.serviceData = res.data;
              echo.value.videoAndImg.push('');
              echo.value.videoAndImg.pop();
            });
          } else {
            $message.error('可上传图片/视频，限制4张');
            e.target.value = '';
          }
        } else if (
          (ele.type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') !== -1 ||
            ele.type.indexOf('application/msword') !== -1 ||
            ele.type.indexOf('application/vnd.ms-excel') !== -1 ||
            ele.type.indexOf('application/pdf') !== -1) &&
          ele.size < 1024 * 1024 * 10
        ) {
          let type2 = '';
          if (ele.type.indexOf('application/msword') !== -1) {
            type2 = 'word';
          } else if (ele.type.indexOf('application/pdf') !== -1) {
            type2 = 'pdf';
          } else if (ele.type.indexOf('application/vnd.ms-excel') !== -1) {
            type2 = 'xls';
          } else if (ele.type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') !== -1) {
            type2 = 'xlsx';
          }
          obj.type = type2;
          obj.file = ele;
          obj.addFlag = true;
          echo.value.txt.push(obj);
          uploadFiles(ele).then((res: any) => {
            obj.serviceData = res.data;
            echo.value.videoAndImg.push('');
            echo.value.videoAndImg.pop();
          });
        } else {
          $message.error(`文件${ele.name}超过限制大小`);
          e.target.value = '';
          return;
        }
      } else {
        $message.error('文件类型错误');
        e.target.value = '';
        return;
      }
      if (result === 'file') {
        obj.file = ele;
        e.target.value = '';
      }
    });
    // console.log(echo);
    //   const reader = new FileReader();
    //   reader.onload = function () {
    //    console.log(this.result);
    //   };
    //   reader.onerror = errorHandler;
    // 上传进度
    //   reader.onprogress = function (e:any) {
    //     console.log(e);
    //     console.log((e.loaded / e.total) * 100);
    //   };
    // 将文件作为二进制字符串读入
    //   reader.readAsBinaryString(e.target.files[0]);
    //   console.log(e.target.files);
    if (result === 'res') {
      e.target.value = '';
    }
  }
  return {
    fileUpload,
    uploadFile,
    getUploadFile,
    echo,
  };
}
export default upFile;
