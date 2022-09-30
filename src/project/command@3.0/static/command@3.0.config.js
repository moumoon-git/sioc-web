window.config = {
    baseURL: 'http://192.168.1.189:8055',
    websocketURL: 'http://192.168.1.188:8066',
    // websocketURL: 'http://192.168.3.107:8066',
    // websocketURL: 'http://192.168.3.43:8066/endpointOyzc',
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
            // longitude: 700562, // 禅城
            // latitude:  2542313, // 禅城
            // level: 11, // 禅城
        },
        // CLIENT_ID: '99eefd298fdc41b9af0fc9699b1cd4bf',
        // CLIENT_SCRECT: '5056cf818de74b8bbedef804c3f4f908',
        CLIENT_ID: 'e9f307cf120049ecae03e3f73d6214da', // EGIS配置
        CLIENT_SCRECT: '6a1930aa5bdf413d9f04fe0210c06f63', // EGIS配置
        WMTS_URL: 'http://172.21.12.74:8877/wmts', // 底图服务
        MAPURL: 'http://172.21.12.74:8877', // 地图映射服务ip地址
        MAPServerUrl: 'http://172.21.12.74:8877/egis/services/api', // 地图服务
        mapApiERIVCE_URL: 'http://172.21.12.74:8877/egis', // 获取token地址
        bounds: '',
        /*
         * 高德 GD 2300898618f6ce0fa1527f4e76866162
         * 百度 BDcccccc
         * 天地图 TDT 815233bc58d602a04377c6a2d30a3a51
        //  * 天地图没有骑行和驾车规划
         */
        mapBusiness: 'GD',
        mapBusinessAkey: '2300898618f6ce0fa1527f4e76866162',
        /* 项目上不用进行配置的：------------------------------------- start */
        // 天地图秘钥
        tk: '815233bc58d602a04377c6a2d30a3a51',
        // tk:'ef7bd303756eda494dc334c62c7b75cb',
    },
    sectionFlag: true, // 是否开启切片请求服务南海项目为true,其他的项目根据自身情况开启，默认为false
    proxyURL: '', // 服务器配置代理地址，项目访问彩云科技天气接口
    isShenXianProject: false, // 是否是莘县的项目，莘县项目请配置成true，其他地方不用修改
    HWASR: '', // 华为ASR访问录音的地址，项目使用百度语音转文字就配置
    // 与UDS链接的MQ配置
    UDSMQConfig: {
      heartbeatAckTime: 3, // 定时检测UDS心跳检测回复的时间(单位：秒)
      senderPrefix: 'uds_command_', // MqTopic的sender的前缀（与uds约定好了是以“uds+web项目名”作为sender的前缀）
    }
};
