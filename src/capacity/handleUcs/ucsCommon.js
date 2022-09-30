/**
 * @author xrw
 * @date 2019/9/23
 * @description 调用融合通讯服务api
 */

import axios from 'axios'
import mqEvent from './ucsConnect.js'

const ucsCommon = function () {
  // eos服务器地址
  this.eosServerUrl = ''
  // usc服务地址
  this.ucsServerUrl = ''
  // mq服务地址
  this.MQServer
  // mq用户名
  this.MQUser
  // mq密码
  this.MQPwd
  // EMTAgent在MQ中的标识，传入用户需要登录的ICP坐席号码
  this.MQMyCode
  // WEB端在MQ中的标识，WEB端自定义即可，用于EMTAgent给WEB端发送消息
  this.MQDeCode
  // 登录坐席的用户名
  this.user
  // 用户登录的坐席id
  this.agentId
  // 事件id
  this.eventId
  this.heartInerval

  this.sysConfType = ''
  this.isConnected = false
  this.heartBreakTick = 0
  this.isFirstInit = true
  this.transferNumList = new Map()
  this.isAgentLoginSuccess = false
  // 登录坐席的用户id
  this.operatorId = 0
}
/**
 * 设置json公告消息头
 * @param PriCmd 主命令字，标识命令类型，默认1
 * @param SubCmd 次命令字，标识接口id，1至255
 * @param Tag 扩展字段，当SubCmd为255时启动该字段，256至int类型最大值，不启用是设置0
 */
ucsCommon.prototype.setRequestHeader = function (PriCmd, SubCmd, Tag) {
  // json公告消息头
  const requestHeader = {
    cmd: {
      PriCmd: PriCmd,
      SubCmd: SubCmd,
      Tag: Tag
    }
  }
  return requestHeader
}
/**
 * 获取坐席未登录的固定请求返回json，仅内部调用
 * @author Ouyuqian
 * @date 2020/09/15
 */
ucsCommon.prototype.GetUnLoginResPonse = function () {
  console.log('调用失败，坐席未登录')
  return { data: { errorcode: -1, msg: '坐席未登录' } }
}
/**
 *description 初始化SDK，从ucs后台获取坐席连接的mq信息，
 * 强退可能已被人登录的agent，
 * 然后启动坐席agent，之后连接mq接收消息，最后发起坐席心跳检测，判断坐席连接mq状态
 * @param sysConfig ucs配置信息
 * 1、 ucsServer ucs服务地址
 * 2、listenMQServer 坐席连接的mq地址
 * 3、 userCode 第三方前端订阅的mq消息topic名称
 * 4、 agentCode 第三方指定坐席在mq订阅的topic
 * 5、 MQServer MQ服务地址（带端口号）
 * 6、MQUser  MQ登录用户名
 * 7、MQPwd  MQ登录密码
 * 8、sysConfService ucs会议能力厂商标识
 * 9、isFirstLogin 是否首次登录，若是，则完全初始化，重新打开emtagent等
 * 10、logCallBack 登录回调
 *@author Ouyuqian
 *@date 2019/12/10
 */
ucsCommon.prototype.InitSDK = async function (sysConfig) {
  this.ucsServerUrl = sysConfig.ucsServer
  this.MQDeCode = 'eos' + sysConfig.userCode
  this.MQMyCode = sysConfig.agentCode

  this.MQServer = sysConfig.MQServer
  this.MQUser = sysConfig.MQUser
  this.MQPwd = sysConfig.MQPwd
  this.sysConfType = sysConfig.sysConfService
  // this.isFirstInit = sysConfig.isFirstLogin;
  this.isFirstInit = true
  const doRet = await mqEvent.connect_server(sysConfig.listenMQServer, this.MQMyCode, this.MQDeCode, this.MQUser, this.MQPwd, sysConfig.logCallBack,sysConfig.store)

  this.startAgent()
  const timeStamp = sysConfig.sysConfService === 'YouShiKang' ? 20 * 1000 : 1500
  this.isConnected = sysConfig.sysConfService === 'YouShiKang'
  this.startCheckHeart(timeStamp)

  return true
}
/**
 *description 关闭SDK，释放资源
 *@author Ouyuqian
 *@date 2019/12/12
 */
ucsCommon.prototype.UnInitialize = async function () {
  await this.AgentLogout()
  await this.CloseEMTAgent()
  if (this.heartInerval != 'undefined') {
    clearInterval(this.heartInerval)
    this.heartInerval = 0
    this.heartBreakTick = 0
  }
  mqEvent.dis_connect()
  this.isConnected = false
}
/**
 * EMTAgent启动 地址链接组成方式为：自定义协调头://自定义参数;自定义协议头：默认注册为EMTProtocol
 * @param MQServer MQ服务地址，带端口
 * @param MQUser MQ登录用户
 * @param MQPwd MQ登陆密码
 * @param this.MQMyCode EMTAgent在MQ中的标识，传入用户需要登录的ICP坐席号码
 * @param MQDeCode WEB端在MQ中的标识，WEB端自定义即可，用于EMTAgent给WEB端发送消息,即TOPIC
 * 所有参数已提前设置好，或通过其他接口改变参数
 */
ucsCommon.prototype.startAgent = function () {
  const tmp = document.getElementById('startEMTAgent')
  if (tmp === null && this.isFirstInit && this.sysConfType !== 'YouShiKang') {
    this.CloseEMTAgent()
    const dom = document.createElement('div')
    dom.setAttribute('id', 'startEMTAgent')
    dom.setAttribute('style', 'display:none;')
    dom.innerHTML = "<iframe scrolling='no' frameborder='0' marginheight='10' marginwidth='40%' width='500' height='500' allowTransparency src='" +
      'EMTProtocol://<Config>' +
      '<MQServer>' + this.MQServer + '</MQServer>' +
      '<MQUser>' + this.MQUser + '</MQUser>' +
      '<MQPwd>' + this.MQPwd + '</MQPwd>' +
      '<MQMyCode>' + this.MQMyCode + '</MQMyCode>' +
      '<MQDeCode>' + this.MQDeCode + '</MQDeCode><KillRunning>1</KillRunning>' +
      "</Config>'></iframe>"
    document.body.appendChild(dom)
  }
}
/**
 * 退出EMTAgent
 * @constructor
 */
