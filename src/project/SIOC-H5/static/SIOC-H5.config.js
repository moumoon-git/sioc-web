window.config = {
    // 后端访问地址
    baseURL: 'http://192.168.1.189:8055',
    // 登录页面，登录失效时跳转。生产环境下，路由访问地址为：前端访问地址 + '/#/Login'。开发环境下，路由访问地址为：前端访问地址 + '/SIOC-H5/#/Login'
    loginURL: 'http://192.168.3.156:8080/SIOC-H5/#/Login',
    // websocket访问地址
    websocketUrl: 'http://192.168.3.43:8066',
    // websocketUrl: 'http://192.168.1.188:8066',
    searchUrl: 'http://192.168.1.189:8881',
    // 文件服务的地址
    fileUrl: 'http://192.168.3.43:8055',
    // 2.7 H5 访问地址，通过乾坤加载
    legacyH5URL: 'http://localhost:8081',
    // 服务映射
    service: {
        // 登录
        login: '/oauth',
        // 社会治理
        soc: '/ser',
        // EOC迁移（值班+事件+任务+预案）
        eoc: '/event',
        // 飞巡
        flight: '/device',
        // solr检索
        solr: '/solr',
        // 协同标绘
        coplotting: '/cooperate',
        // 文件
        file: '/fileupload',
        // app或H5
        app: '/app',
    },
    mapConfig: {
        // 初始化中心点
        center: {
            longitude: 113.25905,
            latitude: 23.12784,
            level: 17,
        },
        /**
         * 高德 GD 2300898618f6ce0fa1527f4e76866162
         * 百度 BD
         * 天地图 TDT 815233bc58d602a04377c6a2d30a3a51
         */
        mapBusiness: 'GD',
        mapBusinessAkey: '2300898618f6ce0fa1527f4e76866162',
        /* 项目上不用进行配置的：------------------------------------- start */
        // 天地图秘钥
        tk: '815233bc58d602a04377c6a2d30a3a51',
        // tk:'ef7bd303756eda494dc334c62c7b75cb',
    },
    debug: false, // 是否开启debug模式，项目部署默认为false，调试模式设置为true
};
