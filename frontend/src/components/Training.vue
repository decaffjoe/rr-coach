<template>
    <div>
        <router-link to="/"><button>Home</button></router-link>
        <button @click="skipCurrentSection('prev')">Previous Section</button>
        <button @click="skipCurrentSection('next')">Next Section</button>
        <router-link to="/summary"><button>Workout Summary</button></router-link>
        <h1>{{ currentSection }}</h1>
        <hr>
        <button @click="decrementSetNum" class="set">Previous set</button>
        <p class="set"><span>{{ currentSetNum }}</span> / <span>{{ currentMaxSets }}</span></p>
        <button @click="incrementSetNum" class="set">Next set</button>
        <hr>
        <h2>{{ currentVariant.name }}</h2>
        <button @click="easierVariant" v-if="currentSection !== 'Warmups' && currentVariant.num > 0">Easier Variant</button>
        <button @click="tougherVariant" v-if="currentSection !== 'Warmups' && currentVariant.num < currentVariant.max">Tougher Variant</button>
        <p>Rep Goal: {{ currentRepGoal }}</p>
        <p id="completed" v-if="currentSection !== 'Warmups'">Completed: </p>
        <input @keypress.enter="postSet" v-model="repsDone" type="text" v-if="currentSection !== 'Warmups'">
        <iframe width="400" height="200" :src="currentVariant.url" v-if="currentVariant.url"></iframe>
        <ul v-if="currentVariant.desc">
            <!-- Using the first character as key because ordering doesn't matter and no operations are done -->
            <li v-for="point of currentVariant.desc.split('.')" :key="point.id">{{ point }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Training",
    computed: {
        allSections() { return Object.keys(this.sections) },
        currentMaxSets() { return this.sections[this.currentSection]['maxSets'] },
        currentRepGoal() { return this.sections[this.currentSection]['reps'][this.currentSetNum - 1] },
        currentExercise() {
            if (this.currentSection === 'Warmups') {
                return this.sections['Warmups']['exercises'][this.currentSetNum - 1];
            } else if (this.currentSection === 'Core') {
                if (this.currentSetNum % 3 === 0) return this.sections['Core']['path3'];
                else if (this.currentSetNum % 3 === 2) return this.sections['Core']['path2'];
                else return this.sections['Core']['path1'];
            } else {
                if (this.currentSetNum % 2 === 0) return this.sections[this.currentSection]['path2'];
                else return this.sections[this.currentSection]['path1'];
            }
        },
        currentVariant() {
            if (this.currentSection === 'Warmups') return { ...this.currentExercise };
            else return { ...this.$store.getters.progressions[`${this.currentExercise}Progression`][this.variants[this.currentExercise]], num: this.variants[this.currentExercise], max: this.$store.getters.progressions[`${this.currentExercise}Progression`].length - 1 };
        }
    },
    watch: {
        variants: {
            handler(value) {
                if (this.currentSection !== 'Warmups') {
                    console.log('--- watch ---');
                    console.log(value[this.currentExercise]);
                    console.log(this.currentExercise);
                    this.$cookies.set(`${this.currentExercise}Variant`, value[this.currentExercise], Infinity, null, null, null, "Strict");
                }
            }, deep: true
        }
    },
    methods: {
        async incrementSetNum(directClick=true) {
            // if 'next set' button pressed directly, post reps before moving to next set
            if (directClick) await this.postSet(false);
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
        async easierVariant() {
            if (this.currentSection === 'Warmups') return;
            if (this.variants[this.currentExercise] > 0) return --this.variants[this.currentExercise];
            else return;
        },
        tougherVariant() {
            if (this.currentSection === 'Warmups') return;
            console.log('--- tougherVariant ---');
            console.log(this.variants[this.currentExercise]);
            if (this.variants[this.currentExercise] < this.$store.getters.progressions[`${this.currentExercise}Progression`].length - 1) return ++this.variants[this.currentExercise];
            else return;
        },
        async postSet(directClick=true) {
            // reps gotta be inputted first eh
            if (this.repsDone) {
                // create the post url and real (adjusted) set number
                let url, adjSet, currentPath;
                if (this.currentSection === 'Core') {
                    // determine exercise
                    if (this.currentSetNum % 3 === 0) currentPath = this.sections['Core']['path3'];
                    else if (this.currentSetNum % 3 === 2) currentPath = this.sections['Core']['path2'];
                    else if (this.currentSetNum % 3 === 1) currentPath = this.sections['Core']['path1'];
                    // set number
                    if (this.currentSetNum <= 3) adjSet = 1;
                    else if (this.currentSetNum >= 7) adjSet = 3;
                    else adjSet = 2;
                } else {
                    // determine exercise
                    if (this.currentSetNum % 2 === 0) currentPath = this.sections[this.currentSection]['path2'];
                    else currentPath = this.sections[this.currentSection]['path1'];
                    // set number
                    if (this.currentSetNum <= 2) adjSet = 1;
                    else if (this.currentSetNum >= 5) adjSet = 3;
                    else adjSet = 2;
                }
                // set url
                url = `http://localhost:3000/exercise/${currentPath}Set`;
                let hasPosted = false;
                // make the post request if user is logged in
                if (this.$cookies.isKey("workout_id")) {
                    let res = await fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({
                            reps: parseInt(this.repsDone),
                            setNumber: adjSet,
                            progression: this.currentVariant.num,
                            workout_id: this.$cookies.get("workout_id")
                        })
                    });
                    if (res.status === 200) { hasPosted = true; window.sessionStorage['hasPosted'] = 1; }
                }
                // create set object to store in sessionStorage
                let newSet = {
                    reps: parseInt(this.repsDone),
                    setNumber: adjSet,
                    progression: this.currentVariant.num,
                    // id: window.sessionStorage['idCounter']
                };
                // add post url if we're not posting right now
                if (!hasPosted) newSet['postPath'] = url;
                // read current sessionStorage
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                if (!session[currentPath]) session[currentPath] = [];
                // update sessionStorage with newSet included
                session[currentPath].push(newSet);
                window.sessionStorage['workoutSummary'] = JSON.stringify(session);
                // update counter
                window.sessionStorage['idCounter']++;
                // go to next set automatically if 'enter' pressed in input
                if (directClick) this.incrementSetNum(false);
            }
        },
    },
    async created() {
        try {
            // init sessionStorage if not active
            if (!window.sessionStorage['workoutSummary']) window.sessionStorage['workoutSummary'] = "{}";
            if (!window.sessionStorage['idCounter']) window.sessionStorage['idCounter'] = 0;
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
            // overwrite variant integers with cookie values
            let varObj = {};
            for (let ex of this.$store.state.allExercises) {
                if (this.$cookies.isKey(`${ex}Variant`)) {
                    varObj[ex] = this.$cookies.get(`${ex}Variant`);
                } else varObj[ex] = 0;
            }
            this.variants = varObj;
        } catch (error) {
            console.log(error);
        }
    },
    data() {
        return {
            repsDone: undefined,
            currentSetNum: 1,
            currentSection: 'Warmups',
            variants: {
                'pullup': undefined,
                'squat': undefined,
                'dip': undefined,
                'hinge': undefined,
                'row': undefined,
                'pushup': undefined,
                'antiextension': undefined,
                'antirotation': undefined,
                'extension': undefined,
            },
            sections: {
                'Warmups': {
                    maxSets: 8,
                    exercises: [
                        {
                            name: "Yuri's Shoulder Band Warmup",
                            url: "https://www.youtube.com/embed/Vwn5hSf3WEg",
                            desc: ""
                        },
                        {
                            name: "Squat Sky Reaches",
                            url: "https://www.youtube.com/embed/lbozu0DPcYI",
                            desc: ""
                        },
                        {
                            name: "GMB Wrist Prep",
                            url: "https://www.youtube.com/embed/mSZWSQSSEjE",
                            desc: "Do as many reps as you want"
                        },
                        {
                            name: "Deadbugs",
                            url: "https://www.nick-e.com/deadbug/",
                            desc: ""
                        },
                        {
                            name: "Arch Hangs",
                            url: "https://www.youtube.com/embed/C995b3KLXS4",
                            desc: "Add these after you reach Negative Pullups"
                        },
                        {
                            name: "Support Hold",
                            url: "",
                            desc: "Add these after you reach Negative Dips"
                        },
                        {
                            name: "Easier Squat Progression",
                            url: "",
                            desc: "Add these after you reach Bulgarian Split Squats"
                        },
                        {
                            name: "Easier Hinge Progression",
                            url: "",
                            desc: "Add these after you reach Banded Nordic Curls"
                        },
                    ],
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
iframe {
    display: block;
    margin: 0 auto;
}
</style>
