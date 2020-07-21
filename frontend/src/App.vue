<template>
    <div id="app">
        <router-view :key="$route.fullPath" />
    </div>
</template>

<script>
export default {
    name: "App",
};
</script>

<style>
:root {
    --main: #ff8e30;
}
html,body {
    color: white;
    background-color: var(--main);
    font-family: 'Oxygen', sans-serif;
    font-size: 1.0rem;
    font-weight: 700;
    margin: 0;
    padding: 0;
    min-height: 100vh;
}
#app {
    min-height: 100vh;
}
.container {
    padding: 0 25vw;
}
</style>
