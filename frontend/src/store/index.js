import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

// ui state
const state = {
    maxSets: {
        'warmup': 8,
        'pullsquat': 6,
        'diphinge': 6,
        'rowpush': 6,
        'core': 9
    },
    currentExercise: 'pullsquat',
    currentSetNum: 1
};

// update components with ui state
const getters = {
    currentExercise: state => state.currentExercise,
    currentSetNum: state => state.currentSetNum,
    currentSetRange: state => state.maxSets[state.currentExercise]
};

// get/modify backend state
const actions = {
    nextSet({ commit }) { commit('updateCurrentSetNum', state.currentSetNum + 1); },
    prevSet({ commit }) { commit('updateCurrentSetNum', state.currentSetNum - 1); }
};

// backend state -> ui state
const mutations = {
    updateCurrentSetNum: (state, value) => {
        // check if value forces next or previous exercise
        if (value > state.maxSets[state.currentExercise]) {
            // progress to next exercise
            let keys = Object.keys(state.maxSets);
            let i = keys.indexOf(state.currentExercise);
            // if there is a next exercise
            if (i < keys.length - 1) {
                state.currentExercise = keys[i + 1];
                // start at first set
                value = 1;
            }
            else value = state.maxSets[state.currentExercise];
        } else if (value < 1) {
            // go back to previous exercise
            let keys = Object.keys(state.maxSets);
            let i = keys.indexOf(state.currentExercise);
            // if there is a previous exercise
            if (i > 0) {
                state.currentExercise = keys[i - 1];
                // start at last set
                value = state.maxSets[state.currentExercise];
            }
            else value = 1;
        }
        state.currentSetNum = value;
    }
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
    // modules: {}
});
