/* eslint-disable */
if (window.__POWERED_BY_QIANKUN__) {
  // 生产环境时，publicPath 是服务器的地址
  // 开发环境时，写死 localhost:8080，否则资源加载会出错
  __webpack_public_path__ = process.env.NODE_ENV === 'production'
    ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ as string
    : 'http://localhost:8080/';
}
