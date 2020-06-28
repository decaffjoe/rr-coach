<template>
    <div>
        <Navbar />
        <h1>Welcome to the r/bodyweight fitness Recommended Routine (RR) Training Tracker!</h1>
        <ul>
            <li>Pick a progression for each exercise and keep track of your reps</li>
            <li>View a full history of your training sessions</li>
            <li>See video demonstrations and form tips</li>
        </ul>
        <router-link to="/train" id="train-link"><button>Train now!</button></router-link>
        <a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine"><button>Full training guide</button></a>
        <a href="https://thefitness.wiki/improving-your-diet/"><button>Nutrition guide</button></a>
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
#train-link {
    display: block;
    margin-bottom: 1.0em;
}
</style>
