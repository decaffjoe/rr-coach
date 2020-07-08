<template>
    <div id="main">
        <Navbar />
        <section id="welcome">
            <h1>Welcome to the <a href="https://www.reddit.com/r/bodyweightfitness/">r/bodyweightfitness</a> Recommended Routine (RR) Training Tracker (TT)</h1>
            <ul>
                <li>Track your reps</li>
                <li>Built-in videos and tips to improve your form</li>
                <li>Keep tabs on your progress with a full history of your training sessions</li>
            </ul>
            <BaseButton id="train-link" v-on:click="goToTrain" :text="'Train now!'" />
        </section>
        <div class="grid">
            <section>
                <h2>How does it work?</h2>
                <ul>
                    <li>Warmup + 9 total strength exercises</li>
                    <li>6 strength exercises performed in pairs (set of pullups, set of squats, set of pullups...)</li>
                    <li>3 core strength exercises performed in a triplet</li>
                    <li>90 seconds to 3 minutes of rest between every set</li>
                </ul>
                <div id="reddit-links">
                    <a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine"><BaseButton :text="'See the full training guide'" /></a>
                    <a href="https://thefitness.wiki/improving-your-diet/"><BaseButton :text="'Nutrition guide'" /></a>
                </div>
            </section>
            <section>
                <h2>What do I need?</h2>
                <ul>
                    <li>Time: ~1 hour, 3x per week</li>
                    <li>A place to do <a href="https://www.youtube.com/watch?v=rloXYB8M3vU&feature=youtu.be">Rows</a> (Low Bar, or Gymnastics Rings, a Sturdy Table; This is non negotiable regardless of physical skill level. Rows are absolutely integral to the quality of the routine and cannot be substituted.)</li>
                    <li>A place to do pull ups, if you are at the point in the program where you add pull-ups (monkey bars, Pull-up bar, rings, etc)</li>
                    <li><a href="https://antranik.org/wp-content/uploads/2014/01/antranik-holding-support-hold-on-parallel-bars.jpg">Parallel Bars</a> (There are progressions such as the HSPU progression that can be done in place of these once you have reached the appropriate level which do not require these, so if you absolutely cannot find the corner of a kitchen counter, two sturdy chairs, or anything like that, do not let this bar you from starting.)</li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";
export default {
    name: "Landing",
    components: { Navbar, BaseButton },
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
#main {
    text-align: center;
}
#welcome {
    margin: 10vh auto;
}
#reddit-links {
    margin-top: 5vh;
}
h1 {
    text-transform: uppercase;
    color: var(--accent);
    font-size: 2.0em;
}
h1 a {
    color: var(--main);
    text-decoration: none;
}
h1 a:hover {
    text-decoration: underline;
}
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
}
#train-link {
    display: block;
    margin: 0 auto 1.0em;
}
</style>
