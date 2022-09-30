/**
 * @author xrw
 * @date 2019/11/29
 * @description 融合通讯服务的主动推送回调函数
 */

/**
 * 三方通话请求结果返回 274
 * @remake 4.1.3.7版本，ret返回的是错误原因，4.1.3.8版本开始，ret返回-1为失败，大于0代码成功，返回的是会议ID
 * @param data: 1、agent_id=发起操作的坐席id
 2、long callTag= 坐席正在通话的通话标识
 3、BSTR thirdNum =第三方的号码
 4、long numType =第三方号码的类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频。
 （默认传1，集群还需要现场才明白）
 5、long iRet=请求结果，0成功，非0失败，为失败原因
 * @constructor
 */
function ThreeWayConfAck (data) {
  if (data.iRet == -1) {
    console.log('三方通话请求失败！')
  } else {
    console.log('三方通话请求成功！')
  }
}

/**
 * 创建音视频会议结果返回 272
 * @param data: 1、agent_id=发起操作的坐席id
 2、BSTR memberNum=会议成员号码，以逗号隔开，最多24个号码
 3、BSTR numType= 成员号码对应的号码类型，同样以逗号隔开
 4、long confId = 会议标识，0为失败，非0为会议标识，需要保存，会议操作需要用到
 5、int isVideo=是否视频会议，1是，0否
 * @return {*}
 * @constructor
 */
function CreateConfExAck (data) {
  if (data.confId <= 0) {
    console.log('创建音视频会议失败！')
  } else {
    console.log('创建音视频会议成功！')
  }
}

/**
 * 加入会议接口回调返回 277
 * @param data: 1、agent_id=发起操作的坐席id
 2、 long conf_id=会议id
 3、long conn=与坐席通话的通话标识id，暂不可用
 4、int status = 接口调用结果，0成功，非0为失败原因
 5、BSTR phoneNumber
 =要加入会议的号码
 6、long numType=要加入会议的号码类型
 * @constructor
 */
function JoinConfEx2Ack (data) {
  if (data.status == 0) {
    console.log('加入会议成功！')
  } else {
    console.log('加入会议失败，原因：' + data.status)
  }
}

/**
 * 会议成员状态返回 275
 * @param data: 1、int agent_id= 会议所属坐席id
 2、int callTag = 通话标识，暂无意义
 3、int confId = 会议标识id
 4、BSTR memberNum =成员号码
 5、int numType =成员号码类型
 6、int status = 成员状态-----0空闲、1摘机2;  呼叫进入、3呼出、4振铃、5应答
 * @return {*}
 * @constructor
 */
function ConfMemberStatus (data) {
  return data
}

/**
 * 电话会议移出成员结果返回 264
 * @param data: 1、int agent_id//坐席id
 2、,int conf_id,//会议id
 3、int conn,//通话标识
 4、BSTR number,//成员号码
 5、int result//操作结果，0成功，非0 为错误码
 * @constructor
 */
function RemoveFromConfExAck (data) {
  if (data.status == 0) {
    console.log('电话会议移出成功！')
  } else {
    console.log('电话会议移出失败！')
  }
}

/**
 * 设置会议成员禁言/发言 返回结果
 * @param data
 * @constructor
 */
function OperateConfMemberExAck (data) {
  if (data.result == 0) {
    if (data.type == 2) {
      console.log('设置会议成员禁言成功！')
    } else if (data.type == 3) {
      console.log('设置会议成员发言成功！')
    }
  } else {
    console.log('设置会议成员禁言/发言失败！')
  }
}

/**
 * 设置视频会议、视频电话通话视频窗口结果返回
 * @param data: 1、  int agent_id =操作的坐席id;
 2、int localHandle=本端窗口句柄；
 3、  int remoteHandle=远端窗口句柄；
 4、int result=处理结果，0成功，非0为失败错误码
 * @constructor
 */
function SetVideoWindowAck (data) {
  if (data.result == 0) {
    console.log('设置视频会议、视频电话通话视频窗口成功！')
  } else {
    console.log('设置视频会议、视频电话通话视频窗口失败，错误码：' + data.result)
  }
}

