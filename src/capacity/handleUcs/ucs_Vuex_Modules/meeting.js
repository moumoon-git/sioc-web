/*
 * @Author: el
 * @Date: 2020-11-24 09:10:04
 * @LastEditTime: 2021-03-11 13:58:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \exhibition\src\store\modules\metting.js
 */

export default {
  namespaced: true,
  state: {
    // 会议
    // 坐席ID/坐席号和坐席名在初始化ucs的时候会进行赋值
    agentCode: '', // 坐席号
    agentId: '', // 坐席ID
    agentName: '', // 坐席名
    // 会议ID在会议创建成功时会进行赋值
    meetingId: '', // 会议ID 会议召开时会有会议ID 结束时为初始状态 ''
    // 会议列表
    meetingList: {
      // '13800138000':{
      //     name,           // 名字
      //     phone,          // 电话号码 或 设备编码
      //     conn: '',       // 通话标识 callTag
      //     status: 3,      // 当前状态 3 呼叫中 5呼叫成功 0呼叫失败
      //     mute: 1,        // 1发言   0 禁言
      //     type,           // 终端类型
      //     callflag:false, // 是否接听过 判断是 离开会议 还是 呼叫失败
      // },
      // ...object
    },
    meetingListArray: [], // 渲染会议列表用的数据 人员状态改变也会改变这个

    // 点呼
    ClickToCall: {
      // name,
      // phone,
      // type
    }, // 点呼的数据
    callAudioOrVideoFlag: false, // 点呼状态
    ClickToCallState: {
      // stateCode 状态码 0 成功 1失败
      // stateStr  状态字符串
    },

    // 公用
    timeRecording: '' // 记录接通时的毫秒数
  },
  mutations: {
    // 会议ID
    meetingId (state, val) {
      state.meetingId = val
    },
    // 坐席ID/坐席号和坐席名在初始化ucs的时候会进行赋值
    agentId (state, val) {
      state.agentId = val
    },
    // 坐席号
    agentCode (state, val) {
      state.agentCode = val
    },
    // 坐席名
    agentName (state, val) {
      state.agentName = val
    },
    // 设置坐席的基本参数
    setAgentOption (state, val) {
      state.meetingId = val.meetingId // 会议ID
      state.agentCode = val.agentCode // 坐席号
      state.agentId = val.agentId // 坐席ID
      state.agentName = val.agentName // 坐席名
    },
    // 会议列表
    meetingList (state, val) {
      const arr = []
      if (val) {
        for (const key in val) {
          val[key].phoneNum = key // 源号码
          arr.push(val[key])
        }
      }
      state.meetingListArray = arr
      state.meetingList = val
      localStorage.setItem('setupConferencingData', JSON.stringify(arr))
    },
    // 记录接通时的毫秒数
    timeRecording (state, val) {
      state.timeRecording = val
    },
    // 点呼的数据
    ClickToCall (state, val) {
      state.ClickToCall = val
    },
    // 点呼状态
    callAudioOrVideoFlag (state, val) {
      state.callAudioOrVideoFlag = val
    },
    // 点呼状态码
    ClickToCallState (state, val) {
      state.ClickToCallState = val
    }
  },
  actions: {},
  getters: {}
}
