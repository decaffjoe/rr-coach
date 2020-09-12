<template>
  <div id="navbar" :class="{ scrolled: scrollY !== 0 }">
    <!-- Hamburger menu -->
    <Slide right :closeOnNavigation="true" noOverlay width="180">
      <p class="navbar-item" @click="goToPage('/')">Home</p>
      <p class="navbar-item" @click="goToPage('/train')">Train</p>
      <p class="navbar-item" @click="goToPage('/summary')">Summary</p>
      <p class="navbar-item" @click="goToPage('/login')" v-show="!loggedIn">
        Signup / Login
      </p>
      <p class="navbar-item" @click="goToPage('/account')" v-show="loggedIn">
        My Account
      </p>
      <p class="navbar-item" @click="logout" v-show="loggedIn">
        Logout
      </p>
    </Slide>
  </div>
</template>

<script>
import { Slide } from "vue-burger-menu";
export default {
  name: "Navbar",
  components: { Slide },
  watch: {
    scrollY: {
      handler(value) {
        if (value === 0) {
          this.burgerMenu.style.backgroundColor = "white";
          for (let bar of this.burgerMenuBars) {
            bar.style.backgroundColor = "var(--main)";
          }
        } else {
          this.burgerMenu.style.backgroundColor = "var(--main)";
          for (let bar of this.burgerMenuBars) {
            bar.style.backgroundColor = "white";
          }
        }
      },
    },
  },
  created() {
    // if user is logged in
    if (this.$cookies.isKey("user_id")) {
      this.loggedIn = true;
      let name = this.$cookies.get("user_nickname");
      // if there is a real name, use nickname
      if (name !== "null" && name !== null) this.user_nickname = name;
      this.user_id = this.$cookies.get("user_id");
    }
    // keep track of scrolling
    document.addEventListener("scroll", () => {
      this.scrollY = window.scrollY;
    });
  },
  mounted() {
    this.burgerMenu = document.querySelector(".bm-burger-button");
    this.burgerMenuBars = document.querySelectorAll(".bm-burger-bars");
  },
  methods: {
    goToPage(page) {
      this.$emit("click");
      this.$router.push(page);
    },
    logout() {
      // reset cookies
      this.$cookies.remove("user_id");
      this.$cookies.remove("user_nickname");
      this.$cookies.remove("workout_id");
      // logout of navbar
      this.logoutReq = true;
      // reset sessionStorage and go back to homepage
      window.sessionStorage.clear();
      this.$router.push("/");
    },
  },
  data() {
    return {
      loggedIn: false,
      user_id: undefined,
      user_nickname: undefined,
      scrollY: 0,
      burgerMenu: undefined,
      burgerMenuBars: undefined,
    };
  },
};
</script>

<style>
.scrolled {
  background-color: var(--main) !important;
}
#navbar {
  opacity: 0.97;
  position: fixed;
  top: 0;
  width: 100%;
  height: 20px;
  padding: 1.5em 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  font-size: 1em;
  transition: 200ms;
}
.navbar-item {
  margin-right: 0.5em;
  transition: 60ms;
  padding-bottom: 0.5vh;
  border-bottom: 2px solid var(--main);
}
.navbar-link .navbar-item:hover {
  cursor: pointer;
  border-bottom: 2px solid white;
}
.bm-burger-button {
  top: 4px;
  left: 36px;
  position: fixed;
}
.bm-burger-bars {
  background-color: var(--main);
  transition: 200ms;
}
.bm-cross {
  background: none;
}
.bm-cross-button {
  height: 50px;
  width: 50px;
}
.bm-menu {
  background-color: var(--main-light);
  padding-top: 0;
}
.bm-item-list {
  color: white;
  font-size: 10px;
}
.bm-item-list > * {
  width: fit-content;
  margin: 2em 0;
  border-bottom: 2px solid white;
}
.bm-item-list > *:hover {
  cursor: pointer;
  border-bottom: 2px solid white;
}
/* DESKTOP STYLING */
@media (min-width: 900px) {
  #navbar {
    padding: 2vh 20vw;
  }
}
</style>