ucsCommon.prototype.CloseEMTAgent = function () {
  const tmp = document.getElementById('startEMTAgent')
  if (tmp !== null) {
    tmp.parentNode.removeChild(tmp)
  }
  var requestHeader = this.setRequestHeader(1, 255, 270)
  requestHeader.dataBuf = 'CLOSESELF'
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {
    if (data.data.errorcode == 0) {
      console.log('发送其他坐席退出请求')
    } else {
      console.error('其他坐席退出请求失败！')
    }
  })
}
/**
 *description 启动坐席的心跳检测
 *@author Ouyuqian
 *@date 2019/12/11
 */
ucsCommon.prototype.startCheckHeart = function (timeSpan) {
  const that = this
  this.heartInerval = setInterval(function () {
    // console.log(that.heartBreakTick);
    if (that.heartBreakTick < 60 || that.heartBreakTick > 100 || that.sysConfType === 'YouShiKang') {
      const requestHeader = that.setRequestHeader(1, 255, 270)
      requestHeader.dataBuf = 'HEARTBREAK'
      requestHeader.agent_id = that.agentId
      const data = {
        data: {
          topicName: that.MQMyCode,
          text: requestHeader
        }
      }
      if (that.sysConfType !== 'YouShiKang') {
        axios.post(that.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {
          if (data.data.errorcode == 0) {
            console.log('发送坐席心跳')
          } else {
            console.error('坐席心跳发送失败！')
          }
        })
      } else {
        axios.post(that.ucsServerUrl + '/ucs/communication/heartBreak', data).then(function (data) {
          if (data.data.errorcode == 0) {
            console.log('发送坐席心跳')
          } else {
            console.error('坐席心跳发送失败！')
          }
        })
      }
      that.heartBreakTick += 1
    }
  }, timeSpan)
}
/**
 *description 心跳消息返回，说明agent已上线，停止心跳定时器，发送agent初始化信息
 *@param data 消息内容，形如{"cmd":{"PriCmd":1,"SubCmd":225,"Tag":270},"dataBuf":"HEARTBREAK"}
 *@return
 *@author Ouyuqian
 *@date 2019/12/12
 */
ucsCommon.prototype.HeartBreakAck = function (data) {
  if (this.heartInerval !== 'undefined' && this.heartInerval > 0 && this.heartBreakTick < 60) {
    clearInterval(this.heartInerval)
    if (this.isConnected === false && this.isFirstInit) {
      this.SendCtiConfig()
    }
    this.isConnected = true
    this.heartBreakTick = 20 * 1000
    this.startCheckHeart(20 * 1000)
  }
}

/**
 * 处理坐席登录返回事件,若登录失败，则关闭mq连接
 * @author Ouyuqian
 * @date 2020/09/15
 */
ucsCommon.prototype.OnAgentLoginAck = function (msg) {
  if (this.isConnected) {
    console.log(this.isAgentLoginSuccess)
    let isSuccess = this.isAgentLoginSuccess
    const loginRet = msg.status
    const that = this
    switch (loginRet) {
      case 1:
      {
        isSuccess = false
        console.log('loggin failed')
        if (this.heartInerval != 'undefined' && this.heartInerval > 0) {
          clearInterval(this.heartInerval)
        }
        mqEvent.dis_connect()

        break
      } case 0:
      {
        isSuccess = true
        console.log('loggin success')
        break
      } default:break
    }
    this.isAgentLoginSuccess = isSuccess
  }
}
/**
 * 发送ICP登录配置
 * @agent_id 坐席id
 * @constructor
 */
ucsCommon.prototype.SendCtiConfig = function () {
  var requestHeader = this.setRequestHeader(1, 226, 0)
  requestHeader.vcExtension = this.MQMyCode
  // topicName:MQ的topic，vcExtension：用户选择的坐席
  // topicName--发送消息给mq的queue，vcExtension--去数据库查询坐席的坐席号
  var data = { data: { topicName: this.MQMyCode, text: requestHeader } }
  axios.post(this.ucsServerUrl + '/ucs/communication/start', data).then(function (data) {
    if (data.data.errorcode == 0) {
      console.log('已发送ICP登录配置！')
    }
  })

  if (this.isConnected == false) {
    requestHeader = this.setRequestHeader(1, 1, 0)
    requestHeader.user = this.user
    requestHeader.passwd = ''
    requestHeader.license = ''
    requestHeader.agent_id1 = this.agentId
    requestHeader.agent_id2 = this.agentId
    requestHeader.operatorId = this.operatorId
    data = {
      data: {
        topicName: this.MQMyCode,
        text: requestHeader
      }
    }
    axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  }
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
 * @constructor
 */
ucsCommon.prototype.AgentLogin = async function (user, passwd, license, agent_id1, agent_id2, token, userId, operatorId) {
  this.user = user
  this.agentId = agent_id1
  this.operatorId = operatorId || 0
  var requestHeader = this.setRequestHeader(1, 1, 0)
  requestHeader.user = user
  requestHeader.passwd = passwd
  requestHeader.license = license
  requestHeader.agent_id1 = agent_id1
  requestHeader.agent_id2 = agent_id2
  requestHeader.operatorId = operatorId
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/agentLogin', data)// .then(function(data) {
  if (doRet.data.errorcode == 0) {
    console.log('上层用户向ucs服务发起注册！')
  } else {
    console.log('上层用户向ucs服务注册失败！')
  }
  return doRet
  // });
}
/**
 * ucs退出登录
 * @constructor
 */
ucsCommon.prototype.AgentLogout = async function () {
  const requestHeader = this.setRequestHeader(1, 1, 0)
  requestHeader.user = this.user
  requestHeader.passwd = ''
  requestHeader.license = ''
  requestHeader.agent_id1 = this.agentId
  requestHeader.agent_id2 = this.agentId
  const data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/agentLogout', data).then(function (data) {
    if (data.data.errorcode == 0) {
      console.log('logout success')
    } else {
      console.log('logout fail')
    }
  })
}

