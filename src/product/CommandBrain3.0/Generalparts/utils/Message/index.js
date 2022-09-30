import './style/index.scss';

/**
 * @description 悬浮消息
 * @param {*} message 消息内容
 * @param {Number|String} duration 持续时间
 * @return {Object} 消息实例DOM元素
 */
const svmessage = function svmessage(message, duration = 5000) {
  // 创建总的消息容器
  let container = document.getElementById('sv-message');
  if (!container) {
    container = document.createElement('div');
    container.id = 'sv-message';
    container.className = 'sv-message';
    document.body.appendChild(container);
  }
  // 消息实例
  const messageBox = document.createElement('div');
  messageBox.className = 'sv-message--info';
  messageBox.innerHTML = `<div>${message}</div>`;
  container.insertBefore(messageBox, container.firstChild);
  if (Number(duration)) {
    setTimeout(() => {
      container.removeChild(messageBox);
    }, Number(duration));
  }
  return messageBox;
};

svmessage.info = svmessage;
svmessage.success = svmessage;
svmessage.error = function svmessageError(message, duration = 5000) {
  const messageBox = svmessage(message, duration);
  console.error(message);
  messageBox.className = 'sv-message--error';
  return messageBox;
};

export default svmessage;
