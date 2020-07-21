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
    color: white;
    background-color: var(--main);
    border: 3px solid var(--main);
    border-radius: 10px;
    padding: 0.5em;
    outline: none;
}
button:hover {
    cursor: pointer;
}
</style>
