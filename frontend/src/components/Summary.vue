<template>
    <div>
        <p v-if="!this.$cookies.isKey('user_id')">Want to save these stats for the future? Create an account or login using the button above.</p>
        <p v-if="this.$cookies.isKey('user_id')">Workout from:</p>
        <select v-model="prevWorkoutId" v-if="this.$cookies.isKey('user_id')">
            <option v-for="workout of workoutHistory" :key="workout.createdAt" :value="workout.workout_id">{{ new Date(workout.createdAt).toDateString() }}</option>
        </select>
        <button @click="getPreviousWorkoutSummary" v-if="this.$cookies.isKey('user_id')">Get Summary</button>
        <div>
            <table>
                <div v-for="ex in Object.keys(sets)" :key="ex">
                    <!-- e.g. "Pullups" -->
                    <tr><th colspan="2">{{ `${ex[0].toUpperCase()}${ex.slice(1)}s` }}</th></tr>
                    <tr id="legend">
                        <td>Progression</td>
                        <td>Reps</td>
                    </tr>
                    <tr v-for="set of sets[ex]" :key="set.id">
                        <td>{{ progressions[`${ex}Progression`][set.progression].name }}</td>
                        <td>{{ set.reps }}</td>
                    </tr>
                </div>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "Summary",
    async created() {
        // get user's previous workouts by date, if logged in
        if (this.$cookies.isKey("user_id")) {
            let url = `http://localhost:3000/workout?user_id=${this.$cookies.get("user_id")}`;
            try {
                let res = await fetch(url);
                this.workoutHistory = await res.json();
            } catch (error) {
                console.log(error);
            }
        }
    },
    methods: {
        async getPreviousWorkoutSummary() {
            let url = `http://localhost:3000/exercise/allSummary?workout_id=${this.prevWorkoutId}`;
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
    computed: {
        sets() {
            let obj = {};
            for (let ex of this.$store.state.allExercises) {
                if (this.summary[ex]) obj[ex] = this.summary[ex];
            }
            return obj;
        },
        progressions() {
            return this.$store.state.progressions;
        }
    },
    data() {
        return {
            prevWorkoutId: undefined,
            workoutHistory: undefined,
            summary: JSON.parse(window.sessionStorage['workoutSummary']),
            // progressions: {
            //     'pullupProgression': this.$store.state.pullupProgression,
            //     'squatProgression': this.$store.state.squatProgression,
            //     'dipProgression': this.$store.state.dipProgression,
            //     'hingeProgression': this.$store.state.hingeProgression,
            //     'rowProgression': this.$store.state.rowProgression,
            //     'pushupProgression': this.$store.state.pushupProgression,
            //     'antiextensionProgression': this.$store.state.antiExtensionProgression,
            //     'antirotationProgression': this.$store.state.antiRotationProgression,
            //     'extensionProgression': this.$store.state.extensionProgression,
            // },
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
}
#legend {
    text-align: left;
    font-size: 0.9em;
    font-weight: normal;
}
</style>
