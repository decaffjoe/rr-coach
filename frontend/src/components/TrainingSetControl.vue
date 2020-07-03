<template>
    <div>
        <button @click="decrementSetNum" class="set">Previous set</button>
        <p class="set"><span>{{ currentSectionSet }}</span> / <span>{{ currentMaxSets }}</span></p>
        <button @click="incrementSetNum" class="set">Next set</button>
    </div>
</template>

<script>
export default {
    name: "TrainingSetControl",
    props: {
        currentSectionSet: {
            type: Number
        },
        currentMaxSets: {
            type: Number
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
    }
}
</script>

<style scoped>
button {
    background-color: brown;
}
.set {
    display: inline-block;
}
</style>
