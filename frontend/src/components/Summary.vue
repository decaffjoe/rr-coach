<template>
    <div>
        <p v-if="!this.$cookies.isKey('user_id')">Want to save these stats for the future? Create an account or login using the button above.</p>
        <!-- SELECT TRAINING SESSION DATA TO DISPLAY -->
        <p v-if="this.$cookies.isKey('user_id')">Workout from:</p>
        <select v-model="oldWorkoutId" v-if="this.$cookies.isKey('user_id')">
            <option v-for="workout of workoutHistory" :key="workout.createdAt" :value="workout.workout_id">{{ new Date(workout.createdAt).toDateString() }}</option>
        </select>
        <button @click="getOldWorkoutSummary" v-if="this.$cookies.isKey('user_id')">Get Summary</button>
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
    </div>
</template>

<script>
export default {
    name: "Summary",
    // get user's previous workouts by date, if logged in
    async created() {
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
        // name says it all
        async getOldWorkoutSummary() {
            let url = `http://localhost:3000/exercise/allSummary?workout_id=${this.oldWorkoutId}`;
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
            oldWorkoutId: undefined,
            workoutHistory: undefined,
            summary: JSON.parse(window.sessionStorage['workoutSummary']),
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
}
#legend {
    text-align: left;
    font-size: 0.9em;
    font-weight: normal;
}
</style>