/**
 * 广播/取消广播调用接口结果返回 283
 * @param data: 1、int agent_id;
 2、int conf_id;//会议ID
 3、int mixType;//广播画面模式，1单画面,4均分4画面,9均分9画面，16均分16画面
 4、char phoneNum[21*18] ; //成员号码列表，以逗号分隔，最大16个
 5、int isCannel;//是否取消广播
 6、int result=操作结果，0成功，非0为错误码
 * @constructor
 */
function ConfBoardCastMemberAck (data) {
  if (data.result == 0) {
    if (data.isCannel == 1) {
      console.log('取消广播画面成功！')
    } else if (data.isCannel == 0) {
      console.log('开启广播画面成功！')
    }
  } else if (data.result == -1) {
    console.log('参数错误！')
  } else {
    console.log('广播/取消广播失败！')
  }
}

/**
 * 选看视频会议成员画面结果返回
 * @param data: 1、  int agent_id;
 2、int conf_id;  //会议ID
 3、int mixType;//广播画面模式，1单画面,4均分4画面,9均分9画面，16均分16画面
 4、char phoneNum[21*18] ; //成员号码列表，以逗号分隔,最多16个
 5、int result;操作结果，0成功，非0错误码
 * @constructor
 */
function ConfWatchMemberAck (data) {
  if (data.result == 0) {
    console.log('选看视频会议成员画面成功！')
  } else {
    console.log('选看视频会议成员画面失败，错误码：' + data.result)
  }
}

function ConfSetFloorSiteAck (data) {

}
function ConfSetChairAck () {

}
function ConfReleaseChairAck () {

}
function ConfReconnectSiteAck () {

}

/**
 * 查询资源分组结果返回
 * @remake result为查询结果；查询结果可能分几个包返回，最终通过groupInfo字段组成结果Jason字符串
 * @param data: 1、int agent_id;
 2、int iType;//分组类型，0摄像机，1为eLET，8视频终端分组
 3、int iPageIndex;//分页查询，第几页
 4、int iPageSize;//分页查询，每页数量
 5、char   group_id[50];    //分组ID
 6、int result =结果值，0成功，非0错误码
 7、int total;//查询字符串切分数量
 8、int index;//切分数据包第几包
 9、char groupInfo[900];分组信息jason字符串
 * @constructor
 */
function ICPQueryGroupInfoAck (data) {
  if (data.result == 0) {
    var groupInfos = JSON.parse(data.groupInfo)
    // 把分组信息更新同步到本地数据库
    for (var i = 0; i < groupInfos.length; i++) {
      var data = {
        name: groupInfos[i].groupName,
        code: 'VideoGroup',
        operate: 0,
        pid: 0
      }
      axios.post(Url + '/eos/communication/group/updateGroup', data).then(function (data) {

      })
    }
  } else {

  }
}

/**
 * 查询设备信息结果返回，字段devInfo为结果Jason字符串。
 * @param data: 1、 int   agent_id;
 2、int iType;//设备类型 0摄像机，1eLET,8视频终端分组
 3、int iPageIndex;//分页查询，第几页
 4、int iPageSize;//分页查询，每页数量
 5、char   group_id[50];    //分组ID
 6、char devName[50];//设备名称
 7、int result=结果值，0成功，非0错误码
 8、int total;//查询字符串切分数量
 9、int index;//切分数据包第几包
 10、char devInfo[900];分组信息jason字符串
 * @constructor
 */
function ICPQueryDeviceInfoAck (data) {
  data.index = data.index || 0
  data.total = data.total || 0
  if (data.result == 0) {
    if (data.index < data.total) {
      if (data.devInfo) {
        cameraLst += data.devInfo
      }
      ICPQueryDeviceInfo(Number(data.agent_id), Number(0), Number(1), Number(10), Number(0), '')
    }
    if (data.index == data.total) {
      if (cameraLst !== '') {
        JSON.parse(cameraLst)
        // 把视频资源信息更新同步到本地数据库
        for (var i = 0; i < cameraLst.length; i++) {
          var data = {
            name: cameraLst[i].cameraName,
            number: cameraLst[i].cameraNum,
            groupId: 0
          }
          axios.post(Url + '/eos/communication/video/editVideoInfo', data).then(function (data) {

          })
        }
      }
    }
  } else {
    console.log('更新失败，错误码：' + data.result)
  }
}

