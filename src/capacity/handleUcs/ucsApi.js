/**
 * @author oyq
 * @date 2019/9/23
 * @description 调用融合通讯服务api
 * @version 2.7.1.0
 */
import axios from 'axios'
import hwICP from './ucsCommon.js'
// import xw from './xwApi.js'

var ucsClient

/**
 *description 初始化SDK，从ucs后台获取坐席连接的mq信息，
 * 强退可能已被人登录的agent，
 * 然后启动坐席agent，之后连接mq接收消息，最后发起坐席心跳检测，判断坐席连接mq状态
 *@param ucsServer ucs服务地址
 * @param listenMQServer 坐席连接的mq地址
 * @param userCode 第三方前端订阅的mq消息topic名称
 * @param agentCode 第三方指定坐席在mq订阅的topic
 * @param isFirstLogin 是否首次登录，若是，则完全初始化，重新打开emtagent等
 * @param logCallBack 登录回调
 *@author Ouyuqian
 *@date 2019/12/10
 */
function InitSDK (ucsServer, listenMQServer, userCode, agentCode, isFirstLogin, logCallBack,store) {
  // let ucsServerUrl = ucsServer;
  // let MQDeCode = 'eos' + userCode;
  // let MQMyCode = agentCode;
  if (!agentCode) {
    console.log('初始化失败：坐席未选择')
    return false
  }
  const _logCallBack = function (msg) {
  }
  logCallBack = logCallBack || _logCallBack
  axios.post(ucsServer + '/ucs/communication/init', { data: {} }).then(async function (data) {
    if (data.data.errorcode === 0) {
      console.log('MQ账号获取成功')

      const sysConfig = { ucsServer, listenMQServer, userCode, agentCode, isFirstLogin, logCallBack }
      sysConfig.MQServer = data.data.data.url
      sysConfig.MQUser = data.data.data.user
      sysConfig.MQPwd = data.data.data.password
      sysConfig.sysConfService = data.data.data.sysConfService
      sysConfig.sysVideoService = data.data.data.sysVideoService
      sysConfig.store = store
      if (sysConfig.sysConfService === 'VDC' || sysConfig.sysConfService === 'ICPV19' || sysConfig.sysConfService === 'YouShiKang') {
        ucsClient = new hwICP.ucsCommon()

        if (typeof sysConfig.listenMQServer === 'undefined' || sysConfig.listenMQServer == null || sysConfig.listenMQServer == '') {
          sysConfig.listenMQServer = data.data.data.webMqServer
        }
        await ucsClient.InitSDK(sysConfig)
        // logCallBack('0');
      } else if (sysConfig.sysConfService === 'SZXW') {
        // ucsClient = new xw.xwSDK()
        await ucsClient.InitSDK(ucsServer, data.data.data.sdkServer, logCallBack)

        logCallBack('0')
      } else {
        console.log('无法识别的系统标识')
        logCallBack('-1')
      }
    } else {
      console.log('连接ucs服务失败')
      logCallBack('-1')
    }
  })
}

/**
 *description 关闭SDK，释放资源
 *@author Ouyuqian
 *@date 2019/12/12
 */
function UnInitialize (callback) {
  console.log('释放ucs..')
  if (ucsClient) {
    ucsClient.UnInitialize()
  }
  const _callback = function () {

  }
  callback = callback || _callback
  callback()
}

/**
 * 心跳返回
 * @param message
 * @constructor
 */
function HeartBreakAck (message) {
  ucsClient.HeartBreakAck(message)
}

/**
 * 处理坐席登录返回事件
 * @author Ouyuqian
 * @date 2020/09/15
 */
function OnAgentLoginAck (data) {
  ucsClient.OnAgentLoginAck(data)
}
// /**
//  * 发送ICP登录配置
//  * @agent_id 坐席id
//  * @constructor
//  */
// function SendCtiConfig() {
//   return ucsClient.SendCtiConfig();
// }

/**
 * 上层用户向cti服务注册
 * @param user 用户名
 * @param passwd 密码
 * @param license 保留字段
 * @param agent_id1 用户所拥有的1号坐席id
 * @param agent_id2 用户所拥有的2号坐席id
 * @param token 苏州星网平台竹云token
 * @param usreId 苏州星网平台userid
 * @param operatorId 用户表cti_operator中id
 * @constructor
 */
