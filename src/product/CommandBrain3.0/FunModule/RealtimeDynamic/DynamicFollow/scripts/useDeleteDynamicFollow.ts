import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

/**
 * 取消关注
 * @param ids id数组
 * @returns 返回promise
 */
export function deleteDynamicFollow(ids: { id: number, type: number, eventId: number }[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = {
      method: 'post',
      service: 'soc',
      url: '/event/attention/delete',
      headers: {
        'Content-Type': 'application/json',
      },
      data: ids,
    } as const;
    $http(request).then((response) => {
      if (response.code === 0 || response.errorcode === 0) {
        $message.info('取消关注成功');
        resolve(true);
      } else {
        $message.error(`取消关注失败，错误代码${response.code ?? response.errorcode}，错误信息：${response.msg ?? response.message}`);
        reject();
      }
    }).catch((error: Error) => {
      $message.error(`取消关注失败，错误信息：${error}`);
      reject();
    });
  });
}

export default () => {
  return {
    deleteDynamicFollow,
  };
};
