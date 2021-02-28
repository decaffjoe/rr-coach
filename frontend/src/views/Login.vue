<template>
  <div id="top">
    <Navbar />
    <section id="login">
      <h2>Returning users please login here</h2>
      <input
        @keypress.enter="logInUser"
        v-model="loginString"
        class="idField"
        type="text"
        placeholder="ID"
      />
      <BaseButton v-on:click="logInUser" id="loginBtn" :text="'Login'" />
      <p v-show="loginError" class="error">{{ loginError }}</p>
    </section>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";
export default {
  name: "Login",
  components: { Navbar, BaseButton },
  methods: {
    makeCookies(user_id, user_nickname = "") {
      //                                    expiry   path  domain secure sameSite
      this.$cookies.set(
        "user_id",
        user_id,
        Infinity,
        null,
        null,
        null,
        "Strict",
      );
      this.$cookies.set(
        "user_nickname",
        user_nickname,
        Infinity,
        null,
        null,
        null,
        "Strict",
      );
      // set progression variant cookies
      for (let ex of this.$store.state.allExercises) {
        if (!this.$cookies.isKey(`${ex}Variant`)) {
          this.$cookies.set(
            `${ex}Variant`,
            0,
            Infinity,
            null,
            null,
            null,
            "Strict",
          );
        }
      }
    },
    async logInUser() {
      try {
        if (this.loginString) {
          // verify entered user id exists
          let nickname = await fetch(
            `${process.env.VUE_APP_API}/user?user_id=${this.loginString}`,
          );
          // save user_id & nickname as cookies
          if (nickname.status === 200) {
            this.loginError = undefined;
            nickname = await nickname.json();
            this.makeCookies(this.loginString, nickname);
            // redirect to home page
            this.$router.push("/");
          } else {
            this.loginError =
              "Uh oh, that didn't work. Try copy & pasting your id directly.";
          }
        } else this.loginError = "Please enter an id";
        // post existing workout data (if they worked out first)
        await this.postExistingWorkout();
      } catch (error) {
        console.log(error);
      }
    },
  },
  data() {
    return {
      newUserNickname: undefined,
      newUserId: undefined,
      loginString: undefined,
      loginError: undefined,
      createError: undefined,
      isSuccessful: undefined,
    };
  },
};
</script>

<style scoped>
#top {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
h1 {
  font-size: 2em;
  margin: var(--nav-spacing) auto 0.5em;
}
#nickname {
  display: inline-block;
  margin-top: 3em;
}
#createID {
  display: block;
  font-size: 1.2em;
  margin: 2vh auto 0;
  color: white;
  background-color: var(--accent);
  border: 3px solid var(--accent);
}
input,
p.idField {
  border-radius: 50px;
  border: none;
  padding: 0.5em 1em;
  font-size: 1em;
  outline: none;
  margin: 0 auto;
  display: block;
  color: white;
  background-color: var(--main);
  text-align: center;
}
p.idField {
  height: 2vh;
}
.idField {
  width: 75%;
  font-size: 0.9em;
  font-weight: bold;
}
br + .idField {
  margin-top: 2em;
  border-color: var(--main);
  background-color: white;
  color: var(--main);
  border: 2px solid var(--main);
  border-radius: 0;
  text-align: center;
}
#yourID {
  margin-top: 0.2em;
}
.error {
  color: red;
}
.router-link {
  text-decoration: none;
}
#gotIt {
  display: block;
  margin: 5vh auto 0;
  font-size: 1.5rem;
  color: white;
  background-color: var(--main);
}
#login {
  color: var(--main);
  background-color: var(--silver);
  padding: 3vh 0;
  margin-top: 8vh;
  flex-grow: 1;
}
h2 {
  margin: 0 auto;
  font-size: 1.6em;
}
#login input {
  color: white;
  background-color: var(--main);
  border: 2px solid var(--main);
  margin: 2vh auto;
}
#loginBtn {
  color: white;
  background-color: var(--main);
  border: 3px solid var(--main);
}
@media (min-width: 900px) {
  .idField {
    font-size: 1.1em;
    width: 40%;
  }
  #login {
    padding-top: 5vh;
  }
}
</style>
