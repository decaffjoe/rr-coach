<template>
  <div>
      <Navbar />
      <h1>Workout Summary</h1>
      <p>Exercise | Set | Reps </p>
      <p v-for="set of pullups" :key="set.id">{{ set.exerciseVariant }} {{ set.setNumber }} {{ set.reps }}</p>
      <p v-for="set of squats" :key="set.id">{{ set.exerciseVariant }} {{ set.setNumber }} {{ set.reps }}</p>
      <p v-for="set of dips" :key="set.id">{{ set.exerciseVariant }} {{ set.setNumber }} {{ set.reps }}</p>
      <p v-for="set of hinges" :key="set.id">{{ set.exerciseVariant }} {{ set.setNumber }} {{ set.reps }}</p>
      <p v-for="set of rows" :key="set.id">{{ set.exerciseVariant }} {{ set.setNumber }} {{ set.reps }}</p>
      <p v-for="set of pushups" :key="set.id">{{ set.exerciseVariant }} {{ set.setNumber }} {{ set.reps }}</p>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
    name: "Summary",
    components: { Navbar, },
    computed: {
        pullups() {
            if (this.summary['Pullups & Squats']) {
                return this.summary['Pullups & Squats'].filter(set => set.currentPath === 'pullup')
            } else return [];
        },
        squats() {
            if (this.summary['Pullups & Squats']) {
                return this.summary['Pullups & Squats'].filter(set => set.currentPath === 'squat')
            } else return [];
        },
        dips() {
            if (this.summary['Dips & Hinges']) {
                return this.summary['Dips & Hinges'].filter(set => set.currentPath === 'dip');
            } else return [];
        },
        hinges() {
            if (this.summary['Dips & Hinges']) {
                return this.summary['Dips & Hinges'].filter(set => set.currentPath === 'hinge')
            } else return [];
        },
        rows() {
            if (this.summary['Rows & Pushups']) {
                return this.summary['Rows & Pushups'].filter(set => set.currentPath === 'row')
            } else return [];
        },
        pushups() {
            if (this.summary['Rows & Pushups']) {
                return this.summary['Rows & Pushups'].filter(set => set.currentPath === 'pushup')
            } else return [];
        },
    },
    data() {
        return {
            summary: JSON.parse(window.sessionStorage['workoutSummary']),
        }
    }
}
</script>

<style scoped>
div {
    text-align: center;
}
</style>
