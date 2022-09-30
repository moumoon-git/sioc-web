/**
 * @author oyq
 * @date 2020/9/9
 * @description 通过stomp.js连接ActiveMQ，使用topic模式
 * @version 2.7.1.1
 */
import ucsEvent from './ucsEvent.js'
import ucsApi from './ucsApi.js'
import getMessage from './getMessage'
import './stomp'

const mqConfig = {
  mqServer: '',
  mqClient: {},
  // 消息日志回调
  logHandle: function (msg) {},
  mqMyCode: '',
  mqDeCode: '',
  m_mqUser: '',
  m_mqPwd: '',
  reconnectInterval: 0,
  isLogin: false,
  isReconnect: false,
  store:''
}
/**
 * @description 连接MQ方法
 */
async function connect_server (listenMQServer, myCode, deCode, mqUser, mqPwd, logCallBack,store) {
  if (listenMQServer.startsWith('ws://') || listenMQServer.startsWith('wss://')) {
    mqConfig.mqServer = listenMQServer
  } else {
    mqConfig.mqServer = 'ws://' + listenMQServer
  }
  mqConfig.mqMyCode = myCode
  mqConfig.mqDeCode = deCode
  mqConfig.m_mqUser = mqUser
  mqConfig.m_mqPwd = mqPwd
  mqConfig.store = store
  const _logCallBack = function (msg) {
  }
  mqConfig.logHandle = logCallBack || _logCallBack
  mqConfig.mqClient = null
  mqConfig.mqClient = Stomp.client(mqConfig.mqServer)
  if (typeof (mqUser) === 'undefined' || mqUser.length === 0) {
    mqUser = 'admin'
    mqPwd = 'admin'
  }
  // 连接mq
  await mqConfig.mqClient.connect(mqUser, mqPwd, connect_callback, error_callback)
  mqConfig.reconnectInterval = setInterval(function () {
    console.log('mq reconnect ' + mqConfig.reconnectInterval)
    if (mqConfig.reconnectInterval > 0) {
      mqConfig.mqClient = Stomp.client(mqConfig.mqServer)
      mqConfig.mqClient.connect(mqUser, mqPwd, connect_callback, error_callback)
      mqConfig.isReconnect = true
    }
  }, 2000)

  return true
}

/**
 * @description 收到消息的回调方法
 * @param message 消息体
 */
function callbackMSG (message) {
  if (message.body) {
    // console.log('message1: ',message)
    onMessageArrived(message.body)
    //  console.log("got message with body: " + message.body)
  } else {
    console.log('got empty message')
  }
}
/**
 * @description mq连接成功回调
 * @param frame
 */
function connect_callback (frame) {
  // console.log(frame);
  mqConfig.mqClient.subscribe('/topic/' + mqConfig.mqDeCode, callbackMSG)
  clearInterval(mqConfig.reconnectInterval)
  mqConfig.reconnectInterval = 0
  if (!mqConfig.isLogin) {
    if (mqConfig.isReconnect) {
      ucsApi.ReconnectMQSuccess()
    } else {
      mqConfig.logHandle(0)
    }
  }
}

/**
 * @description mq连接失败回调，失败则定时重连
 * @param error
 */
function error_callback (error) {
  console.log('[mqErr]' + error)

  if (!mqConfig.mqClient.connected) {
    // mqClient.disconnect();
    mqConfig.mqClient = Stomp.client(mqConfig.mqServer)
    // 设置连接断开后每隔1s重新连接
    setTimeout(mqConfig.mqClient.connect(mqConfig.m_mqUser, mqConfig.m_mqPwd, connect_callback, error_callback), 1500)
  }
}

/**
 * @description 处理来自通讯服务的推送消息
 * @param msg 消息体
 */
