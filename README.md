# sinvie-3
> 使用vue-cli@4.5搭建的 Vue 3.0 + TypeScript 4.0 多页面项目。

- 公共能力（UI组件库、业务框架、工具库、静态资源等）统一在 `@/common` 里面管理，方便复用和维护
- 每个项目有各自的路由、vuex、全局变量、HTML 模板、脚本入口、静态文件，都可以引用公共能力

## 一、命令行相关

- 安装依赖：`npm install`
- 启用 devServer：`npm run dev` 或 `npm run serve` 或 `npm start`
- 打包构建：`npm run build`
  - 将根据启用的项目进行打包

## 二、目录树结构

```
sinvie-3
├─ .browserslistrc  # 浏览器配置
├─ .editorconfig  # 编辑器配置
├─ .eslintrc.js # eslint 配置
├─ .gitignore # git 忽略文件列表
├─ README.md  # 说明文档
├─ babel.config.js  # babel 配置
├─ config # 整体配置
│  ├─ library.config.js
│  └─ project.config.js
├─ package-lock.json  # 包信息
├─ package.json # 包信息
├─ public # 全局静态文件
├─ src  # 路径别名 @
│  ├─ common  # 所有项目共享资源
│  │  ├─ static # 共享静态文件，根据项目配置
│  │  │  └─ SuperMap  # 超图
│  │  └─ utils  # 常用工具函数
│  └─ project # 所有项目
│     ├─ demo # demo 项目
│     │  ├─ App.vue # demo 项目根组件
│     │  ├─ index.html  # demo 项目 HTML
│     │  ├─ index.ts  # demo 项目 JS 脚本入口
│     │  ├─ shims-vue.d.ts  # TypeScript 中定义 *.vue 模块
│     │  ├─ router  # demo 项目路由配置
│     │  │  └─ index.ts
│     │  ├─ static  # demo 项目静态文件夹
│     │  │  └─ demo.config.js # demo 项目全局变量配置（不能与其他项目冲突，且不能是*.ts）
│     │  ├─ store # demo 项目 vuex 配置
│     │  │  └─ index.ts
│     │  └─ views # demo 项目视图
│     │     ├─ page1.vue
│     │     └─ page2.vue
│     └─ # 其他项目
├─ tsconfig.json  # TypeScript 配置
└─ vue.config.js  # vue-cli 配置

```

## 三、相关配置

### [library.config.js](./config/library.config.js)

分为两部分，每个项目使用到的**共享静态资源**配置，以及所有可用的**共享静态资源**配置。

### [project.config.js](./config/project.config.js)

分为两部分，`projectBuildList` 数组表示启用的项目（不启用则不打包），后续内容为 *vue-cli* 配置，无需修改。
- *vue-cli* 配置：会使用每个项目文件夹中的`index.html`、`index.js`（或 `index.ts`） 和 `static` 文件夹

### 路由

- 尽量使用异步模块引入，并且配置 webpack 分 chunck
  - 异步模块：`component: () => import('../views/page2.vue')`
  - 分 chunk：`component: () => import(/* webpackChunkName: "page2" */ '../views/page2.vue')`
- 树摇（tree-shaking）与动态路由：webpack 设置了树摇，所有可能用到的页面都需要写入静态路由（否则不会被打包），动态路由通过导航守卫（`router.beforeEach`）判断跳转的页面是否满足权限来实现。
