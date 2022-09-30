/**
 * @author xrw
 * @date 2019/9/23
 * @description 调用融合通讯服务api
 */
import axios from 'axios'
import FCC from 'fcc-core'
import mqEvent from './ucsEvent.js'

const PortStatusIdle = 0
const PortStatusPickup = 1
const PortStatusOffered = 2
const PortStatusCallout = 3
const PortStatusAlerting = 4
const PortStatusAnswered = 5

const xwSDK = function () {
  this.xwFcc = new FCC({
    // 写入一些配置，此处可以配置将使用融合通讯中台的哪些服务，例如话务接报、音视频会议等
    meeting: true, // 是否开启音视频会议接口及事件，默认为true，即开启
    phone: true, // 是否开启电话接口及事件，默认为true，即开启
    IM: false, // 是否开启IM消息接口及事件，默认为true，即开启
    monitor: true, // 是否开启监控接口及事件，默认为true，即开启
    pointToPointCall: true  // 是否开启点对点呼叫接口及事件，默认为true，即开启
  })
  this.sysConfig = {
    xwServerUrl: '', // 星网sdk服务地址
    ucsServerUrl: '', // ucs服务地址
    agentId: 0, // 登录的坐席id
    agentNum: '', // 坐席号码
    agentTag: ''// 坐席工号标识
  }

  // sdk连接状态
  this.connectStatus
  // 日志回调函数
  this.logCallBack
  // 通话信息
  this.baseInfo = {
    callDirt: 0,
    numType: 0,
    calling: '',
    called: '',
    callTag: 0,
    callId: '',
    startTime: '',
    connectTime: '',
    endTime: '',
    recordFile: ''
  }
  this.callInfo = this.baseInfo
  this.confInfo = {}
}
/**
 *description 初始化SDK，从ucs后台获取坐席连接的mq信息，
 * 强退可能已被人登录的agent，
 * 然后启动坐席agent，之后连接mq接收消息，最后发起坐席心跳检测，判断坐席连接mq状态
 *@param ucsServer ucs服务地址
 * @param listenMQServer 坐席连接的mq地址
 * @param userCode 第三方前端订阅的mq消息topic名称
 * @param agentCode 第三方指定坐席在mq订阅的topic
 *@author Ouyuqian
 *@date 2019/12/10
 */
xwSDK.prototype.InitSDK = async function (ucsServer, xwServer, logHandle) {
  this.sysConfig.xwServerUrl = xwServer
  this.sysConfig.ucsServerUrl = ucsServer
  const callBack = function (msg) {
  }
  this.logCallBack = logHandle || callBack

  this.connectStatus = await this.xwFcc.connect({
    path: '/xw'
  })

  console.log(this.connectStatus.status, this.connectStatus.msg, this.connectStatus.parameterErrors)

  // this.logCallBack();
  return this.connectStatus.status === 200 ? 0 : this.connectStatus.status
}

/**
 *description 关闭SDK，释放资源
 *@author Ouyuqian
 *@date 2019/12/12
 */
xwSDK.prototype.UnInitialize = function () {
  const outRet = this.xwFcc.logout()
  console.dir(outRet)
  return outRet.status === 200 ? 0 : outRet.status
}

/**
 * 发送ICP登录配置
 * @agent_id 坐席id
 * @constructor
 */
xwSDK.prototype.SendCtiConfig = function () {
  return -1
}

/**
 * 上层用户向cti服务注册
 * @param user 用户名
 * @param passwd 密码
 * @param license 保留字段
 * @param agent_id1 用户所拥有的1号坐席id
 * @param agent_id2 用户所拥有的2号坐席id
 * @param token 苏州星网平台竹云token
 * @param usreId 苏州星网平台userid
 * @param opeatorId 用户表cti_operator中id
 * @author ouyuqian
 */