/**
 * 预览摄像头视频结果返回，playHandle字段为播放句柄，停止播放时需要传入
 * @param data: 1、int agent_id;
 2、int iType;//设备类型 0摄像机，1eLET
 3、char devName[50];//设备号码
 4、char windowHandle[50];
 //预览窗口句柄
 5、int result= 结果值，0成功，非0错误码
 char playHandle[50]=播放句柄，停止预览时需要传入
 * @constructor
 */
function ICPStartRealPlayAck (data) {
  if (data.result == 0) {
    console.log('查询设备信息成功！')
  } else {
    console.log('查询设备信息失败，错误码：' + data.result)
  }
}

/**
 * 停止播放视频结果
 * @param data
 * @constructor
 */
function ICPStopRealPlayAck (data) {
  if (data.result == 0) {
    console.log('查询设备信息成功！')
  } else {
    console.log('查询设备信息失败，错误码：' + data.result)
  }
}

/**
 * 云台控制结果返回
 * @param data: 1、int agent_id;
 2、char vcnId[128];//所属VCN的设备编码
 3、char devNum[50];//设备号码
 4、int ptzCommand;//控制命令
 5、int speed;//控制速率
 6、int multiple;//倍数
 7、int isStop;//是否停止
 8、int result；结果值，0成功，非0失败码
 * @constructor
 */
function ICPPTZDeviceAck (data) {
  if (data.result == 0) {
    console.log('云台控制成功！')
  } else {
    console.log('云台控制失败，错误码：' + data.result)
  }
}

/**
 * 监控入会结果返回
 * @param data: 1、int agent_id;
 2、int iType;//设备类型 0摄像机，1eLET
 3、int conf_id;//会议id
 4、char devName[50];//设备号码
 5、int result;结果值，0成功，非0错误码
 * @constructor
 */
function ConfAddDeviceAck (data) {
  if (data.result == 0) {
    console.log('监控入会成功！')
  } else {
    console.log('监控入会失败，错误码：' + data.result)
  }
}

/**
 * 应答结果返回
 * @param data: 1、int agent_id;
 2、int conn; //通话标识
 3、int isVideo；//是否视频应答
 4、int result;结果值，0成功，非0错误码
 * @constructor
 */
function AnswerCallAck (data) {
  if (data.result == 0) {
    console.log('应答成功！')
  } else {
    console.log('应答失败，错误码：' + data.result)
  }
}

/**
 * 订阅无线集群群组结果
 * @param data: 1、int  agent_id;
 2、int expire;//订阅时间
 3、char groupName[50]
 //群组名称
 4、int result;结果值，0成功，非0为错误码
 * @constructor
 */
function TalkingGroupSubcribeAck (data) {
  if (data.result == 0) {
    console.log('订阅无线集群群组成功！')
  } else {
    console.log('订阅无线集群群组失败，错误码：' + data.result)
  }
}

/**
 * 监听无线集群群组结果返回
 * @param data: 1、int   agent_id;
 2、  char groupName[50];
 //群组名称
 3、int isMonitor;//是否开始监听，1开始监听，0停止监听
 4、int isAutoSubcribe;//是否自动处理订阅，1是，0否，默认1
 5、int result;//结果值，0成功，非0结果码
 * @constructor
 */
function TalkingGroupMonitorAck (data) {
  if (data.result == 0) {
    console.log('监听无线集群群组成功！')
  } else {
    console.log('监听无线集群群组失败，错误码：' + data.result)
  }
}

/**
 * 选中/监听无线集群群组切换结果返回
 * @param data： 1、int   agent_id;
 2、char groupName[50];//群组名称
 3、int isSelect;//是否选中，1选中，0取消选中
 4、int result;//结果值，0成功，非0为错误码
 * @constructor
 */
function TalkingGroupSelectAck (data) {
  if (data.result == 0) {
    console.log('选中/监听无线集群群组切换成功！')
  } else {
    console.log('选中/监听无线集群群组切换失败，错误码：' + data.result)
  }
}

/**
 * 无线集群群组抢权/放权操作结果。
 * @param data: 1、int agent_id;
 2、char groupName[50];//群组名称
 3、int isPTT;//是否抢权，1抢权，0放权
 4、int result;//结果值，0成功，非0结果码
 * @constructor
 */
