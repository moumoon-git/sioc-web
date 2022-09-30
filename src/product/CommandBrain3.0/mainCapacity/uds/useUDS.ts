import { ref } from 'vue';
import useRollingCallback from '@/product/LargeScreen/module/VideoModule/scripts/useUdsRolling'; // 可视化大屏回调
import MQClient from './MQClient';

const {
 openVideoWallCallback, stopVideoWallCallback, startVideoPreviewCallback, stopVideoPreviewCallback, clickWallCallback, openAppCallback,
} = useRollingCallback();

/**
 * @property Id 成员id
 * @property Name 成员名称
 * @property Number 成员号码
 * @property Type 成员类型：1-普通电话，4-短波（集群终端），8-视频电话/终端/WeComm，9-视频监控
 */
interface MeetingMember {
  Id: number,
  Name: string,
  Number: number,
  Type: 1 | 4 | 8 | 9 | number,
}
// 获取或生成浏览器保存的唯一标识
const guid = localStorage.getItem('guid') || `browser${Math.round(Math.random() * 10000000)}`;
localStorage.setItem('guid', guid);

// 注释原因：之前所有所有网页端和 UDS 统一使用 【eos用户名】 的格式，当多个端同时在线时，只能有一个端能收到消息，使其他网页端不能正常接收消息。
// sender字段 = 'eos' + userName
// const sender = document.cookie.match(/userName=([^;]*);?/)?.[1]?`eos${document.cookie.match(/userName=([^;]*);?/)?.[1]}`:`eosruicheng123`;
// const destination = document.cookie.match(/userName=([^;]*);?/)?.[1]?`eos${document.cookie.match(/userName=([^;]*);?/)?.[1]}`:`eosruicheng123`;

// sender字段 = window.config.UDSMQConfig.senderPrefix + 用户名
const senderPrefix = (window as any)?.config?.UDSMQConfig?.senderPrefix || 'uds_';
const defaultSender = document.cookie.match(/userName=([^;]*);?/)?.[1]?`uds_${document.cookie.match(/userName=([^;]*);?/)?.[1]}`:`uds_ruicheng123`
const sender = document.cookie.match(/userName=([^;]*);?/)?.[1]?`${senderPrefix}${document.cookie.match(/userName=([^;]*);?/)?.[1]}`:`${senderPrefix}ruicheng123`;
// 接受会议通知的topic
const meetingTopic = `/topic/IM.ConfNotice.${document.cookie.match(/platformId=([^;]*);?/)?.[1]}`
// 订阅的主题： (`/topic/${sender}`：接受uds心跳检测回调，需要用这个主题去接受)
const url = `/topic/${defaultSender}`; // 发送的topic（uds通过这个主题去接收业务系统发送的消息）
const subscribeURL = [url, `/topic/${sender}`, meetingTopic]

// 正在进行的会议的创建的时间
export const meetingStartTime = ref('');
// 正在进行的会议id
let meetingId = 0;
// 接收到UDS变化时执行所有设置的回调
const callbacks: any[] = [];
let $resolve: any;

// 用户信息
function userInfo() {
  const agentObjStr = decodeURIComponent(document.cookie.match(/seatInformation=([^;]*);?/)?.[1] || '');
  const agentObjData = agentObjStr ? JSON.parse(agentObjStr) : { };
  return agentObjData ?? { };
}

/**
 * MQ客户端实例
 */
console.log(' MQ客户端实例')
console.log(document.cookie.match(/userName=([^;]*);?/)?.[1] as string)
export const uds = new MQClient({
  server: (window as any).config.MQServer,
  user: decodeURIComponent(document.cookie.match(/userName=([^;]*);?/)?.[1] as string||'ruicheng123'),
  password: decodeURIComponent(document.cookie.match(/password=([^;]*);?/)?.[1] as string||'ruicheng@123'),
  // 坐席号
  agent: userInfo().phoneSeatNumber || '1007',
});
// 轮询等待websocket建立连接，然后添加订阅
subscribeURL.forEach((el: string) => {
  uds.subscribe(el, handleMQMessage);
})
const timer = setInterval(() => {
  if (uds.connected) {
    subscribeURL.forEach((el: string) => {
      uds.subscribe(el, handleMQMessage);
    })
    queryMeetingStatus();
    clearInterval(timer);
  }
}, 500);

