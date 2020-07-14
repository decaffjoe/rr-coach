<template>
    <div id="top">
        <Navbar v-on:click="leavePage" />

        <!-- SECTION CONTROL -->
        <section id="section">
            <p>Section</p>
            <i class="arrow bk-arrow" @click="skipCurrentSection('prev')" v-show="currentSection !== 'Warmups'"></i>
            <h1 class="iblock">{{ currentSection }}</h1>
            <i class="arrow fw-arrow" @click="skipCurrentSection('next')" v-show="currentSection !== 'Core'"></i>
        </section>

        <!-- SET CONTROL -->
        <section id="set">
            <p>Set</p>
            <i @click="decrementSetNum" class="arrow bk-arrow" v-show="currentSection !== 'Warmups' || currentSectionSet !== 1"></i>
            <p class="iblock"><span>{{ currentSectionSet }}</span> / <span>{{ currentMaxSets }}</span></p>
            <i @click="incrementSetNum" class="arrow fw-arrow" v-show="currentSection !== 'Core' || currentSectionSet !== 9"></i>
        </section>

        <!-- USER REP INPUT -->
        <section id="rep">
            <p>Rep Goal: {{ currentRepGoal }}</p>
            <p id="completed" v-show="currentSection !== 'Warmups'">Completed: </p>
            <input @keypress.enter="incrementSetNum" v-model="repsDone" type="text" v-show="currentSection !== 'Warmups'">
            <BaseButton id="endOfTrainingMsg" v-on:click="goToPage('/summary')" v-show="endOfTraining" :text="'See your Summary'" />
            <!-- ERROR ON INPUT HANDLING -->
            <p v-show="error">{{ error }}</p>
            <p v-show="!endOfTraining">90 second to 3 minute rest between sets</p>
        </section>

        <!-- EXERCISE VARIANT CONTROL -->
        <section id="variant">
            <p>Exercise</p>
            <i class="arrow bk-arrow" @click="easierVariant" v-show="currentSection !== 'Warmups' && currentVariant.num > 0"></i>
            <h2>{{ currentVariant.name }}</h2>
            <i class="arrow fw-arrow" @click="tougherVariant" v-show="currentSection !== 'Warmups' && currentVariant.num < currentVariant.max"></i>
        </section>

        <!-- EXERCISE INSTRUCTIONS -->
        <section id="info">
            <iframe :src="currentVariant.url" v-show="currentVariant.url"></iframe>
            <p v-show="currentVariant.desc">Exercise Tips</p>
            <ul v-show="currentVariant.desc">
                <li v-for="point of currentVariant.desc.split('.')" :key="point.id">{{ point }}</li>
            </ul>
            <p v-show="currentFormCues.length > 0">General Form Cues</p>
            <ul v-show="currentSection !== 'Warmups'">
                <li v-for="cue of currentFormCues" :key="cue.id">{{ cue }}</li>
            </ul>
        </section>

        <Footer />
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";
import Footer from "../components/Footer.vue";
export default {
    name: "Training",
    components: { Navbar, BaseButton, Footer },
    computed: {
        currentFormCues() {
            if(this.currentSection !== 'Warmups')  {
                return this.$store.getters.generalFormCues[`${this.currentPath}Form`];
            }
            return [];
        },
        // for the 'Finish workout' button @ last set of 'Core'
        endOfTraining() { if(this.currentSection === 'Core' && this.currentSectionSet === 9) return true; return false; },
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
        // current specific exercise progression (return info, integer value & max integer value for progression track)
        currentVariant: {
            get() {
                if (this.currentSection === 'Warmups') return { ...this.currentPath };
                else {
                    // Precedence 1: User changes variant manually on current page
                    if (this.enteredVariant) return { ...this.$store.getters.progressions[`${this.currentPath}Progression`][this.enteredVariant], num: this.enteredVariant, max: this.$store.getters.progressions[`${this.currentPath}Progression`].length - 1 };
                    // Precedence 2: User revisits old set (so load the progression saved from that set)
                    let session = JSON.parse(window.sessionStorage['workoutSummary']);
                    let variantInteger;
                    if (session[this.currentPath] && session[this.currentPath][this.specificExerciseSet - 1]) {
                        variantInteger = session[this.currentPath][this.specificExerciseSet - 1]['progression'];
                    }
                    // Precedence 3: Load the variant saved from cookies (load from local data identical to the cookies, though)
                    else variantInteger = this.variantPreferences[this.currentPath];
                    // return progression info, integer value and max integer value of generic exercise progression
                    return { ...this.$store.getters.progressions[`${this.currentPath}Progression`][variantInteger], num: variantInteger, max: this.$store.getters.progressions[`${this.currentPath}Progression`].length - 1 };
                }
            },
            set(value) {
                // when user manually changes variant on current page
                return this.enteredVariant = value;
            }
        },
        // user reps
        repsDone: {
            get() {
                // Precedence 1: User changes reps manually on current page
                if (this.enteredReps) return this.enteredReps;
                // Precedence 2: User revisits old set (so load reps saved from that set)
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                if (session[this.currentPath] && session[this.currentPath][this.specificExerciseSet - 1]) return session[this.currentPath][this.specificExerciseSet - 1]['reps'];
                // Precedence 3: Default to empty (undefined reps performed)
                else return undefined;
            },
            // for when user enters reps
            set(value) {
                let numValue = parseInt(value);
                // check to make sure it's a number
                if (value !== '' && isNaN(numValue)) this.error = 'Please enter a number';
                else this.error = undefined;
                return this.enteredReps = numValue;
            }
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
        variantPreferences: {
            handler(value) {
                if (this.currentSection !== 'Warmups') {
                    this.$cookies.set(`${this.currentPath}Variant`, value[this.currentPath], Infinity, null, null, null, "Strict");
                }
            }, deep: true
        },
        currentSection: {
            handler(value) {
                window.sessionStorage['currentSection'] = value;
            }
        },
        currentSectionSet: {
            handler(value) {
                window.sessionStorage['currentSectionSet'] = value;
            }
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
            if (this.currentVariant.num > 0) {
                // decrement variant integer
                this.currentVariant = parseInt(this.currentVariant.num) - 1;
                // set cookie preference too
                --this.variantPreferences[this.currentPath];
                // --this.currentVariant;
            } return;
        },
        // go to tougher specific exercise variant
        tougherVariant() {
            if (this.currentSection === 'Warmups') return;
            // check to make sure we aren't on toughest variant
            if (this.currentVariant.num < this.$store.getters.progressions[`${this.currentPath}Progression`].length - 1) {
                // increment variant integer
                this.currentVariant = parseInt(this.currentVariant.num) + 1;
                // set cookie preference too
                ++this.variantPreferences[this.currentPath];
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
                // change was made (or new set), so save current values to set
                set['reps'] = this.repsDone;
                set['setNumber'] = this.specificExerciseSet;
                set['progression'] = this.currentVariant.num;

                // API
                // set url to post
                let url = `http://localhost:3000/exercise/${this.currentPath}Set`;
                // assume logged out, or post failure
                let dbSaveSuccess = false;
                if (this.$cookies.isKey("workout_id")) {
                    let body = {
                        reps: set['reps'],
                        progression: set['progression'],
                    };
                    let method;
                    // updating an existing set
                    if (set['hasPosted']) {
                        method = 'PUT';
                        body['db_id'] = set['db_id'];
                    } else {
                        // posting a new set
                        method = 'POST';
                        body['workout_id'] = this.$cookies.get("workout_id");
                        body['setNumber'] = set['setNumber'];
                    }
                    body = JSON.stringify(body);
                    let res = await fetch(url, {
                        method,
                        body,
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                    });
                    if (res.status === 200) {
                        // save for future PUT request if user updates
                        if (method === 'POST') set['db_id'] = await res.json();
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
                window.sessionStorage['workoutSummary'] = JSON.stringify(session);
            }
            // reset that the user entered reps and progression
            this.enteredReps = undefined;
            this.enteredVariant = undefined;
        },
        async goToPage(page) {
            await this.saveSet();
            this.$router.push(page);
        },
        async leavePage() {
            await this.saveSet();
        },
    },
    // get current or init new workout status/summary, workout_id and exercise variant values
    async created() {
        try {
            // remember section and set (if refreshing during a workout)
            if (window.sessionStorage['currentSection']) this.currentSection = window.sessionStorage['currentSection'];
            if (window.sessionStorage['currentSectionSet']) this.currentSectionSet = window.sessionStorage['currentSectionSet'];

            // if workout_id cookie but no active workout storage...
            // check to see if user wants to continue most recent workout, or start a new one!
            let getNewWorkoutId = false;
            if (!window.sessionStorage['workoutSummary'] && this.$cookies.isKey("workout_id")) {
                let conf = confirm('It looks like you were just training! Press OK to continue your most recent workout, or Cancel to start a new one.');
                // user decides to continue old workout
                if (conf) {
                    // get workout from db
                    let url = `http://localhost:3000/exercise/allSummary?workout_id=${this.$cookies.get("workout_id")}`;
                    console.log('fetching...');
                    let res = await fetch(url, {
                        method: 'GET',
                        mode: 'cors'
                    });
                    if (res.status === 200) {
                        res = await res.json();
                        // update current workout in browser
                        window.sessionStorage['workoutSummary'] = JSON.stringify(res);
                    }
                    // user decides to begin new workout
                } else getNewWorkoutId = true;
            }

            // init workout storage
            if (!window.sessionStorage['workoutSummary']) window.sessionStorage['workoutSummary'] = JSON.stringify({});

            // get a new workout_id (if user is logged in without existing workout_id)
            if ((this.$cookies.isKey("user_id") && !this.$cookies.isKey("workout_id")) || getNewWorkoutId) {
                let url = "http://localhost:3000/workout";
                let res = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({
                        user_id: this.$cookies.get("user_id")
                    })
                });
                if (res.status === 200) {
                    res = await res.json();
                    //                                  expiry path domain secure sameSite
                    this.$cookies.set("workout_id", res, "6h", null, null, null, "Strict");
                }
            }

            // load variantPreferences from cookies, or default to easiest variant (progression 0)
            let varObj = {};
            for (let ex of this.$store.state.allExercises) {
                if (this.$cookies.isKey(`${ex}Variant`)) {
                    varObj[ex] = this.$cookies.get(`${ex}Variant`);
                } else varObj[ex] = 0;
            }
            this.variantPreferences = varObj;
        } catch (error) {
            console.log(error);
        }
    },
    data() {
        return {
            // error message for if user botches reps input
            error: undefined,
            // reset after every "previous/next set" change
            enteredReps: undefined,
            // reset after every "previous/next set" change
            enteredVariant: undefined,
            // cumulative set number per section
            currentSectionSet: 1,
            currentSection: 'Warmups',
            // preferences loaded from cookies or defaulted to 0 if no cookies
            variantPreferences: {
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
                            desc: "Add these after you reach Bulgarian Split Squats.Progression: Assisted Squat, Squat, Split Squat",
                            reps: "10"
                        },
                        {
                            name: "Easier Hinge Progression",
                            url: "",
                            desc: "Add these after you reach Banded Nordic Curls.Progression: Romanian Deadlift, Single Legged Deadlift, Banded Nordic Curl Negatives",
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
#top {
    text-align: center;
}
#nav {
    background-color: black;
    color: white;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    align-items: center;
    font-size: 1.0em;
}
#section {
    margin: 3vh 0 4vh;
    display: grid;
    grid-template-areas: "sec sec sec" "bk-arrow text fw-arrow";
    grid-template-columns: 25% 50% 25%;
    align-items: center;
    justify-items: center;
}
#section>* {
    margin: 0 1em;
}
#section p:first-of-type {
    grid-area: sec;
}
h1 {
    text-transform: uppercase;
    font-size: 1.2em;
    grid-area: text;
}
#section .bk-arrow {
    grid-area: bk-arrow;
}
#section .fw-arrow {
    grid-area: fw-arrow;
}
#completed {
    display: inline;
}
#set,#rep {
    color: var(--main);
    background-color: white;
}
#set {
    padding: 2vh 0 0;
    display: grid;
    grid-template-areas: "set set set" "bk-arrow text fw-arrow";
    grid-template-columns: 25% 50% 25%;
    align-items: center;
    justify-items: center;
}
#set>* {
    margin: 0 0.5em;
}
#set p {
    color: black;
}
#set p:first-of-type {
    margin: 0 auto;
    padding: 0;
    grid-area: set;
}
#set p:nth-last-of-type(1) {
    font-size: 1.5em;
    grid-area: text;
}
#set .bk-arrow {
    grid-area: bk-arrow;
}
#set .fw-arrow {
    grid-area: fw-arrow;
}
#rep {
    padding-bottom: 1vh;
}
#rep p {
    margin: 0;
    padding: 1.5vh;
    font-size: 1.1em;
}
#completed {
    color: red;
}
#rep input {
    border: 3px solid red;
    font-size: 1.3em;
    outline: none;
    padding: 0.1em 0.5em;
    width: 30px;
}
#variant {
    margin: 2vh 0 3vh;
    font-size: 0.8em;
    display: grid;
    grid-template-areas:"var var var" "bk-arrow text fw-arrow";
    grid-template-columns: 25% 50% 25%;
    align-items: center;
    justify-items: center;
}
#variant p:first-of-type {
    grid-area: var;
}
#variant>* {
    display: inline-block;
    margin: 0 1em;
}
h2 {
    text-transform: uppercase;
    font-size: 1.2em;
    grid-area: text;
}
#variant .bk-arrow {
    grid-area: bk-arrow;
}
#variant .fw-arrow {
    grid-area: fw-arrow;
}
iframe {
    display: block;
    margin: 0 auto 2vh;
    border: 2px solid white;
    width: 95%;
    height: 25vh;
}
#info ul {
    list-style-position: inside;
    text-align: left;
    margin: 2vh auto;
    padding: 0 10vw;
}
#info ul li {
    list-style: none;
    margin: 1em 0;
    margin-left: -10px;
}
#info ul li::before {
    --size: 20px;
    content: '';
    display: inline-block;
    height: calc(var(--size) - 4px);
    width: var(--size);
    background-image: url('../assets/arrow.svg');
    background-size: var(--size);
}
#info p {
    border: 2px solid white;
    width: fit-content;
    margin: 0 auto;
    padding: 1vh 1vw;
}
#info p:nth-of-type(2) {
    margin-top: 5vh;
}
.iblock {
    display: inline-block;
}
.arrow {
    --size: 40px;
    display: inline-block;
    height: calc(var(--size) - 5px);
    width: var(--size);
    background-size: var(--size);
}
.fw-arrow {
    background-image: url('../assets/right_arrow.svg');
}
.bk-arrow {
    background-image: url('../assets/left_arrow.svg');
}
#endOfTrainingMsg {
    border: 3px solid var(--main);
    color: white;
    background-color: var(--main);
    display: block;
    margin: 2vh auto 0;
}
</style>
