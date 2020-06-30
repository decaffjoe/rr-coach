<template>
    <div>
        <!-- HEADER -->
        <!-- TODO: saveSet before navigating away from the page -->
        <button @click="goToPage('/')">Home</button>
        <button @click="skipCurrentSection('prev')">Previous Section</button>
        <button @click="skipCurrentSection('next')">Next Section</button>
        <button @click="goToPage('/summary')">Workout Summary</button>
        <h1>{{ currentSection }}</h1>
        <!-- SET CONTROL -->
        <hr>
        <button @click="decrementSetNum" class="set">Previous set</button>
        <p class="set"><span>{{ currentSectionSet }}</span> / <span>{{ currentMaxSets }}</span></p>
        <button @click="incrementSetNum" class="set">Next set</button>
        <hr>
        <!-- EXERCISE NAME AND REPS -->
        <h2>{{ currentVariant.name }}</h2>
        <button @click="easierVariant" v-if="currentSection !== 'Warmups' && currentVariant.num > 0">Easier Variant</button>
        <button @click="tougherVariant" v-if="currentSection !== 'Warmups' && currentVariant.num < currentVariant.max">Tougher Variant</button>
        <p>Rep Goal: {{ currentRepGoal }}</p>
        <!-- USER REP INPUT -->
        <p id="completed" v-if="currentSection !== 'Warmups'">Completed: </p>
        <input @keypress.enter="incrementSetNum" v-model="repsDone" type="text" v-if="currentSection !== 'Warmups'">
        <!-- EXERCISE INSTRUCTION -->
        <iframe width="400" height="200" :src="currentVariant.url" v-if="currentVariant.url"></iframe>
        <ul v-if="currentVariant.desc">
            <li v-for="point of currentVariant.desc.split('.')" :key="point.id">{{ point }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Training",
    computed: {
        // needed for skipping by section
        allSections() { return Object.keys(this.sections) },
        // keep set control in bounds
        currentMaxSets() { return this.sections[this.currentSection]['maxSets'] },
        // display the rep target
        currentRepGoal() {
            if (this.currentSection === 'Warmups') {
                return this.sections[this.currentSection]['exercises'][this.currentSectionSet - 1]['reps'];
            } else if (this.currentSection === 'Core') return "8 - 12";
            else return "5 - 8";
        },
        // return which generic exercise is being done e.g. 'pullup' or 'squat'
        currentPath() {
            if (this.currentSection === 'Warmups') {
                return this.sections['Warmups']['exercises'][this.currentSectionSet - 1];
            } else if (this.currentSection === 'Core') {
                if (this.currentSectionSet % 3 === 0) return this.sections['Core']['path3'];
                else if (this.currentSectionSet % 3 === 2) return this.sections['Core']['path2'];
                else return this.sections['Core']['path1'];
            } else {
                if (this.currentSectionSet % 2 === 0) return this.sections[this.currentSection]['path2'];
                else return this.sections[this.currentSection]['path1'];
            }
        },
        // return which specific exercise is being done (with info, progression int value & progression int max value)
        currentVariant() {
            if (this.currentSection === 'Warmups') return { ...this.currentPath };
            else {
                // if returning to previous set, check sessionStorage for variant
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                let theOneTrueVariant;
                if (session[this.currentPath] && session[this.currentPath][this.specificExerciseSet - 1]) {
                    theOneTrueVariant = session[this.currentPath][this.specificExerciseSet - 1]['progression'];
                }
                // else get variant from cookie (tracked by 'this.variants')
                else theOneTrueVariant = this.variants[this.currentPath];
                // return progression info, integer value and max integer value of generic exercise progression
                return { ...this.$store.getters.progressions[`${this.currentPath}Progression`][theOneTrueVariant], num: theOneTrueVariant, max: this.$store.getters.progressions[`${this.currentPath}Progression`].length - 1 };
            }
        },
        // user reps
        repsDone: {
            // for when user navigates to previously completed set
            get() {
                if (this.enteredReps) return this.enteredReps;
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                if (!session[this.currentPath]) return undefined;
                if (session[this.currentPath][this.specificExerciseSet - 1]) return session[this.currentPath][this.specificExerciseSet - 1]['reps'];
                else return undefined;
            },
            // for when user enters reps
            set(value) { return this.enteredReps = value; }
        },
        // return the 'actual' set e.g. pullup set 3/3 (instead of "pullup & squat" set 5/6)
        specificExerciseSet() {
            if (this.currentSection === 'Warmups') return undefined;
            if (this.currentSection === 'Core') {
                // determine set number
                if (this.currentSectionSet <= 3) return 1;
                else if (this.currentSectionSet >= 7) return 3;
                else return 2;
            } else {
                // determine set number
                if (this.currentSectionSet <= 2) return 1;
                else if (this.currentSectionSet >= 5) return 3;
                else return 2;
            }
        }
    },
    watch: {
        // update exercise variant cookies when variant is changed
        variants: {
            handler(value) {
                if (this.currentSection !== 'Warmups') {
                    this.$cookies.set(`${this.currentPath}Variant`, value[this.currentPath], Infinity, null, null, null, "Strict");
                }
            }, deep: true
        }
    },
    methods: {
        // save and go to next set
        async incrementSetNum() {
            await this.saveSet();
            ++this.currentSectionSet;
            // check if value forces next exercise
            if (this.currentSectionSet > this.currentMaxSets) {
                // if not last exercise, change set number to 1
                if (!this.skipCurrentSection('next')) {
                    this.currentSectionSet = 1;
                } else this.currentSectionSet = this.currentMaxSets;
            }
        },
        // save and go to previous set
        async decrementSetNum() {
            await this.saveSet();
            --this.currentSectionSet;
            // check if value forces previous exercise
            if (this.currentSectionSet < 1) {
                // if not first exercise, change set number to max of prev
                if (!this.skipCurrentSection('prev')) {
                    this.currentSectionSet = this.currentMaxSets;
                } else this.currentSectionSet = 1;
            }
        },
        // skip forward or backward e.g. from 'Warmups' to 'Pullups & Squats'
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
            this.currentSectionSet = 1;
            return false;
        },
        // go to easier specific exercise variant
        easierVariant() {
            if (this.currentSection === 'Warmups') return;
            // check to make sure we aren't on easiest variant
            if (this.variants[this.currentPath] > 0) {
                // decrement variant integer
                --this.variants[this.currentPath];
            } return;
        },
        // go to tougher specific exercise variant
        tougherVariant() {
            if (this.currentSection === 'Warmups') return;
            // check to make sure we aren't on toughest variant
            if (this.variants[this.currentPath] < this.$store.getters.progressions[`${this.currentPath}Progression`].length - 1) {
                // increment variant integer
                ++this.variants[this.currentPath];
            } return;
        },
        // save set data to sessionStorage and API
        async saveSet() {
            // reps gotta be inputted first eh
            if (this.repsDone) {

                // SESSION STORAGE
                // read workout summary from sessionStorage
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                if (!session[this.currentPath]) session[this.currentPath] = [];
                // create new set or read in existing set
                let set;
                if (!session[this.currentPath][this.specificExerciseSet - 1]) set = {};
                else set = session[this.currentPath][this.specificExerciseSet - 1];
                // if object existed and nothing changed, return
                if (set['reps'] === this.repsDone && set['progression'] === this.currentVariant.num) return;
                // change was made (or new set), save current values to set
                set['reps'] = this.repsDone;
                set['setNumber'] = this.specificExerciseSet;
                set['progression'] = this.currentVariant.num;

                // API
                // set url to post
                let url = `http://localhost:3000/exercise/${this.currentPath}Set`;
                // assume logged out, or post failure
                let dbSaveSuccess = false;
                // TODO: PUT to db if updating set instead of creating
                // if (set['hasPosted'] === true) <-- we are updating and need to PUT
                // POST to db if user is logged in and this is a new set
                if (this.$cookies.isKey("workout_id") && !set['hasPosted']) {
                    let body = { ...set['reps'], ...set['setNumber'], ...set['progression'], workout_id: this.$cookies.get("workout_id") };
                    let res = await fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify(body)
                    });
                    if (res.status === 200) {
                        dbSaveSuccess = true;
                        set['hasPosted'] = true;
                    }
                }

                // SESSION STORAGE PT. 2
                // add post url to set if we're not posting to db right now (failed or not logged in)
                if (!dbSaveSuccess) {
                    set['postPath'] = url;
                    set['hasPosted'] = false;
                }
                // update sessionStorage with new/updated set
                session[this.currentPath][this.specificExerciseSet - 1] = set;
                console.log(session);
                window.sessionStorage['workoutSummary'] = JSON.stringify(session);
            }
            // reset that the user entered reps on this particular set, no matter what!
            this.enteredReps = undefined;
        },
        async goToPage(page) {
            await this.saveSet();
            this.$router.push(page);
        },
    },
    // get current or init new workout status/summary, workout_id and exercise variant values
    async created() {
        try {
            // init sessionStorage if not active
            if (!window.sessionStorage['workoutSummary']) window.sessionStorage['workoutSummary'] = JSON.stringify({});
            // get a new workout_id (if user is logged in without existing workout_id)
            if (this.$cookies.isKey("user_id") && !this.$cookies.isKey("workout_id")) {
                let url = "http://localhost:3000/workout";
                let res = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({
                        user_id: this.$cookies.get("user_id")
                    })
                });
                res = await res.json();
                //                                  expiry path domain secure sameSite
                this.$cookies.set("workout_id", res, "12h", null, null, null, "Strict");
            }
            // use variants from cookies, or default to easiest variant (progression 0)
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
            // reset after every "previous/next set" change
            enteredReps: undefined,
            // cumulative set number per section
            currentSectionSet: 1,
            currentSection: 'Warmups',
            // preferences loaded from cookies or defaulted to 0 if no cookies
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
            // Warmup info and paths for API/sessionStorage saving (by generic exercise e.g. 'pullup')
            sections: {
                'Warmups': {
                    maxSets: 8,
                    exercises: [
                        {
                            name: "Yuri's Shoulder Band Warmup",
                            url: "https://www.youtube.com/embed/Vwn5hSf3WEg",
                            desc: "",
                            reps: "5 - 10"
                        },
                        {
                            name: "Squat Sky Reaches",
                            url: "https://www.youtube.com/embed/lbozu0DPcYI",
                            desc: "",
                            reps: "5 - 10"
                        },
                        {
                            name: "GMB Wrist Prep",
                            url: "https://www.youtube.com/embed/mSZWSQSSEjE",
                            desc: "Do as many reps as you want",
                            reps: "10+"
                        },
                        {
                            name: "Deadbugs",
                            url: "https://www.nick-e.com/deadbug/",
                            desc: "",
                            reps: "30s"
                        },
                        {
                            name: "Arch Hangs",
                            url: "https://www.youtube.com/embed/C995b3KLXS4",
                            desc: "Add these after you reach Negative Pullups",
                            reps: "10"
                        },
                        {
                            name: "Support Hold",
                            url: "",
                            desc: "Add these after you reach Negative Dips",
                            reps: "30s"
                        },
                        {
                            name: "Easier Squat Progression",
                            url: "",
                            desc: "Add these after you reach Bulgarian Split Squats",
                            reps: "10"
                        },
                        {
                            name: "Easier Hinge Progression",
                            url: "",
                            desc: "Add these after you reach Banded Nordic Curls",
                            reps: "10"
                        },
                    ],
                },
                'Pullups & Squats': {
                    maxSets: 6,
                    path1: 'pullup',
                    path2: 'squat',
                },
                'Dips & Hinges': {
                    maxSets: 6,
                    path1: 'dip',
                    path2: 'hinge',
                },
                'Rows & Pushups': {
                    maxSets: 6,
                    path1: 'row',
                    path2: 'pushup',
                },
                'Core': {
                    maxSets: 9,
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