/**
 * 坐席改变状态
 * @param agent_id 坐席id
 * @param status 改变到的状态 0:离线；1：上线
 * @param transferNum 离线时来电转移到的号码（夜服号码）
 * @constructor
 */
ucsCommon.prototype.AgentChangeStatus = async function (agent_id, status, transferNum) {
  var requestHeader = this.setRequestHeader(1, 3, 0)
  requestHeader.agent_id = agent_id
  requestHeader.status = status
  requestHeader.transferNum = transferNum
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = axios.post(this.ucsServerUrl + '/ucs/communication/agentChangeStatus', data)// .then(function(data) {
  if (doRet.errorcode == 0) {
    console.log('坐席改变状态成功！')
  } else {
    console.log('坐席改变状态失败！')
  }
  return doRet
}

/**
 * 发起呼叫
 * @remake 发起一次呼叫，需先拿起坐席话机
 * @param agent_id 坐席id
 * @param called 外呼号码
 * @param iddcode 坐席号码
 * @constructor
 */
ucsCommon.prototype.MakeCall = async function (agent_id, called, iddcode, assignObj = {}) {
  if (!this.isAgentLoginSuccess) { return this.GetUnLoginResPonse() };

  const that = this
  const transNumber = await this.TranslateNumber(called)

  var requestHeader = that.setRequestHeader(1, 5, 0)
  requestHeader.agent_id = agent_id
  requestHeader.called = transNumber
  requestHeader.iddcode = iddcode
  var topicName = that.MQMyCode
  var data = {
    data: {
      topicName: topicName,
      text: requestHeader
    }
  }
  if (topicName == '' || topicName == null || topicName == undefined) {
    console.error('坐席未登录!')
  }
  const doRet = await axios.post(that.ucsServerUrl + '/ucs/communication/makeCall', data)// .then(function(data) {
  return doRet
  // });
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
ucsCommon.prototype.MakeCallEx = async function (agent_id, number, iddcode, param_1, numType) {
  this.isAgentLoginSuccess = true
  if (!this.isAgentLoginSuccess) { return this.GetUnLoginResPonse() };

  const that = this
  const transNumber = await this.TranslateNumber(number)

  const topicName = that.MQMyCode
  if (topicName == '' || topicName == null || topicName == undefined) {
    console.error('坐席未登录!')
  }
  const requestHeader = this.setRequestHeader(1, 44, 0)
  requestHeader.agent_id = agent_id
  requestHeader.number = transNumber
  requestHeader.iddcode = iddcode
  requestHeader.param_1 = param_1
  requestHeader.numType = numType
  var data = {
    data: {
      topicName: topicName,
      text: requestHeader
    }
  }
  const doRet = axios.post(that.ucsServerUrl + '/ucs/communication/makeCallEx', data)
  return doRet
}

/**
 * 挂断电话
 * @param agent_id 请求的坐席id
 * @param conn 需挂掉的通道编号
 * @param key 通话队列需要移出的key值(非必填)
 * @constructor
 */
ucsCommon.prototype.DropCall = async function (agent_id, conn, key) {
  var requestHeader = this.setRequestHeader(1, 9, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conn = conn
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/dropCall', data)// .then(function(data) {
  if (doRet.data.errorcode != 0) {
    return doRet
  }

  return doRet
}

/**
 * 来电保持
 * @param agent_id 需要外呼的坐席id
 * @param conn 需挂掉（保持）的通道编号
 * @constructor
 */
ucsCommon.prototype.HeldCall = async function (agent_id, conn) {
  var requestHeader = this.setRequestHeader(1, 7, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conn = conn
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/heldCall', data)// .then(function(data) {
  return doRet
}

/**
 * 恢复来电
 * @remake 接通在等待状态的一路通话，坐席操作员拿起话机，选择等待区中的一路通话进行恢复；
 * @param agent_id 想接通来电的坐席id
 * @param conn_a 坐席通道编号（传agent_id即可）
 * @param conn_b 外线通道编号
 * @constructor
 */
ucsCommon.prototype.AlternateCall = async function (agent_id, conn_a, conn_b) {
  var requestHeader = this.setRequestHeader(1, 8, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conn_a = conn_a
  requestHeader.conn_b = conn_b
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/alternateCall', data)// .then(function(data) {
  return doRet
}

/**
 * 转接线路
 * @remake 把本次通话转接给其他话路；首先【保持】本次通话，接着呼通要转接的话路，选择【转接】功能即可把两个话路接通
 * @param agent_id
 * @param conn
 * @constructor
 */
ucsCommon.prototype.TransferCall = async function (agent_id, conn) {
  var requestHeader = this.setRequestHeader(1, 16, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conn = conn
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/transferCall', data)
  return doRet
}

/**
 * 收听录音
 * @remake 对坐席播放录音文件
 * @param agent_id 对其播放录音的坐席id
 * @param conn 对其播放录音的坐席通道编号
 * @param recordfile 录音文件名
 * @constructor
 */
ucsCommon.prototype.PlayRecordFile = async function (agent_id, conn, recordfile) {
  var requestHeader = this.setRequestHeader(1, 23, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conn = conn
  requestHeader.recordfile = recordfile
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/playRecordFile', data).then(function (data) {

  })
}

/**
 * 创建电话会议
 * @remake 创建一个电话会议
 * @param agent_id 发起会议的坐席id
 * @constructor
 */
ucsCommon.prototype.CreateConf = async function (agent_id) {
  if (!this.isAgentLoginSuccess) { return this.GetUnLoginResPonse() };

  var requestHeader = this.setRequestHeader(1, 24, 0)
  requestHeader.agent_id = agent_id
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/createConf', data).then(function (data) {

  })
}
/**
 * 创建音视频会议，自动呼叫成员号码，呼通接入会议
 * @remake 其中，numType中包含视频类型，则创建视频会议，否则为音频会议。
 音频会议创建后不能再添加视频类的成员。
 创建视频会议时还没有成员，可传登陆的坐席号码，numType对应传8
 * @param agent_id 发起操作的坐席id
 * @param memberNum 会议成员号码+显示名（例如：07551001|*|会议室终端,07551002|*|手持终端），以逗号隔开，最多24个号码
 * @param numType 成员号码对应的号码类型（0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频），同样以逗号隔开
 * @param location 窗口位置，此参数ICP版本无效
 * @constructor
 */
ucsCommon.prototype.CreateConfEx = async function (agent_id, memberNum, numType, winLocation) {
  this.isAgentLoginSuccess = true
  // debugger
  if (!this.isAgentLoginSuccess) { return this.GetUnLoginResPonse() };

  const requestHeader = this.setRequestHeader(1, 255, 271)
  const that = this
  const numberList = !memberNum ? [] : memberNum.split(',')
  const numTypeList = !numType ? [] : numType.split(',')
  // await numberList.forEach(async function (item, index, items) {

  for (let i = 0; i < numberList.length; i++) {
    const memInfo = numberList[i].split('|*|')
    if (memInfo.length > 1) {
      const tmpType = numTypeList[i]
      if (String(tmpType) === '1' && memInfo[0].length >= 7 && !isNaN(Number(memInfo[0]))) {
        memInfo[0] = await that.TranslateNumber(memInfo[0])
      }
      numberList[i] = memInfo.join('|*|')
    }
  }
  memberNum = numberList.join(',')
  requestHeader.agent_id = agent_id
  requestHeader.memberNum = memberNum
  requestHeader.numType = numType
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/createConfEx', data)// .then(function(data) {
  if (doRet.data.errorcode == 0) {
    console.log('已发起创建会议！')
  }
  return doRet
}

/**
 * 删除电话会议
 * @remake 删除一个电话会议
 * @param agent_id 发起会议的坐席id
 * @param conf_id 会议编号id
 * @constructor
 */
ucsCommon.prototype.DeleteConf = async function (agent_id, conf_id) {
  if (!this.isAgentLoginSuccess) { return this.GetUnLoginResPonse() };

  var requestHeader = this.setRequestHeader(1, 28, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/deleteConf', data)// .then(function(data) {

  if (doRet.data.errorcode == 0) {
    console.log('已发起删除会议！')
  }
  return doRet
}

/**
 * 加入电话会议(请使用joinconfex3接口）
 * @remake 把一路话路加入电话会议中
 * @param agent_id 发起会议的坐席id
 * @param conf_id 要加入的会议编号id
 * @param conn 话路通道的编号
 * @constructor
 */
ucsCommon.prototype.JoinConf = async function (agent_id, conf_id, conn) {
  var requestHeader = this.setRequestHeader(1, 26, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.conn = conn
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/joinConf', data).then(function (data) {

  })
}

/**
 * 加入会议(请使用joinconfex3接口）
 * @remake 调用加入会议接口，传入号码及号码类型，后台呼通加入会议，结果通过JoinConfEx2Ack回调返回
 * @param agent_id
 * @param conf_id
 * @param conn
 * @param phoneNumber
 * @param numType
 * @constructor
 */
ucsCommon.prototype.JoinConfEx = async function (agent_id, conf_id, conn, phoneNumber, numType) {
  var requestHeader = this.setRequestHeader(1, 255, 276)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.conn = conn
  requestHeader.phoneNumber = phoneNumber
  requestHeader.numType = numType
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/joinConfEx', data).then(function (data) {

  })
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
ucsCommon.prototype.JoinConfEx3 = async function (agent_id, conf_id, conn, phoneNumber, numType, displayName) {
  if (Number(numType) < 8) {
    phoneNumber = this.TranslateNumber(phoneNumber)
  }
  var requestHeader = this.setRequestHeader(1, 255, 324)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.conn = conn
  requestHeader.phoneNumber = phoneNumber
  requestHeader.numType = numType
  requestHeader.displayName = displayName
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/joinConfEx3', data)// .then(function(data) {
  if (doRet.data.errorcode == 0) {
    console.log('已发起加入会议！')
  }
  return doRet
}

/**
 * 移出电话会议(请使用RemoveFromConfEx)
 * @remake 把一路话路从电话会议中移出
 * @param agent_id 发起会议的坐席id
 * @param conf_id 通道所在会议编号id
 * @param conn 话路通道的编号
 * @constructor
 */
ucsCommon.prototype.RemoveFromConf = async function (agent_id, conf_id, conn) {
  var requestHeader = this.setRequestHeader(1, 29, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.conn = conn
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/removeFromConf', data).then(function (data) {
    if (data.data.errorcode == 0) {
      console.log('已发起移出成员！')
    }
  })
}

