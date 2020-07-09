<template>
    <button @click="onClick">{{ text }}</button>
</template>

<script>
export default {
    name: "BaseButton",
    props: {
        text: {
            type: String
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
}
</script>

<style scoped>
button {
    font-weight: bold;
    font-size: 0.9em;
    color: var(--main);
    background-color: transparent;
    border: 3px solid var(--main);
    border-radius: 80px;
    padding: 0.5em 1.2em;
    transition: 0.2s;
    outline: none;
}
button:hover {
    color: white;
    background-color: var(--main);
}
</style>
