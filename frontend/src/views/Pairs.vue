<template>
    <div>
        <button @click="skipCurrentSection('prev')">Previous Section</button>
        <router-link to="/"><button>Home</button></router-link>
        <button @click="skipCurrentSection('next')">Next Section</button>
        <h1>{{ currentSection }}</h1>
        <hr>
        <button @click="decrementSetNum" class="set">Previous set</button>
        <p class="set"><span>{{ currentSetNum }}</span> / <span>{{ currentMaxSets }}</span></p>
        <button @click="incrementSetNum" class="set">Next set</button>
        <hr>
        <h2>{{ currentExercise }}</h2>
        <p>Rep Goal: {{ currentRepGoal }}</p>
        <p id="completed">Completed: </p>
        <input @keypress.enter="postSet" v-model="repsDone" type="text">
        <p>The goal of this exercise is to train the body into becoming very strong and immensely handsome etc... etc...</p>
    </div>
</template>

<script>
export default {
    name: "Pairs",
    computed: {
        currentMaxSets() { return this.sections[this.currentSection]['maxSets'] },
        currentExercise() { return this.sections[this.currentSection]['exercises'][this.currentSetNum - 1] },
        currentRepGoal() { return this.sections[this.currentSection]['reps'][this.currentSetNum - 1] },
        allSections() { return Object.keys(this.sections) },
    },
    components: {  },
    methods: {
        incrementSetNum() {
            ++this.currentSetNum;
            // check if value forces next exercise
            if (this.currentSetNum > this.currentMaxSets) {
                // if not last exercise, change set number to 1
                if (!this.skipCurrentSection('next')) {
                    this.currentSetNum = 1;
                } else this.currentSetNum = this.currentMaxSets;
            }
        },
        decrementSetNum() {
            --this.currentSetNum;
            // check if value forces previous exercise
            if (this.currentSetNum < 1) {
                // if not first exercise, change set number to max of prev
                if (!this.skipCurrentSection('prev')) {
                    this.currentSetNum = this.currentMaxSets;
                } else this.currentSetNum = 1;
            }
        },
        skipCurrentSection(direction) {
            let i = this.allSections.indexOf(this.currentSection);
            // if skipping to next pair
            if (direction === 'next') {
                // if there is a next exercise
                if (i < this.allSections.length - 1) this.currentSection = this.allSections[i + 1];
                // if at extremity (last exercise)
                else return true;
            } else if (direction === 'prev') {
                // go back to previous exercise
                // if there is a previous exercise
                if (i > 0) this.currentSection = this.allSections[i - 1];
                // if at extremity (first exercise)
                else return true;
            }
            // always start at first set
            this.currentSetNum = 1;
            return false;
        },
        postSet() {
            // if reps have been entered
            if (this.repsDone) {
                // create the target url, adjust set number
                let url, adjSet;
                if (this.currentSection === 'Core') {
                    // url
                    if ([1, 4, 7].includes(this.currentSetNum)) {
                        url = `http://localhost:3000/exercise/${this.sections[this.currentSection]['path1']}Set`;
                    } else if ([2, 5, 8].includes(this.currentSetNum)) {
                        url = `http://localhost:3000/exercise/${this.sections[this.currentSection]['path2']}Set`;
                    } else url = `http://localhost:3000/exercise/${this.sections[this.currentSection]['path3']}Set`;
                    // set number
                    if ([1, 2, 3].includes(this.currentSetNum)) adjSet = 1;
                    else if ([4, 5, 6].includes(this.currentSetNum)) adjSet = 2;
                    else adjSet = 3;
                } else {
                    // url
                    if (this.currentSetNum % 2 !== 0) {
                        url = `http://localhost:3000/exercise/${this.sections[this.currentSection]['path1']}Set`;
                    } else url = `http://localhost:3000/exercise/${this.sections[this.currentSection]['path2']}Set`;
                    // set number
                    if (this.currentSetNum === 1 || this.currentSetNum === 2) adjSet = 1;
                    else if (this.currentSetNum === 3 || this.currentSetNum === 4) adjSet = 2;
                    else adjSet = 3;
                }
                // make the post request
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify({
                        reps: parseInt(this.repsDone),
                        setNumber: adjSet,
                        progression: 4,
                        workout_id: 4
                    })
                }).then(res => console.log(res)).catch(err => console.log(err));
            } else console.log('loser');
        }
    },
    data() {
        return {
            repsDone: undefined,
            currentSetNum: 1,
            currentSection: 'Pullups & Squats',
            sections: {
                'Warmups': {
                    maxSets: 8,
                    exercises: ["Yuri's Shoulder Band Warmup", "Squat Sky Reaches", "GMB Wrist Prep", "Deadbugs", "Arch Hangs", "Support Hold", "Easier Squat Progression", "Easier Hinge Progression"],
                    reps: ["5 - 10", "5 - 10", "10+", "30s", "10", "30s", "10", "10"],
                },
                'Pullups & Squats': {
                    maxSets: 6,
                    exercises: ["Pullups", "Squats", "Pullups", "Squats", "Pullups", "Squats"],
                    reps: ["5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8"],
                    path1: 'pullup',
                    path2: 'squat',
                },
                'Dips & Hinges': {
                    maxSets: 6,
                    exercises: ["Dips", "Hinges", "Dips", "Hinges", "Dips", "Hinges"],
                    reps: ["5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8"],
                    path1: 'dip',
                    path2: 'hinge',
                },
                'Rows & Pushups': {
                    maxSets: 6,
                    exercises: ["Rows", "Pushups", "Rows", "Pushups", "Rows", "Pushups"],
                    reps: ["5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8"],
                    path1: 'row',
                    path2: 'pushup',
                },
                'Core': {
                    maxSets: 9,
                    exercises: ["Anti-Extensions", "Anti-Rotations", "Extensions", "Anti-Extensions", "Anti-Rotations", "Extensions", "Anti-Extensions", "Anti-Rotations", "Extensions"],
                    reps: ["8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12"],
                    path1: 'antiextension',
                    path2: 'antirotation',
                    path3: 'extension',
                }
            },
        }
    }
};
</script>

<style scoped>
#completed {
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
