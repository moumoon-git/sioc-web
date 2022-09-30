export default {
    namespaced: true,
    state: {
        // 从首页跳转时这个地图的所有信息
        selfMap: {},
        mapId: 0,
        // 指挥一张图 和 协同标绘共用当前这个功能
        // 打开or关闭详情弹窗
        detailsPopUp: {
            handleType: '', // 操作类型 add 添加 vis 显示 edit编辑
            handleData: {}, // 操作的数据 包括获取详情的id
            flag: false, // 打开或者关闭
            title: '', // 详情弹窗时的模块 标注详情
        },
        // 图形绘制完成时的图形参数
        graphicParameters: {
            // 绘制类型 点 spot 线 line 面 noodles 其他 other
            type: '',
            // 图形id mark 使用 icon.imageDiv.id vector 使用 feature.geometry.id
            typeId: 0,
            // 图形名称
            convergeName: '',
            // 图形类型
            graphicalType: '',
        },
        // 每个图形第一个点信息
        pointInformation: {},
        // 模板标绘 调起绘制事件的数据
        drawingWventsData: {},
        // 编辑图形时的数据
        editCovData: {
            position: { longitude: 0, laitude: 0 },
            handleType: '', // mark vector
            flag: false, // 控制绘制弹窗的显示
        },
        // 标注详情弹窗
        taggingInfo: {
            title: '', // 详情弹窗时的模块 标注详情
            flag: false, // 是否打开
            handleData: {}, // 传入的数据
        },
        // 地图上删除的时候改变这个值
        deleteId: 0,
        // 保存之后的id
        saveId: 0,
        // 保存之后绘制到统一图层上
        coverageBeforDraw: {
            // 操作类型 点和线或者面 spot line noodle other
            handleType: '',
            // 操作数据
            handleData: [],
        },
        // 取消绘制 或者 完成绘制
        cancelDraw: {
            flag: false,
            handleData: {},
        },
        // 是否刷新协作标绘分组列表
        isRefrashGroup: false,
        // 是否刷新邀请协作管理列表
        isRefrashCoop: false,
        allMapsData: [],
        // 查看更多的数据
        seeMoreObj: {
            data: {},
            active: '',
            openFlag: false, // 打开更多的弹窗
        },
        // 是否刷新平台分享列表
        isRefreshShareList: false,
        // 是否禁用标注详情编辑按钮
        disabledValue: false,
        // 子平台协作新增的标注的id
        coopLayerId: 0,
        // 是否开启协作动态跟踪功能
        isDynamic: true,
        // 当前打开的弹窗id
        selfPopupId: '',
    },
    mutations: {
        // 这个不进行深拷贝
        SET_detailsPopUp(state, val) {
            state.detailsPopUp = val;
        },
        SET_graphicParameters(state, val) {
            state.graphicParameters = val;
        },
        SET_pointInformation(state, val) {
            state.pointInformation = JSON.parse(JSON.stringify(val));
        },
        SET_drawingWventsData(state, val) {
            state.drawingWventsData = val;
        },
        SET_editCovData(state, val) {
            state.editCovData = val;
        },
        SET_taggingInfo(state, val) {
            state.taggingInfo = val;
        },
        SET_deleteId(state, val) {
            state.deleteId = val;
        },
        SET_saveId(state, val) {
            state.saveId = val;
        },
        SET_coverageBeforDraw(state, val) {
            state.coverageBeforDraw = val;
        },
        SET_NEW__MAPID(state, val) {
            state.mapId = val;
        },
        SET_selfMap(state, val) {
            state.selfMap = val;
        },
        SET_cancelDraw(state, val) {
            state.cancelDraw = val;
        },
        SET_REFRASHGROUP(state, val) {
            state.isRefrashGroup = val;
        },
        SET_REFRASHCOOP(state, val) {
            state.isRefrashCoop = val;
        },
        SET_AllMAPSDATA(state, val) {
            state.allMapsData = val;
        },
        SET_SeeMoreObj(state, val) {
            state.seeMoreObj = val;
        },
        SET_isRefreshShareList(state, val) {
            state.isRefreshShareList = val;
        },
        SET_DISABLEDVALUE(state, val) {
            state.disabledValue = val;
        },
        SET_COOPLAYERID(state, val) {
            state.coopLayerId = val;
        },
        SET_ISDYNAMIC(state, val) {
            state.isDynamic = val;
        },
        SET_selfPopupId(state, val) {
            state.selfPopupId = val;
        },
    },
    actions: {},
    getters: {},
};