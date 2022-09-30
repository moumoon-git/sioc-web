window.config = {
    baseURL: 'http://192.168.1.189:8055',
    websocketURL: 'http://192.168.1.188:8066',
    // 登录页面，登录失效时跳转
    loginURL: 'http://172.21.12.73:8055',
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
        // 设备
        device: '/device',
    },
    // MQ服务器地址，用于UDS
    MQServer: 'ws://192.168.1.185:61614',
    project: 'SZ',
    cityName: '广州', // 城市名，用于搜索服务
    mapConfig: {
        // 初始化中心点
        center: {
            longitude: 113.25905,
            latitude: 23.12784,
            level: 17,
        },
        CLIENT_ID: '99eefd298fdc41b9af0fc9699b1cd4bf',
        CLIENT_SCRECT: '5056cf818de74b8bbedef804c3f4f908',
        WMTS_URL: 'http://172.21.12.74:8877/wmts', // 底图服务
        MAPURL: 'http://172.21.12.74:8877',
        MAPServerUrl: 'http://172.21.12.74:8877/mapServer', // 地图服务
        /*
        * 高德 GD 2300898618f6ce0fa1527f4e76866162
        * 百度 BDcccccc
        * 天地图 TDT 815233bc58d602a04377c6a2d30a3a51
        */
        mapBusiness: 'GD',
        mapBusinessAkey: '2300898618f6ce0fa1527f4e76866162',
        /* 项目上不用进行配置的：------------------------------------- start */
        // 天地图秘钥
        tk: '815233bc58d602a04377c6a2d30a3a51',
        // tk:'ef7bd303756eda494dc334c62c7b75cb',
    },
    // 飞巡MQ链接配置，后台还没处理好用户和登录暂时以这种方式
    dispatchDeskConfig: {
        server: 'ws://192.168.1.185:61614',
        user: 'admin',
        pwd: 'admin',
        // sendUrl: 'eoschenbin',
        sendUrl: 'eoslwx', // uds登录的用户
        // sendUrl: 'eosjrl', // uds登录的用户
        topic: '2090020', // web端的坐席
    },
    sectionFlag: false, // 是否开启切片请求服务南海项目为true,其他的项目根据自身情况开启，默认为false,大屏不建议开启
    proxyURL: '', // 服务器配置代理访问外网的地址。录音语音转文字和天气要用到
    isStartUdsVideoWall: true, // 可视化右侧视频墙调用uds显示视频(为false则使用rtmp推流、为true则调用uds方式)
    videoOption: {
        x: 0, // 视频墙左距
        y: 0, // 视频墙上距
        w: 600, // 视频墙宽度
        h: 300, // 视频墙高度
    },
    // 与UDS链接的MQ配置
    UDSMQConfig: {
      heartbeatAckTime: 3, // 定时检测UDS心跳检测回复的时间(单位：秒)
      senderPrefix: 'uds_largeScreen_', // MqTopic的sender的前缀（与uds约定好了是以“uds+web项目名”作为sender的前缀）
    }
};
