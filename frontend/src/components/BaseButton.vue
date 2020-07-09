<template>
    <button
        @click="onClick"
        :style=style
        >{{ text }}</button>
</template>

<script>
export default {
    name: "BaseButton",
    props: {
        text: {
            type: String
        },
        style: {
            type: Object
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    },
}
</script>

<style scoped>
button {
    font-weight: bold;
    font-size: 0.9em;
    color: white;
    background-color: var(--main);
    border: 3px solid var(--main);
    border-radius: 80px;
    padding: 0.5em 1.2em;
    transition: 0.2s;
    outline: none;
}
</style>
