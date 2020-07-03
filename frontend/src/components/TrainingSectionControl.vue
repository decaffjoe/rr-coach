<template>
    <div>
        <button @click="skipCurrentSection('prev')">Previous Section</button>
        <h1>{{ currentSection }}</h1>
        <button @click="skipCurrentSection('next')">Next Section</button>
    </div>
</template>

<script>
export default {
    name: "TrainingSectionControl",
    props: {
        currentSection: {
            type: String
        }
    },
    methods: {
        // skip forward or backward e.g. from 'Warmups' to 'Pullups & Squats'
        skipCurrentSection(direction) { this.$emit('skipCurrentSection', direction); },
    },
}
</script>

<style scoped>
div>* {
    display: inline-block;
}
button {
    background-color: brown;
}
</style>
