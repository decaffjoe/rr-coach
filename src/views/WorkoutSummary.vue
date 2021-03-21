<template>
  <div>
    <Navbar />
    <h1>
      Your Training Summary
    </h1>
    <Summary />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Summary from "../components/Summary.vue";
export default {
  name: "WorkoutSummary",
  components: { Navbar, Summary },
};
</script>

<style scoped>
div {
  text-align: center;
}
h1 {
  margin-top: var(--nav-spacing);
}
</style>
