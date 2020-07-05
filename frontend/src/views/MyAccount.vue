<template>
  <section>
      <Navbar />
      <p v-if="error">{{ errorMsg }}</p>
      <div v-if="!error">
          <h1 v-if="nickname !== null && nickname !== 'null'">Hi, {{ nickname }}</h1>
          <h1 id="yourID">Your id:</h1>
          <input type="text" :value="id">
          <router-link id="summary-link" to="/summary"><button>Go to my Training History</button></router-link>
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
        this.id = this.$cookies.get("user_id");
    },
    data() {
        return {
            id: undefined,
            nickname: undefined,
            error: false,
            errorMsg: 'uh ohhh',
        }
    }
}
</script>

<style scoped>
section {
    text-align: center;
}
#yourID {
    display: inline-block;
}
input {
    width: 320px;
    padding: 0.2em 0.3em;
}
#summary-link {
    display: block;
}
</style>
