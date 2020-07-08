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
    --accent: #2f4858;
    --main: #ff7e00;
}
html,body {
    background-color: #fff;
    color: var(--main);
    font-family: 'Oxygen', sans-serif;
    margin: 0;
    padding: 0;
}
</style>
