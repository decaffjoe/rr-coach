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
            <BaseButton id="train-link" v-on:click="goToTrain" :text="'Train now!'" :style="trainNowStyles" />
        </section>
        <div class="grid">
            <section>
                <h2>How does it work?</h2>
                <ul>
                    <li>Warmup</li>
                    <li>6 strength exercises, performed in pairs (set of pullups, set of squats, set of pullups...)</li>
                    <li>3 core strength exercises performed, in a triplet</li>
                    <li>90 seconds to 3 minutes of rest between every set</li>
                </ul>
                <div id="reddit-links">
                    <a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine"><BaseButton :text="'Full training guide'" :style="redditStyles" /></a>
                    <a href="https://thefitness.wiki/improving-your-diet/"><BaseButton :text="'Nutrition guide'" :style="redditStyles" /></a>
                </div>
            </section>
            <section>
                <h2>What do I need?</h2>
                <ul>
                    <li>Time: ~1 hour, 3x per week</li>
                    <li>A place to do <a href="https://www.youtube.com/watch?v=rloXYB8M3vU&feature=youtu.be">Rows</a> (Low Bar, or Gymnastics Rings, a Sturdy Table)</li>
                    <li>A place to do pullups, if you are at the point in the program where you add pullups (monkey bars, pullup bar, rings, etc)</li>
                    <li>Recommended: <a href="https://antranik.org/wp-content/uploads/2014/01/antranik-holding-support-hold-on-parallel-bars.jpg">Parallel Bars</a> (corner of a kitchen counter, two sturdy chairs, or anything like that)</li>
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
        return {
            trainNowStyles: {
                'font-size': '1.5rem',
                'border-radius': '0',
                'color': 'white',
                'background-color': 'var(--main)',
            },
            redditStyles: {
                'color': 'white',
                'border-color': 'white',
            },
        }
    }
};
</script>

<style scoped>
#main {
    text-align: center;
    min-height: 100vh;
}
#welcome {
    margin: 7vh auto 0;
    padding: 0 15vw;
}
#welcome ul {
    padding-left: 20vw;
}
section ul {
    padding-left: 7vw;
    text-align: left;
}
li {
    list-style: none;
    margin: 1em 0;
    margin-left: -50px;
}
li::before {
    --size: 20px;
    content: '';
    display: inline-block;
    height: calc(var(--size) - 4px);
    width: var(--size);
    background-image: url('../assets/arrow.svg');
    background-size: var(--size);
}
h1 {
    text-transform: uppercase;
    font-size: 2.0em;
}
h1 a {
    text-decoration: none;
    color: var(--main);
}
h1 a:hover {
    text-decoration: underline;
}
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: var(--main);
    color: white;
    padding: 0 20vw 2vh;
}
.grid section:first-of-type {
    margin-right: 1.0em;
}
.grid section:nth-of-type(2) {
    margin-left: 1.0em;
}
#reddit-links a>* {
    margin: 0.5em 0.6em;
}
#train-link {
    display: block;
    margin: 1.5em auto;
}
</style>
