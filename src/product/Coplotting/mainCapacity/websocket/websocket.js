import SockJS from './sockjs.min';

const platId = document.cookie.match(/platformId=([^;]*)/)?.[1] // 平台id
const websocketConfig = {
  user: '',
  admin: '',
  server: `${window.config.websocketURL}/endpointOyzc`,
  subscribe: `/platform/${platId}/message`,
  callback: [],
};
let stompClient = {};


function connect(callback) {
  console.log(SockJS)
  websocketConfig.callback.push(callback);
  const socket = new SockJS(websocketConfig.server);
  stompClient = Stomp.over(socket, null, { timeout: 15000});
  stompClient.connect({}, (frame) => {
    console.log(`Connected: ${frame}`);
    stompClient.subscribe(websocketConfig.subscribe, (res) => {
      // callback(res);
      websocketConfig.callback.forEach((e) => {
        e(res);
      })
      console.log(res);
    });
  });
  return websocketConfig;
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log('Disconnected');
}
export default {
  websocketConfig,
  connect,
  disconnect,
};