function TalkingGroupPTTAck (data) {
  if (data.result == 0) {
    console.log('选中/监听无线集群群组切换成功！')
  } else {
    console.log('选中/监听无线集群群组切换失败，错误码：' + data.result)
  }
}

/**
 * 发起混编/临时混编呼叫结果返回
 * @param data: 1、int agent_id=坐席id，
 2、BSTR groupNum=群组号码
 3、BSTR groupName=群组名称
 4、int conf_id=群组呼叫标识id，小于或等于0为发起失败，大于0时发起呼叫成功，返回呼叫ID
 * @constructor
 */
function MixedGroupCallAck (data) {
  if (data.conf_id <= 0) {
    console.log('发起混编/临时混编呼叫失败！')
  } else if (data.conf_id > 0) {
    console.log('发起混编/临时混编呼叫成功，呼叫ID为：' + data.conf_id)
  }
}

/**
 * 邀请坐席加入会议通知
 * @param data: 1、int agent_id=坐席id
 2、int conf_id=会议id
 3、int isVideo=是否视频会议，1是0否
 4、BSTR confNumber=会议号码，可能为空
 * @return {*}
 * @constructor
 */
function ConfInviteNotify (data) {
  return data
}

/**
 * 坐席接受/拒绝加入会议邀请操作结果返回
 * @param data:  1、int agent_id=坐席id
 2、int conf_id=会议id
 3、int isAccept=是否接受邀请，1接受，0拒绝
 4、BSTR confNumber=会议号码，可为空
 5、Int ackRet=操作结果码，0成功，非0失败
 * @constructor
 */
function ConfAcceptInviteAck (data) {
  if (data.conf_id == 0) {
    console.log('坐席接受/拒绝加入会议成功！')
  } else {
    console.log('坐席接受/拒绝加入会议失败!')
  }
}

/**
 * 通话过程中，自动语音识别结果返回
 * @param data: 1、int agent_id=坐席id
 2、int conn=通话标识
 3、int isAgentSpeek=是否是坐席说好，1是0否
 4、BSTR speekerNum=说话方号码
 5、BSTR asrTxt=说话内容识别出的文字
 * @return {*}
 * @constructor
 */
function AsrTxtNotify (data) {

}

/**
 * 代接正在振铃的坐席的来电结果返回
 * @param data: int agent_id=坐席id,
 int conn=正在通话的通话ID（备用）,
 BSTR agentTag=代接的坐席工号,
 BSTR agentNum=代接的坐席号码
 Int ret = 结果，0成功，非0失败原因
 * @constructor
 */
function SnatchPickupAck (data) {
  if (data.ret == 0) {
    console.log('代接正在振铃的坐席的来电成功！')
  } else {
    console.log('代接正在振铃的坐席的来电失败，失败原因为：' + data.ret)
  }
}

/**
 * 视频会议启动/停止辅流结果通知
 * @param data: int agent_id=坐席id,
 int confId=会议id,
 int isStart=是否启动，1启动，0停止
 Int ret = 结果，0成功，非0失败原因
 * @constructor
 */
function ConfStartDataAck (data) {
  if (data.ret == 0) {
    console.log('视频会议启动/停止辅流成功！')
  } else {
    console.log('视频会议启动/停止辅流失败，失败原因为：' + data.ret)
  }
}

/**
 * 设置一个与会者成员选看另一个与会者成员/锁定视频源结果通知
 * @param data: int agent_id=坐席id,
 int confId=会议id,
 int isLock=是否启动，1启动，0停止
 BSTR dstMember=目的成员,
 BSTR srcMember=视频源成员，
 Int ret = 结果，0成功，非0失败原因
 * @constructor
 */
function ConfSetVideoSourceAck (data) {
  if (data.ret == 0) {
    console.log('设置一个与会者成员选看另一个与会者成员/锁定视频源成功！')
  } else {
    console.log('设置一个与会者成员选看另一个与会者成员/锁定视频源失败，失败原因为：' + data.ret)
  }
}

/**
 * 黑名单管理结果返回
 * @param data: int  agent_id=坐席id;
 char  phoneNumber[21*32]=号码列表，以逗号隔开，最多支持32个21个数字的号码串;
 unsigned char  iControl;//控制命令，1添加，0删除,2清空
 Int iRet = 结果码，0成功，非0错误码
 * @constructor
 */
