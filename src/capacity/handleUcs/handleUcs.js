// name EL
// conferenceList 优先拿到  conferenceListState通过websoket获取会有所延时
// 发起会议者对参会人员的参数进行处理
// 处理时间的显示
import ucsApi from './ucsApi' // 引入ucsApi
// import store from '@/project/demo/store'
/*
    // 会操作到meetingList 会议人员列表的方法{
        初始化 ucs
        禁言
        踢人
        重呼
        创建会议 CreateConfEx('8001','8001|*|坐席,13590014862|*|手机','8,5')
        加入会议
        结束会议
    }
    // 会操作到 ClickToCall 的方法
    点呼

    // 纯操作方法
    广播
    查询摄像头状态
    控制摄像头

    // 待测试方法
    会议保护，会议恢复、重连
    会议恢复重连后重新呼叫成员
*/
class handleUcs{
  constructor(){
    this.store = ''
  }
  // 初始化
  InitSDK (store,ucsServer, listenMQServer, userCode, agentCode,agentId, isFirstLogin, logCallBack) {
    // console.log(store);
    this.store = store
    this.store.commit('meeting/agentId', agentId)
    this.store.commit('meeting/agentName', userCode)
    this.store.commit('meeting/agentCode', agentCode)
    ucsApi.InitSDK(ucsServer, listenMQServer, userCode, agentCode, isFirstLogin, logCallBack,this.store)
  }
  // 登录agent
  AgentLogin (user, passwd, license, agent_id1, agent_id2, token, userId, operatorId) {
    ucsApi.AgentLogin(user, passwd, license, agent_id1, agent_id2, token, userId, operatorId)
  }
  // 创建会议
  CreateConfEx (agent_id, memberNum, numType, winLocation) {
    // 设置会议列表
    if (memberNum) {
      if (memberNum.split(',').length > 1) {
        const arrOpention = memberNum.split(',')
        const arr = []
        const typeArray = numType.split(',')
        arrOpention.forEach(ele => {
          arr.push(ele.split('|*|'))
        })
        const obj = {}
        arr.forEach((ele, index) => {
          obj[ele[0]] = {
            name: ele[1], // 名字
            phone: ele[0], // 电话号码 或 设备编码
            conn: '', // 通话标识 callTag
            status: 3, // 当前状态 3 呼叫中 5呼叫成功 0呼叫失败
            mute: 1, // 1发言   0 禁言
            type: Number(typeArray[index]), // 终端类型
            callflag: false // 是否接听过 判断是 离开会议 还是 呼叫失败
          }
        })
        this.store.commit('meeting/meetingList', obj)
      }
    }
    ucsApi.CreateConfEx(agent_id, memberNum, String(numType), winLocation)
  }
  // 禁言
  OperateConfMemberEx (agent_id, confId, conn, type, phoneNumber, numberType) {
    // type Number 5 是禁言 6是发言
    // phoneNumber string 多个人禁言时用,把号码链接起来 "6001,0755010008,0755010010,075501202,0755060011"
    ucsApi.OperateConfMemberEx(agent_id, confId, conn, type, phoneNumber, numberType)
  }
  // 踢人
  RemoveFromConfEx (agent_id, conf_id, conn, number, numberType) {
    ucsApi.RemoveFromConfEx(agent_id, conf_id, conn, number, numberType)
  }
  // 重呼
  ConfReconnectSite (agentId, confId, sites) {
    ucsApi.ConfReconnectSite(agentId, confId, sites)
  }
  // 加入会议
  addMeetingDel (agentId, meetingId, phone, type, name) {
    if (this.store.state.meeting.meetingId) {
      const obj = JSON.parse(JSON.stringify(store.state.meeting.meetingList))
      // 查看会议列表中有没有这号码 有就不处理
      if (!obj[String(phone)]) {
        obj[String(phone)] = {
          name: (name || phone.toString()), // 名字
          phone, // 电话号码 或 设备编码
          conn: '', // 通话标识 callTag
          status: 3, // 当前状态 3 呼叫中 5呼叫成功 0呼叫失败
          mute: 1, // 1发言   0 禁言
          type: Number(type), // 终端类型
          callflag: false // 是否接听过 判断是 离开会议 还是 呼叫失败
        }
        this.JoinConfEx3(agentId, meetingId, '', Number(phone), Number(type), (name || phone.toString()))
        this.store.commit('meeting/meetingList', obj)
      }
    }
  }
  // 批量加入会议
  batchAddMeeting (agentId, meetingId, array) {
    if (agentId && meetingId && array && Array.isArray(array)) {
      array.forEach(ele => {
        this.addMeetingDel(agentId, meetingId, ele.phone, ele.type, ele.name)
      })
    }
  }
  // 结束会议
  DeleteConf (agent_id, conf_id) {
    ucsApi.DeleteConf(Number(agent_id), Number(conf_id))
  }
  // 查询摄像头状态
  /**
     * @Description: el
     * @Date: 2020-11-26 10:42:14
     * @param {*} agent_id // 坐席id
     * @param {*} users // 设备编码Code
     * @description:
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
  DetectUserInfo (agent_id, code) {
    ucsApi.DetectUserInfo(agent_id, code)
  }
  // 广播
  /**
     * @Description: el
     * @Date: 2020-11-25 17:30:23
     * @param {*} agent_id
     * @param {*} conf_id
     * @param {*}  mixType int 广播画面模式，1单画面,4均分4画面,9均分9画面，16均分16画面
     * @param phoneNum String 成员号码列表，以逗号分隔，最大16个
     * @param isCannel int 是否取消广播，0否，1取消
     * @description:
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
  ConfBoardCastMember (agent_id, conf_id, mixType, phoneNum, isCannel) {
    ucsApi.ConfBoardCastMember(agent_id, conf_id, mixType, phoneNum, isCannel)
  }
  // 点呼/呼叫
  // iddcode 坐席号码
  // param_1 呼叫外带自定义参数，会在历史记录中传入，可选 一般为''
  // numType 号码类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频电话
  MakeCallEx (agent_id, phone, iddcode, param_1, type, name) {
    ucsApi.MakeCallEx(agent_id, phone, iddcode, param_1, type)
    const obj = {
      name,
      phone,
      type
    }
    this.store.commit('meeting/ClickToCall', obj)
  }
  // 控制摄像头
  /**
     * @Description: el
     * @Date: 2020-11-25 17:08:19
     * @param {*} agent_id 坐席id
     * @param {*} vcnId 所属VCN的设备编码 一般为空 ''
     * @param {*} devNum 设备号码
     * @param {*} ptzCommand  调焦 缩小3   放大2
     * @param {*} speed 控制速率--speed是控制的速率，范围是1~10 一般为5
     * @param {*} multiple 放大倍数，范围是1~10
     * @param {*} isStop 是否停止操作,0操作，1停止操作,每个控制指令需要调用一次停止操作
     * @description:
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
  ICPPTZDevice (agent_id, vcnId, devNum, ptzCommand, speed, multiple, isStop) {
    ucsApi.ICPPTZDevice(agent_id, vcnId, devNum, ptzCommand, speed, multiple, isStop)
  }
  // 会议保护，会议恢复、重连
  reStartUcsRequestConf (agentId) {
    const myVdcConfId = localStorage.getItem('setConfId')
    console.log(`获取保存在localstorage中的会议id:${myVdcConfId}`)
    const setupConferencingData = JSON.parse(localStorage.getItem('setupConferencingData'))// 获取开会时保存的所有人员数据
    console.log(`上一次开会时保存的所有人员数据：${setupConferencingData}`)
    // 1、查询现有会议
    ucsApi.RequestConf(agentId).then((res) => {
      if (res.data.errorcode == 0) {
        console.log('查询现有会议')
        return ucsApi.RequestConfMember(Number(agentId), myVdcConfId)
      } else {
        console.log('未召开会议')
      }
    }).then((response) => {
      console.log(`会议的人员查询的返回数据：${response}`)
      console.log(`会议人员查询的详情数据:${localStorage.getItem('meetingMenbersData')}`)
      this.reCallAllMenber(agentId, myVdcConfId, setupConferencingData)
    })
  }
  // 会议恢复重连后重新呼叫成员
  reCallAllMenber (agent_id, myVdcConfId, setupConferencingData) {
    if (!setupConferencingData) { return }
    let str = ''
    for (let i = 0; i < setupConferencingData.length; i++) {
      str += setupConferencingData[i].phoneNum
      if (i != setupConferencingData.length - 1) {
        str += ','
      }
    }
    console.log(str)
    ucsApi.ConfReconnectSite(agent_id, myVdcConfId, str)
      .then(data => {
        console.log('开始重新呼叫所有会议人员')
        console.log(data)
        if (!data.data.errorcode == 0) {
          console.log('重呼失败')
        } else {
          console.log('重呼成功')
        }
      })
  }
}

export default handleUcs
