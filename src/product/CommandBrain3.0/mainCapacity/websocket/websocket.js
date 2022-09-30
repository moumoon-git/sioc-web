const SockJS = require('@/product/CommandBrain3.0/mainCapacity/uds/sockjs(1.0).min');

var websocketConfig = {
    user: '',
    admin: '',
    server: window.config.websocketURL+'/endpointOyzc',
    subscribe: '',
    callback: {},
}
var stompClient = {};

function errorCallback(params) {
    console.log(params);
    // websocketConfig.callback(400);
}

function connect(argument=[]) {
    // websocketConfig.callback = callback;
    var socket = new SockJS(websocketConfig.server);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('websocket Connected: ' + frame);
        argument.forEach((item) =>{
            stompClient.subscribe(item.subscribe, function(res) {
                console.log('websocket订阅的res', res)
                item.callback(res);
            });
        });
    }, errorCallback);
}

function disconnect() {
    if (stompClient !== null && stompClient.connected) {
        stompClient.disconnect();
    }
    console.log("websocket Disconnected");
}

function sendName() {
    stompClient.send("/platform/check", {}, JSON.stringify({ 'name': $("#name").val() }));
}

export default {
    websocketConfig,
    connect,
    disconnect,
    sendName
}