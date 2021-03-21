import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "../views/Landing.vue";
import TrainNow from "../views/TrainNow.vue";
import WorkoutSummary from "../views/WorkoutSummary.vue";

// Load Vue Router
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/train",
    name: "TrainNow",
    component: TrainNow,
  },
  {
    path: "/summary",
    name: "WorkoutSummary",
    component: WorkoutSummary,
  },
];

// Create router
export default new VueRouter({ routes });
