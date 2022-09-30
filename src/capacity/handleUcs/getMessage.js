/*
 * @Author: el
 * @Date: 2020-11-26 09:21:15
 * @LastEditTime: 2021-03-16 14:06:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \exhibition\src\assets\js\handleUcs\getMessage.js
 */
var store = {}
/*
    在ucsConnect.js 中使用 getActualTimeMessage 获取到实时的ucs通讯信息
    不在ucs的代码中进行任何逻辑性操作，只从其中拿到实时的消息
    建立项目独立的消息机制，降低耦合和依赖
*/
function getActualTimeMessage(message, store) {
  store = store
  console.log(store);
  console.log('message:', message)
  if (message.cmd.SubCmd === '255' || message.cmd.SubCmd === 255) {
    switch (String(message.cmd.Tag)) {
      case '270': {
        break
      }
      case '274': {
        // 三方通话请求结果返回
        break
      }
      case '272': {
        // 创建音视频会议结果
        createMeeting(message)
        break
      }
      case '277': {
        // 加入会议接口回调
        break
      }
      case '275': {
        // 会议成员状态返回
        getAllconfListDel(message)
        break
      }
      case '264': {
        // 电话会议移出成员结果返回
        kickout(message)
        break
      }
      case '279': {
        // 设置会议成员禁言/发言 返回结果
        forbiddenWords(message)
        break
      }
      case '281': {
        // 设置视频会议、视频电话通话视频窗口结果返回
        break
      }
      case '283': {
        // 广播/取消广播调用接口结果返回
        break
      }
      case '285': {
        // 选看视频会议成员画面结果
        break
      }
      case '287': {
        // 查询资源分组结果返回
        break
      }
      case '289': {
        // 查询设备信息结果返回
        break
      }
      case '291': {
        // 预览摄像头视频结果返回
        break
      }
      case '293': {
        // 停止播放视频结果
        break
      }
      case '297': {
        // 云台控制结果返回
        break
      }
      case '295': {
        // 监控入会结果返回
        break
      }
      case '299': {
        // 应答结果返回
        break
      }
      case '301': {
        // 订阅无线集群群组结果
        break
      }
      case '303': {
        // 监听无线集群群组结果返回
        break
      }
      case '305': {
        // 选中/监听无线集群群组切换结果
        break
      }
      case '307': {
        // 无线集群群组抢权/放权操作结果
        break
      }
      case '309': {
        // 发起混编/临时混编呼叫结果返回
        break
      }
      case '310': {
        // 邀请坐席加入会议通知
        break
      }
      case '312': {
        // 坐席接受/拒绝加入会议邀请操作结果返回
        break
      }
      case '313': {
        // 通话过程中，自动语音识别结果返回
        break
      }
      case '315': {
        // 代接正在振铃的坐席的来电结果返回
        break
      }
      case '317': {
        // 视频会议启动/停止辅流结果通知
        break
      }
      case '319': {
        // 设置一个与会者成员选看另一个与会者成员/锁定视频源结果通知
        break
      }
      case '321': {
        // 黑名单管理结果返回
        break
      }
      case '323': {
        // 坐席二次拨号结果返回
        break
      }
      case '325': {
        // 加入会议接口回调返回
        break
      }
      case '327': {
        // 坐席重新加入会议结果返回
        break
      }
      case '330': {
        // 终端状态信息返回
        break
      }
      case '338': {
        // 重呼成员返回
        Recall(message)
        break
      }
      case '340': {
        // 传真合并结果
        break
      }
      case '342': {
        // 传真拆分结果
        break
      }
      case '344': {
        // 传真扫描
        break
      }
      case '345':
        {
          // 移动终端GIS上报事件
          break
        }
      default:
        break
    }
  } else {
    switch (String(message.cmd.SubCmd)) {
      case '2': {
        break
      }
      case '6': {
        MakeCallAck(message)
        break
      }
      case '17': {
        break
      }
      case '18': {
        break
      }
      case '19': {
        break
      }
      case '25': {
        break
      }
      case '31': {
        // 结束会议
        leaveTheChair(message)
        break
      }
      case '27': {
        break
      }
      case '35': {
        break
      }
      case '3': {
        break
      }
      case '15': {
        break
      }
      case '13': {
        BroadcastCallOffered(message)
        break
      }
      case '122': {
        break
      }
      case '120': {
        break
      }
      case '41': {
        break
      }
      case '43': {
        break
      }
      case '229': {
        break
      } case '33':
        {
          break
        }
      default:
        break
    }
  }


  // 获取会议人员状态
  function getAllconfListDel(data) {
    // obj[key].conn = data['callTag']       // 通话标识 callTag
    // obj[key].status = data['status']      // 当前状态 3 呼叫中 5呼叫成功 0呼叫失败
    // obj[key].callflag = true              // 表示接听过
    const strCode = `obj[key].conn = data['callTag'];
            obj[key].status = data['status'];
            if(data['status']!=0&&data['status']!=3){
                obj[key].callflag = true;
            }`
    ifPhoneAndCodeIsTrue(data, strCode, 'memberNum')
  }

  // 踢人
  function kickout(data) {
    const strCode = 'delete obj[key]'
    ifPhoneAndCodeIsTrue(data, strCode, 'number')
  }

  // 设置禁言
  function forbiddenWords(data) {
    let strCode = 'obj[key][\'mute\'] = 0'
    if (data.result == 0) {
      if (data.type == 3) { // 2是禁言  3是发言
        strCode = 'obj[key][\'mute\'] = 1'
      }
    }
    ifPhoneAndCodeIsTrue(data, strCode, 'phoneNumber')
  }

  // 重呼成员返回
  function Recall(data) {
    const strCode = 'obj[key][\'status\'] = 3'
    ifPhoneAndCodeIsTrue(data, strCode, 'sites')
  }

  // 结束会议
  function leaveTheChair(data) {
    console.log('结束会议', data);
    // console.log(store);
    store.commit('meeting/meetingList', {})
    store.commit('meeting/meetingId', '') // 设置会议Id
  }

  // 点呼 呼叫的状态
  function MakeCallAck(data) {
    if (data.status == 0) {
      setClickToCallState(0, '呼叫成功！')
      store.commit('meeting/callAudioOrVideoFlag', true) // 设置点呼状态
      store.commit('meeting/timeRecording', new Date().getTime()) // 记录接通时的毫秒数
      // console.log(store);
    } else if (data.status == 1) {
      if (data.cause == 63000) {
        setClickToCallState(1, '已停止呼叫！')
      } else if (data.cause == 61007) {
        setClickToCallState(1, '对方已拒接！')
      } else if (data.cause == 61005) {
        setClickToCallState(1, '被叫无应答！')
      } else if (data.cause == 61003) {
        setClickToCallState(1, '被叫号码不存在！')
      } else {
        setClickToCallState(1, '被叫无应答！')
      }
      store.commit('meeting/callAudioOrVideoFlag', false) // 设置点呼状态
    } else if (data.status == -1) {
      setClickToCallState(1, '呼叫失败！')
      store.commit('meeting/callAudioOrVideoFlag', false) // 设置点呼状态
    }
  }
  // 设置点呼状态
  function setClickToCallState(code, str) {
    const obj = {
      stateCode: code,
      stateStr: str
    }
    store.commit('meeting/ClickToCallState', obj) // 设置点呼状态
  }

  // 点呼 结束或其他状态
  function BroadcastCallOffered(data) {
    if (data.conn) {
      store.commit('meeting/callAudioOrVideoFlag', false) // 设置点呼状态
    }
    if (data.status == 0) {
      console.log('通话状态：消失！')
      if (data.calling.length == 12 && data.calling[0] == '0') {

      } else {

      }
      if (data.called.length == 12 && data.called[0] == '0') {

      } else {

      }
    } else if (data.status == 1) {
      // console.log('通话状态：保持中！');
    } else if (data.status == 2) {
      // console.log('通话状态：呼出通话中！');
    } else if (data.status == 3) {
      // console.log('通话状态：呼入通话中！');
    } else if (data.status == 4) {
      // console.log('通话状态：呼出中！');
      if (data.called) {
        if (data.called.length == 12 && data.called[0] == '0') {

        } else {

        }
      }
    }
  }

  // 创建会议成功或失败
  function createMeeting(data) {
    if (data.confId <= 0) {
      console.log('创建音视频会议失败！')
    } else {
      store.commit('meeting/meetingId', data.confId)
      localStorage.setItem('setConfId', data.confId) // 为会议保护进行数据存储
      store.commit('meeting/timeRecording', new Date().getTime()) // 记录接通时的毫秒数
      console.log('创建音视频会议成功！')
    }
  }

  // 找到列表中对应的号码
  /**
   * @Description: el
   * @Date: 2020-11-26 14:09:40
   * @param {*} data      对应的数据
   * @param {*} strCode   要运行的字符串代码
   * @param {*} condition 用哪个号码作为判断条件
   * @description:
   * @LastEditors: Seven
   * @LastEditTime: Do not edit
   */
  function ifPhoneAndCodeIsTrue(data, strCode, condition) {
    if (data) {
      // console.log(data)
      const obj = JSON.parse(JSON.stringify(store.state.meeting.meetingList))
      if (data) {
        // 查看会议列表中有没有这个人 没有就不处理
        for (const key in obj) {
          // 查看返回的号码有没有中包含 key 这个值，并且判断它的长度 以防是在前面加 90 或者 是不需要加 90 的号码
          if (
            (data[condition].indexOf(key) && data[condition].length <= (key.length + 2)) ||
            obj[data[condition]]
          ) {
            eval(strCode)
          }
        }
      }
      store.commit('meeting/meetingList', obj)
    }
  }
}
export default getActualTimeMessage
