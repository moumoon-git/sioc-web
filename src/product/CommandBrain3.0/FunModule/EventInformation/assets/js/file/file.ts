/*
 * @Author: hxt
 * @Date: 2021-04-25 11:06:26
 * @LastEditTime: 2021-05-05 14:41:46
 * @LastEditors: Please set LastEditors
 * @Description: 存放关于文件后缀的方法
 * @FilePath: \hxt_sinvie3.0\sioc-web\src\product\SIOC-H5\module\task\TaskDetail\assets\js\images\fileExtensions.js
 */
import { ref } from 'vue';

// 图片后缀
const imagesExtension = [
  'bmp',
  'jpg',
  'jpeg',
  'png',
  'tif',
  'gif',
  'pcx',
  'tga',
  'exif',
  'fpx',
  'svg',
  'psd',
  'cdr',
  'pcd',
  'dxf',
  'ufo',
  'eps',
  'ai',
  'raw',
  'WMF',
  'webp',
  'avif',
];

// 文档后缀
const documentExtension = ['ppt', 'txt', 'xls', 'xlsx', 'pdf', 'doc', 'docx', 'pptx'];

// 视频的文件后缀
const videoExtension = ['avi', 'mpg', 'mlv', 'mpe', 'mpeg', 'dat', 'mp4', 'ogg'];

// 可上传的文档类型
const acceptFileType =
  '.doc,.docx,.xml,.ppt,.pptx,.rar,.zip,.xlsx,.xls,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * @author hxt
 * @param {string} fileName 带有后缀名的文件名
 * @returns {string} extension 文件后缀
 * @description 根据带有后缀名的文件名，获取文件后缀
 */
const getExtensions = function(fileName: string): string {
  let extension: any = fileName.slice(fileName.lastIndexOf('.') + 1, fileName.length);
  return extension;
};

/**
 * @author hxt
 * @param {string} extension 文件后缀
 * @param {string} color gray:获取灰色的图片；colored:获取彩色的图片
 * @returns {Object} url
 * @description 根据文件后缀获取对应图标
 */
const getExtensionImage = function(extension: string, color: string): any {
  let url = ref('');
  let fileType = ref('');
  if (color === 'colored') {
    switch (extension) {
      case 'pdf':
        fileType.value = 'pdf';
        break;
      case 'xls':
        fileType.value = 'excel';
        break;
      case 'xlsx':
        fileType.value = 'excel';
        break;
      case 'docx':
        fileType.value = 'word';
        break;
      case 'doc':
        fileType.value = 'word';
        break;
      case 'zip':
        fileType.value = 'zip';
        break;
      case 'rar':
        fileType.value = 'rar';
        break;
      case 'ppt':
        fileType.value = 'ppt';
        break;
      case 'txt':
        fileType.value = 'txt';
        break;
      default:
        fileType.value = 'file';
        break;
    }
  } else {
    switch (extension) {
      case 'pdf':
        fileType.value = 'pdf';
        break;
      case 'xls':
        fileType.value = 'excel';
        break;
      case 'xlsx':
        fileType.value = 'excel';
        break;
      case 'docx':
        fileType.value = 'word';
        break;
      case 'doc':
        fileType.value = 'word';
        break;
      case 'zip':
        fileType.value = 'zip';
        break;
      case 'rar':
        fileType.value = 'rar';
        break;
      case 'ppt':
        fileType.value = 'ppt';
        break;
      case 'txt':
        fileType.value = 'txt';
        break;
      default:
        fileType.value = 'file';
        break;
    }
  }
  let result = ref({
    url: url.value,
    fileType: fileType.value,
  });
  return result.value;
};

/**
 *
 * @param file 下载路径
 * @param fileName
 * @description 下载文件
 */
function downloadFile(file: string, fileName: string) {
  let url = `${file}`;
  let eleLink: any = document.createElement('a');
  eleLink.download = fileName; // 文件名
  eleLink.href = url;
  eleLink.click();
}

/**
 * @param { string } fileName 文件名字
 * @description 判断文件属于哪个类型：file, image, video
 */
function judgeFileExtension(fileName: string) {
  const extension = getExtensions(fileName);
  const type = ref('');
  if (imagesExtension.filter((el: string) => el === extension).length > 0) {
    type.value = 'image';
  } else if (documentExtension.filter((el: string) => el === extension).length > 0) {
    type.value = 'file';
  } else if (videoExtension.filter((el: string) => el === extension).length > 0) {
    type.value = 'video';
  }
  return type.value;
}

export default {
  getExtensions,
  getExtensionImage,
  imagesExtension,
  documentExtension,
  acceptFileType,
  downloadFile,
  videoExtension,
  judgeFileExtension
};
