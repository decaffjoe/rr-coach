<template>
    <div id="reddit-links">
        <a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine">Full training guide</a>
        <a href="https://thefitness.wiki/improving-your-diet/">Nutrition guide</a>
    </div>
</template>

<script>
export default {
    name: "Footer",
}
</script>

<style>
#reddit-links {
    background-color: black;
    padding: 1.3vh 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
}
#reddit-links a {
    color: white;
    font-size: 1.0em;
    text-decoration: none;
}
</style>
