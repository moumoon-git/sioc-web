import { ref } from 'vue'

/**
 * @param {String} fileName 带有后缀名的文件名
 * @returns {String} extension 文件后缀
 * @description 根据带有后缀名的文件名，获取不带“.”的文件后缀
 */
const getExtensions = function (fileName: string): string {
  let extension: any = fileName.slice(
    fileName.lastIndexOf(".") + 1,
    fileName.length
  );
  return extension;
}

/**
 * @param {String} extension 文件后缀
 * @param {String} color gray:获取灰色的图片；colored:获取彩色的图片
 * @returns {Object} url
 * @description 根据文件后缀获取对应图标
 */
const getExtensionImage = function (extension: string, color: string): any {
  // console.log(extension, color)
  let url = ref('');
  let fileType = ref('');
  if (color === 'colored') {
    switch (extension) {
      case 'pdf':
        url.value = '/colored/pdf.png';
        fileType.value = 'pdf';
        break;
      case 'xls':
        url.value = '/colored/excel.png';
        fileType.value = 'excel';
        break;
      case 'xlsx':
        url.value = '/colored/excel.png';
        fileType.value = 'excel';
        break;
      case 'docx':
        url.value = '/colored/word.png';
        fileType.value = 'word';
        break;
      case 'doc':
        url.value = '/colored/word.png';
        fileType.value = 'word';
        break;
      case 'zip':
        url.value = '/colored/zip.png';
        fileType.value = 'zip';
        break;
      case 'rar':
        url.value = '/colored/rar.png';
        fileType.value = 'rar';
        break;
      case 'ppt':
        url.value = '/colored/ppt.png';
        fileType.value = 'ppt';
        break;
      case 'txt':
        url.value = '/colored/txt.png';
        fileType.value = 'txt';
        break;
      default:
        url.value = '/colored/file.png';
        fileType.value = 'file';
        break;
    }
  } else {
    switch (extension) {
      case 'pdf':
        url.value = '/gray/pdf.png';
        fileType.value = 'pdf';
        break;
      case 'xls':
        url.value = '/gray/excel.png';
        fileType.value = 'excel';
        break;
      case 'xlsx':
        url.value = '/gray/excel.png';
        fileType.value = 'excel';
        break;
      case 'docx':
        url.value = '/gray/word.png';
        fileType.value = 'word';
        break;
      case 'doc':
        url.value = '/gray/word.png';
        fileType.value = 'word';
        break;
      case 'zip':
        url.value = '/gray/zip.png';
        fileType.value = 'zip';
        break;
      case 'rar':
        url.value = '/gray/rar.png';
        fileType.value = 'rar';
        break;
      case 'ppt':
        url.value = '/gray/ppt.png';
        fileType.value = 'ppt';
        break;
      case 'txt':
        url.value = '/gray/txt.png';
        fileType.value = 'txt';
        break;
      default:
        url.value = '/gray/file.png';
        fileType.value = 'file';
        break;
    }
  }
  // console.log(fileType.value);
  let result = ref({
    'url': url.value,
    'fileType': fileType.value
  })
  return result.value;
}

/**
 * @param file 下载路径
 * @param fileName 文件名
 * @description 下载文件
 */
function downloadFile(file: any, fileName: any) {
  console.log('下载文件：文件地址为：', file)
  let url = `${file}`;
  let eleLink: any = document.createElement("a");
  eleLink.download = fileName; // 文件名
  eleLink.href = url;
  eleLink.click();
}

export default {
  getExtensions,
  getExtensionImage,
  downloadFile
}
