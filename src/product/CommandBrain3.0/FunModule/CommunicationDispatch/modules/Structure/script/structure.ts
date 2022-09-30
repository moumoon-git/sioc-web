import { ref, onMounted,getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus';
export function getTreeData () {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
  // 获取通讯录树形结构数据
  const getContactTreeData = () => {
      return new Promise((resolve, reject) => {
        const request = {
            method: 'get',
            // service: 'coplotting',
            url: '/ser/mail/mailgroup/list',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
            },
          };
          $http(request).then((response: any) => {
            if (response.code === 0) {
                resolve(response)
            } else {
              ElMessage.error(`获取通讯录失败，错误代码${response.code}，错误信息：${response.msg}`);
              reject(`获取通讯录失败${response.code}`);
            }
          }).catch((error: Error) => {
            ElMessage.error(`获取通讯录失败，错误信息：${error}`);
            reject(`获取通讯录失败${error}`);
          });
      })
   
  }

  return {
    
    getContactTreeData
  }
}