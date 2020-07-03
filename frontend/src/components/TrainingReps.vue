<template>
    <div>
        <p>Rep Goal: {{ currentRepGoal }}</p>
        <!-- USER REP INPUT -->
        <p id="completed" v-if="currentSection !== 'Warmups'">Completed: </p>
        <input @keypress.enter="incrementSetNum" v-model="repsDone" type="text" v-if="currentSection !== 'Warmups'">
    </div>
</template>

<script>
export default {
    name: "TrainingReps"
}
</script>

<style scoped>
#completed {
    display: inline;
}
</style>
