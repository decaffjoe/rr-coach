<template>
  <div>
    <!-- SUMMARY -->
    <div id="tables">
      <table v-for="section of Object.keys(uniqueExercises)" :key="section">
        <!-- e.g. "PULLUPS" -->
        <tr>
          <th colspan="4">
            {{ `${section[0].toUpperCase()}${section.slice(1)}s` }}
          </th>
        </tr>
        <tr id="legend">
          <td>Progression</td>
          <td class="reps" colspan="3">Reps</td>
        </tr>
        <tr
          v-for="variant of Object.keys(uniqueExercises[section])"
          :key="variant.id"
        >
          <!-- e.g. "Pullup Negatives" -->
          <td class="variant-name">{{ variant }}</td>
          <td
            class="reps"
            v-for="reps of uniqueExercises[section][variant]"
            :key="reps.id"
          >
            {{ reps }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Summary",
  computed: {
    uniqueExercises() {
      let exercises = {},
        obj,
        section,
        set;
      for (section of Object.keys(this.summary)) {
        obj = {};
        for (set of this.summary[section]) {
          // set will be null if user skips it (goes out of order)
          if (set !== null && set !== "null") {
            if (
              !obj[
                this.progressions[`${section}Progression`][set.progression].name
              ]
            ) {
              obj[
                this.progressions[`${section}Progression`][set.progression].name
              ] = [];
            }
            obj[
              this.progressions[`${section}Progression`][set.progression].name
            ].push(set.reps);
          }
        }
        exercises[section] = obj;
      }
      return exercises;
    },
  },
  async created() {
    // try to load sessionStorage workout
    if (!window.sessionStorage["workoutSummary"]) this.summary = {};
    else this.summary = JSON.parse(window.sessionStorage["workoutSummary"]);
  },
  methods: {
    // name says it all
    async getWorkoutSummary() {
      // user asks for today's workout
      if (!this.selectedWorkout) {
        if (window.sessionStorage["workoutSummary"])
          return (this.summary = JSON.parse(
            window.sessionStorage["workoutSummary"],
          ));
        return (this.summary = {});
      }
    },
  },
  data() {
    return {
      selectedWorkout: undefined,
      workoutHistory: undefined,
      summary: {},
      progressions: this.$store.getters.progressions,
    };
  },
};
</script>

<style scoped>
div {
  text-align: center;
}
#tables {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 3vh auto;
  padding: 0 4vw;
  gap: 1rem;
}
table {
  text-align: left;
  background-color: #ff7320;
  border-radius: 20px;
  padding: 1vh 20px;
  color: white;
}
/* COLORING */
/* dips & hinges */
table:nth-of-type(3),
table:nth-of-type(4) {
  background-color: #f76668;
}
table:nth-of-type(5),
table:nth-of-type(6) {
  background-color: #c95a8e;
}
/* core */
table:nth-of-type(7),
table:nth-of-type(8),
table:nth-of-type(9) {
  background-color: #865c97;
}
th {
  text-align: center;
  text-transform: uppercase;
  font-size: 1.1em;
}
#legend {
  text-align: left;
  font-size: 0.9em;
  font-weight: normal;
}
.variant-name {
  text-align: left;
  width: 250px;
}
td {
  margin-right: 2em;
}
@media (min-width: 900px) {
  #tables {
    padding: 0 20vw;
  }
  .variant-name {
    width: 80%;
  }
}
</style>
