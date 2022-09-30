export default {
    namespaced: true,
    state: {
        btnData: [{
                name: '应急管理',
                active: true,
            },
            {
                name: '应急指挥',
                active: false,
            },
        ],
    },
    mutations: {
        SET_btnData(state, val) {
            state.btnData = val;
        },
    },
    actions: {},
    getters: {},
};