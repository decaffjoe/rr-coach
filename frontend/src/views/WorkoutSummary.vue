<template>
  <div>
    <Navbar />
    <p
      v-if="!this.$cookies.isKey('user_id')"
      :class="{ topPageMargin: !this.$cookies.isKey('user_id') }"
    >
      Want to save these stats for the future? Create an account or login from
      the homepage.
    </p>
    <h1 :class="{ topPageMargin: this.$cookies.isKey('user_id') }">
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
.topPageMargin {
  margin-top: var(--nav-spacing);
}
div {
  text-align: center;
}
p {
  color: white;
  background-color: darkolivegreen;
  font-size: 0.9em;
  margin: 0;
  padding: 0.7vh 0;
}
</style>
