<template>
    <div>
        <!-- SELECT TRAINING SESSION DATA TO DISPLAY -->
        <!-- <select @change="getWorkoutSummary" v-model="selectedWorkout" v-if="this.$cookies.isKey('user_id')"> -->
        <!--     <option v-for="workout of workoutHistory" :key="workout.workout_id" :value="workout">{{ new Date(workout.createdAt).toDateString() }}</option> -->
        <!--     <option :value="undefined">Today</option> -->
        <!-- </select> -->
        <!-- SUMMARY -->
        <div id="tables">
            <table v-for="section of Object.keys(uniqueExercises)" :key="section">
                <!-- e.g. "PULLUPS" -->
                <tr>
                    <th colspan="4">{{ `${section[0].toUpperCase()}${section.slice(1)}s` }}</th>
                </tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td class="reps" colspan="3">Reps</td>
                </tr>
                <tr v-for="variant of Object.keys(uniqueExercises[section])" :key="variant.id">
                    <!-- e.g. "Pullup Negatives" -->
                    <td class="variant-name">{{ variant }}</td>
                    <td class="reps" v-for="reps of uniqueExercises[section][variant]" :key="reps.id">{{ reps }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "Summary",
    computed: {
        // sort workoutSummary by variant
        // return { $section: { $variant: { $reps } } }
        uniqueExercises() {
            let exercises = {}, obj, section, set;
            for (section of Object.keys(this.summary)) {
                obj = {};
                for (set of this.summary[section]) {
                    // set will be null if user skips it (goes out of order)
                    if (set !== null && set !== 'null') {
                        if (!obj[this.progressions[`${section}Progression`][set.progression].name]) {
                            obj[this.progressions[`${section}Progression`][set.progression].name] = [];
                        }
                        obj[this.progressions[`${section}Progression`][set.progression].name].push(set.reps);
                    }
                }
                exercises[section] = obj;
            }
            return exercises;
        },
    },
    // get user's previous workouts by date, if logged in
    async created() {
        if (this.$cookies.isKey("user_id")) {
            let url, res;

            // if workout_id cookie but no active workout storage...
            // check to see if user wants to continue most recent workout, or start a new one!
            if (!window.sessionStorage['workoutSummary'] && this.$cookies.isKey("workout_id")) {
                let conf = confirm('It looks like you were just training! Press OK to continue your most recent workout, or Cancel to save and start a new one.');
                // user decides to continue old workout
                if (conf) {
                    // get workout from db
                    url = `${process.env.VUE_APP_API}/exercise/allSummary?workout_id=${this.$cookies.get("workout_id")}`;
                    console.log('fetching...');
                    res = await fetch(url, {
                        method: 'GET',
                        mode: 'cors'
                    });
                    if (res.status === 200) {
                        res = await res.json();
                        // update current workout in browser
                        window.sessionStorage['workoutSummary'] = JSON.stringify(res);
                    }
                    // user decides to begin new workout
                } else {
                    // get a new workout_id
                    url = `${process.env.VUE_APP_API}/workout`;
                    res = await fetch(url, {
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
                    // init fresh workoutSummary
                    window.sessionStorage['workoutSummary'] = JSON.stringify({});
                }
            }

            // load workout history
            url = `${process.env.VUE_APP_API}/workout?user_id=${this.$cookies.get("user_id")}`;
            try {
                res = await fetch(url);
                this.workoutHistory = await res.json();
                this.workoutHistory = this.workoutHistory.filter(workout => workout['workout_id'] !== parseInt(this.$cookies.get("workout_id")));
            } catch (error) {
                console.log(error);
            }
        }
        // load today's workout by default, use dummy object if user does not go to training first
        if (!window.sessionStorage['workoutSummary']) this.summary = {};
        else this.summary = JSON.parse(window.sessionStorage['workoutSummary']);
    },
    methods: {
        // name says it all
        async getWorkoutSummary() {
            // user asks for today's workout
            if (!this.selectedWorkout) {
                if (window.sessionStorage['workoutSummary']) return this.summary = JSON.parse(window.sessionStorage['workoutSummary']);
                return this.summary = {};
            }
            // else, user wants an old workout
            let url = `${process.env.VUE_APP_API}/exercise/allSummary?workout_id=${this.selectedWorkout.workout_id}`;
            try {
                let res = await fetch(url);
                if (res.status === 200) {
                    res = await res.json();
                    this.summary = res;
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    data() {
        return {
            selectedWorkout: undefined,
            workoutHistory: undefined,
            summary: {},
            progressions: this.$store.getters.progressions,
        }
    }
}
</script>

<style scoped>
div {
    text-align: center;
}
#tables {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    margin: 3vh auto;
    padding: 0 4vw;
    gap: 1rem;
}
table {
    text-align: left;
    background-color: #ff7320;
    border-radius: 20px;
    padding: 1vh 20px;
    color: white;
}
/* COLORING */
/* dips & hinges */
table:nth-of-type(3), table:nth-of-type(4) {
    background-color: #f76668;
}
table:nth-of-type(5), table:nth-of-type(6) {
    background-color: #c95a8e;
}
/* core */
table:nth-of-type(7), table:nth-of-type(8), table:nth-of-type(9) {
    background-color: #865c97;
}
th {
    text-align: center;
    text-transform: uppercase;
    font-size: 1.1em;
}
#legend {
    text-align: left;
    font-size: 0.9em;
    font-weight: normal;
}
.variant-name {
    text-align: left;
    width: 250px;
}
td {
    margin-right: 2em;
}
@media (min-width: 900px) {
    #tables {
        padding: 0 20vw;
    }
    .variant-name {
        width: 80%;
    }
}
</style>
