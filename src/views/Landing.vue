<template>
  <div id="main">
    <Navbar />
    <div class="grid">
      <section id="welcome">
        <h1>Welcome to the Recommended Routine (RR) Coach</h1>
        <h2>
          From
          <a href="https://www.reddit.com/r/bodyweightfitness/"
            >r/bodyweightfitness</a
          >
        </h2>
        <ul>
          <li>Track your reps</li>
          <li>Built-in videos and tips to improve your form</li>
        </ul>
        <BaseButton
          id="train-link"
          v-on:click="goToTrain"
          :text="'Train now!'"
        />
      </section>
      <section id="info">
        <section>
          <h2>How does it work?</h2>
          <ul>
            <li>Warmup</li>
            <li>
              6 strength exercises, performed in pairs (set of pullups, set of
              squats, set of pullups...)
            </li>
            <li>3 core strength exercises, performed in a triplet</li>
          </ul>
          <RRLinks />
        </section>
        <section>
          <h2>What do I need?</h2>
          <ul>
            <li>Time: ~1 hour, 3x per week</li>
            <li>
              A place to do
              <a
                href="https://www.youtube.com/watch?v=rloXYB8M3vU&feature=youtu.be"
                >Rows</a
              >
              (Low Bar, or Gymnastics Rings, a Sturdy Table)
            </li>
            <li>
              A place to do pullups, if you are at the point in the program
              where you add pullups (monkey bars, pullup bar, rings, etc)
            </li>
            <li>
              Recommended:
              <a
                href="https://antranik.org/wp-content/uploads/2014/01/antranik-holding-support-hold-on-parallel-bars.jpg"
                >Parallel Bars</a
              >
              (corner of a kitchen counter, two sturdy chairs, or anything like
              that)
            </li>
          </ul>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";
import RRLinks from "../components/RRLinks.vue";
export default {
  name: "Landing",
  components: { Navbar, BaseButton, RRLinks },
  methods: {
    goToTrain() {
      // Always start at Warmups
      if (window.sessionStorage["currentSection"])
        delete window.sessionStorage["currentSection"];
      if (window.sessionStorage["currentSectionSet"])
        delete window.sessionStorage["currentSectionSet"];
      this.$router.push("/train");
    },
  },
  data() {
    return {
      trainNowStyles: {
        "font-size": "1.5rem",
        "border-radius": "0",
        color: "white",
        "background-color": "var(--main)",
      },
    };
  },
};
</script>

<style scoped>
#main {
  text-align: center;
  height: fit-content;
  padding: 0;
  margin: 0;
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0;
  margin-top: calc(var(--nav-spacing) / 2);
}
#welcome {
  margin: 2vh auto 0;
  padding: 0 15vw;
}
#welcome ul {
  padding-left: 10vw;
}
section ul {
  padding-left: 7vw;
  text-align: left;
}
li {
  list-style: circle;
  margin: 1em 10vw 1em -3vw;
}
#welcome h1 {
  font-size: 1.6em;
  margin: 7vh 0 2vh;
  color: #633d34;
}
#welcome h2 {
  color: #633d34;
  text-transform: lowercase;
  font-size: 1.1em;
  margin: 0 0 7vh;
}
#welcome h2 a {
  color: #633d34;
}
#train-link {
  display: block;
  margin: 3em auto;
  font-size: 1.5rem;
  border: 5px solid var(--accent);
  color: white;
  background-color: var(--accent);
}
#info section {
  padding: 3vh 5vw 4vh 10vw;
}
#info section h2 {
  margin-bottom: 5vh;
}
#info section ul {
  margin: 0 0 0 5vw;
}
#info section:first-of-type {
  background-color: var(--silver);
  color: var(--main);
}
a {
  color: var(--main);
}
/* DESKTOP STYLING */
@media (min-width: 900px) {
  #welcome {
    font-size: 1.4em;
    padding: 0 2vw;
  }
  #welcome h1 {
    font-size: 2em;
  }
  #welcome ul {
    margin: 12vh auto;
  }
  #train-link {
    font-size: 1.4em;
  }
  #info {
    background-color: var(--silver);
    color: var(--main);
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  #info section {
    padding: 6vh 2vw;
    font-size: 1.1em;
  }
  #info section h2 {
    font-size: 1.7em;
    margin-bottom: 5vh;
  }
  #info section ul {
    padding-left: 4vw;
    padding-right: 0;
    margin-right: 0;
  }
  #info section ul li {
    margin: 2vh 5vw 2vh 0;
  }
  a {
    color: var(--main);
  }
}
</style>
