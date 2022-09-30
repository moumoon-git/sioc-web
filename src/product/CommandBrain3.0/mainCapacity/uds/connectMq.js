/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-undef */

const mqObj = {
    mqUser: '',
    mqPwd: '',
    server: '',
    mqClient: {},
    subscribe: '',
    cb: '',
    cbArr: [],
};
/**
 * @description 收到消息的回调方法
 * @param message 消息体
 */
function callbackMSG(message) {
    console.log(message);
    // eslint-disable-next-line no-unused-expressions
    if (message.body) {
        // eslint-disable-next-line no-unused-expressions
        mqObj.cb && mqObj.cb(JSON.parse(message.body));
        if (mqObj.cbArr.legnth !== 0) {
            mqObj.cbArr.forEach(e => {
                e(JSON.parse(message.body));
            });
        }
    }
}
// 订阅
/**
 * @description mq连接成功回调
 * @param frame
 */
function connectCallback(frame) {
    console.log(frame);
    // console.log('连接MQ成功+++++++++++++++++++++++++++++++++');
    if (mqObj.subscribe) {
        mqObj.mqClient.subscribe(mqObj.subscribe, callbackMSG);
    }
}

function errorCallback(error) {
    console.log(`[mqErr出错了]${error}`);
    if (!mqObj.mqClient.connected) {
        // mqClient.disconnect();
        mqObj.mqClient = Stomp.client(mqObj.server);
        // 设置连接断开后每隔1s重新连接
        // eslint-disable-next-line max-len
        setTimeout(mqObj.mqClient.connect(mqObj.mqUser, mqObj.mqPwd, connectCallback, errorCallback), 1500);
    }
}
/**
 * 主动断开连接
 * @returns {boolean}
 */
function disConnect() {
    mqObj.mqClient.disconnect();
    console.log('MQ disconnected...');
    // console.log('MQ 断开连接了----------------------------------');
}
// 发送消息
function sendMsg(url, message) {
    // mqObj.mqClient.send('/topic/drawXPF', {}, message);
    if (message) {
        const obj = JSON.parse(message);
        const { user } = window.config.dispatchDeskConfig;
        obj.sender = `eos${user}`;
        message = JSON.stringify(obj)
    }
    mqObj.mqClient.send(url, { priority: 9 }, message);
    console.log('发送消息成功');
}
// 连接mq
/*
 *server     服务器地址
 *user       用户名
 *pwd        密码
 *subscribe  订阅名称
 *不能写成class或者构造函数，在connect方法时它的this指向为Stomp
 */
function connectMq(server, user, pwd, subscribe, cb) {
    mqObj.server = server;
    mqObj.mqUser = user;
    mqObj.mqPwd = pwd;
    mqObj.subscribe = subscribe;
    mqObj.cb = cb;
    mqObj.mqClient = Stomp.client(server);
    mqObj.mqClient.connect(user, pwd, connectCallback, errorCallback);
    return mqObj;
}

export default {
    // 连接MQ
    connectMq,
    // 发送消息
    sendMsg,
    // 断开连接
    disConnect,
};