/**
 * 查询UDS会议状态
 * @returns 返回一个promise，收到UDS返回响应时resolve
 */
export function queryMeetingStatus(): Promise<null> {
  return new Promise((resolve) => {
    uds.send(url, {
      cmd: {
        PriCmd: 2,
        SubCmd: 100,
        Tag: 0,
      },
      guid,
      sender,
    });
    $resolve = resolve;
  });
}

/**
 * 创建会议
 * @param title 会议标题
 * @param members 会议成员数组
 * @param eventId 事件id
 */
export function createMeeting(title: string, members: MeetingMember[], eventId: number): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 102,
      Tag: 0,
    },
    guid,
    sender,
    title,
    eventId,
    member: members,
  });
}

/**
 * 添加成员到当前会议
 * @param members 会议成员数组
 */
export function addMeetingMembers(members: MeetingMember[]): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 106,
      Tag: 0,
    },
    guid,
    sender,
    member: members,
    id: meetingId,
  });
}

/**
 * 创建或加入会议
 * @param members 会议成员
 * @param eventId 事件id
 */
export function createOrAddMeeting(members: MeetingMember[], eventId: number): void {
  queryMeetingStatus().then(() => {
    if (meetingStartTime.value) {
      addMeetingMembers(members);
    } else {
      createMeeting(
        `${document.cookie.match(/userName=([^;]*);?/)?.[1] || ''}发起的会议`,
        members,
        eventId,
      );
    }
  });
}

/**
 * 结束会议
 * @param id 会议id
 */
export function stopMeeting(id?: number): void {
  queryMeetingStatus().then(() => {
    uds.send(url, {
      cmd: {
        PriCmd: 2,
        SubCmd: 104,
        Tag: 0,
      },
      guid,
      sender,
      id: id || meetingId,
    });
  });
}

/**
 * 拨打电话
 * @param contact 联系人对象，类型1普通电话，类型8视频电话
 * @param options 可选选项，此参数会通过params字段传递给后台
 */
export function makePhoneCall(contact: {
  phone: number,
  type: 1 | 8 | number,
  id: number,
  name: string,
}, options: { key: string, value: any, type: number }[] = []): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 50,
      Tag: 0,
    },
    guid,
    sender,
    number: contact.phone,
    type: contact.type,
    contactorId: contact.id,
    name: contact.name,
    params: options,
  });
}

/**
 * 监控/视频预览
 * @param deviceList 设备列表
 * @param id 设备id
 * @param name 设备名称
 * @param codeNum 设备号码
 */
 export function monitorPreview(deviceList: {
  id: number,
  name: string,
  codeNum: string | number,
}[]): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 290,
      Tag: 0,
    },
    guid,
    sender,
    device: deviceList,
  });
}

/**
 * 取消监控预览
 * @param deviceList 设备列表
 * @param id 设备id
 * @param name 设备名称
 * @param codeNum 设备号码
 */
 export function  cancelMonitorPreview(codeNum: string | number): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 292,
      Tag: 0,
    },
    guid,
    sender,
    codeNum,
  });
}

/**
 * 轮询
 * @param deviceList 设备列表
 * @param id 设备id
 * @param name 设备名称
 * @param codeNum 设备号码
 */
 export function initiatePolling(title:string,taskids:string,deviceList: {
  id: number,
  name: string,
  codeNum: string | number,
}[]): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 371,
      Tag: 0,
    },
    guid,
    sender,
    title,
    taskid: `${sender}${taskids}`,
    device: deviceList,
  });
}

