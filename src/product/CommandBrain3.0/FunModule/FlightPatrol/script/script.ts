import { useStore } from 'vuex';
import { getCurrentInstance, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import {
  addCallback,
  removeCallback,
  monitorPreview,
  cancelMonitorPreview,
  heartbeat,
  uds,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';

function init() {
  // 使用vuex
  const store = useStore();
  const instance = getCurrentInstance();
  const { $http, $message }: any =
    instance?.appContext.config.globalProperties;
  // 防止重复弹窗开关
  const msgFlag = ref<boolean>(true);
  const startflag = ref<boolean>(true);
  const endflag = ref<boolean>(true);
  // 点击弹窗的摄像头对象
  const cameraDetail = ref<any>({});
  const flightLinkageCameraView = ref<HTMLElement | null | any>(null);
  // uds登录状态查看
  const udsLoginState = ref<boolean | any>(false);
  // 飞巡任务id
  const flightPatrolTaskId = ref<number>(0);
  /*
   * 启动巡查状态弹窗
   */
  function startStatePopup(type: string, msg: string) {
    if (msgFlag.value) {
      if (type === 'info') {
        $message.info(msg);
      } else {
        $message.error(msg);
      }
      msgFlag.value = false;
      setTimeout(() => {
        msgFlag.value = true;
      }, 1000);
    }
  }
  // 处理消息
  function handMsg(code:number,obj: any) {
    console.log(obj);
    if (obj.cmd.SubCmd === '375') {
      if (obj.result === 1) {
        startStatePopup('info', '启动巡查成功');
        // 改变启动状态
        const dispatchDeskData = JSON.parse(
          JSON.stringify(store.state.flightPatrol.dispatchDeskData),
        );
        store.commit('flightPatrol/SET_StartingData', dispatchDeskData);
        store.commit('flightPatrol/SET_dispatchDeskState', true);
        store.commit('flightPatrol/SET_startTime', obj.startTime);
        if (startflag.value) {
          saveFlightRecord();
          startflag.value = false;
          setTimeout(() => {
            startflag.value = true;
          }, 1000);
        }
        // 启动飞巡时的数据
        const stateData = JSON.parse(
          JSON.stringify(store.state.flightPatrol.flghtPatrolSourceData),
        );
        let ImgInfo = {
          width: 34, // 48
          height: 45, //62
          img: require('@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightRecord/FlightRecordDetail/assets/marker.png'),
          // img: require('@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightInspection/assets/polling.png'),
        };
        (window as any).map.drawConverge(
          'flightPatrolLinkage',
          stateData,
          ImgInfo,
          {
            click: (e: any) => {
              console.log(e);
              if (e) {
                cameraDetail.value = e;
                flightLinkageCameraView.value.cameraTitle = '监控详情';
                flightLinkageCameraView.value.initMap(
                  cameraDetail.value.lon || cameraDetail.value.longitude,
                  cameraDetail.value.lat || cameraDetail.value.latitude,
                );
              }
            },
          },
        );
      } else {
        startStatePopup('error', obj.message);
      }
    } else if (obj.cmd.SubCmd === '376') {
      if (obj.result === 1) {
        startStatePopup('info', '停止巡查成功');
        // 改变启动状态
        store.commit('flightPatrol/SET_dispatchDeskState', false);
        if (endflag.value) {
          saveFlightEndRecord(obj.stopTime);
          endflag.value = false;
          setTimeout(() => {
            endflag.value = true;
          }, 1000);
        }
        // 停止巡查时清空所有点
        (window as any).map.clearDrawConvergeData('flightPatrolLinkage');
      } else {
        startStatePopup('error', obj.message);
      }
    } else if (obj.cmd.SubCmd === '377') {
      const { num } = obj;
      const stateData = JSON.parse(
        JSON.stringify(store.state.flightPatrol.backupsData),
      );
      // console.log(stateData);
      const handleArr: any = stateData.reduce((pre: any, ele: any) => {
        ele.devices.filter((y: any) => {
          if (y.number === num) {
            pre = y;
          }
        });
        return pre;
      }, {});
      // 启动巡查单个返回数据
      if (obj.status === 1) {
        // 巡查联动在地图上落点
        let ImgInfo = {
          width: 48,
          height: 62,
          img: require('@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightInspection/assets/polling.png'),
        };
        (window as any).map.modifyStyle(
          'flightPatrolLinkage',
          'deviceId',
          handleArr.deviceId,
          ImgInfo,
        );
      } else if (obj.status === 0) {
        let ImgInfo = {
          width: 34,
          height: 45,
          img: require('@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightRecord/FlightRecordDetail/assets/marker.png'),
        };
        (window as any).map.modifyStyle(
          'flightPatrolLinkage',
          'deviceId',
          handleArr.deviceId,
          ImgInfo,
        );
      } else {
        startStatePopup('error', obj.message);
      }
    } else if (obj.cmd.SubCmd === '291') {
      if (obj.result === 1) {
        startStatePopup('info', '启动预览成功');
        if (obj.codeNum) {
          store.commit('flightPatrol/SET_visPreview', obj.codeNum);
        }
      } else {
        startStatePopup('error', obj.message);
      }
    } else if (obj.cmd.SubCmd === '293') {
      if (obj.result === 1) {
        startStatePopup('info', '取消预览成功');
        if (obj.codeNum) {
          store.commit(
            'flightPatrol/SET_cancelFlightPatrolPreviewFun',
            obj.codeNum,
          );
        }
      } else {
        store.commit(
          'flightPatrol/SET_cancelFlightPatrolPreviewFun',
          obj.codeNum,
        );
        startStatePopup('error', obj.message);
      }
    }
  }
  /*
   * 连接MQ
   */
  function connectMq() {
    addCallback(handMsg)
  }
  // json对象转数组
  function jsonToArr(jsonStr: any) {
    const jsonObj = JSON.parse(jsonStr);
    const jsonStr1 = JSON.stringify(jsonObj);
    const jsonArr = [];
    for (let i = 0; i < jsonObj.length; i++) {
      jsonArr[i] = jsonObj[i];
    }
    return jsonArr;
  }
  // 时间转化
  function timestampToTime(timestamp: any) {
    const date = new Date(timestamp);
    const Y: any = `${date.getFullYear()}-`;
    const M: any = `${date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1
      }-`;
    const D: any = `${date.getDate()} `;
    const h: any = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      }:`;
    const m: any = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }:`;
    const s: any =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return Y + M + D + h + m + s;
  }
  // 保存启动时飞巡记录
  function saveFlightRecord() {
    let tempSaveData: any = '';
    if (sessionStorage.getItem('tempListData')) {
      tempSaveData = jsonToArr(sessionStorage.getItem('tempListData'));
      tempSaveData = JSON.parse(JSON.stringify(tempSaveData));
      tempSaveData.forEach((element: any) => {
        if (element.devices) {
          element.devices.forEach((x: any) => {
            x.deviceId = x.id;
            x.deviceName = x.deviceName || x.name;
          });
        }
      });
      console.log(tempSaveData);
    }
    const tempObj: any = {};
    tempObj.beginTime = timestampToTime(Date.now());
    // 获取飞巡记录的名字和类型
    const recordObj = JSON.parse(
      JSON.stringify(store.state.flightPatrol.flightPatrolRecord),
    );
    tempObj.name = recordObj.name;
    tempObj.type = recordObj.type;
    if (tempObj.type === 0) {
      tempObj.drawLogs = tempSaveData;
      tempObj.endTime = timestampToTime(Date.now());
    } else {
      tempObj.groupLogs = [...store.state.flightPatrol.backupsData];
    }
    const request = {
      method: 'post',
      service: 'flight',
      url: '/device/appbrowselog/save',
      headers: {
        'Content-Type': 'application/json',
      },
      data: tempObj,
    };
    $http(request).then((response: any) => {
      console.log(response.data);
      flightPatrolTaskId.value = response.data.id;
    });
  }
  // 保存结束时飞巡记录
  function saveFlightEndRecord(stopTime: string) {
    const request = {
      method: 'post',
      service: 'flight',
      url: '/device/appbrowselog/setEndTime',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        id: flightPatrolTaskId.value, // 任务id
        endTime: stopTime, // 结束时间
      },
    };
    $http(request).then((response: any) => {
      console.log(response);
    });
  }
  // 监控预览
  function flightPatrolPreview(data: any) {
    if (!uds.client) {
      $message.error('连接通讯服务器失败，请重新打开');
      uds.waken()
      return
    }
    heartbeat();
    let loginState:boolean = false;
    const cb = (code:number)=>{
      if(code === 5){
        loginState = true;
        monitorPreview(data);
      }
    }
    addCallback(cb);
    setTimeout(()=>{
      if(loginState) {
        removeCallback(cb)
      }else{
        uds.waken()
      }
    },200)
  }
  // 取消监控预览
  function cancelFlightPatrolPreview(codeNum: string | number) {
    if (!uds.client) {
      $message.error('连接通讯服务器失败，请重新打开');
      uds.waken()
      return
    }
    cancelMonitorPreview(codeNum);
  }

  // 发起巡查
  watch(() => store.state.flightPatrol.dispatchDeskData, () => {

  })
  // 发起预览
  watch(() => store.state.flightPatrol.flightPatrolPreview, (newVal: any) => {
    // 调试视频预览
    console.log(newVal);
    if (newVal.length !== 0) {
      flightPatrolPreview(newVal);
    }
  })
  // 取消预览
  watch(() => store.state.flightPatrol.cancelFlightPatrolPreview, (newVal: any) => {
    // 调试视频预览
    console.log(newVal, newVal[0].codeNum);
    cancelFlightPatrolPreview(newVal[0].codeNum);
  })

  return {
    connectMq,
    saveFlightRecord,
    saveFlightEndRecord,
    timestampToTime,
    startStatePopup,
    flightPatrolPreview,
    cancelFlightPatrolPreview,
    handMsg,
    cameraDetail,
    flightLinkageCameraView,
  };
}

export default init
