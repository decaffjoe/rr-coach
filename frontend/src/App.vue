<template>
  <div id="app">
    <button id="clicker" @click="linkUp">Get server side bread</button>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      alpha: 3
    };
  },
  methods: {
    linkUp() {
      console.log("trying to fetch...");
      fetch("http://localhost:3000", { method: "get", mode: "cors" })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
