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
        <h2>{{ currentVariant }}</h2>
        <button @click="easierVariant">Easier Variant</button>
        <button @click="tougherVariant">Tougher Variant</button>
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
        allSections() { return Object.keys(this.sections) },
        currentMaxSets() { return this.sections[this.currentSection]['maxSets'] },
        currentRepGoal() { return this.sections[this.currentSection]['reps'][this.currentSetNum - 1] },
        currentExercise() { return this.sections[this.currentSection]['exercises'][this.currentSetNum - 1] },
        currentVariant() {
            if (this.currentExercise === 'Pullups') {
                return this.pullupProgression[this.pullupVariant];
            } else if (this.currentExercise === 'Squats') {
                return this.squatProgression[this.squatVariant];
            } else if (this.currentExercise === 'Dips') {
                return this.dipProgression[this.dipVariant];
            } else if (this.currentExercise === 'Hinges') {
                return this.hingeProgression[this.hingeVariant];
            } else if (this.currentExercise === 'Rows') {
                return this.rowProgression[this.rowVariant];
            } else if (this.currentExercise === 'Pushups') {
                return this.pushupProgression[this.pushupVariant];
            } else if (this.currentExercise === 'Anti-Extensions') {
                return this.antiExtenstionProgression[this.antiExtensionVariant];
            } else if (this.currentExercise === 'Anti-Rotations') {
                return this.antiRotationProgression[this.antiRotationVariant];
            } else if (this.currentExercise === 'Extensions') {
                return this.extensionProgression[this.extensionVariant];
            } else return this.currentExercise;
        }
    },
    components: {  },
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
        easierVariant() {
            if (this.currentExercise === 'Pullups') {
                if (this.pullupVariant > 0) return --this.pullupVariant;
                else return;
            }
            else if (this.currentExercise === 'Squats') {
                if (this.squatVariant > 0) return --this.squatVariant;
                else return;
            }
            else if (this.currentExercise === 'Dips') {
                if (this.dipVariant > 0) return --this.dipVariant;
                else return;
            }
            else if (this.currentExercise === 'Hinges') {
                if (this.hingeVariant > 0) return --this.hingeVariant;
                else return;
            }
            else if (this.currentExercise === 'Rows') {
                if (this.rowVariant > 0) return --this.rowVariant;
                else return;
            }
            else if (this.currentExercise === 'Pushups') {
                if (this.pushupVariant > 0) return --this.pushupVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Extensions') {
                if (this.antiExtensionVariant > 0) return --this.antiExtensionVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Rotations') {
                if (this.antiRotationVariant > 0) return --this.antiRotationVariant;
                else return;
            }
            else if (this.currentExercise === 'Extensions') {
                if (this.extensionVariant > 0) return --this.extensionVariant;
                else return;
            }
            else return;
        },
        tougherVariant() {
            if (this.currentExercise === 'Pullups') {
                if (this.pullupVariant < this.pullupProgression.length - 1) return ++this.pullupVariant;
                else return;
            }
            else if (this.currentExercise === 'Squats') {
                if (this.squatVariant < this.squatProgression.length - 1) return ++this.squatVariant;
                else return;
            }
            else if (this.currentExercise === 'Dips') {
                if (this.dipVariant < this.dipProgression.length - 1) return ++this.dipVariant;
                else return;
            }
            else if (this.currentExercise === 'Hinges') {
                if (this.hingeVariant < this.hingeProgression.length - 1) return ++this.hingeVariant;
                else return;
            }
            else if (this.currentExercise === 'Rows') {
                if (this.rowVariant < this.rowProgression.length - 1) return ++this.rowVariant;
                else return;
            }
            else if (this.currentExercise === 'Pushups') {
                if (this.pushupVariant < this.pushupProgression.length - 1) return ++this.pushupVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Extensions') {
                if (this.antiExtensionVariant < this.antiExtensionProgression.length - 1) return ++this.antiExtensionVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Rotations') {
                if (this.antiRotationVariant < this.antiRotationProgression.length - 1) return ++this.antiRotationVariant;
                else return;
            }
            else if (this.currentExercise === 'Extensions') {
                if (this.extensionVariant < this.extensionProgression.length - 1) return ++this.extensionVariant;
                else return;
            }
            else return;
        },
        async postSet(directClick=true) {
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
                    let res = await fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({
                            reps: parseInt(this.repsDone),
                            setNumber: adjSet,
                            progression: 4,
                            workout_id: this.$cookies.get("workout_id")
                        })
                    });
                    if (res.status === 200) { hasPosted = true; window.sessionStorage['hasPosted'] = 1; }
                }
                // create set object to store in sessionStorage
                let newSet = {
                    reps: parseInt(this.repsDone),
                    setNumber: adjSet,
                    progression: 4,
                    currentPath,
                    exerciseVariant: this.currentExercise,
                    id: window.sessionStorage['idCounter']
                };
                // add post url if we're not posting right now
                if (!hasPosted) newSet['postPath'] = url;
                // read current sessionStorage
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                if (!session[this.currentSection]) session[this.currentSection] = [];
                // update sessionStorage with newSet included
                session[this.currentSection].push(newSet);
                window.sessionStorage['workoutSummary'] = JSON.stringify(session);
                // update counter
                window.sessionStorage['idCounter']++;
                // go to next set automatically if 'enter' pressed in input
                if (directClick) this.incrementSetNum(false);
            } else console.log('loser');
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
        } catch (error) {
            console.log(error);
        }
    },
    data() {
        return {
            repsDone: undefined,
            currentSetNum: 1,
            currentSection: 'Warmups',
            pullupProgression: ["Scapular Pulls", "Arch Hangs", "Pullup Negatives", "Pullups", "Weighted Pullups"],
            pullupVariant: 0,
            squatProgression: ["Assisted Squat", "Squat", "Split Squat", "Bulgarian Split Squat", "Beginner Shrimp Squat", "Intermediate Shrimp Squat", "Advanced Shrimp Squat", "Weighted Shrimp Squat"],
            squatVariant: 0,
            dipProgression: ["Parallel Bar Support Hold", "Negative Dips", "Parallel Bar Dips", "Weighted Dips"],
            dipVariant: 0,
            hingeProgression: ["Romanian Deadlift", "Single Legged Deadlift", "Banded Nordic Curl Negatives", "Banded Nordic Curl", "Nordic Curls"],
            hingeVariant: 0,
            rowProgression: ["Vertical Rows", "Incline Rows", "Horizontal Rows", "Wide Rows", "Weighted Inverted Rows"],
            rowVariant: 0,
            pushupProgression: ["Vertical Pushup", "Incline Pushup", "Full Pushup", "Diamond Pushup", "Pseudo Planche Pushups"],
            pushupVariant: 0,
            antiExtenstionProgression: ["Plank", "Ring Ab Rollouts"],
            antiExtensionVariant: 0,
            antiRotationProgression: ["Banded Pallof Press"],
            antiRotationVariant: 0,
            extensionProgression: ["Reverse Hyperextension"],
            extensionVariant: 0,
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
