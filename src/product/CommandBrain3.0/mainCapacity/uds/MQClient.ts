import { onBeforeUnmount } from 'vue';

const SockJS = require('@/product/CommandBrain3.0/mainCapacity/uds/sockjs(1.0).min');

const { Stomp } = <any>window;

interface Config {
  server: string,
  user: string | number,
  password: string | number,
  agent: string | number,
}

class MQClient {
  config: Config

  client: any

  subscribedMap: Map<string, Set<any> & { unsubscribe?: () => void }>

  /**
   * 构造函数
   * @param server MQ服务器地址
   * @param user 用户名
   * @param password 密码
   * @param agent 坐席
   */
  constructor(options: {
    server: string,
    user: string | number,
    password: string | number,
    agent: string | number,
  }) {
    this.config = options;
    this.subscribedMap = new Map();
    this.establish();
    try {
      // When it is used in setup(), try disconnect automatically.
      onBeforeUnmount(() => {
        this.disconnect();
      });
    } finally {
      // do nothing
    }
  }

  get connected(): boolean {
    if (this.client) {
      return this.client.connected;
    }
    return false;
  }

  /**
   * 唤醒本地UDS客户端
   */
  waken(): void {
    const a = document.createElement('a');
    a.href = `sinvie-uds://localhost/?action=login&user=${this.config.user}&pwd=${this.config.password}&agent=${this.config.agent}`;
    console.log('唤醒本地UDS客户端链接')
    console.log(a.href)
    a.click();
  }

  /**
   * 与MQ服务器建立连接
   * @param count 错误重连的次数
   */
  establish = (count = 1): void => {
    if (!this.client) {
      if (this.config.server.toLowerCase().startsWith('http')) {
        this.client = Stomp.over(new SockJS(this.config.server));
      } else {
        this.client = Stomp.client(this.config.server);
      }
    }
    this.client.connect(
      this.config.user,
      this.config.password,
      () => {
        console.log(`【MQClient】与 ${this.config.server} 建立 Stomp 协议连接成功：`, this);
      },
      this.errorCallback(count),
    );
  }

  /**
   * 建立连接发生错误，重试（最多5次）
   * @param errorMessage 错误消息
   */
  errorCallback = (count: number) => (errorMessage: unknown): void => {
    if (count <= 5) {
      console.error('Establish error:', errorMessage);
      setTimeout(() => this.establish(count + 1), 1000);
    }
  }

  /**
   * 向MQ服务器发送一条消息
   * @param url 目标地址
   * @param message 消息体
   * @param headers 消息头
   */
  send(url: string, message: string | Record<string, any>, headers: any = {}): void {
    if (!this.connected) {
      throw Error('Client is not established or disconnected.');
    }
    if (typeof headers !== 'object') {
      throw Error('Argument `headers` must be an object.');
    }
    if (typeof message === 'string') {
      this.client.send(url, headers, message);
    } else {
      this.client.send(url, headers, JSON.stringify(message));
    }
  }

  /**
   * 监听/订阅某个地址的返回消息
   * @param url 监听的地址
   * @param handler 回调函数
   * @returns 返回一个取消监听的函数
   */
  subscribe(
    url: string,
    handler: (messageBody: Record<string, any> | string, fullMessage?: Record<string, any>) => void,
  ): () => void {
    if (!this.connected) {
      this.establish();
    }
    this.whenConnected().then(() => {
      if (this.subscribedMap.has(url)) {
        // Append to queue.
        this.subscribedMap.get(url)!.add(handler);
      } else {
        // Create and append to queue.
        const callbackQueue: Set<any> & { unsubscribe?: () => void } = new Set([handler]);
        this.subscribedMap.set(url, callbackQueue);
        // When receive message, flush callbacks.
        callbackQueue.unsubscribe = this.client.subscribe(url, (message: any) => {
          let formattedMessage: any;
          try {
            formattedMessage = JSON.parse(message.body);
          } catch {
            formattedMessage = message.body;
          }
          callbackQueue.forEach((callback: any) => {
            try {
              callback(formattedMessage, message);
            } catch (e) {
              console.error(e);
            }
          });
        }).unsubscribe;
      }
    });
    // used to unsubscribe
    return () => {
      const callbackQueue = this.subscribedMap.get(url);
      if (callbackQueue) {
        callbackQueue.delete(handler);
        // When each callback queue is empty, clear related data.
        if (callbackQueue.size === 0 && callbackQueue.unsubscribe) {
          callbackQueue.unsubscribe();
          this.subscribedMap.delete(url);
        }
      }
    };
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.client.disconnect();
    this.subscribedMap.clear();
  }

  /**
   * 轮询判断是否连接
   * @returns 客户端实例
   */
  whenConnected(): Promise<MQClient> {
    return new Promise((resolve) => {
      const timer = window.setInterval(() => {
        if (this.connected) {
          resolve(this);
          clearInterval(timer);
        }
      }, 100);
    });
  }
}

export default MQClient;