function OperateBlackListAck (data) {
  if (data.iRet == 0) {
    console.log('黑名单管理成功！')
  } else {
    console.log('黑名单管理失败，错误码为：' + data.iRet)
  }
}

/**
 * 坐席二次拨号结果返回
 * @param data: Int agent_id=坐席id;
 char dtmfNum[21] = 二次拨号号码;
 Int iRet=结果返回，0成功，非0为错误码
 * @constructor
 */
function AgentSendDtmfAck (data) {
  if (data.iRet == 0) {
    console.log('坐席二次拨号成功！')
  } else {
    console.log('坐席二次拨号失败，错误码为：' + data.iRet)
  }
}

/**
 * 加入会议接口回调返回 325
 * @param data: 1、agent_id=发起操作的坐席id
 2、 long conf_id=会议id
 3、long conn=与坐席通话的通话标识id，暂不可用
 4、int status = 接口调用结果，0成功，非0为失败原因
 5、BSTR phoneNumber
 =要加入会议的号码
 6、long numType=要加入会议的号码类型
 7、BSTR displayName=成员在会议中的显示名称
 * @constructor
 */
function JoinConfEx3Ack (data) {
  if (data.status == 0) {
    console.log('加入会议成功！')
  } else {
    console.log('加入会议失败，失败原因为：' + data.status)
  }
}

/**
 * 坐席重新加入会议结果返回
 * @param data: 1、agent_id=发起操作的坐席id
 2、 long conf_id=会议id
 3、int iRet=调用结果，0正确，非0为错误码
 * @constructor
 */
function AgentAccessConfAck (data) {
  if (data.iRet == 0) {
    console.log('坐席重新加入会议成功！')
  } else {
    console.log('坐席重新加入会议失败，错误码为：' + data.iRet)
  }
}

/**
 * 用户登录结果返回
 * @data 接收登录返回的结果
 * @constructor
 */
function AgentLoginAck (data) {
  if (data.status == 0) {
    console.log('ICP通讯服务登录成功！')
  } else {
    console.log('ICP通讯服务登录失败！')
  }
}

/**
 * 呼叫任务请求结果通知，需要将外线编号和被呼号码关联保存起来，用于保持通话、恢复通话等 6
 * @param data 接收到的结果
 * 1、agent_id=发起呼叫的坐席id
 * 2、new_conn=用于外呼的外线编号
 * 3、status=任务结果
 * 4、cause=备用字段
 * @constructor
 */
function MakeCallAck (data) {
  if (data.status == 0) {
    console.log('呼叫成功！')
  } else if (data.status == 1) {
    console.log('呼叫失败！')
    if (data.cause == 63000) {
      console.log('已停止呼叫！')
    } else if (data.cause == 61007) {
      console.log('对方已拒接！')
    } else if (data.cause == 61005) {
      console.log('被叫无应答！')
    } else if (data.cause == 61003) {
      console.log('被叫号码不存在！')
    } else {
      console.log('被叫无应答！')
    }
  } else if (data.status == -1) {
    console.error('呼叫失败！')
  }
}

/**
 * 保持来电结果返回
 * @param data: 1、agent_id=通话的坐席id
 * 2、conn=通话的通道编号
 * 3、status=结果
 * cdr_id=插入数据库记录的id
 * @constructor
 */
function HeldCallAck (data) {
  if (data.status == 0) {
    console.log('保持通话成功！')
  } else {
    console.log('保持通话失败！')
  }
}

/**
 * 来电恢复请求结果返回
 * @param data:1、agent_id=通话的坐席id
 2、conn_a=通话一方的通道编号
 3、conn_b=通道另一方的通道编号
 4、status=结果
 * @constructor
 */
function AlternateCallAck (data) {
  if (data.status == 0) {
    console.log('恢复通话成功！')
  } else {
    console.log('恢复通话失败！')
  }
}

/**
 * 来电转接请求结果返回
 * @param data: 1、1agent_id=通话的坐席id
 2、conn=转接过去（第三方）的通道编号
 3、status=结果
 * @constructor
 */
function TransferCallAck (data) {
  if (data.status == 0) {
    console.log('来电转接成功！')
  } else {
    console.log('来电转接失败！')
  }
}

