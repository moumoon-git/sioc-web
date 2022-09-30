const SockJS = require('@/product/CommandBrain3.0/mainCapacity/uds/sockjs(1.0).min');

var websocketConfig = {
  user: '',
  admin: '',
  server: `${window.config.websocketUrl}/endpointOyzc`,
}
var stompClient = {};

/**
 * @description websocket连接和订阅主题
 * @param {Array} subscribeArr 订阅的主题和收到消息后的回调
 * 传参如下：
 * { subscribe: '/topic/eventTask/dynamic', callback: websocketCallback, }
 */
function connect(subscribeArr) {
  var socket = new SockJS(websocketConfig.server);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      subscribeArr.forEach(item => {
        stompClient.subscribe(item.subscribe, function (res) {
          item.callback(res);
        });
      })
  });
}

function disconnect() {
  if (stompClient !== null && stompClient.connected) {
      stompClient.disconnect();
  }
  console.log("Disconnected");
}

function sendName() {
  stompClient.send("/platform/check", {}, JSON.stringify({'name': $("#name").val()}));
}

export default{
  websocketConfig,
  connect,
  disconnect,
  sendName,
}