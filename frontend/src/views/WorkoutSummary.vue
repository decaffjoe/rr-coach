<template>
  <div>
    <Navbar />
    <h1>
      Your Training Summary
    </h1>
    <Banner
      v-if="!this.$cookies.isKey('user_id')"
      text="Want to save these stats for the future?"
      link="/login"
      linkText="Create an account or login"
    />
    <Summary />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Summary from "../components/Summary.vue";
import Banner from "../components/Banner.vue";
export default {
  name: "WorkoutSummary",
  components: { Navbar, Summary, Banner },
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
