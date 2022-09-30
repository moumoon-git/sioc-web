import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import { map } from 'lodash';
import { useStore } from 'vuex';
import {
    openVideoWall, // 打开视频墙
  } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS'; // 链接uds发送方法

/**
* @desc 视频墙uds成功调用的回调
* @param {}
* @returns {} returns
*/
const useRollingCallback = (): {
    openVideoWallCallback:(obj:any) => void,
    stopVideoWallCallback:(obj:any) => void,
    startVideoPreviewCallback:(obj:any) => void,
    stopVideoPreviewCallback:(obj:any) => void,
    clickWallCallback:(obj:any) => void,
    openAppCallback:(obj:any) => void,
} => {
    const store = useStore();
    /**
    * @desc 开启视频墙成功回调
    * @param {} params
    * @returns {} returns
    */
    const openVideoWallCallback = (obj:any) => {
        console.log('callback：开启视频墙成功');
        console.log(obj);
    };
    /**
    * @desc 关闭视频墙成功回调
    * @param {} params
    * @returns {} returns
    */
    const stopVideoWallCallback = (obj:any) => {
        console.log('callback：关闭视频墙成功');
        console.log(obj);
    };
    /**
    * @desc 视频墙开始预览成功回调
    * @param {} params
    * @returns {} returns
    */
     const startVideoPreviewCallback = (obj:any) => {
        console.log('callback：视频墙预览成功');
        console.log(obj);
    };
    /**
    * @desc 视频墙停止预览成功回调
    * @param {} params
    * @returns {} returns
    */
     const stopVideoPreviewCallback = (obj:any) => {
        console.log('callback：视频墙停止预览成功');
        console.log(obj);
    };
     /**
    * @desc 客户端启动成功回调
    * @param {} params
    * @returns {} returns
    */
      const openAppCallback = (obj:any) => {
        console.log('callback：客户端启动成功');
        console.log(obj);
        if ((window as any).config.isStartUdsVideoWall) {
            // 当开启了uds视频墙配置才进行初始化
            return new Promise((resolve, reject) => {
                const option = {
                  x: (window as any).config.videoOption.x,
                  y: (window as any).config.videoOption.y,
                  w: (window as any).config.videoOption.w,
                  h: (window as any).config.videoOption.h,
                  total: 6,
                  number: '',
                };
                console.log(option);
                console.log('成功来自useUdsRolling');
                console.log('开始发送初始化视频墙命令');
                openVideoWall(option);
                resolve('初始化视频墙成功');
                console.log('初始化视频墙成功');
              });
          }
    };
    /**
    * @desc 视频墙单个点击回调
    * @param {} params
    * @returns {} returns
    */
     const clickWallCallback = (obj:any) => {
        console.log('callback：视频墙单个点击回调');
        console.log(obj);
        const videoCode = obj.number; // 点击的视频的code
        // const allVideoArrs = store.state.selectedVideoArr;
        const allVideoArrs = JSON.parse((localStorage.getItem('videoLogs')) as any).pollingVideos;
        allVideoArrs.forEach((element:any) => {
            if (element.code === videoCode) {
                const { longitude, latitude } = element;
                window.map.setCentent({ longitude, latitude }, 12);
            }
        });
    };
  return {
    openVideoWallCallback,
    stopVideoWallCallback,
    startVideoPreviewCallback,
    stopVideoPreviewCallback,
    clickWallCallback,
    openAppCallback,
  };
};
export default useRollingCallback;
