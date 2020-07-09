<template>
    <div id="top">
        <p v-if="loggedIn && user_nickname">Hey there, {{ user_nickname }}</p>
        <p v-else-if="loggedIn && user_id">Hi, {{ user_id.slice(0, 12) }}...</p>
        <router-link to="/" v-if="this.$route.name !== 'Landing'"><BaseButton class="btn" :text="'Home'" /></router-link>
        <BaseButton class="btn" v-on:click="goToLogin" v-if="!loggedIn && this.$route.name !== 'Login'" :text="'Create Account / Login'" />
        <BaseButton class="btn" v-on:click="goToAccount" v-if="loggedIn && this.$route.name !== 'MyAccount'" :text="'My Account'" />
        <router-link to="/train" v-if="this.$route.name === 'WorkoutSummary'"><BaseButton class="btn" :text="'Train Now'" /></router-link>
    </div>
</template>

<script>
import BaseButton from "../components/BaseButton.vue";
export default {
    name: "Navbar",
    props: {
        logoutReq: {
            type: Boolean
        }
    },
    components: { BaseButton, },
    created() {
        // if user just logged out
        if (this.logoutReq) {
            this.loggedIn = false;
            this.user_id = undefined;
            this.user_nickname = undefined;
            return;
        }
        // if user is logged in
        if (this.$cookies.isKey("user_id")) {
            this.loggedIn = true;
            let name = this.$cookies.get("user_nickname");
            // if there is a real name, use nickname
            if (name !== 'null' && name !== null) this.user_nickname = name;
            this.user_id = this.$cookies.get("user_id");
        }
    },
    methods: {
        goToLogin() {
            this.$router.push('/login');
        },
        goToAccount() {
            this.$router.push('/account');
        },
    },
    data() {
        return {
            loggedIn: false,
            user_id: undefined,
            user_nickname: undefined,
        }
    }
}
</script>

<style scoped>
#top {
    padding: 0.5vh 0 0.5vh 50vw;
    background-color: bisque;
    color: black;
}
.btn {
    background-color: black;
    border: 3px solid black;
    color: white;
    margin: 0 0.3em;
}
.btn:hover {
    color: white;
    background-color: black;
}
p {
    margin-right: 0.5em;
    display: inline;
}
</style>