function AgentLogin (user, passwd, license, agent_id1, agent_id2, token, userId, operatorId) {
  return ucsClient.AgentLogin(user, passwd, license, agent_id1, agent_id2, token, userId, operatorId)
}

/**
 * 坐席改变状态
 * @param agent_id 坐席id
 * @param status 改变到的状态 0:离线；1：上线
 * @param transferNum 离线时来电转移到的号码（夜服号码）
 * @constructor
 */
function AgentChangeStatus (agent_id, status, transferNum) {
  return ucsClient.AgentChangeStatus(agent_id, status, transferNum)
}

/**
 * 退出EMTAgent
 * @constructor
 */
function CloseEMTAgent () {
  return ucsClient.CloseEMTAgent()
}

/**
 * 发起呼叫
 * @remake 发起一次呼叫，需先拿起坐席话机
 * @param agent_id 坐席id
 * @param called 外呼号码
 * @param iddcode 坐席号码
 * @constructor
 */
function MakeCall (agent_id, called, iddcode, assignObj = {}) {
  return ucsClient.MakeCall(agent_id, called, iddcode, assignObj)
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
function MakeCallEx (agent_id, number, iddcode, param_1, numType) {
  return ucsClient.MakeCallEx(agent_id, number, iddcode, param_1, numType)
}

/**
 * 挂断电话
 * @param agent_id 请求的坐席id
 * @param conn 需挂掉的通道编号
 * @param key 通话队列需要移出的key值(非必填)
 * @constructor
 */
function DropCall (agent_id, conn, key) {
  return ucsClient.DropCall(agent_id, conn, key)
}

/**
 * 来电保持
 * @param agent_id 需要外呼的坐席id
 * @param conn 需挂掉（保持）的通道编号
 * @constructor
 */
function HeldCall (agent_id, conn) {
  return ucsClient.HeldCall(agent_id, conn)
}

/**
 * 恢复来电
 * @remake 接通在等待状态的一路通话，坐席操作员拿起话机，选择等待区中的一路通话进行恢复；
 * @param agent_id 想接通来电的坐席id
 * @param conn_a 坐席通道编号（传agent_id即可）
 * @param conn_b 外线通道编号
 * @constructor
 */
function AlternateCall (agent_id, conn_a, conn_b) {
  return ucsClient.AlternateCall(agent_id, conn_a, conn_b)
}

/**
 * 转接线路
 * @remake 把本次通话转接给其他话路；首先【保持】本次通话，接着呼通要转接的话路，选择【转接】功能即可把两个话路接通
 * @param agent_id
 * @param conn
 * @constructor
 */
function TransferCall (agent_id, conn) {
  return ucsClient.TransferCall(agent_id, conn)
}

/**
 * 请求把与坐席通话的通道转接到其他号码上
 * @param agent_id 发起操作的坐席id
 * @param mobile_to 转接的号码
 * @constructor
 */
function TransferCallOneKey (agent_id, mobile_to) {
  return ucsClient.TransferCallOneKey(agent_id, mobile_to)
}

/**
 * 在坐席通话过程中，加入第三方形成三方通话，系统后台自动呼叫第三方号码。
 * @param agent_id 发起操作的坐席id
 * @param callTag 坐席正在通话的通话标识
 * @param thirdNum 第三方的号码
 * @param numType 第三方号码的类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频。（默认传1，集群还需要现场才明白）
 * @constructor
 */
function ThreeWayConf (agent_id, callTag, thirdNum, numType) {
  return ucsClient.ThreeWayConf(agent_id, callTag, thirdNum, numType)
}

/**
 * 收听录音
 * @remake 对坐席播放录音文件
 * @param agent_id 对其播放录音的坐席id
 * @param conn 对其播放录音的坐席通道编号
 * @param recordfile 录音文件名
 * @constructor
 */
function PlayRecordFile (agent_id, conn, recordfile) {
  return ucsClient.PlayRecordFile(agent_id, conn, recordfile)
}

/**
 * 创建电话会议
 * @remake 创建一个电话会议
 * @param agent_id 发起会议的坐席id
 * @constructor
 */
function CreateConf (agent_id) {
  return ucsClient.CreateConf(agent_id)
}

/**
 * 创建音视频会议，自动呼叫成员号码，呼通接入会议
 * @remake 其中，numType中包含视频类型，则创建视频会议，否则为音频会议。
 音频会议创建后不能再添加视频类的成员。
 创建视频会议时还没有成员，可传登陆的坐席号码，numType对应传8
 * @param agent_id 发起操作的坐席id
 * @param memberNum 会议成员号码+显示名（例如：07551001|*|会议室终端,07551002|*|手持终端），以逗号隔开，最多24个号码
 * @param numType 成员号码对应的号码类型（0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频），同样以逗号隔开
 * @param location object 窗口位置，包含locX（X轴起点）,locY（Y轴起点）,width（窗口宽度）,height（窗口高度）四个参数,icp版本下此参数无效
 * @constructor
 */
function CreateConfEx (agent_id, memberNum, numType, winLocation) {
  return ucsClient.CreateConfEx(agent_id, memberNum, numType, winLocation)
}

/**
 * 删除电话会议
 * @remake 删除一个电话会议
 * @param agent_id 发起会议的坐席id
 * @param conf_id 会议编号id
 * @constructor
 */
function DeleteConf (agent_id, conf_id) {
  return ucsClient.DeleteConf(agent_id, conf_id)
}

/**
 * 加入电话会议
 * @remake 把一路话路加入电话会议中
 * @param agent_id 发起会议的坐席id
 * @param conf_id 要加入的会议编号id
 * @param conn 话路通道的编号
 * @constructor
 */
function JoinConf (agent_id, conf_id, conn) {
  return ucsClient.JoinConf(agent_id, conf_id, conn)
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
function JoinConfEx (agent_id, conf_id, conn, phoneNumber, numType) {
  return ucsClient.JoinConfEx(agent_id, conf_id, conn, phoneNumber, numType)
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
function JoinConfEx3 (agent_id, conf_id, conn, phoneNumber, numType, displayName) {
  return ucsClient.JoinConfEx3(agent_id, conf_id, conn, phoneNumber, numType, displayName)
}

/**
 * 移出电话会议
 * @remake 把一路话路从电话会议中移出
 * @param agent_id 发起会议的坐席id
 * @param conf_id 通道所在会议编号id
 * @param conn 话路通道的编号
 * @constructor
 */
function RemoveFromConf (agent_id, conf_id, conn) {
  return ucsClient.RemoveFromConf(agent_id, conf_id, conn)
}

/**
 * 电话会议移出成员
 * @param agent_id  1、int agent_id//坐席id
 * @param conf_id 2、,int conf_id,//会议id
 * @param conn 3、int conn,//通话标识
 * @param number 4、BSTR number,//成员号码
 * @constructor
 */
function RemoveFromConfEx (agent_id, conf_id, conn, number, numberType) {
  return ucsClient.RemoveFromConfEx(agent_id, conf_id, conn, number, numberType)
}

/**
 * 查询已创建的电话会议
 * @param agent_id 发起会议的坐席id
 * @constructor
 */
function RequestConf (agent_id) {
  return ucsClient.RequestConf(agent_id)
}

/**
 * 查询电话会议成员
 * @param agent_id 发起会议的坐席id
 * @param conf_id 要查询的会议编号id
 * @constructor
 */
function RequestConfMember (agent_id, conf_id) {
  return ucsClient.RequestConfMember(agent_id, conf_id)
}

/**
 * 改变会议中线路状态
 * @param agent_id 发起请求的坐席id
 * @param conf_id 电话会议标识id
 * @param conn 电话线路编号
 * @param member_type 成员状态1:只能说 2:只能听 3:可说可听
 * @constructor
 */
function OperateConfMember (agent_id, conf_id, conn, member_type) {
  return ucsClient.OperateConfMember(agent_id, conf_id, conn, member_type)
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
function OperateConfMemberEx (agent_id, confId, conn, type, phoneNumber, numberType) {
  return ucsClient.OperateConfMemberEx(agent_id, confId, conn, type, phoneNumber, numberType)
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
function SendFax (case_id, opr_name, fax_number, fax_name, fax_file, fax_process_id, fax_id, fax_extend) {
  return ucsClient.SendFax(case_id, opr_name, fax_number, fax_name, fax_file, fax_process_id, fax_id, fax_extend)
}

/**
 * 设置视频通话视频窗口
 * 设置视频会议、视频电话通话视频窗口
 * @param agent_id  int agent_id =操作的坐席id;
 * @param localHandle int localHandle=本端窗口句柄；
 * @param remoteHandle  int remoteHandle=远端窗口句柄；
 * @constructor
 */
function SetVideoWindow (agent_id, localHandle, remoteHandle) {
  return ucsClient.SetVideoWindow(agent_id, localHandle, remoteHandle)
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
function ConfBoardCastMember (agent_id, conf_id, mixType, phoneNum, isCannel) {
  return ucsClient.ConfBoardCastMember(agent_id, conf_id, mixType, phoneNum, isCannel)
}

/**
 *description 点名发言
 *@param agentId 坐席id
 * @param confId 会议id
 * @param floorSite 发言的会场
 *@author Ouyuqian
 *@date 2020/1/2
 */
function ConfSetFloorSite (agentId, confId, floorSite) {
  return ucsClient.ConfSetFloorSite(agentId, confId, floorSite)
}

/**
 *description 设置主会场
 *@param agentId 坐席id
 * @param confId 会议id
 * @param chairSite 设为主席的会场
 *@author Ouyuqian
 *@date 2020/1/2
 */
function ConfSetChair (agentId, confId, chairSite) {
  return ucsClient.ConfSetChair(agentId, confId, chairSite)
}

/**
 *description 取消会议主会场
 *@param agentId 坐席id
 * @param confId 会议id
 *@author Ouyuqian
 *@date 2020/1/2
 */
function ConfReleaseChair (agentId, confId) {
  return ucsClient.ConfReleaseChair(agentId, confId)
}

/**
 *description 会议重呼成员
 *@param agentId 坐席id
 * @param confId 会议id
 * @param sites 成员列表
 *@author Ouyuqian
 *@date 2020/1/2
 */
function ConfReconnectSite (agentId, confId, sites) {
  return ucsClient.ConfReconnectSite(agentId, confId, sites)
}

/**
 * 选看视频会议成员画面，可同时预览多个成员画面，最多16个
 * @param agent_id 坐席id
 * @param conf_id 会议ID
 * @param mixType 广播画面模式，1-单画面,4-均分4画面,9-均分9画面，16-均分16画面
 * @param phoneNum 成员号码列表，以逗号分隔,最多16个
 * @constructor
 */
function ConfWatchMember (agent_id, conf_id, mixType, phoneNum) {
  return ucsClient.ConfWatchMember(agent_id, conf_id, mixType, phoneNum)
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
function ICPQueryGroupInfo (agent_id, iType, iPageIndex, iPageSize, group_id) {
  return ucsClient.ICPQueryGroupInfo(agent_id, iType, iPageIndex, iPageSize, group_id)
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
function ICPQueryDeviceInfo (agent_id, iType, iPageIndex, iPageSize, group_id, devName) {
  return ucsClient.ICPQueryDeviceInfo(agent_id, iType, iPageIndex, iPageSize, group_id, devName)
}

/**
 * 根据摄像头号码，在指定窗口预览视频
 * @param agent_id 坐席id
 * @param iType 设备类型 0摄像机，1eLET
 * @param devName 设备号码
 * @param windowHandle 预览窗口句柄
 * @param x 到屏幕左边的距离，单位：px
 * @param y 到屏幕上边的距离，单位:px
 * @param width 窗口宽度，单位：px
 * @param height 窗口高度，单位：px
 *
 */
function ICPStartRealPlay (agent_id, iType, devName, windowHandle, iX, iY, iWidth, iHeight) {
  return ucsClient.ICPStartRealPlay(agent_id, iType, devName, windowHandle, iX, iY, iWidth, iHeight)
}

/**
 * 停止播放视频
 * @param agent_id 坐席id
 * @param iType 设备类型 0摄像机，1eLET
 * @param playHandle 播放句柄
 * @constructor
 */
function ICPStopRealPlay (agent_id, iType, playHandle) {
  return ucsClient.ICPStopRealPlay(agent_id, iType, playHandle)
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
function ICPPTZDevice (agent_id, vcnId, devNum, ptzCommand, speed, multiple, isStop) {
  return ucsClient.ICPPTZDevice(agent_id, vcnId, devNum, ptzCommand, speed, multiple, isStop)
}

/**
 * 监控入会，目前只能添加摄像机
 * @param agent_id
 * @param iType 设备类型 0摄像机，1eLET
 * @param conf_id 会议id
 * @param devName 设备号码
 * @constructor
 */
function ConfAddDevice (agent_id, iType, conf_id, devName) {
  return ucsClient.ConfAddDevice(agent_id, iType, conf_id, devName)
}

/**
 * 应答通话，话机摘机应答
 * @param agent_id
 * @param conn 通话标识
 * @param isVideo 是否视频应答
 * @constructor
 */
function AnswerCall (agent_id, conn, isVideo) {
  return ucsClient.AnswerCall(agent_id, conn, isVideo)
}

/**
 * 订阅无线集群群组
 * @param agent_id
 * @param expire 订阅时间
 * @param groupName 群组名称
 * @constructor
 */
function TalkingGroupSubcribe (agent_id, expire, groupName) {
  return ucsClient.TalkingGroupSubcribe(agent_id, expire, groupName)
}

/**
 * 监听无线集群群组
 * @param agent_id
 * @param groupName 群组名称
 * @param isMonitor 是否开始监听，1开始监听，0停止监听
 * @param isAutoSubcribe 是否自动处理订阅，1是，0否，默认1
 * @constructor
 */
function TalkingGroupMonitor (agent_id, groupName, isMonitor, isAutoSubcribe) {
  return ucsClient.TalkingGroupMonitor(agent_id, groupName, isMonitor, isAutoSubcribe)
}

/**
 * 选中/监听无线集群群组切换
 * @param agent_id
 * @param groupName 群组名称
 * @param isSelect 是否选中，1选中，0取消选中
 * @constructor
 */
function TalkingGroupSelect (agent_id, groupName, isSelect) {
  return ucsClient.TalkingGroupSelect(agent_id, groupName, isSelect)
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
function TalkingGroupPTT (agent_id, groupName, isPTT) {
  return ucsClient.TalkingGroupPTT(agent_id, groupName, isPTT)
}

/**
 * 发起混编/临时混编呼叫接口
 * @param agent_id 坐席id
 * @param groupNum 群组号码
 * @param groupName 群组名称
 * @constructor
 */
function MixedGroupCall (agent_id, groupNum, groupName) {
  return ucsClient.MixedGroupCall(agent_id, groupNum, groupName)
}

/**
 * 坐席接受/拒绝加入会议邀请,isAccept值为1接受，0拒绝
 * @param agent_id 坐席id
 * @param conf_id 会议id
 * @param isAccept 是否接受邀请，1接受，0拒绝
 * @param confNumber 会议号码，可为空
 * @constructor
 */
function ConfAcceptInvite (agent_id, conf_id, isAccept, confNumber) {
  return ucsClient.ConfAcceptInvite(agent_id, conf_id, isAccept, confNumber)
}

/**
 * 代接正在振铃的坐席的来电
 * @param agent_id 坐席id
 * @param conn 正在通话的通话ID（备用）
 * @param agentTag 代接的坐席工号,
 * @param agentNum 代接的坐席号码
 * @constructor
 */
function SnatchPickup (agent_id, conn, agentTag, agentNum) {
  return ucsClient.SnatchPickup(agent_id, conn, agentTag, agentNum)
}

/**
 * 视频会议启动/停止辅流
 * @param agent_id 坐席id
 * @param confId 会议id
 * @param isStart 是否启动，1启动，0停止
 * @constructor
 */
function ConfStartData (agent_id, confId, isStart) {
  return ucsClient.ConfStartData(agent_id, confId, isStart)
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
function ConfSetVideoSource (agent_id, confId, isLock, dstMember, srcMember) {
  return ucsClient.ConfSetVideoSource(agent_id, confId, isLock, dstMember, srcMember)
}

/**
 * 黑名单管理，可1添加，0删除,2清空
 * @param agent_id 坐席id
 * @param phoneNumber 号码列表，以逗号隔开，最多支持32个21个数字的号码串
 * @param iControl 控制命令，1添加，0删除,2清空
 * @constructor
 */
function OperateBlackList (agent_id, phoneNumber, iControl) {
  return ucsClient.OperateBlackList(agent_id, phoneNumber, iControl)
}

/**
 * 坐席二次拨号，可多次调用，需间隔一秒以上
 * @param agent_id 坐席id
 * @param dtmfNum 二次拨号号码
 * @constructor
 */
function AgentSendDtmf (agent_id, dtmfNum) {
  return ucsClient.AgentSendDtmf(agent_id, dtmfNum)
}

/**
 * 坐席重新加入会议
 * @remake 一般情况下，坐席掉线但是会议没有结束的情况下，调用次接口重新加入会议
 * @param agent_id 发起操作的坐席id
 * @param conf_id 会议id
 * @constructor
 */
function AgentAccessConf (agent_id, conf_id) {
  return ucsClient.AgentAccessConf(agent_id, conf_id)
}

/**
 * 传真合并
 * @param path 传真文件远程路径（多个用“;”分隔）
 * @constructor
 */
function FaxMerge (path) {
  ucsClient.FaxMerge(path)
}

/**
 * 传真拆分
 * @param path 传真文件远程路径（多个用“;”分隔）
 * @constructor
 */
function FaxSplit (path) {
  ucsClient.FaxSplit(path)
}

/**
 * 扫描文件
 * @param
 * @constructor
 */
function FaxScan () {
  return ucsClient.FaxScan()
}

/**
 * 号码还原
 * @param number 待还原号码
 * @returns string 还原后号码
 * @constructor
 */
function ReverseNumber (number) {
  return ucsClient.ReverseNumber(number)
}

/**
 * 重连MQ回调
 * @constructor
 */
function ReconnectMQSuccess () {
  return ucsClient.ReconnectMQSuccess()
}

/**
 * 大牛视频流播放接口
 * @param rtmpUrl
 * @param resoureName
 * @returns {*}
 * @constructor
 */
function StartRealPlay_Daniu (rtmpUrl, resoureName) {
  return ucsClient.StartRealPlay_Daniu(rtmpUrl, resoureName)
}
/**
* 订阅设备状态
* @param users 终端号码，可拼接32个长度不超过21个数字的号码列表，以逗号隔开
* @returns {*}
* @constructor
*/
function DetectUserInfo (users) {
  return ucsClient.DetectUserInfo(users)
}
export default {
  InitSDK,
  UnInitialize,
  HeartBreakAck,
  OnAgentLoginAck,
  AgentLogin,
  AgentChangeStatus,
  MakeCall,
  MakeCallEx,
  DropCall,
  HeldCall,
  AlternateCall,
  TransferCall,
  PlayRecordFile,
  CreateConf,
  DeleteConf,
  JoinConf,
  RemoveFromConf,
  RequestConfMember,
  RequestConf,
  OperateConfMember,
  SendFax,
  TransferCallOneKey,
  ThreeWayConf,
  CreateConfEx,
  JoinConfEx,
  RemoveFromConfEx,
  OperateConfMemberEx,
  SetVideoWindow,
  ConfBoardCastMember,
  ConfWatchMember,
  ICPQueryGroupInfo,
  ICPQueryDeviceInfo,
  ICPStartRealPlay,
  ICPStopRealPlay,
  ICPPTZDevice,
  ConfAddDevice,
  AnswerCall,
  TalkingGroupSubcribe,
  TalkingGroupMonitor,
  TalkingGroupSelect,
  TalkingGroupPTT,
  MixedGroupCall,
  ConfAcceptInvite,
  SnatchPickup,
  ConfStartData,
  ConfSetVideoSource,
  OperateBlackList,
  AgentSendDtmf,
  JoinConfEx3,
  AgentAccessConf,
  ConfSetFloorSite,
  ConfSetChair,
  ConfReleaseChair,
  ConfReconnectSite,
  FaxMerge,
  FaxSplit,
  FaxScan,
  ReverseNumber,
  ReconnectMQSuccess,
  StartRealPlay_Daniu,
  DetectUserInfo
}
