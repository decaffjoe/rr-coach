<template>
    <div>
        <button @click="prevPair">Previous Section</button>
        <router-link to="/"><button>Home</button></router-link>
        <button @click="nextPair">Next Section</button>
        <h1>{{ currentExercise }}</h1>
        <hr>
        <button @click="prevSet" class="set">Previous set</button>
        <p class="set"><span>{{ currentSetNum }}</span> / <span>{{ currentSetRange }}</span></p>
        <button @click="nextSet" class="set">Next set</button>
        <hr>
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
        ...mapActions(["nextSet", "prevSet", "prevPair", "nextPair"]),
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
.set {
    display: inline-block;
}
</style>
