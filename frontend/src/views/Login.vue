<template>
    <div>
        <h1>New to the site? All you need is your own id!</h1>
        <p id="nickname">(Optional) nickname: </p>
        <input v-model="createNickname" type="text">
        <button @click="createUser" id="createID">Create id</button>
        <p>*No passwords or email, so hold on to this somewhere safe!</p>
        <p id="yourID">Your ID:</p>
        <input v-model="newUserId" type="text">
        <h2>Already have an account? Login with your user id!</h2>
        <input @keypress.enter="findUser" v-model="loginString" type="text">
        <button @click="findUser">Login</button>
    </div>
</template>

<script>
export default {
    name: "Login",
    methods: {
        async findUser() {
            try {
                // verify entered user id exists
                let nickname = await fetch(`http://localhost:3000/user?user_id=${this.loginString}`);
                nickname = await nickname.json();
                console.log(nickname);
                // if nickname exists, save to global store
                if (nickname) console.log(nickname);
                // redirect to home page
            } catch (error) {
                console.log(error);
            }
        },
        async createUser() {
            let res;
            try {
                if (this.createNickname) {
                    res = await fetch('http://localhost:3000/user', {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({
                            nickname: this.createNickname,
                        }),
                    });
                } else res = await fetch('http://localhost:3000/user', { method: 'POST', mode: 'cors', });
                this.newUserId = await res.json();
            } catch (error) {
                console.log(error);
            }
        },
    },
    data() {
        return {
            createNickname: undefined,
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
