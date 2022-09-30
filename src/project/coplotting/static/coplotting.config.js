window.config = {
    baseURL: 'http://192.168.3.155:8055',
    websocketURL: 'http://192.168.1.188:8066', // websocket
    // 登录页面，登录失效时跳转
    loginURL: 'http://124.71.14.193:8055',
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
    // MQ服务器地址，用于UDS
    MQServer: 'ws://192.168.1.185:61614',
    project: 'SZ',
    cityName: '南海', // 城市名，用于搜索服务
    mapConfig: {
        // 初始化中心点
        center: {
            longitude: 113.25905,
            latitude: 23.12784,
            level: 17,
        },
        WMTS_URL: 'http://120.52.31.31:590', // 地图服务地址
        mapApiERIVCE_URL: 'http://120.52.31.31:590', // 地图接口服务地址
        /**
         * 高德 GD 2300898618f6ce0fa1527f4e76866162
         * 百度 BD
         * 天地图 TDT 815233bc58d602a04377c6a2d30a3a51
         * EGIS 秘钥要动态获取
         */
        mapBusiness: 'GD', // SJS EGIS TDT GD 点搜索、逆地理坐标转换服务
        mapBusinessAkey: '2300898618f6ce0fa1527f4e76866162',
        /* 项目上不用进行配置的：------------------------------------- start */
        // 天地图秘钥 地图加载时的秘钥 EGIS 秘钥要动态获取
        tk: '815233bc58d602a04377c6a2d30a3a51',
        CLIENT_ID: '22a42f65c8c44724b5703efd54bf5782',
        CLIENT_SCRECT: 'aa9001532bd34279a97e3b01bf6173f9',
    },
    // 飞巡MQ链接配置，后台还没处理好用户和登录暂时以这种方式
    dispatchDeskConfig: {
        server: 'ws://124.71.14.193:61614',
        user: 'admin',
        pwd: 'admin',
        // sendUrl: 'eoschenbin',
        sendUrl: 'eoslwx', // uds登录的用户
        topic: '2090010', // web端的坐席
    },
    token: '123',
    // 与UDS链接的MQ配置
    UDSMQConfig: {
      heartbeatAckTime: 3, // 定时检测UDS心跳检测回复的时间(单位：秒)
      senderPrefix: 'uds_coplotting_', // MqTopic的sender的前缀（与uds约定好了是以“uds+web项目名”作为sender的前缀）
    }
};