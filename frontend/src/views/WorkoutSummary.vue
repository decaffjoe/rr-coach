<template>
  <div>
    <Navbar />
    <h1>
      Your In-Progress Training Summary
    </h1>
    <WarningBanner
      v-if="this.$cookies.isKey('user_id')"
      text="Attention! The RR Coach database is being shut off on March 21. You are now no longer able to save your workouts & view past workout summaries (but you will always be able to view your in-progress workout summary and use the 'Train' section normally). If you want to save your workout history please click the button below."
    />
    <a v-if="this.$cookies.isKey('user_id')" id="downloader" :href="downloadUrl" download="workout_history.json">
      <BaseButton text="Download workout history" />
    </a>
    <Summary />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Summary from "../components/Summary.vue";
import WarningBanner from "../components/WarningBanner.vue";
import BaseButton from "../components/BaseButton";
export default {
  name: "WorkoutSummary",
  components: { Navbar, Summary, WarningBanner, BaseButton },
  data() {
    return {
      downloadUrl: `${
        process.env.VUE_APP_API
      }/workout/history?user_id=${this.$cookies.get("user_id")}`,
    };
  },
};
</script>

<style scoped>
div {
  text-align: center;
}
h1 {
  margin-top: var(--nav-spacing);
}
#downloader button {
  margin-top: 1rem;
}
</style>