/**
 * 电话会议移出成员
 * @param agent_id  1、int agent_id//坐席id
 * @param conf_id 2、,int conf_id,//会议id
 * @param conn 3、int conn,//通话标识
 * @param number 4、BSTR number,//成员号码
 * @constructor
 */
ucsCommon.prototype.RemoveFromConfEx = async function (agent_id, conf_id, conn, number, numberType) {
  if (String(numberType) === '1' && number.length >= 7) {
    number = await this.TranslateNumber(number)
  }
  var requestHeader = this.setRequestHeader(1, 255, 263)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.conn = conn
  requestHeader.number = number
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/removeFromConfEx', data)
  return doRet
}
/**
 * 查询电话会议成员
 * @param agent_id 发起会议的坐席id
 * @param conf_id 要查询的会议编号id
 * @constructor
 */
ucsCommon.prototype.RequestConfMember = async function (agent_id, conf_id) {
  var requestHeader = this.setRequestHeader(1, 34, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/requestConfMember', data)
  return doRet
}

/**
 * 查询已创建的电话会议
 * @param agent_id 发起会议的坐席id
 * @constructor
 */
ucsCommon.prototype.RequestConf = async function (agent_id) {
  var requestHeader = this.setRequestHeader(1, 32, 0)
  requestHeader.agent_id = agent_id
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/requestConf', data)
  return doRet
}

/**
 * 改变会议中线路状态(请改用OperateConfMemberEx)
 * @param agent_id 发起请求的坐席id
 * @param conf_id 电话会议标识id
 * @param conn 电话线路编号
 * @param member_type 成员状态1:只能说 2:只能听 3:可说可听
 * @constructor
 */
ucsCommon.prototype.OperateConfMember = async function (agent_id, conf_id, conn, member_type) {
  var requestHeader = this.setRequestHeader(1, 30, 0)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.conn = conn
  requestHeader.member_type = member_type
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/operateConfMember', data)
  return doRet
}

/**
 * 设置会议成员禁言/发言，执行结果通话OperateConfMemberExAck接口回调返回 278
 * @param agent_id 1、int agent_id= 会议所属坐席id
 * @param confId 2、int confId = 会议标识id
 * @param conn 3、int conn= 通话标识，暂无意义
 * @param type 4、int type=成员权限-----1、只能说2、只能听3、可说可听
 * @param phoneNumber 5、BSTR phoneNumber=成员号码
 * @constructor
 */
ucsCommon.prototype.OperateConfMemberEx = async function (agent_id, confId, conn, type, phoneNumber, numberType) {
  if (String(numberType) === '1' && phoneNumber.length >= 7) {
    phoneNumber = await this.TranslateNumber(phoneNumber)
  }
  var requestHeader = this.setRequestHeader(1, 255, 278)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = confId
  requestHeader.conn = conn
  requestHeader.type = type
  requestHeader.phoneNumber = phoneNumber
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/operateConfMemberEx', data)// .then(function(data) {
  if (doRet.data.errorcode == 0) {
    if (type == 2) {
      console.log('已发起会议成员禁言')
    } else if (type == 3) {
      console.log('已发起会议成员发言')
    }
  }
  return doRet
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
ucsCommon.prototype.SendFax = async function (case_id, opr_name, fax_number, fax_name, fax_file, fax_process_id, fax_id, fax_extend) {
  var requestHeader = this.setRequestHeader(1, 121, 0)
  requestHeader.case_id = case_id
  requestHeader.opr_name = opr_name
  requestHeader.fax_number = fax_number
  requestHeader.fax_name = fax_name
  requestHeader.fax_file = fax_file
  requestHeader.fax_process_id = fax_process_id
  requestHeader.fax_id = fax_id
  requestHeader.fax_extend = fax_extend
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  return doRet
}

/**
 * 请求把与坐席通话的通道转接到其他号码上
 * @param agent_id 发起操作的坐席id
 * @param mobile_to 转接的号码
 * @constructor
 */
ucsCommon.prototype.TransferCallOneKey = async function (agent_id, mobile_to) {
  const transNumber = await this.TranslateNumber(mobile_to)
  var requestHeader = this.setRequestHeader(1, 42, 0)
  requestHeader.agent_id = agent_id
  requestHeader.mobile_to = transNumber
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/transferCallOneKey', data)
  return doRet
}

/**
 * 在坐席通话过程中，加入第三方形成三方通话，系统后台自动呼叫第三方号码。
 * @param agent_id 发起操作的坐席id
 * @param callTag 坐席正在通话的通话标识
 * @param thirdNum 第三方的号码
 * @param numType 第三方号码的类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频。（默认传1，集群还需要现场才明白）
 * @constructor
 */
ucsCommon.prototype.ThreeWayConf = async function (agent_id, callTag, thirdNum, numType) {
  const transNumber = await this.TranslateNumber(thirdNum)
  var requestHeader = this.setRequestHeader(1, 255, 273)
  requestHeader.agent_id = agent_id
  requestHeader.callTag = callTag
  requestHeader.thirdNum = transNumber
  requestHeader.numType = numType
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/threeWayConf', data)
  return doRet
}

/**
 * 设置视频通话视频窗口
 * 设置视频会议、视频电话通话视频窗口
 * @param agent_id  int agent_id =操作的坐席id;
 * @param localHandle int localHandle=本端窗口句柄；
 * @param remoteHandle  int remoteHandle=远端窗口句柄；
 * @constructor
 */
ucsCommon.prototype.SetVideoWindow = async function (agent_id, localHandle, remoteHandle) {
  var requestHeader = this.setRequestHeader(1, 255, 280)
  requestHeader.agent_id = agent_id
  requestHeader.localHandle = localHandle
  requestHeader.remoteHandle = remoteHandle
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/setVideoWindow', data)
  return doRet
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
ucsCommon.prototype.ConfBoardCastMember = async function (agent_id, conf_id, mixType, phoneNum, isCannel) {
  var requestHeader = this.setRequestHeader(1, 255, 282)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.mixType = mixType
  requestHeader.phoneNumber = phoneNum
  requestHeader.isCannel = isCannel
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/confBoardCastMember', data)// .then(function(data) {
  if (doRet.data.errorcode == 0) {
    if (isCannel == 1) { console.log('已发起取消广播画面功能') } else if (isCannel == 0) { console.log('已发起广播画面功能') }
  } else {
    // console.log("发起广播画面功能 失败")
  }
  return doRet
}
/**
 *description 点名发言
 *@param agentId 坐席id
 * @param confId 会议id
 * @param floorSite 发言的会场
 *@author Ouyuqian
 *@date 2020/1/2
 */
ucsCommon.prototype.ConfSetFloorSite = async function (agentId, confId, floorSite) {
  var requestHeader = this.setRequestHeader(1, 255, 282)
  requestHeader.agent_id = agentId
  requestHeader.confId = confId
  requestHeader.site = floorSite
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/confSetFloorSite', data).then(function (data) {
    if (data.data.errorcode == 0) {
      console.log('已发起点名发言')
    }
  })
}

/**
 *description 设置主会场
 *@param agentId 坐席id
 * @param confId 会议id
 * @param chairSite 设为主席的会场
 *@author Ouyuqian
 *@date 2020/1/2
 */
ucsCommon.prototype.ConfSetChair = async function (agentId, confId, chairSite) {
  var requestHeader = this.setRequestHeader(1, 255, 282)
  requestHeader.agent_id = agentId
  requestHeader.confId = confId
  requestHeader.chairSite = chairSite
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/confSetFloorSite', data).then(function (data) {
    if (data.data.errorcode == 0) {
      console.log('已发起设置主席')
    }
  })
}

