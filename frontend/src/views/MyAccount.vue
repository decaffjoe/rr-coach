<template>
  <section>
      <Navbar :logoutReq="logoutReq" :key="updated" />
      <p v-if="error">{{ errorMsg }}</p>
      <div v-if="!error">
          <router-link class="iblock" to="/summary"><button>Go to my Training History</button></router-link>
          <br>
          <h1 id="yourID">Your id:</h1>
          <input type="text" id="idInput" :value="id">
          <br>
          <h2 class="iblock">Update nickname:</h2>
          <input @keypress.enter="updateNickname" type="text" v-model="nickname">
          <button @click="updateNickname">Save</button>
          <button class="block" @click="logout">Logout</button>
      </div>
  </section>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
    name: "MyAccount",
    components: { Navbar },
    created() {
        if (!this.$cookies.isKey("user_id")) return this.error = true;
        if (this.$cookies.isKey("user_nickname")) this.nickname = this.$cookies.get("user_nickname");
        // if user did not set a nickname (db stores 'null' as string)
        if (this.nickname === 'null') this.nickname = null;
        this.id = this.$cookies.get("user_id");
    },
    methods: {
        logout() {
            // reset cookies
            this.$cookies.remove("user_id");
            this.$cookies.remove("user_nickname");
            this.$cookies.remove("workout_id");
            // logout of navbar
            this.logoutReq = true;
            // reset sessionStorage and go back to homepage
            window.sessionStorage.clear();
            this.$router.push('/');
        },
        async updateNickname() {
            let url = "http://localhost:3000/user";
            let res = await fetch(url, {
                method: 'PUT',
                mode: 'cors',
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                    user_id: this.id,
                    nickname: this.nickname
                }),
            });
            if (res.status === 200) {
                this.$cookies.set("user_nickname", this.nickname, Infinity, null, null, null, "Strict");
                this.updated++;
            }
        }
    },
    data() {
        return {
            id: undefined,
            nickname: undefined,
            logoutReq: false,
            updated: 0,
            error: false,
            errorMsg: 'Please login before trying to access your account!',
        }
    }
}
</script>

<style scoped>
section {
    text-align: center;
}
.iblock {
    display: inline-block;
}
.block {
    display: block;
    margin: 0 auto;
}
#yourID {
    display: inline-block;
}
#idInput {
    width: 320px;
    padding: 0.2em 0.3em;
}
</style>
