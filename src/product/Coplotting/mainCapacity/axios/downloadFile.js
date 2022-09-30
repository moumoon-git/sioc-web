import axios from 'axios';
/* req
    {
      method: 'post',
      url: 'xxx',
      baseURL: window.SITE_CONFIG.baseUrl,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        token: xxx,
      },
      data: {},
      responseType: 'arraybuffer',
    }
*/

function downloadFile(req = {}, downFlag = true) {
    const promise = new Promise((resolve, reject) => {
                axios(req).then((response) => {
                            if (response.data && response.data.code === 20005) {
                                return;
                            }

                            if (downFlag) {
                                const date = new Date();
                                const n = date.getFullYear();
                                const y = (date.getMonth() + 1);
                                const r = date.getDate();
                                const timeStr = `${n}-${y < 10 ? `0${y}` : y}-${r < 10 ? `0${r}` : r}`;
				if (navigator.msSaveOrOpenBlob) {
					// 兼容ie
					navigator.msSaveOrOpenBlob(
						new Blob([response.data], {
							type: 'application/vnd.ms-excel'
						}),
						`${timeStr}.xls`,
					);
				} else {
					const fileName = decodeURI(
						response.headers['content-disposition'].split('fileName=')[1],
					);
					const a = document.createElement('a');
					a.href = window.URL.createObjectURL(
						new Blob([response.data], {
							type: 'application/vnd.ms-excel'
						}),
					);
					// console.log(escape(response.headers['content-disposition']));
					// console.log(response.headers['content-disposition'].split('fileName=')[1]);
					console.log(fileName);
					console.log(response);
					a.download = fileName || `${timeStr}.xls`;
					document.body.appendChild(a); // 兼容Firefox浏览器
					a.click();
					a.remove();
				}
			}

			resolve(response);
		});
	});
	return promise;
}
export default downloadFile;