/**
 *description 取消会议主会场
 *@param agentId 坐席id
 * @param confId 会议id
 *@author Ouyuqian
 *@date 2020/1/2
 */
ucsCommon.prototype.ConfReleaseChair = async function (agentId, confId) {
  var requestHeader = this.setRequestHeader(1, 255, 282)
  requestHeader.agent_id = agentId
  requestHeader.confId = confId
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/confReleaseChair', data).then(function (data) {
    if (data.data.errorcode == 0) {
      console.log('已发起取消会议主席')
    }
  })
}

/**
 *description 会议重呼成员
 *@param agentId 坐席id
 * @param confId 会议id
 * @param sites 成员号码列表，逗号隔开
 *@author Ouyuqian
 *@date 2020/1/2
 */
ucsCommon.prototype.ConfReconnectSite = async function (agentId, confId, sites) {
  const siteList = !sites ? [] : sites.split(',')
  for (let i = 0; i < siteList.length; i++) {
    siteList[i] = await this.TranslateNumber(siteList[i])
  }
  var requestHeader = this.setRequestHeader(1, 255, 282)
  requestHeader.agent_id = agentId
  requestHeader.confId = confId
  requestHeader.sites = siteList.join(',')
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/confReconnectSite', data)
  if (doRet.data.errorcode == 0) {
    console.log('已发起重呼')
  }
  return doRet
}
/**
 * 选看视频会议成员画面，可同时预览多个成员画面，最多16个
 * @param agent_id 坐席id
 * @param conf_id 会议ID
 * @param mixType 广播画面模式，1-单画面,4-均分4画面,9-均分9画面，16-均分16画面
 * @param phoneNum 成员号码列表，以逗号分隔,最多16个
 * @constructor
 */
