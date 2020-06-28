<template>
    <div>
        <Navbar />
        <h1>Welcome to the r/bodyweight fitness Recommended Routine (RR) Training Tracker!</h1>
        <router-link to="/pairs"><button>Train now!</button></router-link>
        <button><a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine">More info</a></button>
        <button><a href="https://thefitness.wiki/improving-your-diet/">Nutrition guide</a></button>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
    name: "Landing",
    components: { Navbar },
    methods: { },
    data() {
        return { }
    }
};
</script>

<style scoped>
div {
    text-align: center;
}
h1 {
    color: blue;
}
</style>
