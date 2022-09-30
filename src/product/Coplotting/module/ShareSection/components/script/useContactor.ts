/*
 * @Author: DGT 
 * @Date: 2021-06-16 09:46:01 
 * @Last Modified by: DGT_
 * @Last Modified time: 2021-06-16 14:16:41
 */

import { Ref,ref } from 'vue'
import { ElMessage } from 'element-plus';
const useContactorFun = ($http:any):{
    contactorTreeData:Ref<any[]>,
    getContactor:() => void,
    personListData:Ref<any[]>,
    getPersonByGroupId:(data:any)=>void,
    sendMsg:(data:any)=>void
} =>{
    // 获取通讯录树结构
    const contactorTreeData = ref([]);// 通讯录树结构
    const getContactor = () =>{
        const request = {
            method: 'get',
            service: 'soc',
            url: '/mail/mailgroup/list',
            headers: {
              'Content-Type': 'application/json',
            },
            // params: data
          };
          $http(request)
            .then((response: any) => {
              if (response.code === 0) {
                contactorTreeData.value = response.data
              } else {
                ElMessage.error(
                  `获取通讯录失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error: Error) => {
              ElMessage.error(`获取通讯录失败，错误信息：${error}`);
            });
    }
    // 根据分组id获取分组对应人员
    const personListData = ref([]) // 分组人员数据
    const getPersonByGroupId = (data:any) =>{
        const request = {
            method: 'post',
            service: 'soc',
            url: '/mail/mailcontactor/list',
            headers: {
              'Content-Type': 'application/json',
            },
            data: data
          };
          $http(request)
            .then((response: any) => {
              if (response.code === 0) {
                personListData.value = response.data.list
              } else {
                ElMessage.error(
                  `获取人员失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error: Error) => {
              ElMessage.error(`获取人员失败，错误信息：${error}`);
            });
    }
    // 短信发送
    const sendMsg = (data:any) =>{
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/eos/communication/sms/addSmsQueue',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data
      };
      $http(request)
        .then((response: any) => {
          if (response.errorcode === 0) {
            ElMessage.success({
              message: '已加入发送队列',
              type: 'success',
            });
          } else {
            ElMessage.error(
              `发送失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`发送失败，错误信息：${error}`);
        });
    } 
    return {
        getContactor,
        contactorTreeData,
        personListData,
        getPersonByGroupId,
        sendMsg
    }
}
export default useContactorFun