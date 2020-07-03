<template>
    <div>
        <button @click="goToPage('/')">Home</button>
        <button @click="goToPage('/summary')">Workout Summary</button>
    </div>
</template>

<script>
export default {
    name: "TrainingNavbar",
    methods: {
        goToPage(page) {
            this.$emit('saveSet');
            this.$router.push(page);
        },
    }
}
</script>

<style scoped>
button {
    background-color: brown;
}
</style>
