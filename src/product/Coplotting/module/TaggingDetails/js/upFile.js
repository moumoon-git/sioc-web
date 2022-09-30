import { ref } from 'vue';

function upFile($http, type) {
    const types = type;
    // 上传文件的input
    const fileUpload = ref(null);
    // 上传后的文件回显数据
    const echo = ref({ txt: [], videoAndImg: [] });
    // 点击上传文件按钮后激活上传选择
    function uploadFile() {
        fileUpload.value.click();
    }
    // 上传文件
    function uploadFiles(params) {
        const formData = new FormData(); // 每次失败要重置formdata对象
        formData.append('type', types);
        formData.append('file', params);
        const request = {
            method: 'post',
            service: 'file',
            url: '/appAttachment/fileUploadAttachment',
            headers: {
                'Content-Type': 'application/json',
            },
            data: formData,
        };
        return $http(request);
    }
    // 把图片和视频文件 转换成 可读取的url
    function getObjectURL(file) {
        let url = null;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL !== undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL !== undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) { // webkit or chrome
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
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" xlsx
      */
    function getUploadFile(e) {
        // console.log(e);
        const filesList = e.target.files;
        // console.log(filesList);
        filesList.forEach((ele) => {
            // console.log(ele);
            const obj = {
                name: ele.name,
            };
            // 图片和视频都可以进行预览
            // 图片不超过10m
            // 视频不超过100m
            if ((ele.type.indexOf('video') !== -1 && ele.size < 1024 * 1024 * 100) ||
                (ele.type.indexOf('image') !== -1 && ele.size < 1024 * 1024 * 10)) {
                const newsrc = getObjectURL(ele);
                obj.src = newsrc;
                const typex = ele.type.indexOf('image') !== -1 ? 'image' : 'video';
                obj.type = typex;
                echo.value.videoAndImg.push(obj);
                uploadFiles(ele).then((res) => {
                    obj.serviceData = res.data;
                });
            } else {
                let type2 = 'xlsx';
                if (ele.type.indexOf('word') !== -1) {
                    type2 = 'word';
                } else if (ele.type.indexOf('pdf') !== -1) {
                    type2 = 'pdf';
                }
                obj.type = type2;
                echo.value.txt.push(obj);
                uploadFiles(ele).then((res) => {
                    obj.serviceData = res.data;
                });
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
        // e.target.value = '';
    }
    return {
        fileUpload,
        uploadFile,
        getUploadFile,
        echo,
    };
}
export default upFile;