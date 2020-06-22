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
    currentSetNum: 1,
    currentSection: 'warmup',
    warmupExercises: [["Yuri's Shoulder Band Warmup", "5 - 10"], ["Squat Sky Reaches", "5 - 10"], ["GMB Wrist Prep", "10+"], ["Deadbugs", "30s"], ["Arch Hangs", "10"], ["Support Hold", "30s"], ["Easier Squat Progression", "10"], ["Easier Hinge Progression", "10"]],
};

// update components with ui state
// using local computed arrow funcs for now...
const getters = {
    // currentSection: state => state.currentSection,
    // currentSetNum: state => state.currentSetNum,
    // currentSetRange: state => state.maxSets[state.currentSection],
    // warmupExercises: state => state.warmupExercises
};

// get/modify backend state
const actions = {
    prevSet({ commit }) { commit('incrementSetNum', state.currentSetNum - 1); },
    nextSet({ commit }) { commit('incrementSetNum', state.currentSetNum + 1); },
    prevPair({ commit }) { commit('skipCurrentSection', 'prev') },
    nextPair({ commit }) { commit('skipCurrentSection', 'next') },
};

// backend state -> ui state
const mutations = {
    incrementSetNum: (state, value) => {
        // check if value forces next or previous exercise
        if (value > state.maxSets[state.currentSection]) {
            // if not last exercise, change set number to 1
            if (!mutations.skipCurrentSection(state, 'next')) {
                state.currentSetNum = 1;
            }
        } else if (value < 1) {
            // if not first exercise, change set number to max of prev
            if (!mutations.skipCurrentSection(state, 'prev')) {
                state.currentSetNum = state.maxSets[state.currentSection];
            }
        }
        else state.currentSetNum = value;
    },
    skipCurrentSection: (state, value) => {
        let keys = Object.keys(state.maxSets);
        let i = keys.indexOf(state.currentSection);
        // if skipping to next pair
        if (value === 'next') {
            // if there is a next exercise
            if (i < keys.length - 1) state.currentSection = keys[i + 1];
            // if at extremity (last exercise)
            else return true;
        } else if (value === 'prev') {
            // go back to previous exercise
            // if there is a previous exercise
            if (i > 0) state.currentSection = keys[i - 1];
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
