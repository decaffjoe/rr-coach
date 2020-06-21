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
    currentExercise: 'warmup',
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
    prevSet({ commit }) { commit('incrementSetNum', state.currentSetNum - 1); },
    nextSet({ commit }) { commit('incrementSetNum', state.currentSetNum + 1); },
    prevPair({ commit }) { commit('skipCurrentExercise', 'prev') },
    nextPair({ commit }) { commit('skipCurrentExercise', 'next') },
};

// backend state -> ui state
const mutations = {
    incrementSetNum: (state, value) => {
        // check if value forces next or previous exercise
        if (value > state.maxSets[state.currentExercise]) {
            // if not last exercise, change set number to 1
            if (!mutations.skipCurrentExercise(state, 'next')) {
                state.currentSetNum = 1;
            }
        } else if (value < 1) {
            // if not first exercise, change set number to max of prev
            if (!mutations.skipCurrentExercise(state, 'prev')) {
                state.currentSetNum = state.maxSets[state.currentExercise];
            }
        }
        else state.currentSetNum = value;
    },
    skipCurrentExercise: (state, value) => {
        let keys = Object.keys(state.maxSets);
        let i = keys.indexOf(state.currentExercise);
        // if skipping to next pair
        if (value === 'next') {
            // if there is a next exercise
            if (i < keys.length - 1) state.currentExercise = keys[i + 1];
            // if at extremity (last exercise)
            else return true;
        } else if (value === 'prev') {
            // go back to previous exercise
            // if there is a previous exercise
            if (i > 0) state.currentExercise = keys[i - 1];
            // if at extremity (first exercise)
            else return true;
        }
        // always start at first set
        state.currentSetNum = 1;
        return false;
    }
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
    // modules: {}
});