xwSDK.prototype.AgentLogin = async function (user, passwd, license, agent_id1, agent_id2, token, userId, operatorId) {
// return ;
  setTimeout(async () => {
    const data = {
      type: 'SZXW',
      // 'type': 'YouShiKang',
      id: agent_id1
    }
    const agent = await axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/phone/agent', data)
    console.dir(agent)
    if (agent.data.errorcode == 0) {
      console.log('获取agent账号成功')
      const loginResult = await this.xwFcc.login({
        userAccount: agent.data.data[0].name,
        password: agent.data.data[0].passwd,
        token: token,
        userId: userId
      })
      console.log(loginResult)

      // 上下线通知事件
      let listenResult = await this.xwFcc.listen('OnOffLineNotice', params => {
        console.log('OnOffLineNotice', params)
      })
      console.log('OnOffLineNotice', listenResult)
      // 连接异常或中断事件
      listenResult = await this.xwFcc.listen('OnDropped', params => {
        console.log('OnDropped', params)
      })
      console.log('OnDropped', listenResult)
      // 自动重连成功事件
      listenResult = await this.xwFcc.listen('OnReconnect', params => {
        console.log('OnReconnect', params)
      })
      console.log('OnReconnect', listenResult)
      // 人员状态变更事件
      listenResult = await this.xwFcc.listen('OnMemberStatusChange', params => {
      // console.log('OnMemberStatusChange', params);
      })
      console.log('OnMemberStatusChange', listenResult)

      // 语音点呼来电事件
      listenResult = await this.xwFcc.listen('OnDialVoiceRequest', params => {
        console.log('OnDialVoiceRequest', params)
        this.callInfo.callDirt = 0
        this.callInfo.numType = 1
        this.callInfo.callTag = this.GetTag()
        this.callInfo.calling = params.caller
        this.callInfo.called = this.sysConfig.agentNum
        this.callInfo.callId = params.callId
        this.callInfo.startTime = this.getTime()
        this.SendPortStatus(PortStatusOffered)
        this.SendUpdateCallingNum(this.callInfo.callTag, params.caller)
      })
      console.log('OnDialVoiceRequest', listenResult)

      // 语音点呼挂机事件
      listenResult = await this.xwFcc.listen('OnDialVoiceDropped', params => {
        console.log('OnDialVoiceDropped', params)
        this.SendPortStatus(PortStatusIdle)
        this.SendBroadcastCalloffered(this.callInfo.callTag, this.callInfo.calling, this.callInfo.called, 0)
        mqEvent.InsertPhoneCdr({
          call_type: this.callInfo.callDirt,
          call_prop: 0,
          calling: this.callInfo.calling,
          called: this.callInfo.called,
          analog_channel: this.callInfo.called,
          agent_channel: this.sysConfig.agentId,
          agent_id: this.sysConfig.agentId,
          operator_id: 0,
          start_time: this.callInfo.startTime,
          connected_time: this.callInfo.connectTime,
          end_time: this.getTime(),
          duration: 0,
          recordfile: this.callInfo.recordFile,
          system_type: 0,
          app_param_1: ''
        })
        mqEvent.CallReleased(this.sysConfig.agentId, this.callInfo.callTag, 0)
        this.callInfo = this.baseInfo
      })
      console.log('OnDialVoiceDropped', listenResult)
      // 视频点呼来电事件
      listenResult = await this.xwFcc.listen('OnDialVideoRequest', params => {
        console.log('OnDiavVideoRequest', params)
        this.callInfo.callDirt = 0
        this.callInfo.numType = 8
        this.callInfo.callTag = this.GetTag()
        this.callInfo.calling = params.caller
        this.callInfo.called = this.sysConfig.agentNum
        this.callInfo.callId = params.callId
        this.callInfo.startTime = this.getTime()
        this.SendPortStatus(PortStatusOffered)
        this.SendUpdateCallingNum(this.callInfo.callTag, params.caller)
      })
      console.log('OnDiavVideoRequest', listenResult)
      // 视频点呼挂机事件
      listenResult = await this.xwFcc.listen('OnDialVideoDropped', params => {
        console.log('OnDialVideoDropped', params)
        if (this.callInfo.callTag > 0) {
          this.SendPortStatus(PortStatusIdle)
          this.SendBroadcastCalloffered(this.callInfo.callTag, this.callInfo.calling, this.callInfo.called, 0)
          mqEvent.InsertPhoneCdr({
            call_type: this.callInfo.callDirt,
            call_prop: 0,
            calling: this.callInfo.calling,
            called: this.callInfo.called,
            analog_channel: this.callInfo.called,
            agent_channel: this.sysConfig.agentId,
            agent_id: this.sysConfig.agentId,
            operator_id: 0,
            start_time: this.callInfo.startTime,
            connected_time: this.callInfo.connectTime,
            end_time: this.getTime(),
            duration: 0,
            recordfile: this.callInfo.recordFile,
            system_type: 0,
            app_param_1: ''
          })
          this.callInfo = this.baseInfo
        } else if (this.confInfo.meetingId || this.callInfo.MEETING_ID) {
          mqEvent.DeleteConfAck({
            conf_id: this.confInfo.meetingId || this.confInfo.MEETING_ID,
            status: 0
          })
          this.confInfo = {}
        }
      })
      console.log('OnDialVideoDropped', listenResult)
      if (this.xwFcc.phone) {
      // 电话呼出接通成功事件
        listenResult = await this.xwFcc.listen('OnAnswerSuccess', params => {
          console.log('OnAnswerSuccess', params)
          this.SendPortStatus(PortStatusAnswered)
          this.SendBroadcastCalloffered(
            this.callInfo.callTag,
            this.callInfo.calling,
            this.callInfo.called,
            this.callInfo.callDirt === 0 ? 3 : 2 // 0,消失，1保持中，2呼出通话中，3呼入通话中,4正在外呼中
          )
        })

        console.log('OnAnswerSuccess', listenResult)
        // 电话来电事件
        listenResult = await this.xwFcc.listen('OnAnswerRequest', params => {
          console.log('OnAnswerRequest', params)
          this.callInfo.callDirt = 0
          this.callInfo.numType = 8
          this.callInfo.callTag = this.GetTag()
          this.callInfo.calling = params.caller
          this.callInfo.called = this.sysConfig.agentNum
          this.callInfo.callId = params.callId
          this.SendPortStatus(PortStatusOffered)
          this.SendUpdateCallingNum(this.callInfo.callTag, params.caller)
        })
        console.log('OnAnswerRequest', listenResult)
        // 电话挂机事件
        listenResult = await this.xwFcc.listen('OnReleaseSuccess', params => {
          console.log('OnReleaseSuccess', params)
          this.SendPortStatus(PortStatusIdle)
          this.SendBroadcastCalloffered(this.callInfo.callTag, this.callInfo.calling, this.callInfo.called, 0)
          mqEvent.InsertPhoneCdr({
            call_type: this.callInfo.callDirt,
            call_prop: 0,
            calling: this.callInfo.calling,
            called: this.callInfo.called,
            analog_channel: this.callInfo.called,
            agent_channel: this.sysConfig.agentId,
            agent_id: this.sysConfig.agentId,
            operator_id: 0,
            start_time: this.callInfo.startTime,
            connected_time: this.callInfo.connectTime,
            end_time: this.getTime(),
            duration: 0,
            recordfile: this.callInfo.recordFile,
            system_type: 0,
            app_param_1: ''
          })
          mqEvent.CallReleased(this.sysConfig.agentId, this.callInfo.callTag, 0)
          this.callInfo = this.baseInfo
        })
        console.log('OnReleaseSuccess', listenResult)
        // 电话久未应答事件
        listenResult = await this.xwFcc.listen('OnLongNoAnswer', params => {
          console.log('OnLongNoAnswer', params)
        })
        console.log('OnLongNoAnswer', listenResult)
      }
      // 音视频会议结束事件
      listenResult = await this.xwFcc.listen('OnMeetingOver', params => {
        console.log('OnMeetingOver', params)
        mqEvent.DeleteConfAck({
          conf_id: this.confInfo.meetingId || this.confInfo.MEETING_ID,
          status: 0
        })
        this.confInfo = {}
      })
      console.log('OnMeetingOver', listenResult)
      if (this.xwFcc.monitor) {
      // 关闭监控事件
        listenResult = await this.xwFcc.listen('OnCloseMonitor', params => {
          mqEvent.ICPStopRealPlayAck({
            agent_id: this.sysConfig.agentId,
            result: 0
          })
          console.log('OnCloseMonitor', params)
        })

        console.log('OnCloseMonitor', listenResult)

        // 退出矩阵监控事件
        listenResult = await this.xwFcc.listen('OnExitMatrix', params => {
          console.log('OnExitMatrix', params)
        })
        console.log('OnExitMatrix', listenResult)
      }
      this.sysConfig.agentId = agent_id1
      this.sysConfig.agentNum = agent.data.data[0].extension
      this.sysConfig.agentTag = agent.data.data[0].name
      mqEvent.AgentLoginAck({
        status: loginResult.status === 200 ? 0 : loginResult.status
      })
    /* test code */
    // mqEvent.AgentLoginAck({status:0});
    /* test code */
    } else {
      console.log('获取agent账号失败！')
      return -1
    }
  }, 3000)
  return 0
}

