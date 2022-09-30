import { getCurrentInstance } from 'vue';
function init(props?: any) {
  const { $downFile }: any =
    getCurrentInstance()?.appContext.config.globalProperties;
  // 单个下载
  function download(x: any, url?: string) {
    console.log(x);
    const request = {
      method: 'get',
      url:
        (window as any).config.baseURL +
        (window as any).config.service.file +
        (url || '/appAttachment/downloadAssistMarkFile'),
      service: 'file',
      headers: {
        'Content-Type': 'application/json',
        token: document.cookie.match(/token=([^;]*)/)?.[1] || (window as any).TOKEN,
      },
      params: {
        appAttachmentId: x.id || x.serviceData.id,
        isForceDownload: 1,
      },
      responseType: 'arraybuffer',
    };
    $downFile(request, false).then((res: any) => {
      console.log(res);
      const a = document.createElement('a');
      if (x.fileSuffix === 'xls') {
        a.href = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/vnd.ms-excel' }),
        );
      } else if (x.fileSuffix === 'doc') {
        a.href = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/msword' }),
        );
      } else if (x.fileSuffix === 'pdf') {
        a.href = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' }),
        );
      } else if (x.fileSuffix === 'xlsx') {
        a.href = window.URL.createObjectURL(
          new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        );
      } else if (x.fileSuffix === 'ppt') {
        a.href = window.URL.createObjectURL(
          new Blob([res.data], {
            type: 'application/vnd.ms-powerpoint',
          }),
        );
      } else if (x.fileSuffix === 'txt') {
        a.href = window.URL.createObjectURL(
          new Blob([res.data], {
            type: 'text/plain',
          }),
        );
      }
      a.download = `${x.fileName}.${x.fileSuffix}`;
      document.body.appendChild(a); // 兼容Firefox浏览器
      a.click();
      a.remove();
    });
  }
  // 下载所有
  function downloadAll() {
    props.visData.map((x: any) => {
      download(x);
    });
  }
  return {
    download,
    downloadAll
  }
}
export default init;
