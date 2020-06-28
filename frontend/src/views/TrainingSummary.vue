<template>
    <div>
        <Navbar />
        <h1>Training Summary</h1>
        <Summary />
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Summary from "../components/Summary.vue";
export default {
    name: "TrainingSummary",
    components: { Navbar, Summary, },
}
</script>

<style scoped>
div {
    text-align: center;
}
</style>