/**
 * 坐席改变状态
 * @param agent_id 坐席id
 * @param status 改变到的状态 0:离线；1：上线
 * @param transferNum 离线时来电转移到的号码（夜服号码）
 * @constructor
 */
xwSDK.prototype.AgentChangeStatus = function (agent_id, status, transferNum) {
  return -1
}

/**
 * 退出EMTAgent
 * @constructor
 */
xwSDK.prototype.CloseEMTAgent = function () {
  return -1
}
/**
 * 获取随机标识
 */
xwSDK.prototype.GetTag = function () {
  const now = new Date()
  const starTime = new Date('2020-2-26')
  return now - starTime
}
/**
 * 发起呼叫
 * @remake 发起一次呼叫，需先拿起坐席话机
 * @param agent_id 坐席id
 * @param called 外呼号码
 * @param iddcode 坐席号码
 * @constructor
 */
xwSDK.prototype.MakeCall = async function (agent_id, called, iddcode, assignObj) {
  return await this.MakeCallEx(agent_id, called, iddcode, '', 1)
}

/**
 * 发起呼叫--扩展接口。
 * @remake 提供一个自定义参数，最终在历史记录中传入。增加号码类型，区分普通电话和视频电话等类型
 * @param agent_id 需要外呼的坐席id
 * @param number 外呼号码
 * @param iddcode 坐席的号码
 * @param param_1 呼叫外带自定义参数，会在历史记录中传入，可选
 * @param numType 号码类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频电话
 * @constructor
 */
xwSDK.prototype.MakeCallEx = async function (agent_id, number, iddcode, param_1, numType) {
  // if( this.connectStatus.status === 200)
  // {
  // number='M04';
  let transNum = number
  let dialRet
  if (Number(numType) === 1 && number.length >= 8) {
    const doRet = await axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/phone/validateNumber?number=' + number + '&agentId=' + this.sysConfig.agentNum)
    transNum = doRet.status === 200 ? doRet.data.data : number
    dialRet = await this.xwFcc.callout({
      phoneNum: transNum
    })
  } else if (Number(numType) >= 1 && numType < 8) {
    dialRet = await this.xwFcc.dialVoice({
      userAccount: number
    })
  } else if (Number(numType) === 8) {
    dialRet = await this.xwFcc.dialVideo({
      userAccount: number
    })
  }
  console.dir(dialRet)

  if (dialRet.status === 200) {
    const callTag = this.GetTag()

    this.callInfo.callDirt = 1
    this.callInfo.callTag = callTag
    this.callInfo.numType = Number(numType)
    this.callInfo.calling = this.sysConfig.agentNum
    this.callInfo.called = number
    this.callInfo.startTime = this.getTime()
    this.callInfo.connectTime = this.getTime()
    mqEvent.MakeCallAck({
      agent_id: agent_id,
      new_conn: callTag,
      status: dialRet.status === 200 ? 0 : dialRet.status,
      cause: ''
    })
    this.SendPortStatus(PortStatusCallout)
    this.SendBroadcastCalloffered(callTag, this.sysConfig.agentNum, number, 4)

    setTimeout(() => {
      this.SendPortStatus(PortStatusAnswered)
      this.SendBroadcastCalloffered(callTag, this.sysConfig.agentNum, number, 2)
    }, 2000)
    return 0
  } else {
    mqEvent.MakeCallAck({
      agent_id: agent_id,
      new_conn: 0,
      status: -1,
      cause: ''
    })
    return -1
  }
}

/**
 * 挂断电话
 * @param agent_id 请求的坐席id
 * @param conn 需挂掉的通道编号
 * @param key 通话队列需要移出的key值(非必填)
 * @constructor
 */
xwSDK.prototype.DropCall = async function (agent_id, conn, key) {
  let dropRet
  if (this.callInfo.numType === 1 && this.callInfo.called.length < 8) {
    dropRet = await this.xwFcc.dialVoiceHangUp()
  } else if (this.callInfo.numType === 8) {
    dropRet = await this.xwFcc.dialVideoHangUp()
  } else {
    dropRet = await this.xwFcc.release()
  }
  console.dir(dropRet)
  if (dropRet.status === 200) {
    this.SendPortStatus(PortStatusIdle)
    mqEvent.BroadcastCallOffered({
      conn: conn,
      calling: this.callInfo.calling,
      called: this.callInfo.called,
      status: 0 // 0,消失，1保持中，2呼出通话中，3呼入通话中,4正在外呼中
    })
    mqEvent.InsertPhoneCdr({
      call_type: this.callInfo.callDirt,
      call_prop: 0,
      calling: this.callInfo.calling,
      called: this.callInfo.called,
      analog_channel: this.callInfo.called,
      agent_channel: this.sysConfig.agentId,
      agent_id: this.sysConfig.agentId,
      operator_id: 0,
      start_time: this.callInfo.startTime,
      connected_time: this.callInfo.connectTime,
      end_time: this.getTime(),
      duration: 0,
      recordfile: this.callInfo.recordFile,
      system_type: 0,
      app_param_1: ''
    })
    mqEvent.CallReleased(agent_id, conn, 0)
  } else { return -1 }
  return 0
}

/**
 * 来电保持
 * @param agent_id 需要外呼的坐席id
 * @param conn 需挂掉（保持）的通道编号
 * @constructor
 */