/**
 * 轮询
 * @param deviceList 设备列表
 * @param id 设备id
 * @param name 设备名称
 * @param codeNum 设备号码
 */
 export function cancelInitiatePolling(taskids:string): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 372,
      Tag: 0,
    },
    guid,
    sender,
    taskid:`${sender}${taskids}`,
  });
}

/**
 * 语音集群/语音点呼
 * @param deviceList 设备列表
 * @param id 设备id
 * @param name 设备名称
 * @param num 设备号码
 */
export function callVoiceCluster(deviceList: {
  id: number,
  name: string,
  num: number,
}[]): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 200,
      Tag: 0,
    },
    guid,
    sender,
    member: deviceList,
  });
}

/**
 * 视频集群/视频点呼
 * @param deviceList 设备列表
 * @param id 设备id
 * @param name 设备名称
 * @param num 设备号码
 */
export function callVideoCluster(deviceList: {
  id: number,
  name: string,
  num: number,
}[]): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 201,
      Tag: 0,
    },
    guid,
    sender,
    member: deviceList,
  });
}

/**
 * 组呼
 * @param deviceList 设备列表
 * @param id 设备id
 * @param name 设备名称
 * @param num 设备号码
 */
export function callGroupCluster(deviceList: {
  id: number,
  name: string,
  num: number,
}[]): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 202,
      Tag: 0,
    },
    guid,
    sender,
    member: deviceList,
  });
}
/**
* @desc 视频墙开启
* @param x x坐标
* @param y y坐标
* @param w 宽
* @param h 高
* @param total 屏幕总数
* @param y y坐标
* @returns {} returns
*/
export function openVideoWall(option: {
  x: number,
  y: number,
  w: number,
  h: number,
  total: number,
  number: string
}): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 51,
      Tag: 0,
    },
    guid,
    sender,
    x: option.x,
    y: option.y,
    w: option.w,
    h: option.h,
    total: option.total,
    number: option.number,
  });
}
/**
* @desc 视频墙停止
* @returns {} returns
*/
export function stopVideoWall(): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 53,
      Tag: 0,
    },
    guid,
    sender,
  });
}
/**
* @desc 视频墙开始预览
* @index 预览位置，多个号码index不足时只按存在的进行位置分配，其它自动分配，0为自动分配
* @number 预览号码,多个号码逗号分隔组合成的字符串
* @total 屏幕总数
* @returns {} returns
*/
export function startVideoPreview(option: {
  index: number,
  number: string,
  total: number,
  isFlight: number,
  deviceName: string
}): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 55,
      Tag: 0,
    },
    guid,
    sender,
    isFlight: option.isFlight || 0,
    total: option.total,
    index: option.index,
    number: option.number,
    deviceName: option.deviceName,
  });
}
/**
* @desc 视频墙停止预览
* @number 预览号码,多个号码逗号分隔组合成的字符串
* @returns {} returns
*/
export function stopVideoPreview(option: {
  number: string,
  isFlight: number,
  taskid?: string,
  deviceName?: string,
}): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 57,
      Tag: 0,
    },
    guid,
    sender,
    isFlight: option.isFlight || 0,
    number: option.number,
    taskid: option.taskid || '',
    deviceName: option.deviceName || '',
  });
}
/**
* @desc 指挥端控制调度台跳转到传真模块
* @returns {} returns
*/
export function stepToFax(): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2,
      SubCmd: 60,
      Tag: 0,
    },
    guid,
    sender,
  });
}
/**
 * 检查uds客户端是否启动
 */
export function heartbeat(): void {
  uds.send(url, {
    cmd: {
      PriCmd: 2, // 参考PriCmd
      SubCmd: 4, // 参考SubCmd
      Tag: 0,
    },
    guid,
    sender,
    agent: userInfo().phoneSeatNumber,
  });
}

