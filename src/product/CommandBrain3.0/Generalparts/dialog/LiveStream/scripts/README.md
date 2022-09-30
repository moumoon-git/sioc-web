# TWebLive 服务说明

> 日期：2021-07-01

## # References

> 参考

- [TWebLive](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive/TWebLive.html)
- [TIM](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive/IM.html)
- [官方 Demo](https://cloud.tencent.com/document/product/269/47959)

## # Setup

> 安装依赖

  ```bash
    npm i tweblive tim-js-sdk trtc-js-sdk
  ```

## # Usage

> 使用说明

### ## 需要的参数

- `SDKAppID`：购买 IM 服务后在个人中心查看
- `roomID/groupID`：直播房间号
- `userID`：用户 ID，项目中一般与登录平台的账号相同
- `userSig`：用户签名，需要在后端生成并返回

### ## 拉流

```ts
// 官方未提供 ts 类型文件，需要自己添加 tweblive.d.ts
import TWebLive from 'tweblive';

// 1. 创建播放器实例
const player = TWebLive.createPlayer();

// 2. 将播放器渲染到 DOM 容器上
player.setRenderView({ elementID: 'tweblive-container' });

// 3. 开始播放
const streamURL = `room://sdkappid=${SDKAppID}&roomid=${roomID}&userid=${userID}&usersig=${userSig}`;
player.startPlay(streamURL)
```

### ## 聊天室

首先需要登录 IM 服务

```ts
// 1. 创建 IM 服务实例
const im = TWebLive.createIM({ SDKAppID });
// 2. 登录
im.login({ userID, userSig });
```

登录以后可以加入某个房间，并发送文本消息（一时间只能加入一个房间，必须先加入房间再发送消息）

```ts
im.enterRoom(roomID).then(() => {
  im.sendTextMessage({ roomID, text });
});
```

接收消息，会收到所有房间的消息，自己发送成功的消息也会收到

```ts
im.on(TWebLive.EVENT.IM_TEXT_MESSAGE_RECEIVED, (msg) => {
  console.log(msg)
});
```