xwSDK.prototype.HeldCall = async function (agent_id, conn) {
  const doRet = await this.xwFcc.hold({
    ishold: true
  })
  console.log(doRet)
  if (doRet.status === 200) {
    mqEvent.HeldCallAck({
      agent_id,
      conn,
      status: 0,
      cdr_id: 0
    })
    this.SendPortStatus(PortStatusPickup)
    this.SendBroadcastCalloffered(conn, this.callInfo.calling, this.callInfo.called, 1)
  } else {
    mqEvent.HeldCallAck({
      agent_id,
      conn,
      status: -1,
      cdr_id: 0
    })
  }
  // return -1;
}

/**
 * 恢复来电
 * @remake 接通在等待状态的一路通话，坐席操作员拿起话机，选择等待区中的一路通话进行恢复；
 * @param agent_id 想接通来电的坐席id
 * @param conn_a 坐席通道编号（传agent_id即可）
 * @param conn_b 外线通道编号
 * @constructor
 */
xwSDK.prototype.AlternateCall = async function (agent_id, conn_a, conn_b) {
  const doRet = await this.xwFcc.hold({
    ishold: false
  })
  console.log(doRet)
  if (doRet.status === 200) {
    mqEvent.AlternateCallAck({
      agent_id,
      conn_a,
      conn_b,
      status: 0
    })
    this.SendPortStatus(PortStatusPickup)
    this.SendBroadcastCalloffered(conn, this.callInfo.calling, this.callInfo.called, 1)
  } else {
    mqEvent.AlternateCallAck({
      agent_id,
      conn_a,
      conn_b,
      status: -1
    })
  }
}

/**
 * 转接线路
 * @remake 把本次通话转接给其他话路；首先【保持】本次通话，接着呼通要转接的话路，选择【转接】功能即可把两个话路接通
 * @param agent_id
 * @param conn
 * @constructor
 */
xwSDK.prototype.TransferCall = function (agent_id, conn) {
  return -1
}

/**
 * 请求把与坐席通话的通道转接到其他号码上
 * @param agent_id 发起操作的坐席id
 * @param mobile_to 转接的号码
 * @constructor
 */
xwSDK.prototype.TransferCallOneKey = async function (agent_id, mobile_to) {
  let transNum = mobile_to
  let numType = 2// 转移设备类型，技能队列为1，坐席为2， IVR为3，系统接入码为4，外部号码为5
  if (mobile_to.length == 8 || mobile_to.length == 11) {
    const doRet = await axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/phone/validateNumber?number=' + number + '&agentId=' + this.sysConfig.agentNum)
    transNum = doRet.status === 200 ? doRet.data.data : transNum
    numType = 5
  }
  const transRet = await this.xwFcc.transfer({
    address: transNum,
    devicetype: numType,
    mode: 2
    // 转移模式：释放转为0(支持：技能、坐席、IVR、系统接入码、外线)，挂起转为1(支持：IVR)，
    // 成功转为2(支持：技能、坐席、接入码、外线)，通话转为3(支持：外线)，三方转为4(支持：外线)
  })
  console.log(transRet)
  mqEvent.TransferCallOneKeyAck({
    agent_id,
    mobile_to,
    status: transRet.status === 200 ? 0 : transRet.status
  })
}

/**
 * 在坐席通话过程中，加入第三方形成三方通话，系统后台自动呼叫第三方号码。
 * @param agent_id 发起操作的坐席id
 * @param callTag 坐席正在通话的通话标识
 * @param thirdNum 第三方的号码
 * @param numType 第三方号码的类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频。（默认传1，集群还需要现场才明白）
 * @constructor
 */
xwSDK.prototype.ThreeWayConf = async function (agent_id, callTag, thirdNum, numType) {
  let transNum = thirdNum
  // let numType=2;//转移设备类型，技能队列为1，坐席为2， IVR为3，系统接入码为4，外部号码为5
  if (thirdNum.length == 8 || thirdNum.length == 11) {
    const doRet = await axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/phone/validateNumber?number=' + thirdNum + '&agentId=' + this.sysConfig.agentNum)
    transNum = doRet.status === 200 ? doRet.data.data : transNum
    numType = 5
  }
  const transRet = await this.xwFcc.confjoin({
    address: transNum,
    devicetype: numType,
    mode: 4
  })
  console.log(transRet)
  mqEvent.ThreeWayConfAck({
    agent_id,
    callTag,
    thirdNum,
    numType,
    iRet: transRet.status === 200 ? 0 : transRet.status
  })
}

/**
 * 收听录音
 * @remake 对坐席播放录音文件
 * @param agent_id 对其播放录音的坐席id
 * @param conn 对其播放录音的坐席通道编号
 * @param recordFile 录音文件名
 * @constructor
 */
xwSDK.prototype.PlayRecordFile = function (agent_id, conn, recordFile) {
  return -1
}

/**
 * 创建电话会议
 * @remake 创建一个电话会议
 * @param agent_id 发起会议的坐席id
 * @constructor
 */
xwSDK.prototype.CreateConf = function (agent_id) {
  return -1
}

/**
 * 创建音视频会议，自动呼叫成员号码，呼通接入会议
 * @remake 其中，numType中包含视频类型，则创建视频会议，否则为音频会议。
 音频会议创建后不能再添加视频类的成员。
 创建视频会议时还没有成员，可传登陆的坐席号码，numType对应传8
 * @param agent_id 发起操作的坐席id
 * @param memberNum 会议成员号码+显示名（例如：07551001|*|会议室终端|*|32344,07551002|*|手持终端|*|32345），以逗号隔开，最多24个号码
 * @param numType 成员号码对应的号码类型（0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频,9监控），同样以逗号隔开
 * @param location object 窗口位置，包含locX（X轴起点）,locY（Y轴起点）,width（窗口宽度）,height（窗口高度）四个参数
 * @constructor
 */
