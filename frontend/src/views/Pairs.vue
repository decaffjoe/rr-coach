<template>
    <div>
        <router-link to="/warmup"><button>Back to Warmup</button></router-link>
        <router-link to="/"><button>Home</button></router-link>
        <button>Skip Pair</button>
        <h1>EXERCISE 1 & EXERCISE 2</h1>
        <hr>
        <p>1 / 6</p>
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
export default {
    name: "Pairs",
    components: {  },
    methods: {  },
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
