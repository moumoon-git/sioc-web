export default {
    namespaced: true,
    state: {
        resAllocationData: {},
    },
    mutations: {
        SET_resAllocationData(state, val) {
            state.resAllocationData = val;
        },
    },
    actions: {},
    getters: {},
};