xwSDK.prototype.CreateConfEx = async function (agent_id, memberNum, numType, winLocation) {
  const memberList = []

  const numberList = !memberNum ? [] : memberNum.split(',')
  const numTypeList = !numType ? [] : numType.split(',')
  for (let index = 0; index < numberList.length; index++) {
    // numberList.forEach(function (item, index, items) {
    const item = numberList[index]
    const memInfo = item.split('|*|')
    if (memInfo.length > 1) {
      let oType
      let pType
      const tmpType = numTypeList[index]
      if (tmpType === '1') {
        oType = '3'
        pType = '3'
        const transNumber = await axios.post(this.ucsServerUrl + '/ucs/communication/phone/validateNumber?number=' + memInfo[0] + '&agentId=' + this.sysConfig.agentNum)
        memInfo[0] = transNumber.status == 200 ? transNumber.data.data : memInfo[0]
      } else if (tmpType === '8' || tmpType === '6') {
        oType = '2'
        pType = '4'
      } else if (tmpType === '9') {
        oType = '1'
        pType = '4'
      } else {
        oType = '3'
        pType = '3'
      }
      const member = {
        OBJ_TYPE: oType, // 参会对象类型, 1-设备 2-用户 3-通讯录
        OBJ_ID: memInfo[2] ? memInfo[2] : '32344',
        OBJ_NAME: memInfo[1],
        PART_TYPE: pType, // 入会方式, 3-语音入会 4-视频入会
        PART_DEV: pType, // 入会方式, 3-语音入会 4-视频入会
        PART_SNO: memInfo[0] //
      }
      if (oType === '1') {
        member.TYPE_ID = '1'// 用户类型为1设备时，1 监控，2 无人机，3 执法仪，4 智能眼镜，5会议终端
        // 如果是视频监控，需要按@切割监控编码，分出id与sno
        const numInfo = memInfo[0].split('@')
        if (numInfo.length > 1) {
          member.OBJ_ID = numInfo[0]
          member.PART_SNO = numInfo[1]
        }
      }
      memberList.push(member)
    }
  }
  console.log('memberParams', memberList)
  const createRet = await this.xwFcc.createConf({
    meetingName: '视频会议',
    members: memberList,
    location: typeof (winLocation) === 'object' ? winLocation : {/* locX:'0',locY:'0',width:'1024',height:'768' */}
  })
  console.dir(createRet)
  this.confInfo = createRet.data
  mqEvent.CreateConfExAck({
    agent_id: agent_id,
    memberNum: memberNum,
    numType: numType,
    confId: createRet.status === 200 ? (createRet.data.MEETING_ID || createRet.data.meetingId) : 0,
    isVideo: 1
  })
  return 0
}

/**
 * 删除电话会议
 * @remake 删除一个电话会议
 * @param agent_id 发起会议的坐席id
 * @param conf_id 会议编号id
 * @constructor
 */
xwSDK.prototype.DeleteConf = function (agent_id, conf_id) {
  console.log('DeleteConf NOT OFFER')
}

/**
 * 加入电话会议
 * @remake 把一路话路加入电话会议中
 * @param agent_id 发起会议的坐席id
 * @param conf_id 要加入的会议编号id
 * @param conn 话路通道的编号
 * @constructor
 */
xwSDK.prototype.JoinConf = function (agent_id, conf_id, conn) {
  console.log('JoinConf NOT OFFER')
}

/**
 * 加入会议
 * @remake 调用加入会议接口，传入号码及号码类型，后台呼通加入会议，结果通过JoinConfEx2Ack回调返回
 * @param agent_id
 * @param conf_id
 * @param conn
 * @param phoneNumber
 * @param numType
 * @constructor
 */
xwSDK.prototype.JoinConfEx = function (agent_id, conf_id, conn, phoneNumber, numType) {
  console.log('JoinConfEx NOT OFFER')
}

/**
 * 调用加入会议接口，传入号码及号码类型，后台呼通加入会议，结果通过JoinConfEx2Ack回调返回
 * @param agent_id 发起操作的坐席id
 * @param conf_id 会议id
 * @param conn 与坐席通话的通话标识id，暂不可用
 * @param phoneNumber 要加入会议的号码
 * @param numType 要加入会议的号码类型
 * @param displayName 成员在会议中的显示名称
 * @constructor
 */
xwSDK.prototype.JoinConfEx3 = async function (agent_id, conf_id, conn, phoneNumber, numType, displayName) {
  let oType
  let pType
  const tmpType = String(numType)
  if (tmpType === '1') {
    oType = '3'
    pType = '3'
    const transNumber = await axios.post(this.ucsServerUrl + '/ucs/communication/phone/validateNumber?number=' + phoneNumber + '&agentId=' + this.sysConfig.agentNum)
    phoneNumber = transNumber.status == 200 ? transNumber.data.data : phoneNumber
  } else if (tmpType === '8' || tmpType === '6') {
    oType = '2'
    pType = '4'
  } else if (tmpType === '9') {
    oType = '1'
    pType = '4'
  } else {
    oType = '3'
    pType = '3'
  }
  const memInfo = displayName.split('|*|')
  const memberList = [{
    OBJ_TYPE: oType, // 参会对象类型, 1-设备 2-用户 3-通讯录
    OBJ_ID: memInfo[1] ? memInfo[1] : '32344',
    OBJ_NAME: memInfo[0],
    PART_TYPE: pType, // 入会方式, 3-语音入会 4-视频入会
    PART_DEV: pType, // 入会方式, 3-语音入会 4-视频入会
    PART_SNO: phoneNumber //
  }]
  if (oType === '1') {
    memberList[0].TYPE_ID = '1'// 用户类型为1设备时，1 监控，2 无人机，3 执法仪，4 智能眼镜，5会议终端
    // 如果是视频监控，需要按@切割监控编码，分出id与sno
    const numInfo = phoneNumber.split('@')
    if (numInfo.length > 1) {
      memberList[0].OBJ_ID = numInfo[0]
      memberList[0].PART_SNO = numInfo[1]
    }
  }
  const doRet = await this.xwFcc.addMeetingMembers({
    members: memberList,
    meetingInfo: {
      MEETING_ID: conf_id,
      MEETING_SNO: this.confInfo.MEETING_SNO
    }
  })
  console.log(doRet)
  mqEvent.JoinConfEx3Ack({
    agent_id,
    conf_id,
    conn,
    phoneNumber,
    numType,
    displayName,
    status: doRet.status === 200 ? 0 : -1
  })
  return 0
}

/**
 * 移出电话会议
 * @remake 把一路话路从电话会议中移出
 * @param agent_id 发起会议的坐席id
 * @param conf_id 通道所在会议编号id
 * @param conn 话路通道的编号
 * @constructor
 */
xwSDK.prototype.RemoveFromConf = function (agent_id, conf_id, conn) {
  console.log('NOT OFFER')
}

