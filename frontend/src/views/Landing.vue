<template>
    <div>
        <router-link to="/login"><button>Create Account / Login</button></router-link>
        <h1>Welcome to the r/bodyweight fitness Recommended Routine (RR) Training Tracker!</h1>
        <router-link to="/pairs"><button>Train now!</button></router-link>
        <button>More info</button>
        <button>Nutrition guide</button>
    </div>
</template>

<script>
export default {
    name: "Landing",
    components: { },
    methods: { },
    data() {
        return {  }
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
