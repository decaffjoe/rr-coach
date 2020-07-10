<template>
    <div>
        <Navbar />
        <p v-if="!this.$cookies.isKey('user_id')">Want to save these stats for the future? Create an account or login using the button above.</p>
        <h1>Your Training Summary</h1>
        <Summary />
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Summary from "../components/Summary.vue";
export default {
    name: "WorkoutSummary",
    components: { Navbar, Summary, },
}
</script>

<style scoped>
div {
    text-align: center;
}
p {
    color: white;
    background-color: darkolivegreen;
    font-size: 0.9em;
    margin: 0;
    padding: 0.7vh 0;
}
</style>
