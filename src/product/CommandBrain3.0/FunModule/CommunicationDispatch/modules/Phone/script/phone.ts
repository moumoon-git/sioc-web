import { ref, getCurrentInstance } from 'vue';

  // const phoneHistoryData = ref({
  //   id: '', // 查询记录id
  //   phoneNumber: '', // 通话号码
  //   eventId: eventId, // 事件id
  //   callType: '', // 呼叫类型标识
  //   vcDirect: '', // 呼叫类型中文
  //   dtStart: '', // 开始日期
  //   dtEnd: '', // 结束日期
  //   searchText: '', // 搜索内容
  //   isGroupBy: '', // 是否聚合联系人
  //   page: '', // 第几页
  //   size: '', // 每页多少数据
  // });

  /**
   * @param {object} phoneHistoryData 请求接口的数据
   *  id          查询记录id
   *  phoneNumber 通话号码
   *  eventId     事件id
   *  callType    呼叫类型标识
   *  vcDirect    呼叫类型中文
   *  dtStart     开始日期
   *  dtEnd       结束日期
   *  searchText  搜索内容
   *  isGroupBy   是否聚合联系人
   *  page        第几页
   *  size        每页多少数据
   * @param  successCallback 请求成功的回调函数
   * @param  errorCallback 请求失败的回调函数
   * @description 获取历史数据
   */
  function getPhoneHistory($http: any, phoneHistoryData: object, successCallback: any, errorCallback: any) {
    const requestData = ref({
      method: 'post',
      service: 'eoc',
      url: '/eos/history/phone/list',
      contentType: 'application/x-www-from-urlencoded',
      data: phoneHistoryData,
    });
    $http(requestData.value)
      .then((res: any) => {
        if (res.errorcode === 0) {
          successCallback(res);
        } else {
          errorCallback(res);
        }
      })
      .catch((error: any) => {
        errorCallback(error);
      });
  }

  /**
   * @param { string | number } eventId 事件Id
   * @param  successCallback 请求成功的回调函数
   * @param  errorCallback 请求失败的回调函数
   * @description 获取历史数据
   */
  function getEventPhoneCount($http: any,eventId: string | number, successCallback: any, errorCallback: any) {
    let data = ref(new FormData());
    data.value.append('eventId', eventId.toString())
    const requestData = ref({
      method: 'post',
      service: 'eoc',
      url: '/eos/history/phone/eventPhoneCount',
      contentType: 'application/x-www-from-urlencoded',
      data: data
    });
    $http(requestData.value)
      .then((res: any) => {
        if (res.errorcode === 0) {
          successCallback(res);
        } else {
          errorCallback(res);
        }
      })
      .catch((error: any) => {
        errorCallback(error);
      });
  }

export default {
  getPhoneHistory,
  getEventPhoneCount,
};
