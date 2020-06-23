<template>
    <div>
        <h1>New to the site? All you need is an id!</h1>
        <p id="nickname">(Optional) nickname: </p>
        <input v-model="newUserNickname" type="text">
        <button @click="createUser" id="createID">Create id</button>
        <p>*No passwords or email, so hold on to this somewhere safe!</p>
        <p id="yourID">Your ID:</p>
        <input v-model="newUserId" type="text">
        <router-link to="/pairs"><button>Got it, let's lift</button></router-link>
        <h2>Already have an account? Login with your user id!</h2>
        <input @keypress.enter="findUser" v-model="loginString" type="text">
        <button @click="findUser">Login</button>
    </div>
</template>

<script>
export default {
    name: "Login",
    methods: {
        makeCookies(user_id, user_nickname=undefined) {
            //                                    expiry   path  domain secure sameSite
            this.$cookies.set("user_id", user_id, Infinity, null, null, null, "Strict");
            this.$cookies.set("user_nickname", user_nickname, Infinity, null, null, null, "Strict");
        },
        async findUser() {
            try {
                if (this.loginString) {
                    // verify entered user id exists
                    let nickname = await fetch(`http://localhost:3000/user?user_id=${this.loginString}`);
                    // save user_id & nickname as cookies
                    if (nickname.status === 200) {
                        nickname = await nickname.json();
                        this.makeCookies(this.loginString, nickname);
                    }
                    // redirect to home page
                    this.$router.push('/');
                }
            } catch (error) {
                console.log(error);
            }
        },
        async createUser() {
            try {
                if (!this.newUserId && !this.loginString) {
                    // create user in db
                    let res;
                    if (this.newUserNickname) {
                        res = await fetch('http://localhost:3000/user', {
                            method: 'POST',
                            mode: 'cors',
                            headers: { "Content-Type": "application/json; charset=utf-8" },
                            body: JSON.stringify({
                                nickname: this.newUserNickname,
                            }),
                        });
                    } else res = await fetch('http://localhost:3000/user', { method: 'POST', mode: 'cors', });
                    // create cookie in client with user info
                    if (res.status === 200) {
                        this.newUserId = await res.json();
                        this.makeCookies(this.newUserId, this.newUserNickname);
                    }
                }
            } catch(error) { console.log(error); }
        },
    },
    data() {
        return {
            newUserNickname: undefined,
            newUserId: undefined,
            loginString: undefined,
        }
    }
}
</script>

<style scoped>
div {
    text-align: center;
}
#nickname {
    display: inline-block;
}
#yourID {
    display: inline-block;
}
#createID {
    display: block;
    margin: 0 auto;
}
</style>
