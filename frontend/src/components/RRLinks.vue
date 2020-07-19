<template>
    <div>
        <a href="https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine"><BaseButton class="btn" :text="'Full training guide'" /></a>
        <a href="https://thefitness.wiki/improving-your-diet/"><BaseButton class="btn" :text="'Nutrition guide'" /></a>
    </div>
</template>

<script>
import BaseButton from "../components/BaseButton.vue";
export default {
    name: "Footer",
    components: { BaseButton }
}
</script>

<style scoped>
div {
    background-color: white;
    padding-top: 2vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.2em;
    align-items: center;
}
div a:first-of-type {
    justify-self: end;
}
div a:nth-of-type(2) {
    justify-self: start;
}
.btn {
    color: var(--main);
    background-color: white;
    border-color: var(--main);
}
/* DESKTOP STYLING */
@media (min-width: 900px) {
    div {
        gap: 1em;
        padding-top: 4vh;
    }
}
</style>