ucsCommon.prototype.ConfWatchMember = async function (agent_id, conf_id, mixType, phoneNum) {
  var requestHeader = this.setRequestHeader(1, 255, 284)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.mixType = mixType
  requestHeader.phoneNum = phoneNum
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/confWatchMember', data)
  return doRet
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
ucsCommon.prototype.ICPQueryGroupInfo = async function (agent_id, iType, iPageIndex, iPageSize, group_id) {
  var requestHeader = this.setRequestHeader(1, 255, 286)
  requestHeader.agent_id = agent_id
  requestHeader.iType = iType
  requestHeader.iPageIndex = iPageIndex
  requestHeader.iPageSize = iPageSize
  requestHeader.group_id = group_id
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {

  })
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
ucsCommon.prototype.ICPQueryDeviceInfo = async function (agent_id, iType, iPageIndex, iPageSize, group_id, devName) {
  var requestHeader = this.setRequestHeader(1, 255, 288)
  requestHeader.agent_id = agent_id
  requestHeader.iType = iType
  requestHeader.iPageIndex = iPageIndex
  requestHeader.iPageSize = iPageSize
  requestHeader.group_id = group_id
  requestHeader.devName = devName
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {
    if (data.data.errorcode == 0) {
      typeof call === 'function' && call(data)
      console.log('已发起视频预览！')
    }
  })
}

/**
 * 根据摄像头号码，在指定窗口预览视频
 * @param agent_id 坐席id
 * @param iType 设备类型 0摄像机，1eLET
 * @param devName 设备号码
 * @param windowHandle 预览窗口句柄
 * @constructor
 */
ucsCommon.prototype.ICPStartRealPlay = async function (agent_id, iType, devName, windowHandle, iX, iY, iWidth, iHeight) {
  if (!this.isAgentLoginSuccess) { return this.GetUnLoginResPonse() };

  var requestHeader = this.setRequestHeader(1, 255, 290)
  requestHeader.agent_id = agent_id
  requestHeader.iType = iType
  requestHeader.devName = devName
  requestHeader.windowHandle = windowHandle
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  if (doRet.data.errorcode == 0) {
    console.log('已发起视频预览！')
  }
  return doRet
}

/**
 * 停止播放视频
 * @param agent_id 坐席id
 * @param iType 设备类型 0摄像机，1eLET
 * @param playHandle 播放句柄
 * @constructor
 */