async function onMessageArrived (msg) {
  // containerVue.textareaEvent = containerVue.textareaEvent+msg+'\n';
  // if('function'=== typeof logHandle && logHandle !== null) {
  //     logHandle(msg);
  // }
  // 将收到的消息转换成json格式
  let message
  try {
    message = JSON.parse(msg)
  } catch (e) {

  }
  if (typeof message !== 'object' || message == null) {
    console.log(msg)
    return
  }
  // SendMessageToECS(message)
  // console.log('message: ',message)
  if (message.cmd) {
    getMessage(message,mqConfig.store)
    if (message.cmd.SubCmd === '255' || message.cmd.SubCmd === 255) {
      switch (String(message.cmd.Tag)) {
        case '270': {
          if (message.dataBuf === 'HEARTBREAK') {
            ucsApi.HeartBreakAck(message)
          }
          break
        }
        case '274': {
          // 三方通话请求结果返回
          message.thirdNum = await ucsApi.ReverseNumber(message.thirdNum)
          ucsEvent.ThreeWayConfAck(message)
          break
        }
        case '272': {
          // 创建音视频会议结果
          ucsEvent.CreateConfExAck(message)
          break
        }
        case '277': {
          // 加入会议接口回调
          if (Number(message.numType) < 8) {
            message.phoneNumber = await ucsApi.ReverseNumber(message.phoneNumber)
          }
          ucsEvent.JoinConfEx2Ack(message)
          break
        }
        case '275': {
          // 会议成员状态返回
          if (Number(message.numType) < 8) {
            message.memberNum = await ucsApi.ReverseNumber(message.memberNum)
          }
          ucsEvent.ConfMemberStatus(message)
          break
        }
        case '264': {
          // 电话会议移出成员结果返回
          message.number = await ucsApi.ReverseNumber(message.number)
          ucsEvent.RemoveFromConfExAck(message)
          break
        }
        case '279': {
          // 设置会议成员禁言/发言 返回结果
          message.phoneNumber = await ucsApi.ReverseNumber(message.phoneNumber)
          ucsEvent.OperateConfMemberExAck(message)
          break
        }
        case '281': {
          // 设置视频会议、视频电话通话视频窗口结果返回
          ucsEvent.SetVideoWindowAck(message)
          break
        }
        case '283': {
          // 广播/取消广播调用接口结果返回
          ucsEvent.ConfBoardCastMemberAck(message)
          break
        }
        case '285': {
          // 选看视频会议成员画面结果
          ucsEvent.ConfWatchMemberAck(message)
          break
        }
        case '287': {
          // 查询资源分组结果返回
          ucsEvent.ICPQueryGroupInfoAck(message)
          break
        }
        case '289': {
          // 查询设备信息结果返回
          ucsEvent.ICPQueryDeviceInfoAck(message)
          break
        }
        case '291': {
          // 预览摄像头视频结果返回
          ucsEvent.ICPStartRealPlayAck(message)
          break
        }
        case '293': {
          // 停止播放视频结果
          ucsEvent.ICPStopRealPlayAck(message)
          break
        }
        case '297': {
          // 云台控制结果返回
          ucsEvent.ICPPTZDeviceAck(message)
          break
        }
        case '295': {
          // 监控入会结果返回
          ucsEvent.ConfAddDeviceAck(message)
          break
        }
        case '299': {
          // 应答结果返回
          ucsEvent.AnswerCallAck(message)
          break
        }
        case '301': {
          // 订阅无线集群群组结果
          ucsEvent.TalkingGroupSubcribeAck(message)
          break
        }
        case '303': {
          // 监听无线集群群组结果返回
          ucsEvent.TalkingGroupMonitorAck(message)
          break
        }
        case '305': {
          // 选中/监听无线集群群组切换结果
          ucsEvent.TalkingGroupSelectAck(message)
          break
        }
        case '307': {
          // 无线集群群组抢权/放权操作结果
          ucsEvent.TalkingGroupPTTAck(message)
          break
        }
        case '309': {
          // 发起混编/临时混编呼叫结果返回
          ucsEvent.MixedGroupCallAck(message)
          break
        }
        case '310': {
          // 邀请坐席加入会议通知
          ucsEvent.ConfInviteNotify(message)
          break
        }
        case '312': {
          // 坐席接受/拒绝加入会议邀请操作结果返回
          ucsEvent.ConfAcceptInviteAck(message)
          break
        }
        case '313': {
          // 通话过程中，自动语音识别结果返回
          if (message.speekerNum.length >= 8) {
            message.speekerNum = await ucsApi.ReverseNumber(message.speekerNum)
          }
          ucsEvent.AsrTxtNotify(message)
          break
        }
        case '315': {
          // 代接正在振铃的坐席的来电结果返回
          ucsEvent.SnatchPickupAck(message)
          break
        }
        case '317': {
          // 视频会议启动/停止辅流结果通知
          ucsEvent.ConfStartDataAck(message)
          break
        }
        case '319': {
          // 设置一个与会者成员选看另一个与会者成员/锁定视频源结果通知
          ucsEvent.ConfSetVideoSourceAck(message)
          break
        }
        case '321': {
          // 黑名单管理结果返回
          ucsEvent.OperateBlackListAck(message)
          break
        }
        case '323': {
          // 坐席二次拨号结果返回
          ucsEvent.AgentSendDtmfAck(message)
          break
        }
        case '325': {
          // 加入会议接口回调返回
          if (Number(message.numType) < 8) {
            message.phoneNumber = await ucsApi.ReverseNumber(message.phoneNumber)
          }
          ucsEvent.JoinConfEx3Ack(message)
          break
        }
        case '327': {
          // 坐席重新加入会议结果返回
          ucsEvent.AgentAccessConfAck(message)
          break
        }
        case '330': {
          // 终端状态信息返回
          ucsEvent.NotifyUserInfo(message)
          break
        }
        case '340': {
          // 传真合并结果
          ucsEvent.FaxMergeAck(message)
          break
        }
        case '342': {
          // 传真拆分结果
          ucsEvent.FaxSplitAck(message)
          break
        }
        case '344': {
          // 传真扫描
          ucsEvent.FaxScanAck(message)
          break
        }
        case '345':
        {
          // 移动终端GIS上报事件
          ucsEvent.GisNotify(message)
          break
        }
        default:
          break
      }
    } else {
      switch (String(message.cmd.SubCmd)) {
        case '2': {
          mqConfig.isLogin = true
          ucsApi.OnAgentLoginAck(message)
          ucsEvent.AgentLoginAck(message)
          break
        }
        case '6': {
          ucsEvent.MakeCallAck(message)
          break
        }
        case '17': {
          ucsEvent.HeldCallAck(message)
          break
        }
        case '18': {
          ucsEvent.AlternateCallAck(message)
          break
        }
        case '19': {
          ucsEvent.TransferCallAck(message)
          break
        }
        case '25': {
          ucsEvent.CreateConfAck(message)
          break
        }
        case '31': {
          ucsEvent.DeleteConfAck(message)
          break
        }
        case '27': {
          ucsEvent.JoinConfAck(message)
          break
        }
        case '35': {
          ucsEvent.ConfMemberDetail(message)
          break
        }
        case '3': {
          ucsEvent.PortStatusChanged(message)
          break
        }
        case '15': {
          message.calling = await ucsApi.ReverseNumber(message.calling)
          ucsEvent.UpdateCallingNumber(message)
          break
        }
        case '13': {
          message.calling = await ucsApi.ReverseNumber(message.calling)
          message.called = await ucsApi.ReverseNumber(message.called)
          ucsEvent.BroadcastCallOffered(message)
          break
        }
        case '122': {
          ucsEvent.FaxSent(message)
          break
        }
        case '120': {
          ucsEvent.FaxReceived(message)
          break
        }
        case '41': {
          ucsEvent.OperateConfMemberAck(message)
          break
        }
        case '43': {
          message.mobile_to = await ucsApi.ReverseNumber(message.mobile_to)
          ucsEvent.TransferCallOneKeyAck(message)
          break
        }
        case '229': {
          if (message.call_type === 0 && message.calling.length > 11) {
            message.calling = await ucsApi.ReverseNumber(message.calling)
          } else (message.called.length > 11)
          {
            message.called = await ucsApi.ReverseNumber(message.called)
          }
          ucsEvent.InsertPhoneCdr(message)
          break
        } case '33':
        {
          ucsEvent.ConfDetail(message)
          break
        }
        default:
          break
      }
    }
  }
}

// 连接中断(暂未启用)
// function onConnectionLost(responseObject) {
//   if (responseObject.errorCode !== 0) {
//     // mqClient.clientId 可以获取到ClientID
//     console.log(mqClient.clientId + ": " + responseObject.errorCode);
//   }
// }

/**
 * 主动断开连接
 * @returns {boolean}
 */
function dis_connect () {
  mqConfig.isLogin = false
  mqConfig.isReconnect = false
  mqConfig.mqClient.disconnect()
  console.log('MQ disconnected...')
  return true
}
export default {
  connect_server,
  dis_connect
}
