import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

// ui state
const state = {
    // newUserId: undefined,
    // loginString: undefined,
    // currentSetNum: 1,
    // currentSection: 'warmup',
};

// update components with ui state
// using local computed arrow funcs for now...
const getters = {
    newUserId: state => state.newUserId,
    loginString: state => state.loginString,
};

// get/modify backend state
const actions = {
};

// backend state -> ui state
const mutations = {
    createUser: (state, userId) => {
        return state.newUserId = userId;
    },
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
