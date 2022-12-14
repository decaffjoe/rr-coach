<template>
  <div id="top">
    <Navbar id="navbar" v-on:click="leavePage" />

    <!-- SECTION CONTROL -->
    <section id="section">
      <p>Section</p>
      <i
        class="arrow bk-arrow"
        @click="skipCurrentSection('prev')"
        v-show="currentSection !== 'Warmups'"
      ></i>
      <h1 class="iblock">{{ currentSection }}</h1>
      <i
        class="arrow fw-arrow"
        @click="skipCurrentSection('next')"
        v-show="currentSection !== 'Core'"
      ></i>
    </section>

    <!-- SET CONTROL -->
    <section id="set">
      <p>Set</p>
      <i
        @click="decrementSetNum"
        class="arrow bk-arrow"
        v-show="currentSection !== 'Warmups' || currentSectionSet !== 1"
      ></i>
      <p class="iblock">{{ currentSectionSet }} / {{ currentMaxSets }}</p>
      <i
        @click="incrementSetNum"
        class="arrow fw-arrow"
        v-show="currentSection !== 'Core' || currentSectionSet !== 9"
      ></i>
    </section>

    <!-- USER REP INPUT -->
    <section id="rep">
      <p>Rep Goal: {{ currentRepGoal }}</p>
      <p id="completed" v-show="currentSection !== 'Warmups'">Completed:</p>
      <input
        @keypress.enter="incrementSetNum"
        v-model="repsDone"
        type="text"
        v-show="currentSection !== 'Warmups'"
      />
      <BaseButton
        id="endOfTrainingMsg"
        v-on:click="goToPage('/summary')"
        v-show="endOfTraining"
        :text="'See your Summary'"
      />
      <!-- ERROR ON INPUT HANDLING -->
      <p v-show="error">{{ error }}</p>

      <!-- REST REMINDER -->
      <p
        id="rest-timer"
        v-show="currentSection !== 'Warmups' && !endOfTraining"
        v-bind:style="{ color: restTimerStatus.color }"
      >
        {{ restTimerStatus.text }}
        <span
          id="rest-timer-seconds"
          v-bind:style="{
            borderColor: restTimerStatus.color,
          }"
        >
          {{ currentRestTime }}
        </span>
      </p>
    </section>

    <!-- EXERCISE VARIANT CONTROL -->
    <section id="variant">
      <p>Exercise</p>
      <i
        class="arrow bk-arrow"
        @click="easierVariant"
        v-show="currentSection !== 'Warmups' && currentVariant.num > 0"
      ></i>
      <h2>{{ currentVariant.name }}</h2>
      <i
        class="arrow fw-arrow"
        @click="tougherVariant"
        v-show="
          currentSection !== 'Warmups' &&
            currentVariant.num < currentVariant.max
        "
      ></i>
    </section>

    <!-- EXERCISE INSTRUCTIONS -->
    <section id="info">
      <iframe :src="currentVariant.url" v-show="currentVariant.url"></iframe>
      <div>
        <p v-show="currentVariant.desc">Exercise Tips</p>
        <ul v-show="currentVariant.desc">
          <li v-for="point of currentVariant.desc.split('.')" :key="point.id">
            {{ point }}
          </li>
        </ul>
      </div>
      <div>
        <p v-show="currentFormCues.length > 0">General Form Cues</p>
        <ul v-show="currentSection !== 'Warmups'">
          <li v-for="cue of currentFormCues" :key="cue.id">{{ cue }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";

export default {
  name: "Training",
  components: { Navbar, BaseButton },
  computed: {
    restTimerStatus() {
      if (this.currentRestTime > 180) {
        return { color: "red", text: "Go lift now" };
      } else if (this.currentRestTime < 90) {
        return { color: "var(--main)", text: "Rest 90 - 180 seconds..." };
      }
      return { color: "green", text: "Good to go" };
    },
    currentFormCues() {
      if (this.currentSection !== "Warmups") {
        return this.$store.getters.generalFormCues[`${this.currentPath}Form`];
      }
      return [];
    },
    // for the 'Finish workout' button @ last set of 'Core'
    endOfTraining() {
      if (this.currentSection === "Core" && this.currentSectionSet === 9)
        return true;
      return false;
    },
    // needed for skipping by section
    allSections() {
      return Object.keys(this.sections);
    },
    // keep set control in bounds
    currentMaxSets() {
      return this.sections[this.currentSection]["maxSets"];
    },
    // display the rep target
    currentRepGoal() {
      if (this.currentSection === "Warmups") {
        return this.sections[this.currentSection]["exercises"][
          this.currentSectionSet - 1
        ]["reps"];
      } else if (this.currentSection === "Core") return "8 - 12";
      else return "5 - 8";
    },
    // return which generic exercise is being done e.g. 'pullup' or 'squat'
    currentPath() {
      if (this.currentSection === "Warmups") {
        return this.sections["Warmups"]["exercises"][
          this.currentSectionSet - 1
        ];
      } else if (this.currentSection === "Core") {
        if (this.currentSectionSet % 3 === 0)
          return this.sections["Core"]["path3"];
        else if (this.currentSectionSet % 3 === 2)
          return this.sections["Core"]["path2"];
        else return this.sections["Core"]["path1"];
      } else {
        if (this.currentSectionSet % 2 === 0)
          return this.sections[this.currentSection]["path2"];
        else return this.sections[this.currentSection]["path1"];
      }
    },
    // current specific exercise progression (return info, integer value & max integer value for progression track)
    currentVariant: {
      get() {
        if (this.currentSection === "Warmups") return { ...this.currentPath };
        else {
          // Precedence 1: User changes variant manually on current page
          if (this.enteredVariant)
            return {
              ...this.$store.getters.progressions[
                `${this.currentPath}Progression`
              ][this.enteredVariant],
              num: this.enteredVariant,
              max:
                this.$store.getters.progressions[
                  `${this.currentPath}Progression`
                ].length - 1,
            };
          // Precedence 2: User revisits old set (so load the progression saved from that set)
          let session = JSON.parse(window.sessionStorage["workoutSummary"]);
          let variantInteger;
          if (
            session[this.currentPath] &&
            session[this.currentPath][this.specificExerciseSet - 1]
          ) {
            variantInteger =
              session[this.currentPath][this.specificExerciseSet - 1][
                "progression"
              ];
          }
          // Precedence 3: Load the variant saved from cookies (load from local data identical to the cookies, though)
          else variantInteger = this.variantPreferences[this.currentPath];
          // return progression info, integer value and max integer value of generic exercise progression
          return {
            ...this.$store.getters.progressions[
              `${this.currentPath}Progression`
            ][variantInteger],
            num: variantInteger,
            max:
              this.$store.getters.progressions[`${this.currentPath}Progression`]
                .length - 1,
          };
        }
      },
      set(value) {
        // when user manually changes variant on current page
        return (this.enteredVariant = value);
      },
    },
    // user reps
    repsDone: {
      get() {
        // Precedence 1: User changes reps manually on current page
        if (this.enteredReps) return this.enteredReps;
        // Precedence 2: User revisits old set (so load reps saved from that set)
        let session = JSON.parse(window.sessionStorage["workoutSummary"]);
        if (
          session[this.currentPath] &&
          session[this.currentPath][this.specificExerciseSet - 1]
        )
          return session[this.currentPath][this.specificExerciseSet - 1][
            "reps"
          ];
        // Precedence 3: Default to empty (undefined reps performed)
        else return undefined;
      },
      // for when user enters reps
      set(value) {
        let numValue = parseInt(value);
        // check to make sure it's a number
        if (value !== "" && isNaN(numValue))
          this.error = "Please enter a number";
        else this.error = undefined;
        return (this.enteredReps = numValue);
      },
    },
    // return the 'actual' set e.g. pullup set 3/3 (instead of "pullup & squat" set 5/6)
    specificExerciseSet() {
      if (this.currentSection === "Warmups") return undefined;
      if (this.currentSection === "Core") {
        // determine set number
        if (this.currentSectionSet <= 3) return 1;
        else if (this.currentSectionSet >= 7) return 3;
        else return 2;
      } else {
        // determine set number
        if (this.currentSectionSet <= 2) return 1;
        else if (this.currentSectionSet >= 5) return 3;
        else return 2;
      }
    },
  },
  watch: {
    // update exercise variant cookies when variant is changed
    variantPreferences: {
      handler(value) {
        if (this.currentSection !== "Warmups") {
          this.$cookies.set(
            `${this.currentPath}Variant`,
            value[this.currentPath],
            Infinity,
            null,
            null,
            null,
            "Strict",
          );
        }
      },
      deep: true,
    },
    // remember section if user refreshes page
    currentSection: {
      handler(value) {
        window.sessionStorage["currentSection"] = value;
      },
    },
    // remember set if user refreshes page
    currentSectionSet: {
      handler(value) {
        window.sessionStorage["currentSectionSet"] = value;
      },
    },
  },
  methods: {
    incrementRestTime() {
      // increment the timer
      ++this.currentRestTime;
      return window.setTimeout(this.incrementRestTime, 1000);
    },
    // save and go to next set
    async incrementSetNum() {
      // go to summary if we're on the last set of the workout!
      if (
        this.currentSection === "Core" &&
        this.currentSectionSet === this.currentMaxSets
      ) {
        return this.goToPage("/summary");
      }
      await this.saveSet();
      ++this.currentSectionSet;
      // check if value forces next exercise
      if (this.currentSectionSet > this.currentMaxSets) {
        // if not last exercise, change set number to 1
        if (!this.skipCurrentSection("next")) {
          this.currentSectionSet = 1;
        } else this.currentSectionSet = this.currentMaxSets;
      }
    },
    // save and go to previous set
    async decrementSetNum() {
      await this.saveSet();
      --this.currentSectionSet;
      // check if value forces previous exercise
      if (this.currentSectionSet < 1) {
        // if not first exercise, change set number to max of prev
        if (!this.skipCurrentSection("prev")) {
          this.currentSectionSet = this.currentMaxSets;
        } else this.currentSectionSet = 1;
      }
    },
    // skip forward or backward e.g. from 'Warmups' to 'Pullups & Squats'
    skipCurrentSection(direction) {
      let i = this.allSections.indexOf(this.currentSection);
      // if skipping to next pair
      if (direction === "next") {
        // if there is a next exercise
        if (i < this.allSections.length - 1)
          this.currentSection = this.allSections[i + 1];
        // if at extremity (last exercise)
        else return true;
      } else if (direction === "prev") {
        // go back to previous exercise
        // if there is a previous exercise
        if (i > 0) this.currentSection = this.allSections[i - 1];
        // if at extremity (first exercise)
        else return true;
      }
      // always start at first set
      this.currentSectionSet = 1;
      // reset rest timer
      this.currentRestTime = 0;
      return false;
    },
    // go to easier specific exercise variant
    easierVariant() {
      if (this.currentSection === "Warmups") return;
      // check to make sure we aren't on easiest variant
      if (this.currentVariant.num > 0) {
        // decrement variant integer
        this.currentVariant = parseInt(this.currentVariant.num) - 1;
        // set cookie preference too
        --this.variantPreferences[this.currentPath];
        // --this.currentVariant;
      }
      return;
    },
    // go to tougher specific exercise variant
    tougherVariant() {
      if (this.currentSection === "Warmups") return;
      // check to make sure we aren't on toughest variant
      if (
        this.currentVariant.num <
        this.$store.getters.progressions[`${this.currentPath}Progression`]
          .length -
          1
      ) {
        // increment variant integer
        this.currentVariant = parseInt(this.currentVariant.num) + 1;
        // set cookie preference too
        ++this.variantPreferences[this.currentPath];
      }
      return;
    },
    // save set data to sessionStorage
    async saveSet() {
      // reps gotta be inputted first eh
      if (this.repsDone) {
        // read workout summary from sessionStorage
        let session = JSON.parse(window.sessionStorage["workoutSummary"]);
        if (!session[this.currentPath]) session[this.currentPath] = [];
        // create new set or read in existing set
        let set;
        if (!session[this.currentPath][this.specificExerciseSet - 1]) set = {};
        else set = session[this.currentPath][this.specificExerciseSet - 1];
        // if object existed and nothing changed, return
        if (
          set["reps"] === this.repsDone &&
          set["progression"] === this.currentVariant.num
        )
          return;
        // change was made (or new set), so save current values to set
        set["reps"] = this.repsDone;
        set["setNumber"] = this.specificExerciseSet;
        set["progression"] = this.currentVariant.num;

        // update sessionStorage with new/updated set
        session[this.currentPath][this.specificExerciseSet - 1] = set;
        window.sessionStorage["workoutSummary"] = JSON.stringify(session);
      }
      // reset that the user entered reps and progression
      this.enteredReps = undefined;
      this.enteredVariant = undefined;
      // reset rest timer
      this.currentRestTime = 0;
    },
    async goToPage(page) {
      await this.saveSet();
      this.$router.push(page);
    },
    async leavePage() {
      await this.saveSet();
    },
  },
  // get current or init new workout status/summary, workout_id and exercise variant values
  async created() {
    try {
      // remember section and set (if refreshing during a workout)
      if (window.sessionStorage["currentSection"])
        this.currentSection = window.sessionStorage["currentSection"];
      if (window.sessionStorage["currentSectionSet"])
        this.currentSectionSet = window.sessionStorage["currentSectionSet"];

      // init workout storage
      if (!window.sessionStorage["workoutSummary"])
        window.sessionStorage["workoutSummary"] = JSON.stringify({});

      // load variantPreferences from cookies, or default to easiest variant (progression 0)
      let varObj = {};
      for (let ex of this.$store.state.allExercises) {
        if (this.$cookies.isKey(`${ex}Variant`)) {
          varObj[ex] = this.$cookies.get(`${ex}Variant`);
        } else varObj[ex] = 0;
      }
      this.variantPreferences = varObj;
    } catch (error) {
      console.log(error);
    }

    // get the rest timer started
    this.incrementRestTime();
  },
  data() {
    return {
      // error message for if user botches reps input
      error: undefined,
      // reset after every "previous/next set" change
      enteredReps: undefined,
      // reset after every "previous/next set" change
      enteredVariant: undefined,
      // cumulative set number per section
      currentSection: "Warmups",
      currentSectionSet: 1,
      currentRestTime: 0,
      // preferences loaded from cookies or defaulted to 0 if no cookies
      variantPreferences: {
        pullup: undefined,
        squat: undefined,
        dip: undefined,
        hinge: undefined,
        row: undefined,
        pushup: undefined,
        antiextension: undefined,
        antirotation: undefined,
        extension: undefined,
      },
      // Warmup info and paths for sessionStorage saving (by generic exercise e.g. 'pullup')
      sections: {
        Warmups: {
          maxSets: 8,
          exercises: [
            {
              name: "Yuri's Shoulder Band Warmup",
              url: "https://www.youtube.com/embed/Vwn5hSf3WEg",
              desc: "",
              reps: "5 - 10",
            },
            {
              name: "Squat Sky Reaches",
              url: "https://www.youtube.com/embed/lbozu0DPcYI",
              desc: "",
              reps: "5 - 10",
            },
            {
              name: "GMB Wrist Prep",
              url: "https://www.youtube.com/embed/mSZWSQSSEjE",
              desc: "Do as many reps as you want",
              reps: "10+",
            },
            {
              name: "Deadbugs",
              url: "https://www.nick-e.com/deadbug/",
              desc: "",
              reps: "30s",
            },
            {
              name: "Arch Hangs",
              url: "https://www.youtube.com/embed/C995b3KLXS4",
              desc: "Add these after you reach Negative Pullups",
              reps: "10",
            },
            {
              name: "Support Hold",
              url: "",
              desc: "Add these after you reach Negative Dips",
              reps: "30s",
            },
            {
              name: "Easier Squat Progression",
              url: "",
              desc:
                "Add these after you reach Bulgarian Split Squats.Progression: Assisted Squat, Squat, Split Squat",
              reps: "10",
            },
            {
              name: "Easier Hinge Progression",
              url: "",
              desc:
                "Add these after you reach Banded Nordic Curls.Progression: Romanian Deadlift, Single Legged Deadlift, Banded Nordic Curl Negatives",
              reps: "10",
            },
          ],
        },
        "Pullups & Squats": {
          maxSets: 6,
          path1: "pullup",
          path2: "squat",
        },
        "Dips & Hinges": {
          maxSets: 6,
          path1: "dip",
          path2: "hinge",
        },
        "Rows & Pushups": {
          maxSets: 6,
          path1: "row",
          path2: "pushup",
        },
        Core: {
          maxSets: 9,
          path1: "antiextension",
          path2: "antirotation",
          path3: "extension",
        },
      },
    };
  },
};
</script>

<style scoped>
#top {
  text-align: center;
}
#section {
  margin: 3vh 0 4vh;
  display: grid;
  grid-template-areas: "sec sec sec" "bk-arrow text fw-arrow";
  grid-template-columns: 25% 50% 25%;
  align-items: center;
  justify-items: center;
  font-size: 1.1em;
  margin-top: var(--nav-spacing);
}
#section > * {
  margin: 0 1em;
}
#section p:first-of-type {
  grid-area: sec;
}
h1 {
  text-transform: uppercase;
  font-size: 1.2em;
  grid-area: text;
}
#completed {
  display: inline;
}
#set,
#rep {
  color: var(--main);
  background-color: var(--silver);
}
#set {
  padding: 2vh 0 0;
  display: grid;
  grid-template-areas: "set set set" "bk-arrow text fw-arrow";
  grid-template-columns: 25% 50% 25%;
  align-items: center;
  justify-items: center;
}
#set > * {
  margin: 0 0.5em;
}
#set p {
  color: black;
}
#set p:first-of-type {
  margin: 0 auto;
  padding: 0;
  grid-area: set;
}
#set p:nth-last-of-type(1) {
  font-size: 1.5em;
  grid-area: text;
}
#rep {
  padding-bottom: 1vh;
}
#rep p {
  margin: 0;
  padding: 1.5vh;
  font-size: 1.1em;
}
#completed {
  color: var(--accent);
}
#rep input {
  border: 3px solid var(--accent);
  font-size: 1.3em;
  outline: none;
  padding: 0.1em 0.5em;
  width: 30px;
}
#rest-timer {
  padding: 0 !important;
  margin: 1.2em auto 0 !important;
  font-size: 1.05em !important;
}
#rest-timer-seconds {
  display: inline-block;
  transition: 400ms;
  border: 2px solid var(--main);
  border-radius: 5px;
  padding: 0.1em 0.4em !important;
  width: 1.5em !important;
}
#variant {
  margin: 2vh 0 3vh;
  display: grid;
  grid-template-areas: "var var var" "bk-arrow text fw-arrow";
  grid-template-columns: 25% 50% 25%;
  align-items: center;
  justify-items: center;
}
#variant p:first-of-type {
  grid-area: var;
}
#variant > * {
  display: inline-block;
  margin: 0 1em;
}
h2 {
  text-transform: uppercase;
  font-size: 1.2em;
  grid-area: text;
}
#section .bk-arrow,
#set .bk-arrow,
#variant .bk-arrow {
  grid-area: bk-arrow;
  justify-self: end;
}
#section .fw-arrow,
#set .fw-arrow,
#variant .fw-arrow {
  grid-area: fw-arrow;
  justify-self: start;
}
iframe {
  display: block;
  margin: 0 auto 2vh;
  border: none;
  width: 95%;
  height: 30vh;
}
#info div {
  margin: 5vh auto;
}
#info ul {
  list-style-position: inside;
  text-align: left;
  margin: 2vh auto;
  padding: 0 10vw;
}
#info ul li {
  list-style: circle;
  margin: 1em 0 1em 4vw;
}
#info p {
  border: 3px solid var(--main);
  width: fit-content;
  margin: 0 auto;
  padding: 1vh 1vw;
}
.iblock {
  display: inline-block;
}
.arrow {
  --size: 40px;
  display: inline-block;
  height: calc(var(--size) - 5px);
  width: var(--size);
  background-size: var(--size);
}
.fw-arrow {
  background-image: url("../assets/right_arrow.svg");
}
.bk-arrow {
  background-image: url("../assets/left_arrow.svg");
}
.fw-arrow:hover,
.bk-arrow:hover {
  cursor: pointer;
}
#endOfTrainingMsg {
  border: 3px solid var(--main);
  color: white;
  background-color: var(--main);
  display: block;
  margin: 2vh auto 0;
}
@media (min-width: 900px) {
  #top {
    font-size: 1.1em;
  }
  #navbar {
    font-size: 0.9em;
  }
  #section,
  #set,
  #variant {
    grid-template-columns: 40% 20% 40%;
    padding: 3vh 0;
  }
  #rep {
    padding-bottom: 3vh;
  }
  #variant {
    font-size: 1em;
  }
  iframe {
    width: 700px;
    height: 400px;
  }
  #info ul {
    padding: 0 25vw;
    font-size: 1.1em;
  }
  #info p {
    font-size: 1.4em;
  }
}
</style>
