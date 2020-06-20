<template>
    <div>
        <router-link to="/"><button>Home</button></router-link>
        <router-link to="/pairs"><button>Skip Warmup</button></router-link>
        <h1>WARMUP</h1>
        <hr>
        <p>1 / 8</p>
        <hr>
        <h2>Shoulder Band Warmup</h2>
        <p>Rep goal: 5 - 10</p>
        <p>(Psshhh... we don't track warmup reps!!)</p>
        <p>The goal of this exercise is to train the body into becoming very strong and immensely handsome etc... etc...</p>
    </div>
</template>

<script>
export default {
    name: "Warmup",
    components: {  },
    methods: {  },
    data() {
        return {  }
    }
};
</script>

<style scoped>
div {
    text-align: center;
}
button {
    background-color: brown;
}
</style>