ucsCommon.prototype.ICPStopRealPlay = async function (agent_id, iType, playHandle) {
  var requestHeader = this.setRequestHeader(1, 255, 292)
  requestHeader.agent_id = agent_id
  requestHeader.iType = iType
  requestHeader.playHandle = playHandle
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  return doRet
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
ucsCommon.prototype.ICPPTZDevice = async function (agent_id, vcnId, devNum, ptzCommand, speed, multiple, isStop) {
  var requestHeader = this.setRequestHeader(1, 255, 296)
  requestHeader.agent_id = agent_id
  requestHeader.vcnId = vcnId
  requestHeader.devNum = devNum
  requestHeader.ptzCommand = ptzCommand
  requestHeader.speed = speed
  requestHeader.multiple = multiple
  requestHeader.isStop = isStop
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  return doRet
}

/**
 * 监控入会，目前只能添加摄像机
 * @param agent_id
 * @param iType 设备类型 0摄像机，1eLET
 * @param conf_id 会议id
 * @param devName 设备号码
 * @constructor
 */
ucsCommon.prototype.ConfAddDevice = async function (agent_id, iType, conf_id, devName) {
  var requestHeader = this.setRequestHeader(1, 255, 294)
  requestHeader.agent_id = agent_id
  requestHeader.iType = iType
  requestHeader.conf_id = conf_id
  requestHeader.devName = devName
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  return doRet
}

/**
 * 应答通话，话机摘机应答
 * @param agent_id
 * @param conn 通话标识
 * @param isVideo 是否视频应答
 * @constructor
 */
ucsCommon.prototype.AnswerCall = async function (agent_id, conn, isVideo) {
  var requestHeader = this.setRequestHeader(1, 255, 298)
  requestHeader.agent_id = agent_id
  requestHeader.conn = conn
  requestHeader.isVideo = isVideo
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/answerCall', data)

  return doRet
}

/**
 * 订阅无线集群群组
 * @param agent_id
 * @param expire 订阅时间
 * @param groupName 群组名称
 * @constructor
 */
ucsCommon.prototype.TalkingGroupSubcribe = async function (agent_id, expire, groupName) {
  var requestHeader = this.setRequestHeader(1, 255, 300)
  requestHeader.agent_id = agent_id
  requestHeader.expire = expire
  requestHeader.groupName = groupName
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  if (doRet.data.errorcode == 0) {
    console.log('已发起订阅无线集群群组！')
  }
  return doRet
}

/**
 * 监听无线集群群组
 * @param agent_id
 * @param groupName 群组名称
 * @param isMonitor 是否开始监听，1开始监听，0停止监听
 * @param isAutoSubcribe 是否自动处理订阅，1是，0否，默认1
 * @constructor
 */
ucsCommon.prototype.TalkingGroupMonitor = async function (agent_id, groupName, isMonitor, isAutoSubcribe) {
  var requestHeader = this.setRequestHeader(1, 255, 302)
  requestHeader.agent_id = agent_id
  requestHeader.groupName = groupName
  requestHeader.isMonitor = isMonitor
  requestHeader.isAutoSubcribe = isAutoSubcribe
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  if (doRet.data.errorcode == 0) {
    if (isMonitor == 1) {
      console.log('已发起开始监听无线集群群组！')
      TalkingGroupSelect(agent_id, groupName, 1)
    } else if (isMonitor == 0) {
      console.log('已发起停止监听无线集群群组！')
    }
  }
  return doRet
}

/**
 * 选中/监听无线集群群组切换
 * @param agent_id
 * @param groupName 群组名称
 * @param isSelect 是否选中，1选中，0取消选中
 * @constructor
 */
ucsCommon.prototype.TalkingGroupSelect = async function (agent_id, groupName, isSelect) {
  var requestHeader = this.setRequestHeader(1, 255, 304)
  requestHeader.agent_id = agent_id
  requestHeader.groupName = groupName
  requestHeader.isSelect = isSelect
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  if (doRet.data.errorcode == 0) {
    if (isSelect == 1) {
      //   console.log('已选中无线集群群组！');
    } else if (isSelect == 0) {
    //  console.log("已取消选中无线集群群组！");
    }
  }
  return doRet
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
ucsCommon.prototype.TalkingGroupPTT = async function (agent_id, groupName, isPTT) {
  var requestHeader = this.setRequestHeader(1, 255, 306)
  requestHeader.agent_id = agent_id
  requestHeader.groupName = groupName
  requestHeader.isPTT = isPTT
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
  return doRet
}

/**
 * 发起混编/临时混编呼叫接口
 * @param agent_id 坐席id
 * @param groupNum 群组号码
 * @param groupName 群组名称
 * @constructor
 */
ucsCommon.prototype.MixedGroupCall = async function (agent_id, groupNum, groupName) {
  var requestHeader = this.setRequestHeader(1, 255, 308)
  requestHeader.agent_id = agent_id
  requestHeader.groupNum = groupNum
  requestHeader.groupName = groupName
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  return await axios.post(this.ucsServerUrl + '/ucs/communication/mixedGroupCall', data)// .then((data)=>{
}

/**
 * 坐席接受/拒绝加入会议邀请,isAccept值为1接受，0拒绝
 * @param agent_id 坐席id
 * @param conf_id 会议id
 * @param isAccept 是否接受邀请，1接受，0拒绝
 * @param confNumber 会议号码，可为空
 * @constructor
 */
ucsCommon.prototype.ConfAcceptInvite = async function (agent_id, conf_id, isAccept, confNumber) {
  var requestHeader = this.setRequestHeader(1, 255, 311)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  requestHeader.isAccept = isAccept
  requestHeader.confNumber = confNumber
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/confAcceptInvite', data)
  return doRet
}

/**
 * 代接正在振铃的坐席的来电
 * @param agent_id 坐席id
 * @param conn 正在通话的通话ID（备用）
 * @param agentTag 代接的坐席工号,
 * @param agentNum 代接的坐席号码
 * @constructor
 */
ucsCommon.prototype.SnatchPickup = async function (agent_id, conn, agentTag, agentNum) {
  var requestHeader = this.setRequestHeader(1, 255, 314)
  requestHeader.agent_id = agent_id
  requestHeader.conn = conn
  requestHeader.agentTag = agentTag
  requestHeader.agentNum = agentNum
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/snatchPickup', data)
  return doRet
}

/**
 * 视频会议启动/停止辅流
 * @param agent_id 坐席id
 * @param confId 会议id
 * @param isStart 是否启动，1启动，0停止
 * @constructor
 */
ucsCommon.prototype.ConfStartData = async function (agent_id, confId, isStart) {
  var requestHeader = this.setRequestHeader(1, 255, 316)
  requestHeader.agent_id = agent_id
  requestHeader.confId = confId
  requestHeader.isStart = isStart
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/confStartData', data)
  return doRet
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
ucsCommon.prototype.ConfSetVideoSource = async function (agent_id, confId, isLock, dstMember, srcMember) {
  var requestHeader = this.setRequestHeader(1, 255, 318)
  requestHeader.agent_id = agent_id
  requestHeader.confId = confId
  requestHeader.isLock = isLock
  requestHeader.dstMember = dstMember
  requestHeader.srcMember = srcMember
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  return await axios.post(this.ucsServerUrl + '/ucs/communication/confSetVideoSource', data)
}

/**
 * 黑名单管理，可1添加，0删除,2清空
 * @param agent_id 坐席id
 * @param phoneNumber 号码列表，以逗号隔开，最多支持32个21个数字的号码串
 * @param iControl 控制命令，1添加，0删除,2清空
 * @constructor
 */
ucsCommon.prototype.OperateBlackList = async function (agent_id, phoneNumber, iControl) {
  var requestHeader = this.setRequestHeader(1, 255, 320)
  requestHeader.agent_id = agent_id
  requestHeader.phoneNumber = phoneNumber
  requestHeader.iControl = iControl
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  return await axios.post(this.ucsServerUrl + '/ucs/communication/operateBlackList', data)
}

/**
 * 坐席二次拨号，可多次调用，需间隔一秒以上
 * @param agent_id 坐席id
 * @param dtmfNum 二次拨号号码
 * @constructor
 */
ucsCommon.prototype.AgentSendDtmf = async function (agent_id, dtmfNum) {
  var requestHeader = this.setRequestHeader(1, 255, 322)
  requestHeader.agent_id = agent_id
  requestHeader.dtmfNum = dtmfNum
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  return await axios.post(this.ucsServerUrl + '/ucs/communication/agentSendDtmf', data)
}

/**
 * 坐席重新加入会议
 * @remake 一般情况下，坐席掉线但是会议没有结束的情况下，调用次接口重新加入会议
 * @param agent_id 发起操作的坐席id
 * @param conf_id 会议id
 * @constructor
 */
ucsCommon.prototype.AgentAccessConf = async function (agent_id, conf_id) {
  var requestHeader = this.setRequestHeader(1, 255, 326)
  requestHeader.agent_id = agent_id
  requestHeader.conf_id = conf_id
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  return await axios.post(this.ucsServerUrl + '/ucs/communication/agentAccessConf', data)
}

/**
 * 传真合并
 * @param path 传真文件远程路径（多个用“;”分隔）
 * @constructor
 */
ucsCommon.prototype.FaxMerge = async function (path) {
  var requestHeader = this.setRequestHeader(1, 255, 339)
  requestHeader.path = path
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {

  })
}

/**
 * 传真拆分
 * @param path 传真文件远程路径（多个用“;”分隔）
 * @constructor
 */
ucsCommon.prototype.FaxSplit = async function (path) {
  var requestHeader = this.setRequestHeader(1, 255, 341)
  requestHeader.path = path
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/send', data).then(function (data) {

  })
}
ucsCommon.prototype.FaxScan = async function (path) {
  var requestHeader = this.setRequestHeader(1, 255, 343)
  requestHeader.path = path
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
}

