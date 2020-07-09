<template>
  <div id="app">
      <router-view />
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
    background-color: white;
    color: var(--main);
    font-family: 'Oxygen', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    padding: 0;
}
.container {
    padding: 0 25vw;
}
</style>
