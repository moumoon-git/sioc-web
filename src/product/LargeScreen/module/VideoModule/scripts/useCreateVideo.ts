import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
export default function useCreateVideo($video: any) {
  /**
  * @desc 利用videoJs创建video标签，并初始化设置
  * @param {
  * domId:挂载标签的dom的Id
  * option:标签的设置
  * } 
  * @returns {} returns
  */
  type OptionParam = {
    // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
    controls: boolean,
    // 自动播放属性,muted:静音播放
    autoplay: string,
    // 建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
    preload: string,
    // 设置视频播放器的显示宽度（以像素为单位）
    width: string,
    // 设置视频播放器的显示高度（以像素为单位）
    height: string,
  };
  const createVideo = (domId: string, option: OptionParam) => {
    //初始化视频方法
    return new Promise((resolve, reject) => {
      let myPlayer = $video(domId, option);
      resolve(myPlayer)
    })

  }
  /**
  * @desc 获取视频流地址
  * @param {
  * videoCode:视频编码
  * } 
  * @returns {} returns
  */
  const getVideoStreamSrc = (videoCode: string) => {
    return new Promise((resolve) => {
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appdevicegroup/getMonitor',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          agentId: 1,
          type: "0",
          devName: videoCode,
          topicName: '6001'
        }
      } as const;
      $http(request).then((response) => {
        console.log(response)
        resolve(response.data?.playUrl || '');
      });
    });
  }
  return {
    createVideo,
    getVideoStreamSrc,
  }
}