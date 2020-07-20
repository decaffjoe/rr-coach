<template>
    <div>
        <section>
            <p id="rrtt" @click="goToPage('/')" v-if="this.$route.name !== 'Landing'">Home</p>
        </section>
        <section>
            <p v-if="loggedIn && user_nickname">Hey {{ user_nickname }}!</p>
            <p v-else-if="loggedIn && user_id">Hi, {{ user_id.slice(0, 6) }}...</p>
        </section>
        <section>
            <p @click="goToPage('/summary')" v-if="this.$route.name === 'TrainNow'">Summary</p>
            <p @click="goToPage('/train')" v-else-if="this.$route.name === 'WorkoutSummary'">Train</p>
            <p @click="goToPage('/login')" v-else-if="!loggedIn && this.$route.name !== 'Login'">Signup / Login</p>
            <p @click="goToPage('/account')" v-else-if="loggedIn && this.$route.name === 'Landing'">My Account</p>
            <p @click="logout" v-else-if="loggedIn && this.$route.name === 'MyAccount'">Logout</p>
        </section>
    </div>
</template>

<script>
export default {
    name: "Navbar",
    created() {
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
        goToPage(page) {
            this.$emit('click');
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
            this.$router.push('/');
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
section:first-of-type p:hover, section:last-of-type p:hover {
    cursor: pointer;
}
/* DESKTOP STYLING */
@media (min-width: 900px) {
    div {
        padding: 2.0vh 20vw;
    }
}
</style>
