export default {
    namespaced: true,
    state: {
        MapDataList: {
            openFlag: false,
            data: [],
            page: 1,
            maxPage: 1,
            request: false,
            typeName: '',
            handleType: '',
            totalCount: 0,
        },
        turnPages: {
            num: 0,
            state: false,
        },
    },
    mutations: {
        set_MapDataList(state, val) {
            state.MapDataList = val;
        },
        set_TurnPages(state, val) {
            state.turnPages = val;
        },
    },
    actions: {},
    getters: {},
};