/**
 * 创建电话会议请求结果返回
 * @param data: 1、agent_id=坐席id
 2、conf_id=创建的电话会议id
 3、status=结果
 * @constructor
 */
function CreateConfAck (data) {
  if (data.status == 0) {
    console.log('创建电话会议成功！')
  } else {
    console.log('创建电话会议失败！')
  }
}

/**
 * 删除电话会议请求结果返回
 * @param data：1、conf_id=需删除的电话会议id
 2、status=结果
 * @constructor
 */
function DeleteConfAck (data) {
  if (data.status == 0) {
    console.log('电话会议结束成功！')
  } else {
    console.log('电话会议结束失败！')
  }
}

/**
 * 加入电话会议请求结果返回
 * @param data： 1、agent_id=坐席id
 2、conf_id=目的电话会议id
 3、conn=加入电话会议的通道编号
 4、status=结果
 * @constructor
 */
function JoinConfAck (data) {
  if (data.status == 0) {
    console.log('加入电话会议成功！')
  } else {
    console.log('加入电话会议失败！')
  }
}
/**
*
* data: 1、conf_count 数量
*      2、conf_id 会议id号，多个则以逗号隔开
*/

function ConfDetail (data) {

}

/**
 * 查询电话会议成员结果返回---自行处理返回的结果
 * @param data: 1、conf_id=目的电话会议id
 2、memmber_count=成员数量
 3、conn=成员通道编号集，以逗号隔开
 4、number=成员通道号码集，以逗号隔开
 * @return {*}
 * @constructor
 */
function ConfMemberDetail (data) {
  return data
}

/**
 * 线路状态提醒 3
 * @param data: 1、agent_id=坐席id
 2、conn=坐席通道编号
 3、status=坐席状态;0空闲、1摘机2;  呼叫进入、3呼出、4振铃、5应答
 * @constructor
 */
function PortStatusChanged (data) {
  if (data.status == 0) {
    console.log('坐席处于空闲状态！')
  } else if (data.status == 1) {
    console.log('坐席处于摘机状态！')
  } else if (data.status == 2) {
    console.log('坐席处于呼叫进入状态！')
  } else if (data.status == 3) {
    console.log('坐席处于呼出状态！')
  } else if (data.status == 4) {
    console.log('坐席处于振铃状态！')
  } else if (data.status == 5) {
    console.log('坐席处于应答状态！')
  }
}

/**
 * 来电号码提醒 15
 * @param data: 1、agent_id=正在振铃的坐席id
 2、conn=取得来电号码的通道编号
 3、calling=取得的来电号码
 * @return {*}
 * @constructor
 */
function UpdateCallingNumber (data) {
  var callingNum = ''
  if (data.calling.length == 12 && data.calling[0] == '0') {
    callingNum = data.calling.substr(1)
  } else {
    callingNum = data.calling
  }
}

/**
 * 来电等待通知 13
 * @param data: 1、conn=来电进入等待的通道编号
 2、calling=来电号码
 3、called=被叫号码
 4、status=通话状态---0,消失，1保持中，2呼出通话中，3呼入通话中
 * @constructor
 */
function BroadcastCallOffered (data) {
  if (data.conn) {
  }
  if (data.status == 0) {
    // console.log("通话状态：消失！");
    console.log('通话状态：消失！')
    if (data.calling.length == 12 && data.calling[0] == '0') {

    } else {

    }
    if (data.called.length == 12 && data.called[0] == '0') {

    } else {

    }
  } else if (data.status == 1) {
    console.log('通话状态：保持中！')
  } else if (data.status == 2) {
    console.log('通话状态：呼出通话中！')
  } else if (data.status == 3) {
    console.log('通话状态：呼入通话中！')
  } else if (data.status == 4) {
    console.log('通话状态：呼出中！')
    if (data.called) {
      if (data.called.length == 12 && data.called[0] == '0') {

      } else {

      }
    }
  }
}

/**
 * 传真发送结果返回
 * @param data： 1、fax_cdr_id=传真记录id
 2、fax_number=接收方的号码
 3、fax_file=传真文件的存放路径
 4、result=传真的发送结果
 * @constructor
 */
function FaxSent (data) {
  if (data.status == 0) {
    console.log('传真发送成功！')
  } else {
    console.log('传真发送失败！')
  }
}