// 接收消息回调
function handleMQMessage(message: any) {
  console.log('【UDS】接收到消息', message);
  if (message?.guid === guid || message?.sender === sender) {
    switch (String(message.cmd.SubCmd)) {
      // 会议状态
      case '101': {
        if ('onMeeting' in message) {
          meetingStartTime.value = (message.onMeeting === 0 || message.onMeeting === '0') ? '' : message.time;
          meetingId = message.id;
          $resolve && $resolve();
          $resolve = null;
        }
        break;
      }
      // 创建会议
      case '103': {
        flushCallbacks(103, message);
        queryMeetingStatus();
        break;
      }
      // 结束会议
      case '105': {
        flushCallbacks(105, message);
        queryMeetingStatus();
        break;
      }
      // 与会成员发生变化
      case '107': {
        flushCallbacks(107, message);
        queryMeetingStatus();
        break;
      }
      // 视频预览响应
      case '291': {
        flushCallbacks(291, message);
        break;
      }
      // 启动巡查成功
      case '375': {
        flushCallbacks(375, message);
        break;
      }
      // 停止巡查成功
      case '376': {
        flushCallbacks(376, message);
        break;
      }
      // 巡查单个数据返回成功
      case '377': {
        flushCallbacks(377, message);
        break;
      }
      // 巡查单个数据返回成功
      case '377': {
        flushCallbacks(377, message);
        break;
      }
      // 登录状态响应
      case '5': {
        flushCallbacks(5, message);
        break;
      }
      // 开启视频墙成功
      case '52': {
        openVideoWallCallback(message);
        break;
      }
      // 关闭视频墙成功
      case '54': {
        stopVideoWallCallback(message);
        break;
      }
      // 开启视频墙预览成功
      case '56': {
        startVideoPreviewCallback(message);
        break;
      }
      // 关闭视频预览成功
      case '58': {
        stopVideoPreviewCallback(message);
        break;
      }
      // 视频墙单个点击单独弹窗回调
      case '59': {
        clickWallCallback(message);
        break;
      }
      // 客户端启动成功回调
      case '2': {
        if ((window as any).config.isStartUdsVideoWall) {
          openAppCallback(message);
        }
        break;
      }
      default:
    }
    // 视频停止预览响应 uds没有给 sender
    if(message.cmd.SubCmd === '293') {
      flushCallbacks(293, message);
    }
  } else if (message.cmd) {
      switch (String(message.cmd.SubCmd)) {
        // 客户端启动成功回调
        case '2': {
          if ((window as any).config.isStartUdsVideoWall) {
            openAppCallback(message);
          }
          break;
        }
        default:
      }
    }
}

/**
 * 添加回调函数，在收到UDS响应时调用
 * 结合removeCallback使用
 * @param func 回调函数
 */
export function addCallback(func: any): void {
  callbacks.push(func);
}

/**
 * 移除回调函数
 * 结合addCallback使用
 * @param func 回调函数
 */
export function removeCallback(func: any): void {
  const index = callbacks.indexOf(func);
  if (index > -1) {
    callbacks.splice(index, 1);
  }
}

function flushCallbacks(code?: number, message?: any) {
  callbacks.forEach((cb) => {
    cb(code, message);
  });
}

export default {
  queryMeetingStatus,
  createMeeting,
  addMeetingMembers,
  createOrAddMeeting,
  addCallback,
  removeCallback,
  stopMeeting,
  meetingStartTime,
  uds,
  monitorPreview,
  cancelMonitorPreview,
  callVideoCluster,
  callVoiceCluster,
  callGroupCluster,
  heartbeat,
  // 可视化视频墙
  openVideoWall,
  stopVideoWall,
  startVideoPreview,
  stopVideoPreview,
  // 指挥控制uds跳转到传真模块
  stepToFax,
  initiatePolling,
  cancelInitiatePolling,
};
