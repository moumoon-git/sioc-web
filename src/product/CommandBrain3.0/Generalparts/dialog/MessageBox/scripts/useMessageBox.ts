import { ref, getCurrentInstance } from 'vue';

// 1. States

// 弹窗是否可见
const visible = ref(false);
// 弹窗类型: prompt delete success
const type = ref('prompt');
// 弹窗标题
const title = ref('提示');
// 消息
const message = ref('是否确认当前操作？');
// 消息提示
const tips = ref('');
// 是否显示备注栏
const showRemark = ref(false);
// 备注栏的值
const remarkValue = ref('');
// 备注栏的 placeholder
const placeholder = ref('写点什么呢？');
// type === 'success' 自动关闭弹窗倒计时
const countDown = ref(3);
// 确认 callback
const resolve = ref((param: unknown) => {
  console.log('missing resolve', param);
});
// 取消 callback
const reject = ref((param: unknown) => {
  console.log('missing reject', param);
});

// 2. Methods

// 清空 state
const close = () => {
  visible.value = false;
  type.value = 'prompt';
  title.value = '提示';
  message.value = '是否确认当前操作？';
  tips.value = '';
  showRemark.value = false;
  remarkValue.value = '';
  placeholder.value = '写点什么呢？';
};
// 点击确认
const handleConfirm = () => {
  resolve.value(remarkValue.value);
  close();
};
// 点击取消
const handleCancel = () => {
  reject.value('取消');
  close();
};
// 初始化弹窗
const init = (options: {
  type?: string,
  title?: string,
  message?: string,
  tips?: string,
  remark?: boolean,
  placeholder?: string,
}) => {
  if (options.type) type.value = options.type;
  if (options.title) title.value = options.title;
  if (options.message) message.value = options.message;
  if (options.tips) tips.value = options.tips;
  if (options.remark) {
    showRemark.value = true;
    placeholder.value = options.placeholder || '写点什么呢？';
  }
  visible.value = true;
  if (options.type === 'success') {
    countDown.value = 3;
    setTimeout(() => {
      countDown.value = 2;
    }, 1000);
    setTimeout(() => {
      countDown.value = 1;
    }, 2000);
    setTimeout(() => {
      countDown.value = 0;
    }, 3000);
    setTimeout(() => {
      handleConfirm();
    }, 4000);
  }
  return new Promise((res, rej) => {
    resolve.value = res;
    reject.value = rej;
  });
};

export default () => {
  // 将方法挂载到全局
  const ins = getCurrentInstance();
  if (ins) {
    ins.appContext.config.globalProperties.$MessageBox = init;
  }
  return {
    visible,
    type,
    title,
    message,
    tips,
    showRemark,
    remarkValue,
    placeholder,
    countDown,
    resolve,
    reject,
    init,
    handleCancel,
    handleConfirm,
  };
};