/**
 * 电话会议移出成员
 * @param agent_id  1、int agent_id//坐席id
 * @param conf_id 2、,int conf_id,//会议id
 * @param conn 3、int conn,//通话标识
 * @param number 4、BSTR number,//成员号码
 * @constructor
 */
xwSDK.prototype.RemoveFromConfEx = function (agent_id, conf_id, conn, number, numberType) {
  console.log('NOT OFFER')
}

/**
 * 查询已创建的电话会议
 * @param agent_id 发起会议的坐席id
 * @constructor
 */
xwSDK.prototype.RequestConf = function (agent_id) {
  console.log('NOT OFFER')
}

/**
 * 查询电话会议成员
 * @param agent_id 发起会议的坐席id
 * @param conf_id 要查询的会议编号id
 * @constructor
 */
xwSDK.prototype.RequestConfMember = function (agent_id, conf_id) {
  console.log('NOT OFFER')
}

/**
 * 改变会议中线路状态
 * @param agent_id 发起请求的坐席id
 * @param conf_id 电话会议标识id
 * @param conn 电话线路编号
 * @param member_type 成员状态1:只能说 2:只能听 3:可说可听
 * @constructor
 */
xwSDK.prototype.OperateConfMember = function (agent_id, conf_id, conn, member_type) {
  console.log('NOT OFFER')
}

/**
 * 设置会议成员禁言/发言，执行结果通话OperateConfMemberExAck接口回调返回 278
 * @param agent_id 1、int agent_id= 会议所属坐席id
 * @param confId 2、int confId = 会议标识id
 * @param conn 3、int conn= 通话标识，暂无意义
 * @param type 4、int type=成员权限-----1、只能说2、只能听3、可说可听
 * @param phoneNumber 5、BSTR phoneNumber=成员号码
 * @param numberType 号码类型
 * @constructor
 */
xwSDK.prototype.OperateConfMemberEx = function (agent_id, confId, conn, type, phoneNumber, numberType) {
  console.log('NOT OFFER')
}

/**
 * 发送传真
 * @remake 向cti服务发送传真请求
 * @param case_id 事件id
 * @param opr_name 客户端登陆用户
 * @param fax_number 接收方号码
 * @param fax_name 传真标题
 * @param fax_file 传真文件名
 * @param fax_process_id 事件流程id
 * @param fax_id 传真任务id
 * @param fax_extend 传真任务自定义内容
 * @constructor
 */
xwSDK.prototype.SendFax = function (case_id, opr_name, fax_number, fax_name, fax_file, fax_process_id, fax_id, fax_extend) {
  console.log('NOT OFFER')
}

/**
 * 设置视频通话视频窗口
 * 设置视频会议、视频电话通话视频窗口
 * @param agent_id  int agent_id =操作的坐席id;
 * @param localHandle int localHandle=本端窗口句柄；
 * @param remoteHandle  int remoteHandle=远端窗口句柄；
 * @constructor
 */
xwSDK.prototype.SetVideoWindow = function (agent_id, localHandle, remoteHandle) {
  console.log('NOT OFFER')
}

/**
 * 视频会议中，广播/取消广播成员画面功能 282
 * @remake 可以广播单个成员画面，也可组合多个成员的画面广播。
 * @param agent_id int 坐席id
 * @param conf_id int 会议ID
 * @param mixType int 广播画面模式，1单画面,4均分4画面,9均分9画面，16均分16画面
 * @param phoneNum String 成员号码列表，以逗号分隔，最大16个
 * @param isCannel int 是否取消广播，0否，1取消
 * @constructor
 */
xwSDK.prototype.ConfBoardCastMember = function (agent_id, conf_id, mixType, phoneNum, isCannel) {
  console.log('NOT OFFER')
}

/**
 *description 点名发言
 *@param agentId 坐席id
 * @param confId 会议id
 * @param floorSite 发言的会场
 *@author Ouyuqian
 *@date 2020/1/2
 */
xwSDK.prototype.ConfSetFloorSite = function (agentId, confId, floorSite) {
  console.log('NOT OFFER')
}

/**
 *description 设置主会场
 *@param agentId 坐席id
 * @param confId 会议id
 * @param chairSite 设为主席的会场
 *@author Ouyuqian
 *@date 2020/1/2
 */
xwSDK.prototype.ConfSetChair = function (agentId, confId, chairSite) {
  console.log('NOT OFFER')
}

/**
 *description 取消会议主会场
 *@param agentId 坐席id
 * @param confId 会议id
 *@author Ouyuqian
 *@date 2020/1/2
 */
xwSDK.prototype.ConfReleaseChair = function (agentId, confId) {
  console.log('NOT OFFER')
}

/**
 *description 会议重呼成员
 *@param agentId 坐席id
 * @param confId 会议id
 * @param sites 成员列表
 *@author Ouyuqian
 *@date 2020/1/2
 */
xwSDK.prototype.ConfReconnectSite = function (agentId, confId, sites) {
  console.log('NOT OFFER')
}

/**
 * 选看视频会议成员画面，可同时预览多个成员画面，最多16个
 * @param agent_id 坐席id
 * @param conf_id 会议ID
 * @param mixType 广播画面模式，1-单画面,4-均分4画面,9-均分9画面，16-均分16画面
 * @param phoneNum 成员号码列表，以逗号分隔,最多16个
 * @constructor
 */
xwSDK.prototype.ConfWatchMember = function (agent_id, conf_id, mixType, phoneNum) {
  console.log('NOT OFFER')
}

/**
 * 根据分组id，分页查询其子分组信息
 * @remake 分组id为0时查询根分组；可查询摄像机资源和eLTE终端分组资源
 * @param agent_id 坐席id
 * @param iType 分组类型，0摄像机，1为eLET,8视频终端分组
 * @param iPageIndex 分页查询，第几页
 * @param iPageSize 分页查询，每页数量
 * @param group_id 分组ID
 * @constructor
 */
xwSDK.prototype.ICPQueryGroupInfo = function (agent_id, iType, iPageIndex, iPageSize, group_id) {
  console.log('NOT OFFER')
}

