import { ref } from 'vue'
import { useStore } from 'vuex';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import utilFun from './util';
import {
  openVideoWall,// 打开视频墙
  stopVideoWall,// 关闭视频墙
  startVideoPreview, // 开始预览
  stopVideoPreview // 关闭预览
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS'; // 链接uds发送方法
const { getDivPosition, returnNumberStr, returnNameStr } = utilFun();

export default function useVideoIndexFun($video: any) {
  const store = useStore();
  // 轮询时间
  const options = ref(['30秒', '1分钟', '3分钟', '5分钟', '7分钟', '9分钟']);
  // 所有的模式数组
  const allModes = ref([1, 4, 6, 8, 9]);
  // 所选择的模式
  const selectMode = ref(4);
  // 所选择的时间
  const timeValue = ref(0);
  // 当前定时器显示的视频数据
  const displayVideos = ref([]);
  // 右侧视频模块dom
  const videoIndexRef = ref<null>(null)
  /**
  * @desc 切换轮询时间
  * @param {} params
  * @returns {} returns
  */
  const changeTime = ($event: any) => {
    console.log(store.state.selectPollingTime)
    console.log(getDivPosition(videoIndexRef.value))
  }
  /**
  * @desc 根据不同的mode显示对应的模板
  * @param {} params
  * @returns {} returns
  */
  const changeModeEmitFun = (mode: number) => {
    selectMode.value = mode;
    store.commit("SET_POLLINGMODE", mode);
    if (store.state.selectedVideoArr?.length === 0) {
      return $message.error(`未选择监控分组，请先选择监控分组`);
    }
    startPolling(); //切换模式的时候重新启动轮询
  };
  /**
  * @desc 将所有要轮循的视频监控按照轮询模式拆分
  * @param {} params
  * @returns {} returns
  */
  const devertSrcArr = (arr: any, num: number) => {
    const result: any = [];
    for (var i = 0; i < arr.length; i += num) {
      result.push(arr.slice(i, i + num));
    }
    return result
  }
  /**
  * @desc 按数组长度以及所需index返回数组元素
  * @param {
  * arr：原数组
  * index: 第几个元素
  * }
  * @returns {} returns
  */
  function returnArrayItemByIndex(arr: any, index: number) {
    if (arr[index]) {
      return arr[index]
    } else {
      return {
        name: '暂无',
        code: 0
      }
    }
  }
  /**
  * @desc 改变显示视图
  * @param {} params
  * @returns {} returns
  */
  let pollingTimer: any = null;// 定时器
  const pollingButton = ref('暂无巡查'); // 巡查状态按钮
  const isPolling = ref(false); // 是否正在巡查
  function setTimeoutFun() {
    const pollingVideos = store.state.selectedVideoArr; // 所有要轮循的视频
    const selectPollingMode = store.state.selectPollingMode; // 当前的轮询模式
    const selectPollingTime = store.state.selectPollingTime; // 所选中的轮询时间
    console.log(selectPollingTime)
    let countNum = 0;
    let tempArr = devertSrcArr(pollingVideos, selectPollingMode)
    var allNum = tempArr.length;
    // 每隔时间段替换数组
    function changeShowVideoView() {
      if (pollingTimer) {
        window.clearInterval(pollingTimer)
      }
      if (countNum >= allNum) {//i超出数组长度，归零
        countNum = 0
      }
      let tempShowArr = tempArr[countNum];
      console.log(tempShowArr);
      // 如果开启了调用uds视频墙
      if ((window as any).config.isStartUdsVideoWall) {
        statUdsRolling(tempShowArr) // 调用uds视频预览
      } else {
        // 未开启则调用rtmp推流方式
        disposeVideo()
        displayVideos.value = tempShowArr;
      }
      countNum++;
      pollingTimer = setTimeout(changeShowVideoView, selectPollingTime);//每隔10秒调用方法
    }
    changeShowVideoView()
  }

  /**
  * @desc 启动轮询
  * @param {} params
  * @returns {} returns
  */
  const startPolling = () => {
    setTimeoutFun();
    isPolling.value = true
    pollingButton.value = '暂停巡查'
    saveVideoLogs()
  }
  /**
  * @desc 暂停定时器
  * @param {} params
  * @returns {} returns
  */
  function stopTimer() {
    window.clearInterval(pollingTimer);
    if (store.state.selectedVideoArr?.length === 0) {
      return $message.error(`未选择监控分组，请先选择监控分组`);
    }
    if (isPolling.value) {
      pollingButton.value = '开始巡查';
      isPolling.value = !isPolling.value
    } else {
      startPolling()
    }
  }
  /**
  * @desc 销毁播放器
  * @param {} params
  * @returns {} returns
  */
  function disposeVideo() {
    for (let i = 0; i < 9; i++) {
      document.getElementById(`myVideo${i}`) && $video(`myVideo${i}`).dispose();
    }
  }
  // 以下是调用调度台
  /**
  * @desc 初始化视频墙
  * @param {} params
  * @returns {} returns
  */
  async function initUdsVideoWall() {
    console.log('开始初始化视频墙');
    // 初始化的时候右侧显示空白
    return new Promise((resolve, reject) => {
      const option = {
        x: (window as any).config.videoOption.x,
        y: (window as any).config.videoOption.y,
        w: (window as any).config.videoOption.w,
        h: (window as any).config.videoOption.h,
        total: 6,
        number: ''
      }
      console.log(option)
      console.log('成功来自videoIndex')
      console.log('开始发送初始化视频墙命令')
      openVideoWall(option)
      resolve('初始化视频墙成功');
      console.log('初始化视频墙成功')
    })

  }
  /**
  * @desc 关闭视频墙
  * @param {} params
  * @returns {} returns
  */
  function closeUdsVideoWall() {
    stopVideoWall()
  }
  /**
  * @desc 轮询中开始预览
  * @param {
  * @arr 当前队列正在轮询的视频数组
  * }
  * @returns {} returns
  */
  function statUdsRolling(arr: any) {
    console.log('当前队列正在轮询的视频数组：')
    console.log(returnNumberStr(arr));
    if (arr.length === 0) {
      return new Error('暂无监控')
    }
    const numberStr = returnNumberStr(arr); // 当前轮询的监控号码拼接的字符串
    const nameStr = returnNameStr(arr); // 当前轮询的监控名称拼接的字符串
    const option = {
      index: -1,
      number: numberStr,
      total: store.state.selectPollingMode,
      isFlight: (store.state.isFlight ? 1 : 0),
      deviceName: nameStr
    }
    startVideoPreview(option)
  }

  /**
  * @desc 缓存播放记录
  * @param {} params
  * @returns {} returns
  */
  function saveVideoLogs() {
    const pollingVideos = store.state.selectedVideoArr; // 所有要轮循的视频
    const selectPollingMode = store.state.selectPollingMode; // 当前的轮询模式
    const selectPollingTime = store.state.selectPollingTime; // 所选中的轮询时间
    const selectGroupName = store.state.selectGroupName; // 所选中的组名
    const saveData: any = {
      pollingVideos, selectPollingMode, selectPollingTime, selectGroupName
    }
    localStorage.setItem('videoLogs', JSON.stringify(saveData));
  }
  /**
  * @desc 刷新页面或者重新进入自动读取缓存里的数据作为初始数据
  * @param {} params
  * @returns {} returns
  */
  function restartVideoFromStorage() {
    const storageData = JSON.parse((localStorage.getItem('videoLogs')) as any);
    if (storageData.pollingVideos && storageData.selectPollingMode && storageData.selectPollingTime) {
      store.commit('SET_VIDEOARR', storageData.pollingVideos);
      store.commit('SET_POLLINGMODE', storageData.selectPollingMode);
      store.commit('SET_POLLINGTIME', storageData.selectPollingTime);
      store.commit('SET_GROUPNAME', storageData.selectGroupName)
      startPolling()
    } else {

    }
  }
  return {
    allModes,
    options,
    timeValue,
    selectMode,
    displayVideos,// 当前循环内正在显示的视频数据
    pollingButton,
    changeModeEmitFun,
    devertSrcArr,
    startPolling,
    returnArrayItemByIndex,
    stopTimer,
    disposeVideo,
    changeTime,
    videoIndexRef,
    initUdsVideoWall, // 初始化视频墙
    closeUdsVideoWall, // 关闭视频墙
    restartVideoFromStorage, // 读取缓存数据设置新的轮询数据并开始轮询
  }
}

