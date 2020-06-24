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
    props: ['workoutSummary'],
    computed: {
        pullups() { return this.summary['Pullups & Squats'].filter(set => set.currentPath === 'pullup') },
        squats() { return this.summary['Pullups & Squats'].filter(set => set.currentPath === 'squat') },
        dips() { return this.summary['Dips & Hinges'].filter(set => set.currentPath === 'dip') },
        hinges() { return this.summary['Dips & Hinges'].filter(set => set.currentPath === 'hinge') },
        rows() { return this.summary['Rows & Pushups'].filter(set => set.currentPath === 'row') },
        pushups() { return this.summary['Rows & Pushups'].filter(set => set.currentPath === 'pushup') },
    },
    data() {
        return {
            summary: this.workoutSummary
        }
    }
}
</script>

<style scoped>
div {
    text-align: center;
}
</style>