/**
 * 根据资源分组id，分页查询该分组下设备资源信息，可传入设备名称模糊、精确查询设备信息
 * @param agent_id 坐席id
 * @param iType 设备类型 0摄像机，1eLET,8视频终端
 * @param iPageIndex 分页查询，第几页
 * @param iPageSize 分页查询，每页数量
 * @param group_id 分组ID
 * @param devName 设备名称
 * @constructor
 */
xwSDK.prototype.ICPQueryDeviceInfo = function (agent_id, iType, iPageIndex, iPageSize, group_id, devName) {
  console.log('NOT OFFER')
}

/**
 * 根据摄像头号码，在指定窗口预览视频
 * @param agent_id 坐席id
 * @param iType 设备类型 0摄像机，1eLET
 * @param devName 设备号码
 * @param windowHandle 预览窗口句柄
 * @constructor
 */
xwSDK.prototype.ICPStartRealPlay = async function (agent_id, iType, devName, windowHandle, iX, iY, iWidth, iHeight) {
  const devInfo = !devName ? [] : devName.split('@')
  iX = !iX ? '0' : iX
  iY = !iY ? '0' : iY
  iWidth = !iWidth ? '600' : iWidth
  iHeight = !iHeight ? '400' : iHeight
  const playRet = await this.xwFcc.openMonitor({
    resId: devInfo[0],
    x: String(iX),
    y: String(iY),
    width: Number(iWidth),
    height: Number(iHeight)
  })
  console.dir(playRet)
  mqEvent.ICPStartRealPlayAck({
    agent_id: agent_id,
    iType: iType,
    devName: devName,
    result: playRet.status === 200 ? 0 : -1,
    windowHandle: windowHandle
  })
  return 0
}

/**
 * 停止播放视频
 * @param agent_id 坐席id
 * @param iType 设备类型 0摄像机，1eLET
 * @param playHandle 播放句柄
 * @constructor
 */
xwSDK.prototype.ICPStopRealPlay = function (agent_id, iType, playHandle) {
  console.log('NOT OFFER')
}

/**
 * 摄像机云台控制
 * @param agent_id 坐席id
 * @param vcnId 所属VCN的设备编码
 * @param devNum 设备号码
 * @param ptzCommand 控制命令 控制命令:
 PTZ_LENS_ZOOM_IN = 0,焦距变大(PTZ)
 PTZ_LENS_ZOOM_OUT=1,焦距变小(PTZ)
 PTZ_LENS_FOCAL_NEAT=2,焦点前调 (FI)
 PTZ_LENS_FOCAL_FAR = 3, 焦点后调 (FI)
 PTZ_LENS_APERTURE_OPEN = 4,光圈扩大 (FI)
 PTZ_LENS_APERTURE_CLOSE = 5,光圈缩小 (FI)
 PTZ_UP = 6,云台向上 (PTZ)
 PTZ_DOWN = 7,云台向下 (PTZ)
 PTZ_LEFT = 8,云台左转 (PTZ)
 PTZ_RIGHT = 9,云台右转 (PTZ)
 PTZ_STOP = 10,停止PTZ
 PTZ_FI_STOP = 11停止FI
 * @param speed 控制速率--speed是控制的速率，范围是1~10，ptzCommand为PTZ_LENS_FOCAL_NEAT/PTZ_LENS_FOCAL_FAR/PTZ_UP/PTZ_DOWN/PTZ_LEFT/PTZ_RIGHT有效
 * @param multiple 放大倍数，范围是1~10，ptzCommand为PTZ_LENS_ZOOM_IN/PTZ_LENS_ZOOM_OUT / PTZ_LENS_APERTURE_OPEN/PTZ_LENS_APERTURE_CLOSE有效
 * @param isStop 是否停止操作,0操作，1停止操作,每个控制指令需要调用一次停止操作
 * @constructor
 */
xwSDK.prototype.ICPPTZDevice = function (agent_id, vcnId, devNum, ptzCommand, speed, multiple, isStop) {
  console.log('NOT OFFER')
}

/**
 * 监控入会，目前只能添加摄像机
 * @param agent_id
 * @param iType 设备类型 0摄像机，1eLET
 * @param conf_id 会议id
 * @param devName 设备号码
 * @constructor
 */
xwSDK.prototype.ConfAddDevice = function (agent_id, iType, conf_id, devName) {
  console.log('NOT OFFER')
}

/**
 * 应答通话，话机摘机应答
 * @param agent_id
 * @param conn 通话标识
 * @param isVideo 是否视频应答
 * @constructor
 */
xwSDK.prototype.AnswerCall = function (agent_id, conn, isVideo) {
  console.log('NOT OFFER')
}

/**
 * 订阅无线集群群组
 * @param agent_id
 * @param expire 订阅时间
 * @param groupName 群组名称
 * @constructor
 */
xwSDK.prototype.TalkingGroupSubcribe = function (agent_id, expire, groupName) {
  console.log('NOT OFFER')
}

/**
 * 监听无线集群群组
 * @param agent_id
 * @param groupName 群组名称
 * @param isMonitor 是否开始监听，1开始监听，0停止监听
 * @param isAutoSubcribe 是否自动处理订阅，1是，0否，默认1
 * @constructor
 */
xwSDK.prototype.TalkingGroupMonitor = function (agent_id, groupName, isMonitor, isAutoSubcribe) {
  console.log('NOT OFFER')
}

/**
 * 选中/监听无线集群群组切换
 * @param agent_id
 * @param groupName 群组名称
 * @param isSelect 是否选中，1选中，0取消选中
 * @constructor
 */
xwSDK.prototype.TalkingGroupSelect = function (agent_id, groupName, isSelect) {
  console.log('NOT OFFER')
}

/**
 * 无线集群群组抢权/放权操作
 * @remake 注意：
 1、该操作的前提条件是，先顺序操作以下流程：订阅、监听、选中
 2、抢权说话完要放权，要不然会一直占用，其他人抢不了权说话。
 * @param agent_id
 * @param groupName 群组名称
 * @param isPTT 是否抢权，1抢权，0放权
 * @constructor
 */
xwSDK.prototype.TalkingGroupPTT = function (agent_id, groupName, isPTT) {
  console.log('NOT OFFER')
}

/**
 * 发起混编/临时混编呼叫接口
 * @param agent_id 坐席id
 * @param groupNum 群组号码
 * @param groupName 群组名称
 * @constructor
 */
