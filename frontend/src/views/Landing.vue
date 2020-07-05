<template>
    <div>
        <Navbar />
        <h1>Welcome to the r/bodyweight fitness Recommended Routine (RR) Training Tracker!</h1>
        <ul>
            <li>Track your reps</li>
            <li>Built-in videos and tips to improve your form</li>
            <li>Keep tabs on your progress with a full history of your training sessions</li>
        </ul>
        <button id="train-link" @click="goToTrain">Train now!</button>
        <a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine"><button>Full training guide</button></a>
        <a href="https://thefitness.wiki/improving-your-diet/"><button>Nutrition guide</button></a>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
    name: "Landing",
    components: { Navbar },
    methods: {
        goToTrain() {
            // Always start at Warmups
            if (window.sessionStorage['currentSection']) delete window.sessionStorage['currentSection'];
            if (window.sessionStorage['currentSectionSet']) delete window.sessionStorage['currentSectionSet'];
            this.$router.push('/train');
        }
    },
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
    margin: 0 auto 1.0em;
}
</style>
