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
    },
    data() {
        return { }
    }
}
</script>

<style>
div {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
button {
    background-color: brown;
}
</style>
