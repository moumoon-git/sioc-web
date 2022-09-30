window.config = {
    baseURL: 'http://192.168.1.189:8055',
    // 登录页面，登录失效时跳转
    loginURL: 'http://192.168.1.189:8055',
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
    project: 'SZ',
    // MQ服务器地址，用于UDS
    MQServer: 'ws://192.168.1.185:61614',
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
    // 飞巡MQ链接配置，后台还没处理好用户和登录暂时以这种方式
    dispatchDeskConfig: {
        server: 'ws://192.168.1.185:61614',
        user: 'admin',
        pwd: 'admin',
        // sendUrl: 'eoschenbin',
        sendUrl: 'eosdel', // uds登录的用户
        // sendUrl: 'eosjrl', // uds登录的用户
        topic: '6009', // web端的坐席
    },
    isShenXianProject: true, // 是否是莘县的项目，莘县项目请配置成true，其他地方不用修改（禅道13566）
    // 与UDS链接的MQ配置
    UDSMQConfig: {
      heartbeatAckTime: 3, // 定时检测UDS心跳检测回复的时间(单位：秒)
      senderPrefix: 'uds_flightPatrol_', // sender的前缀（与uds约定好了是以“uds+web项目名”作为sender的前缀）
    }
};