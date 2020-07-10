<template>
    <button
        @click="onClick"
        :style=styles
        >{{ text }}</button>
</template>

<script>
export default {
    name: "BaseButton",
    props: {
        text: {
            type: String
        },
        styles: {
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
    color: var(--main);
    background-color: white;
    border: 3px solid white;
    border-radius: 10px;
    padding: 0.5em;
    outline: none;
}
</style>
