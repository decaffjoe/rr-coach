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
  --main: #633d34;
  --main-light: #784d42;
  --silver: rgb(240, 240, 240);
  --accent: #f642d3;
  --orange: #ff8e30;
  --nav-spacing: 80px;
  font-size: 14px;
}
html,
body {
  color: var(--main);
  background-color: white;
  font-family: "Oxygen", sans-serif;
  font-size: 1rem;
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
@media (min-width: 900px) {
  :root {
    --nav-spacing: 70px;
  }
}
</style>
