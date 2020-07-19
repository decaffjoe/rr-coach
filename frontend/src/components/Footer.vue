<template>
    <div>
        <a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine">Full training guide</a>
        <a href="https://thefitness.wiki/improving-your-diet/">Nutrition guide</a>
    </div>
</template>

<script>
export default {
    name: "Footer",
}
</script>

<style scoped>
div {
    background-color: black;
    padding: 1.3vh 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
}
div a {
    color: white;
    font-size: 1.0em;
    text-decoration: none;
}
/* DESKTOP STYLING */
@media (min-width: 900px) {
    div {
        margin-top: 10vh;
        background-color: var(--main);
    }
    div a {
        margin: 0 2vw;
        text-decoration: underline;
    }
}
</style>
