<template>
    <div>
        <!-- SELECT TRAINING SESSION DATA TO DISPLAY -->
        <select @change="getWorkoutSummary" v-model="selectedWorkout" v-if="this.$cookies.isKey('user_id')">
            <option v-for="workout of workoutHistory" :key="workout.workout_id" :value="workout">{{ new Date(workout.createdAt).toDateString() }}</option>
            <option :value="undefined">Today</option>
        </select>
        <!-- SUMMARY -->
        <table>
            <div v-for="ex in Object.keys(summary)" :key="ex">
                <!-- e.g. "Pullups" -->
                <tr><th colspan="2">{{ `${ex[0].toUpperCase()}${ex.slice(1)}s` }}</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of summary[ex]" :key="set.id">
                    <!-- e.g. "Pullup Negatives" -->
                    <td>{{ progressions[`${ex}Progression`][set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
            </div>
        </table>

        <!-- NEW SUMMARY WITH ROWS BY VARIANT (INSTEAD OF SET) -->
        <h1>TEST</h1>
        <table>
            <div v-for="section of Object.keys(uniqueExercises)" :key="section">
                <!-- e.g. "PULLUPS" -->
                <tr><th colspan="4">{{ `${section[0].toUpperCase()}${section.slice(1)}s` }}</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td colspan="3">Reps</td>
                </tr>
                <tr v-for="variant of Object.keys(uniqueExercises[section])" :key="variant.id">
                    <!-- e.g. "Pullup Negatives" -->
                    <td class="variant-name">{{ variant }}</td>
                    <td v-for="reps of uniqueExercises[section][variant]" :key="reps.id">{{ reps }}</td>
                </tr>
            </div>
        </table>
    </div>
</template>

<script>
export default {
    name: "Summary",
    computed: {
        uniqueExercises() {
            let exercises = {}, obj, section, set;
            for (section of Object.keys(this.summary)) {
                obj = {};
                for (set of this.summary[section]) {
                    if (!obj[this.progressions[`${section}Progression`][set.progression].name]) {
                        obj[this.progressions[`${section}Progression`][set.progression].name] = [];
                    }
                    obj[this.progressions[`${section}Progression`][set.progression].name].push(set.reps);
                }
                exercises[section] = obj;
            }
            console.log(exercises);
            return exercises;
        },
    },
    // get user's previous workouts by date, if logged in
    async created() {
        if (this.$cookies.isKey("user_id")) {
            let url = `http://localhost:3000/workout?user_id=${this.$cookies.get("user_id")}`;
            try {
                let res = await fetch(url);
                this.workoutHistory = await res.json();
                // filter out the browser workout_id to avoid duplicate entry loading from db
                this.workoutHistory = this.workoutHistory.filter(workout => workout['workout_id'] !== parseInt(this.$cookies.get("workout_id")));
            } catch (error) {
                console.log(error);
            }
        }
        // load today's workout by default, init workoutSummary if user does not go to training first
        if (!window.sessionStorage['workoutSummary']) window.sessionStorage['workoutSummary'] = JSON.stringify({});
        this.summary = JSON.parse(window.sessionStorage['workoutSummary']);
    },
    methods: {
        // name says it all
        async getWorkoutSummary() {
            // user asks for today's workout
            if (!this.selectedWorkout) return this.summary = JSON.parse(window.sessionStorage['workoutSummary']);
            // else, user wants historical workout
            let url = `http://localhost:3000/exercise/allSummary?workout_id=${this.selectedWorkout.workout_id}`;
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
table {
    margin: 0 auto;
}
th {
    text-align: left;
    text-transform: uppercase;
}
#legend {
    text-align: left;
    font-size: 0.9em;
    font-weight: normal;
}
table div {
    margin-bottom: 3vh;
}
.variant-name {
    text-align: left;
}
</style>
