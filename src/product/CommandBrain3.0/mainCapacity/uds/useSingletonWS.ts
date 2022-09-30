import { App } from 'vue';
import MQClient from './MQClient';

export const ws = new MQClient({
  server: `${(window as any).config.websocketURL || (window as any).config.websocketUrl}/endpointOyzc`,
  user: '',
  password: '',
  agent: '',
});

export default (app: App): void => {
  app.config.globalProperties.$ws = ws;
};
