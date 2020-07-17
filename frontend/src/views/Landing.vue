<template>
    <div id="main">
        <Navbar />
        <section id="welcome">
            <h1>Welcome to the Recommended Routine (RR) Coach</h1>
            <h2>From <a href="https://www.reddit.com/r/bodyweightfitness/">r/bodyweightfitness</a></h2>
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
                    <li>Warmup</li>
                    <li>6 strength exercises, performed in pairs (set of pullups, set of squats, set of pullups...)</li>
                    <li>3 core strength exercises performed, in a triplet</li>
                    <li>90 seconds to 3 minutes of rest between every set</li>
                </ul>
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
        <Footer />
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";
import Footer from "../components/Footer.vue";
export default {
    name: "Landing",
    components: { Navbar, BaseButton, Footer },
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
    margin: 2vh auto 0;
    padding: 0 15vw;
}
#welcome ul {
    padding-left: 10vw;
}
section ul {
    padding-left: 7vw;
    text-align: left;
}
li {
    list-style: circle;
    margin: 1em 10vw 1em -3vw;
}
#welcome h1 {
    font-size: 1.6em;
    margin: 7vh 0 2vh;
}
#welcome h2 {
    color: red;
    text-transform: lowercase;
    font-size: 1.1em;
    margin: 0 0 7vh;
}
#welcome h2 a {
    color: red;
}
#train-link {
    display: block;
    margin: 7vh auto;
    font-size: 1.5rem;
    border: 5px solid yellow;
    color: black;
    background-color: yellow;
}
.grid {
    display: grid;
    grid-template-columns: 1fr;
    background-color: white;
    color: var(--main);
}
.grid section {
    padding: 0 5vw 2vh 10vw;
}
.grid section ul {
    margin: 0 0 0 5vw;
}
.grid section:first-of-type {
    margin-bottom: 1vh;
}
.grid section:nth-of-type(2) {
    color: white;
    background-color: var(--main);
}
a {
    color: white;
}
</style>
