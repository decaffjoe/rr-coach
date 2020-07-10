<template>
    <div>
        <section>
            <router-link id="rrtt" to="/">Home</router-link>
        </section>
        <section>
            <p v-if="loggedIn && user_nickname">Hey {{ user_nickname }}!</p>
            <p v-else-if="loggedIn && user_id">Hi, {{ user_id.slice(0, 6) }}...</p>
        </section>
        <section>
            <p @click="goToLogin" v-if="!loggedIn && this.$route.name !== 'Login'">Signup / Login</p>
            <p @click="goToAccount" v-if="loggedIn && this.$route.name !== 'MyAccount'">My Account</p>
        </section>
    </div>
</template>

<script>
export default {
    name: "Navbar",
    props: {
        logoutReq: {
            type: Boolean
        }
    },
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
div {
    background-color: black;
    color: white;
    padding: 2.0vh 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    align-items: center;
    font-size: 1.0em;
}
#rrtt {
    color: white;
    text-decoration: none;
}
.btn {
    background-color: black;
    border: 2px solid white;
    color: white;
    margin: 0 0.2em;
}
p {
    margin-right: 0.5em;
    display: inline;
}
</style>