xwSDK.prototype.MixedGroupCall = function (agent_id, groupNum, groupName) {
  console.log('NOT OFFER')
}

/**
 * 坐席接受/拒绝加入会议邀请,isAccept值为1接受，0拒绝
 * @param agent_id 坐席id
 * @param conf_id 会议id
 * @param isAccept 是否接受邀请，1接受，0拒绝
 * @param confNumber 会议号码，可为空
 * @constructor
 */
xwSDK.prototype.ConfAcceptInvite = function (agent_id, conf_id, isAccept, confNumber) {
  console.log('NOT OFFER')
}

/**
 * 代接正在振铃的坐席的来电
 * @param agent_id 坐席id
 * @param conn 正在通话的通话ID（备用）
 * @param agentTag 代接的坐席工号,
 * @param agentNum 代接的坐席号码
 * @constructor
 */
xwSDK.prototype.SnatchPickup = function (agent_id, conn, agentTag, agentNum) {
  console.log('NOT OFFER')
}

/**
 * 视频会议启动/停止辅流
 * @param agent_id 坐席id
 * @param confId 会议id
 * @param isStart 是否启动，1启动，0停止
 * @constructor
 */
xwSDK.prototype.ConfStartData = function (agent_id, confId, isStart) {
  console.log('NOT OFFER')
}

/**
 * 设置视频源
 * @remake 设置一个与会者成员选看另一个与会者成员/锁定视频源
 * @param agent_id 坐席id,
 * @param confId 会议id
 * @param isLock 是否启动，1启动，0停止
 * @param dstMember 目的成员
 * @param srcMember 视频源成员
 * @constructor
 */
xwSDK.prototype.ConfSetVideoSource = function (agent_id, confId, isLock, dstMember, srcMember) {
  console.log('NOT OFFER')
}

/**
 * 黑名单管理，可1添加，0删除,2清空
 * @param agent_id 坐席id
 * @param phoneNumber 号码列表，以逗号隔开，最多支持32个21个数字的号码串
 * @param iControl 控制命令，1添加，0删除,2清空
 * @constructor
 */
xwSDK.prototype.OperateBlackList = function (agent_id, phoneNumber, iControl) {
  console.log('NOT OFFER')
}

/**
 * 坐席二次拨号，可多次调用，需间隔一秒以上
 * @param agent_id 坐席id
 * @param dtmfNum 二次拨号号码
 * @constructor
 */
xwSDK.prototype.AgentSendDtmf = function (agent_id, dtmfNum) {
  console.log('NOT OFFER')
}

/**
 * 坐席重新加入会议
 * @remake 一般情况下，坐席掉线但是会议没有结束的情况下，调用次接口重新加入会议
 * @param agent_id 发起操作的坐席id
 * @param conf_id 会议id
 * @constructor
 */
xwSDK.prototype.AgentAccessConf = function (agent_id, conf_id) {
  console.log('NOT OFFER')
}

/**
 * 传真合并
 * @param path 传真文件远程路径（多个用“;”分隔）
 * @constructor
 */
xwSDK.prototype.FaxMerge = function (path) {
  var requestHeader = setRequestHeader(1, 255, 339)
  requestHeader.path = path
  var data = {
    data: {
      topicName: MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {

  })
}

/**
 * 传真拆分
 * @param path 传真文件远程路径（多个用“;”分隔）
 * @constructor
 */
xwSDK.prototype.FaxSplit = function (path) {
  var requestHeader = setRequestHeader(1, 255, 341)
  requestHeader.path = path
  var data = {
    data: {
      topicName: MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {

  })
}

/**
 * 启动扫描仪
 * @constructor
 */
xwSDK.prototype.FaxScan = function () {
  var requestHeader = setRequestHeader(1, 255, 343)
  requestHeader.path = path
  var data = {
    data: {
      topicName: MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {

  })
}

xwSDK.prototype.ReconnectMQSuccess = function () {

}
xwSDK.prototype.HeartBreakAck = function (message) {

}
/**
 * 号码还原
 * @param number
 * @returns {Promise<*>}
 * @constructor
 */
xwSDK.prototype.ReverseNumber = async function (number) {
  const transNum = await axios.post(this.sysConfig.ucsServerUrl + '/ucs/communication/phone/reverseValidatedNumber?number=' + number + '&agentId=' + this.sysConfig.agentNum)
  return transNum.status == 200 ? transNum.data.data : number
}

xwSDK.prototype.SendPortStatus = function (portStatus) {
  mqEvent.PortStatusChanged({
    agent_id: this.sysConfig.agentId,
    conn: this.callInfo.agentId,
    agentNumber: this.sysConfig.agentNum,
    status: portStatus
  })
}
xwSDK.prototype.SendUpdateCallingNum = function (conn, calling) {
  mqEvent.UpdateCallingNumber({
    agent_id: this.sysConfig.agentId,
    conn: conn,
    agentNumber: this.sysConfig.agentNum,
    calling: calling,
    agentTag: this.sysConfig.agentTag
  })
}

xwSDK.prototype.SendBroadcastCalloffered = function (conn, calling, called, callStatus) {
// 0,消失，1保持中，2呼出通话中，3呼入通话中,4正在外呼中
  mqEvent.BroadcastCallOffered(
    {
      conn,
      calling,
      called,
      status: callStatus
    })
}
xwSDK.prototype.DetectUserInfo = function (users) {
  console.log('NOT OFFER')
}
/**
 * 获取系统当前时间
 */
xwSDK.prototype.getTime = function () {
  var date = new Date()
  var seperator1 = '-'
  var seperator2 = ':'
  var month = date.getMonth() + 1
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  var strDate = date.getDate()
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var Hours = date.getHours()
  if (Hours >= 0 && Hours <= 9) {
    Hours = '0' + Hours
  }
  var Minutes = date.getMinutes()
  if (Minutes >= 0 && Minutes <= 9) {
    Minutes = '0' + Minutes
  }
  var Seconds = date.getSeconds()
  if (Seconds >= 0 && Seconds <= 9) {
    Seconds = '0' + Seconds
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + Hours + seperator2 + Minutes + seperator2 + Seconds
  return currentdate
}
export default {
  xwSDK
}