/**
 * 号码变换
 * @param number
 * @returns {Promise<*>}
 * @constructor
 */
ucsCommon.prototype.TranslateNumber = async function (number) {
  if (number.length <= 8) {
    return number
  }

  let transNum = this.transferNumList.get(number)
  if (transNum) {
    return transNum
  } else {
    const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/phone/validateNumber?number=' + number + '&agentId=' + this.MQMyCode)
    transNum = doRet.status == 200 ? doRet.data.data : number
    this.transferNumList.set(number, transNum)
    if (number != transNum) {
      this.transferNumList.set(transNum, number)
    }

    return transNum
  }
}

/**
 * 号码还原
 * @param number
 * @returns {Promise<*>}
 * @constructor
 */
ucsCommon.prototype.ReverseNumber = async function (number) {
  if (!number && number.length <= 8) {
    return number
  }
  let transNum = this.transferNumList.get(number)
  if (transNum) {
    return transNum
  } else {
    const doRet = await axios.post(this.ucsServerUrl + '/ucs/communication/phone/reverseValidatedNumber?number=' + number + '&agentId=' + this.MQMyCode)
    transNum = doRet.status == 200 ? doRet.data.data : number
    this.transferNumList.set(number, transNum)
    return transNum
  }
}

/**
 * 重连mq成功，内部接口
 * @constructor
 */
ucsCommon.prototype.ReconnectMQSuccess = function () {
  this.AgentLogin(this.user, '', '', this.agentId, this.agentId)
}

/**
* 大牛视频流播放接口
* @param rtmpUrl
* @param resoureName
* @returns {*}
* @constructor
*/
ucsCommon.prototype.StartRealPlay_Daniu = async function (rtmpUrl, resoureName) {
  var requestHeader = this.setRequestHeader(1, 255, 270)
  requestHeader.dataBuf = {
    CmdType: 'StartRealPlayByDaniu',
    CmdBuf: { rtmpUrl: rtmpUrl, resoureName: resoureName }
  }
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  return await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
}
/**
* 订阅设备状态 328
* @param users 终端号码，可拼接32个长度不超过21个数字的号码列表，以逗号隔开
* @returns {*}
* @constructor
*/
ucsCommon.prototype.DetectUserInfo = async function (users) {
  var requestHeader = this.setRequestHeader(1, 255, 328)
  requestHeader.agent_id = agent_id
  requestHeader.users = users
  var data = {
    data: {
      topicName: this.MQMyCode,
      text: requestHeader
    }
  }
  return await axios.post(this.ucsServerUrl + '/ucs/communication/send', data)
}
/**
 * 获取系统当前时间
 */
ucsCommon.prototype.getTime = async function () {
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

//
export default {
  ucsCommon
}
