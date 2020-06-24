<template>
    <div>
        <router-link to="/" v-if="this.$route.name !== 'Landing'"><button>Home</button></router-link>
        <button @click="goToLogin" v-if="!loggedIn">Create Account / Login</button>
        <p style="display: inline-block;" v-if="user_nickname">Hi, {{ user_nickname }}</p>
        <button @click="goToAccount" v-if="loggedIn">My Account</button>
        <button @click="logout" v-if="loggedIn">Logout</button>
    </div>
</template>

<script>
export default {
    name: "Navbar",
    created() {
        if (this.$cookies.isKey("user_id")) {
            this.loggedIn = true;
            if (this.$cookies.isKey("user_nickname")) this.user_nickname = this.$cookies.get("user_nickname");
            else this.user_nickname = this.$cookies.get("user_id");
        }
    },
    methods: {
        goToLogin() {
            this.$router.push('/login');
        },
        goToAccount() {
            this.$router.push('/pairs');
        },
        logout() {
            this.$cookies.remove("user_id");
            this.$cookies.remove("user_nickname");
            this.$cookies.remove("workout_id");
            this.loggedIn = false;
            this.user_id = undefined;
            this.user_nickname = undefined;
        }
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

</style>
