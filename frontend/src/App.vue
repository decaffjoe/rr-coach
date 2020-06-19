<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
export default {
    name: "App",
    components: { },
};
</script>

<style>
:root {
    --blue: #ff22ff;
}
html,body {
    color: white;
    margin: 0;
    padding: 0;
}
</style>
