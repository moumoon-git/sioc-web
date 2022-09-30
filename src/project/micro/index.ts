// 修改 webpack 运行时 publicPath
import './public-path';
import { createApp } from 'vue';
import Element from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import Viewer from '@/product/CommandBrain3.0/Generalparts/directives/Viewer/';
import App from './App.vue';

interface IncomingProps {
  [p: string]: any
}

declare global {
  interface Window {
    microProps: IncomingProps,
    render: (props: IncomingProps) => void,
  }
}

function setConfig(props?: IncomingProps) {
  if (props) {
    window.microProps = props;
    props.container.style.width = '100%';
    props.container.style.height = '100%';
  }
}

function render(props?: IncomingProps) {
  setConfig(props);
  const app = createApp(App);
  app.config.globalProperties.microProps = props || window.microProps;
  app
    .use(Element, { zIndex: 20000, locale })
    .directive('viewer', Viewer)
    .mount('#micro');
}

window.render = render;

// 不配合 qiankun 使用时独立渲染
if (
  process.env.NODE_ENV === 'development'
  && !window.__POWERED_BY_QIANKUN__
) {
  render();
  document.body.style.width = '100vw';
  document.body.style.height = '100vh';
}

// qiankun 微应用生命周期钩子函数
export async function bootstrap(): Promise<void> {
  // 只在首次初始化时执行
  console.log('【qiankun】bootstrap');
}
export async function mount(props: IncomingProps): Promise<void> {
  // 每次加载页面时执行
  console.log('【qiankun】mount', props);
  render(props);
}
export async function unmount(): Promise<void> {
  // 每次卸载页面时执行
  console.log('【qiankun】unmount');
}
