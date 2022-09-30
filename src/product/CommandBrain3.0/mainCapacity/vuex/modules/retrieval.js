export default {
    namespaced: true,
    state: {
        // 资源检索启动状态
        retrievalStartupStatus: true,
        // 资源检索选中的类型
        retrievalSelectType: [{
                // 防护目标
                typeKey: 'protect',
            },
            {
                // 风险隐患
                typeKey: 'risk',
            },
            {
                // 避难场所
                typeKey: 'refuge',
            },
            {
                // 应急物资
                typeKey: 'material',
            },
            {
                // 监控
                typeKey: 'camera',
            },
            {
                // 设备
                typeKey: 'device',
            },
            {
                // 群组
                typeKey: 'colony',
            },
            // {
            // wecomm设备
            // typeKey: 'wecomm',
            // },
            {
                // 人员
                typeKey: 'personnel',
            },
            {
                // 队伍
                typeKey: 'team',
            },
        ],
        // 附近监控(nearbyMonitoring) 周边检索(peripheralSearch)
        peripheralSearch: {
            type: '',
            centerCircleData: {},
            sourceData: {},
        },
        // 是否关闭弹窗
        isClosePeripheralSearch: false,
        // 图例当前状态
        legendState: true,
    },
    mutations: {
        SET_retrievalStartupStatus(state, val) {
            state.retrievalStartupStatus = val;
        },
        SET_retrievalSelectType(state, val) {
            state.retrievalSelectType = val;
        },
        SET_peripheralSearch(state, val) {
            state.peripheralSearch = val;
        },
        SET_isClosePeripheralSearch(state, val) {
            state.isClosePeripheralSearch = val;
        },
        SET_legendState(state, val) {
            state.legendState = val;
        },
    },
    actions: {},
    getters: {},
};