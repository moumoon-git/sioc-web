import TWebLive from 'tweblive';
import {
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import axios from 'axios';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

// 用户 ID
export const userID = document.cookie.match(/userName=([^;]*);?/)?.[1] || '';
// 用户签名
let userSig: string;
let SDKAppID: number;
// IM 服务是否就绪
const isIMReady = ref(false);
// IM 服务实例
let im:any = '';

// 播放器实例 ID
let playerID = 0;
const messageCallbacksByRoomID = new Map();
async function createIMs(){
  im = await TWebLive.createIM({ SDKAppID });
  // 处理 IM 消息的回调
  // 监听 IM 服务就绪
  im.on(TWebLive.EVENT.IM_READY, () => { isIMReady.value = true; });
  // 监听 IM 服务接收到消息
  im.on(TWebLive.EVENT.IM_TEXT_MESSAGE_RECEIVED, (msg: any) => {
    if (msg.data?.length) {
      msg.data.forEach((textBody: any) => {
        const destination = textBody.to;
        const callback = messageCallbacksByRoomID.get(destination);
        if (callback) {
          callback(textBody);
        }
      });
    }
  });
  // log 等级
  im.setLogLevel(3);
}
/**
 * 登录 IM 服务
 */
function loginIM() {
  createIMs()
  im.login({ userID, userSig })
    .then((response: unknown) => {
      console.log('IM 服务登录成功', response);
    })
    .catch((error: Error) => {
      console.error(`IM 服务登录失败，2秒后重试，错误信息：${error}`);
      setTimeout(loginIM, 2000);
    });
}

/**
 * 获取当前直播房间列表（实时）
 *
 * @returns 直播房间列表
 */
export function getLiveRoom(): Promise<any> {
  // return im._tim.getGroupList();
  return new Promise((resolve) => {
    axios(`https://service-c2zjvuxa-1252463788.gz.apigw.tencentcs.com/release/forTestAdvanced?method=getRoomList&appId=${SDKAppID}&type=liveRoom`)
      .then((response) => {
        resolve(response.data.data || []);
      });
  });
}

/**
 * 获取详细的直播房间列表（不保证实时）
 */
export function getDetailedLiveRoom(): Promise<any> {
  return new Promise((resolve) => {
    const request = {
      method: 'GET',
      service: 'eoc',
      url: '/im/appImLives',
    } as const;
    $http(request).then((response) => {
      resolve(response);
    });
  });
}

/**
 * 创建一个静音的弹窗，用来小窗预览
 *
 * @param elementID DOM 元素 ID
 * @param roomID 房间 ID
 * @returns 停止播放的函数
 */
export function createMiniPlayer(elementID: number | string, roomID: number | string): () => void {
  const player = TWebLive.createPlayer();
  player.setRenderView({ elementID });
  player.startPlay(`room://sdkappid=${SDKAppID}&roomid=${roomID}&userid=${userID}&usersig=${userSig}`);
  player.setPlayoutVolume(0);
  return player.stopPlay;
}

/**
 * 从后端获取用户签名，然后登录 IM
 */
function getUserSig(): void {
  const request = {
    method: 'GET',
    service: 'eoc',
    url: '/im/userSig',
    params: {
      apiVersion: '0.0.2',
      userId: userID,
      platformId: document.cookie.match(/platformId=([^;]*)/)?.[1]
    },
  } as const;
  $http(request).then((response) => {
    if (response.code === 0) {
      userSig = response.data?.userSig || '';
      SDKAppID = response.data?.appId || 0;
      loginIM();
    } else {
      console.error(`获取 IM 用户签名失败，2秒后重试，错误代码${response.code}，错误信息：${response.msg}`);
      setTimeout(getUserSig, 2000);
    }
  }).catch((error: Error) => {
    console.error(`获取 IM 用户签名失败，2秒后重试，错误信息：${error}`);
    setTimeout(getUserSig, 2000);
  });
}

// 获取签名并登录
getUserSig();

/**
 * @param roomID 房间号
 * @param onMessageReceived 接收到消息的回调
 */
export default (
  roomID: string | number,
  onMessageReceived: (msg: any) => any,
) => {
  // 播放器容器元素 ID
  playerID += 1;
  const uuid = `tweblive-player-${playerID}`;

  messageCallbacksByRoomID.set(roomID, onMessageReceived);

  try {
    im.enterRoom(roomID);
  } catch (error) {
    $message.error(`${error}`);
  }

  /**
   * 发送消息到直播聊天室
   *
   * @param text 需要发送的文本消息
   * @return 发送成功的消息
   */
  const sendMessage = (text: string) => {
    return new Promise((resolve, reject) => {
      if (isIMReady.value) {
        // 需要先进入直播聊天室，再发送消息
        im.enterRoom(roomID).then(() => {
          im.sendTextMessage({
            roomID,
            text,
          }).then((res: any) => {
            if (res.code === 0) {
              resolve(res.data.message);
              reject();
            }
          });
        }).catch((error: Error) => {
          $message.error(`发送消息失败，错误信息：${error}`);
          reject();
        });
      } else {
        $message.error('IM 服务未就绪，请稍等重试');
        reject();
      }
    });
  };

  let player: any;

  // 是否正在播放
  const isPlaying = ref(false);

  // 是否静音
  const isSilent = ref(false);

  const toggleVolume = () => {
    if (player) {
      isSilent.value = !isSilent.value;
      player.setPlayoutVolume(isSilent.value ? 0 : 100);
    }
  };

  onMounted(() => {
    // 播放器实例
    player = TWebLive.createPlayer();
    // 挂载播放器
    player.setRenderView({ elementID: uuid });
    // 启动播放器
    player.startPlay(`room://sdkappid=${SDKAppID}&roomid=${roomID}&userid=${userID}&usersig=${userSig}`)
      .catch((error: Error) => {
        $message.error(`启动播放器失败，错误信息：${error}`);
      });
    player.on(TWebLive.EVENT.RTC_CONNECTION_STATE_CHANGED, (event: any) => {
      if (event.data.state === 'CONNECTED') {
        isPlaying.value = true;
      } else {
        isPlaying.value = false;
      }
    });
    // log 等级
    player.setLogLevel(3);
  });

  onBeforeUnmount(() => {
    player.stopPlay();
    im.exitRoom(roomID);
    messageCallbacksByRoomID.delete(roomID);
  });

  return {
    uuid,
    isIMReady,
    isPlaying,
    isSilent,
    toggleVolume,
    sendMessage,
  };
};
