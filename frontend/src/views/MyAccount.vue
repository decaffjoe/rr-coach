<template>
  <section>
      <Navbar :key="updated" />
      <p v-if="error">{{ errorMsg }}</p>
      <div v-if="!error">
          <router-link to="/summary"><BaseButton id="summaryBtn" :text="'My Training Summary'" /></router-link>
          <h1>Your id:</h1>
          <input type="text" id="idInput" :value="id">
          <br>
          <h2>Update nickname:</h2>
          <input class="block" @keypress.enter="updateNickname" type="text" v-model="nickname">
          <br>
          <BaseButton v-on:click="updateNickname" :text="'Save'" />
      </div>
  </section>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";
export default {
    name: "MyAccount",
    components: { Navbar, BaseButton, },
    created() {
        if (!this.$cookies.isKey("user_id")) return this.error = true;
        if (this.$cookies.isKey("user_nickname")) this.nickname = this.$cookies.get("user_nickname");
        // if user did not set a nickname (db stores 'null' as string)
        if (this.nickname === 'null') this.nickname = null;
        this.id = this.$cookies.get("user_id");
    },
    methods: {
        async updateNickname() {
            let url = `${process.env.VUE_APP_API}/user`;
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
    position: relative;
}
#summaryBtn {
    color: white;
    border-color: var(--accent);
    background-color: var(--accent);
    margin: 4vh auto 2vh;
    font-size: 1.3em;
}
.block {
    display: block;
    margin: 0 auto;
}
h1 {
    margin-top: 3vh;
}
#idInput {
    outline: none;
    width: 80%;
    font-size: 1.05em;
    font-weight: bold;
    color: var(--main);
    background-color: white;
    border: 2px solid var(--main);
    padding: 0.2em 0.3em;
    text-align: center;
}
h2 {
    margin-top: 5vh;
}
h2 + input {
    border-radius: 50px;
    border: none;
    padding: 0.5em 1.0em;
    font-size: 1.0em;
    outline: none;
    margin: 0 auto;
    display: block;
    color: white;
    background-color: var(--main);
    text-align: center;
}
@media (min-width: 900px) {
    #idInput {
        font-size: 1.1em;
        width: 40%;
    }
}
</style>
