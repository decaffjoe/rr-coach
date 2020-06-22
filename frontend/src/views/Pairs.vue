<template>
    <div>
        <button @click="skipCurrentSection('prev')">Previous Section</button>
        <router-link to="/"><button>Home</button></router-link>
        <button @click="skipCurrentSection('next')">Next Section</button>
        <h1>{{ currentSection }}</h1>
        <hr>
        <button @click="decrementSetNum" class="set">Previous set</button>
        <p class="set"><span>{{ currentSetNum }}</span> / <span>{{ currentSetRange }}</span></p>
        <button @click="incrementSetNum" class="set">Next set</button>
        <hr>
        <h2>{{ currentExercise }}</h2>
        <p>{{ currentRepGoal }}</p>
        <form action="" method="POST">
            <p>Completed: </p>
            <input type="text">
        </form>
        <p>The goal of this exercise is to train the body into becoming very strong and immensely handsome etc... etc...</p>
    </div>
</template>

<script>
export default {
    name: "Pairs",
    computed: {
        currentSetRange() { return this.maxSets[this.currentSection] },
        currentExercise() { return this.warmupExercises[this.currentSetNum - 1][0]},
        currentRepGoal() { return this.warmupExercises[this.currentSetNum - 1][1]},
    },
    components: {  },
    methods: {
        incrementSetNum() {
            ++this.currentSetNum;
            // check if value forces next exercise
            if (this.currentSetNum > this.maxSets[this.currentSection]) {
                // if not last exercise, change set number to 1
                if (!this.skipCurrentSection('next')) {
                    this.currentSetNum = 1;
                } else this.currentSetNum = this.maxSets[this.currentSection];
            }
        },
        decrementSetNum() {
            --this.currentSetNum;
            // check if value forces previous exercise
            if (this.currentSetNum < 1) {
                // if not first exercise, change set number to max of prev
                if (!this.skipCurrentSection('prev')) {
                    this.currentSetNum = this.maxSets[this.currentSection];
                } else this.currentSetNum = 1;
            }
        },
        skipCurrentSection(direction) {
            let keys = Object.keys(this.maxSets);
            let i = keys.indexOf(this.currentSection);
            // if skipping to next pair
            if (direction === 'next') {
                // if there is a next exercise
                if (i < keys.length - 1) this.currentSection = keys[i + 1];
                // if at extremity (last exercise)
                else return true;
            } else if (direction === 'prev') {
                // go back to previous exercise
                // if there is a previous exercise
                if (i > 0) this.currentSection = keys[i - 1];
                // if at extremity (first exercise)
                else return true;
            }
            // always start at first set
            this.currentSetNum = 1;
            return false;
        },
    },
    data() {
        return {
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
        }
    }
};
</script>

<style scoped>
form p {
    display: inline;
}
div {
    text-align: center;
}
button {
    background-color: brown;
}
.set {
    display: inline-block;
}
</style>
