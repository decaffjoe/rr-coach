<template>
    <div>
        <router-link to="/warmup"><button>Back to Warmup</button></router-link>
        <router-link to="/"><button>Home</button></router-link>
        <button>Skip Pair</button>
        <h1>{{ currentExercise }}</h1>
        <hr>
        <p><span>{{ currentSetNum }}</span> / <span>{{ currentSetRange }}</span></p>
        <hr>
        <button @click="prevSet">Previous set</button>
        <button @click="nextSet">Next set</button>
        <h2>Pull-ups</h2>
        <p>Rep goal: 5 - 8</p>
        <form action="" method="POST">
            <p>Completed: </p>
            <input type="text">
        </form>
        <p>The goal of this exercise is to train the body into becoming very strong and immensely handsome etc... etc...</p>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    name: "Pairs",
    computed: {
        currentExercise() { return this.$store.getters.currentExercise; },
        currentSetNum() { return this.$store.getters.currentSetNum; },
        currentSetRange() { return this.$store.getters.currentSetRange; }
    },
    components: {  },
    methods: {
        ...mapActions(["nextSet", "prevSet"]),
    },
    data() {
        return { }
    }
};
</script>

<style scoped>
form p {
    display: inline;
}
div {
    text-align: center;
}
button {
    background-color: brown;
}
</style>
