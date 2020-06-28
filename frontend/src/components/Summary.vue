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
                <tr><th colspan="2">Pullups</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of pullups" :key="set.id">
                    <td>{{ pullupProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Squats</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of squats" :key="set.id">
                    <td>{{ squatProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Dips</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of dips" :key="set.id">
                    <td>{{ dipProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Hinges</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of hinges" :key="set.id">
                    <td>{{ hingeProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Rows</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of rows" :key="set.id">
                    <td>{{ rowProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Pushups</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of pushups" :key="set.id">
                    <td>{{ pushupProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Core: Anti-Extensions</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of antiExtensions" :key="set.id">
                    <td>{{ antiExtensionProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Core: Anti-Rotations</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of antiRotations" :key="set.id">
                    <td>{{ antiRotationProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
                <tr><th colspan="2">Core: Extensions</th></tr>
                <tr id="legend">
                    <td>Progression</td>
                    <td>Reps</td>
                </tr>
                <tr v-for="set of extensions" :key="set.id">
                    <td>{{ extensionProgression[set.progression].name }}</td>
                    <td>{{ set.reps }}</td>
                </tr>
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
        pullups() {
            if (this.summary['pullup']) return this.summary['pullup'];
            else return [];
        },
        squats() {
            if (this.summary['squat']) return this.summary['squat'];
            else return [];
        },
        dips() {
            if (this.summary['dip']) return this.summary['dip'];
            else return [];
        },
        hinges() {
            if (this.summary['hinge']) return this.summary['hinge'];
            else return [];
        },
        rows() {
            if (this.summary['row']) return this.summary['row'];
            else return [];
        },
        pushups() {
            if (this.summary['pushup']) return this.summary['pushup'];
            else return [];
        },
        antiExtensions() {
            if (this.summary['antiextension']) return this.summary['antiextension'];
            else return [];
        },
        antiRotations() {
            if (this.summary['antirotation']) return this.summary['antirotation'];
            else return [];
        },
        extensions() {
            if (this.summary['extension']) return this.summary['extension'];
            else return [];
        },
    },
    data() {
        return {
            prevWorkoutId: undefined,
            workoutHistory: undefined,
            summary: JSON.parse(window.sessionStorage['workoutSummary']),
            pullupProgression: this.$store.state.pullupProgression,
            squatProgression: this.$store.state.squatProgression,
            dipProgression: this.$store.state.dipProgression,
            hingeProgression: this.$store.state.hingeProgression,
            rowProgression: this.$store.state.rowProgression,
            pushupProgression: this.$store.state.pushupProgression,
            antiExtensionProgression: this.$store.state.antiExtensionProgression,
            antiRotationProgression: this.$store.state.antiRotationProgression,
            extensionProgression: this.$store.state.extensionProgression,
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
    font-size: 0.9em;
    font-weight: normal;
}
</style>
