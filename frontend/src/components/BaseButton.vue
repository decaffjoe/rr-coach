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
    color: #eee;
    font-weight: bold;
    background-color: #fb525d;
    border: none;
    border-radius: 10px;
    padding: 0.3em 1em 0.4em;
    transition: 0.2s;
    outline: none;
}
button:hover {
    color: white;
}
</style>
