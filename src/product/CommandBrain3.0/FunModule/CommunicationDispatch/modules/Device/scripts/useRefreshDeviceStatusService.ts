import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

const request = {
  method: 'POST',
  service: 'device',
  url: '/device/appdevice/refreshDeviceStatus',
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * 刷新设备状态
 *
 * 由于接口本身是异步的，返回的响应不代表刷新成功，需要通过 websocket 监听
 */
function refreshDeviceStatus(): void {
  $http(request).then((response) => {
    if (response.code === 0) {
      $message.success('请求刷新设备状态成功');
    } else {
      $message.error(`刷新设备状态失败，错误代码${response.code}，错误信息：${response.msg}`);
    }
  }).catch((error) => {
    $message.error(`刷新设备状态失败，错误信息：${error}`);
  });
}

export default refreshDeviceStatus;