/**
 * 通知上层收到一个新传真
 * @param data: 1、fax_cdr_id=传真记录id
 2、fax_number=发送方的号码
 3、fax_file=传真文件名
 * @return {*}
 * @constructor
 */
function FaxReceived (data) {
  return data
}

/**
 * 会议成员状态改变结果返回
 * @param data: 1、agent_id=发起请求的坐席id
 2、conf_id=电话会议标识id
 3、conn=电话线路编号
 4、type=成员状态1:只能说 2:只能听 3:可说可听
 5、flag=操作结果
 * @constructor
 */
function OperateConfMemberAck (data) {
  if (data.type == 1) {
    console.log('坐席处于空闲状态！')
  } else if (data.type == 2) {
    console.log('坐席处于摘机状态！')
  } else if (data.type == 3) {
    console.log('坐席处于呼叫进入状态！')
  }
}

/**
 * 转接结果返回
 * @param data: 1、agent_id=发起操作的坐席id
 2、mobile_to=转接的号码
 3、status= 请求结果
 * @constructor
 */
function TransferCallOneKeyAck (data) {
  if (data.status == 0) {
    console.log('转接成功！')
  } else {
    console.log('转接失败！')
  }
}

/**
 * 通话结束返回 229(默认此时更新通话记录)
 * @param data:
 call_type=通话类型，0呼入，1呼出
 calling =主叫号码
 called= 被叫号码
 annalog_channel=通话标识
 agent_channel=坐席通道id
 agent_id=坐席id
 start_time=开始时间
 connected_time=通话接通时间
 end_time=结束时间
 duration=通话时长
 recordfile=录音文件名，非绝对路径
 app_param_1=前端自定义内容
 * @constructor
 */
function InsertPhoneCdr (result) {

}

/**
 * 扫描仪结果
 * @param data:
 * 1、path=保存的文件路径
 2、result=操作结果0代表调用函数成功，-1失败
 * @constructor
 */
function FaxScanAck (data) {

}

/***
 * 移动终端gis位置上报（icp20.0或者pwi版本使用）
 * @param data
 * {
 *     "devCode":"9414","longitude":"120.2215326","latitude":"30.213155"
 * }
 * @constructor
 */
function GisNotify (data) {
  console.log('GisNotify -> ', data)
}
/***
* 终端状态返回事件
* @param data 1、agent_id=发起操作的坐席id
* 2、string userName=终端号码；
* 3、int userStatus=终端状态，0离线，1在线，3忙碌(无效），4离开(无效)
* 4、string statusDsc = 状态描述
*/
function NotifyUserInfo (data) {
  console.log('NotifyUserInfo -> ', data)
}

export default {
  AgentLoginAck,
  MakeCallAck,
  HeldCallAck,
  AlternateCallAck,
  TransferCallAck,
  CreateConfAck,
  DeleteConfAck,
  JoinConfAck,
  ConfDetail,
  ConfMemberDetail,
  PortStatusChanged,
  UpdateCallingNumber,
  BroadcastCallOffered,
  FaxSent,
  FaxReceived,
  OperateConfMemberAck,
  TransferCallOneKeyAck,
  ThreeWayConfAck,
  CreateConfExAck,
  JoinConfEx2Ack,
  ConfMemberStatus,
  RemoveFromConfExAck,
  OperateConfMemberExAck,
  SetVideoWindowAck,
  ConfBoardCastMemberAck,
  ConfWatchMemberAck,
  ICPQueryGroupInfoAck,
  ICPQueryDeviceInfoAck,
  ICPStartRealPlayAck,
  ICPStopRealPlayAck,
  ICPPTZDeviceAck,
  ConfAddDeviceAck,
  AnswerCallAck,
  TalkingGroupSubcribeAck,
  TalkingGroupMonitorAck,
  TalkingGroupSelectAck,
  TalkingGroupPTTAck,
  MixedGroupCallAck,
  ConfInviteNotify,
  ConfAcceptInviteAck,
  AsrTxtNotify,
  SnatchPickupAck,
  ConfStartDataAck,
  ConfSetVideoSourceAck,
  OperateBlackListAck,
  AgentSendDtmfAck,
  JoinConfEx3Ack,
  AgentAccessConfAck,
  InsertPhoneCdr,
  FaxScanAck,
  GisNotify,
  NotifyUserInfo
}
