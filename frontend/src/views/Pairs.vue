<template>
    <div>
        <button @click="skipCurrentSection('prev')">Previous Section</button>
        <router-link to="/"><button>Home</button></router-link>
        <button @click="skipCurrentSection('next')">Next Section</button>
        <button @click="goToSummary">Workout Summary</button>
        <h1>{{ currentSection }}</h1>
        <hr>
        <button @click="decrementSetNum" class="set">Previous set</button>
        <p class="set"><span>{{ currentSetNum }}</span> / <span>{{ currentMaxSets }}</span></p>
        <button @click="incrementSetNum" class="set">Next set</button>
        <hr>
        <h2>{{ currentExercise }}</h2>
        <p>Rep Goal: {{ currentRepGoal }}</p>
        <p id="completed" v-if="currentSection !== 'Warmups'">Completed: </p>
        <input @keypress.enter="postSet" v-model="repsDone" type="text" v-if="currentSection !== 'Warmups'">
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
            // reps gotta be inputted first eh
            if (this.repsDone) {
                // create the post url and real (adjusted) set number
                let url, adjSet, currentPath;
                if (this.currentSection === 'Core') {
                    // determine exercise
                    if ([1, 4, 7].includes(this.currentSetNum)) {
                        currentPath = this.sections[this.currentSection]['path1'];
                    } else if ([2, 5, 8].includes(this.currentSetNum)) {
                        currentPath = this.sections[this.currentSection]['path2'];
                    } else currentPath = this.sections[this.currentSection]['path3'];
                    // set number
                    if ([1, 2, 3].includes(this.currentSetNum)) adjSet = 1;
                    else if ([4, 5, 6].includes(this.currentSetNum)) adjSet = 2;
                    else adjSet = 3;
                } else {
                    // determine exercise
                    if (this.currentSetNum % 2 !== 0) {
                        currentPath = this.sections[this.currentSection]['path1'];
                    } else currentPath = this.sections[this.currentSection]['path2'];
                    // set number
                    if (this.currentSetNum === 1 || this.currentSetNum === 2) adjSet = 1;
                    else if (this.currentSetNum === 3 || this.currentSetNum === 4) adjSet = 2;
                    else adjSet = 3;
                }
                // set url
                url = `http://localhost:3000/exercise/${currentPath}Set`;
                let hasPosted = false;
                // make the post request if user is logged in
                if (this.$cookies.isKey("workout_id")) {
                    fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({
                            reps: parseInt(this.repsDone),
                            setNumber: adjSet,
                            progression: 4,
                            workout_id: this.$cookies.get("workout_id")
                        })
                    }).then(res => console.log(res)).catch(err => console.log(err));
                    hasPosted = true;
                }
                // add post url if we're not posting right now
                if (!hasPosted) {
                    this.workoutSummary[this.currentSection].push({
                        reps: parseInt(this.repsDone),
                        setNumber: adjSet,
                        progression: 4,
                        workout_id: this.$cookies.get("workout_id"),
                        postPath: url,
                        currentPath,
                        exerciseVariant: this.currentExercise,
                        id: this.id
                    });
                } else {
                    // but save the summary even if we did post!
                    this.workoutSummary[this.currentSection].push({
                        reps: parseInt(this.repsDone),
                        setNumber: adjSet,
                        progression: 4,
                        workout_id: this.$cookies.get("workout_id"),
                        currentPath,
                        exerciseVariant: this.currentExercise,
                        id: this.id
                    });
                }
            } else console.log('loser');
            this.id++;
        },
        goToSummary() {
            this.$router.push({
                name: 'Summary',
                params: {
                    workoutSummary: this.workoutSummary,
                }
            });
        }
    },
    async created() {
        try {
            // get a new workout_id (if user is logged in without existing workout_id)
            if (this.$cookies.isKey("user_id") && !this.$cookies.isKey("workout_id")) {
                let url = "http://localhost:3000/workout";
                let res = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify({
                        user_id: this.$cookies.get("user_id")
                    })
                });
                res = await res.json();
                //                                  expiry path domain secure sameSite
                this.$cookies.set("workout_id", res, "12h", null, null, null, "Strict");
            }
        } catch (error) {
            console.log(error);
        }
    },
    data() {
        return {
            repsDone: undefined,
            currentSetNum: 1,
            currentSection: 'Warmups',
            id: 0,
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
            workoutSummary: {
                'Pullups & Squats': [],
                'Dips & Hinges': [],
                'Rows & Pushups': [],
                'Core': [],
            }
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
