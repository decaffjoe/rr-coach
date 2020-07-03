<template>
    <div>
        <p>Rep Goal: {{ currentRepGoal }}</p>
        <p id="completed" v-if="currentSection !== 'Warmups'">Completed: </p>
        <input @keyup="updateRepsDone" @keypress.enter="incrementSetNum" v-model="reps" type="text" v-if="currentSection !== 'Warmups'">
    </div>
</template>

<script>
export default {
    name: "TrainingReps",
    props: {
        repsDone: {
            type: String
        },
        currentRepGoal: {
            type: String
        },
        currentSection: {
            type: String
        }
    },
    methods: {
        incrementSetNum() { this.$emit('incrementSetNum'); },
        updateRepsDone() { this.$emit('updateRepsDone', this.reps); }
    },
    watch: {
        // repsDone will return (a) user entered reps, (b) sessionStorage reps or (c) undefined, in that order
        repsDone: {
            handler(value) { this.reps = value; },
        },
    },
    data() {
        return { reps: undefined, }
    }
}
</script>

<style scoped>
#completed {
    display: inline;
}
</style>
