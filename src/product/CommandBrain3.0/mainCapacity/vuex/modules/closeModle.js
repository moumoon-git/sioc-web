export default {
    namespaced: true,
    state: {
        closeModle: {
            name: '',
            flag: false,
        },
    },
    mutations: {
        SET_closeModle(state, newEvent) {
            state.closeModle = newEvent;
        },
    },
    actions: {},
    getters: {},
};