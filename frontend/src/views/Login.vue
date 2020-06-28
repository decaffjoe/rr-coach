<template>
    <div>
        <router-link to="/"><button>Back to Home</button></router-link>
        <h1>New? All you need is an id</h1>
        <p id="nickname">(Optional) nickname: </p>
        <input v-model="newUserNickname" type="text">
        <button @click="createUser" id="createID">Create id</button>
        <p>*No passwords, email, or anything else- so hold on to this somewhere safe!</p>
        <p id="yourID">Your ID:</p>
        <input v-model="newUserId" type="text">
        <router-link to="/pairs"><button>Got it, let's train</button></router-link>
        <h2>Returning users please login here</h2>
        <input @keypress.enter="logInUser" v-model="loginString" type="text">
        <button @click="logInUser">Login</button>
        <p v-show="errorMsg">{{ errorMsg }}</p>
        <p>If you just finished your workout, your stats will be saved automatically once you sign up or login</p>
        <p>Head over to "My Account" to see them</p>
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
        async logInUser() {
            try {
                if (this.loginString) {
                    // verify entered user id exists
                    let nickname = await fetch(`http://localhost:3000/user?user_id=${this.loginString}`);
                    // save user_id & nickname as cookies
                    if (nickname.status === 200) {
                        nickname = await nickname.json();
                        this.makeCookies(this.loginString, nickname);
                        // redirect to home page
                        this.$router.push('/');
                    } else {
                        this.errorMsg = "Uh oh, that didn't work";
                    }
                }
                // post existing workout data (if they worked out first)
                this.postExistingWorkout();
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
                    // post existing workout data (if they worked out first)
                    this.postExistingWorkout();
                }
            } catch(error) { console.log(error); }
        },
        // post existing workout data (if they worked out first, then logged in/created account)
        async postExistingWorkout() {
            if (window.sessionStorage['workoutSummary']) {
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                // if no sets saved, exit
                if (!(session['Pullups & Squats'] || session['Dips & Hinges'] || session['Rows & Pushups'] || session['Core'])) return;
                let section, set, url, firstPost = true;
                // iterate over exercise categories
                for (section in session) {
                    // iterate over the sets in each category
                    for (set of section) {
                        // if set hasn't been posted yet
                        if (set['postPath']) {
                            // get a workout_id the first time we find a set that needs to be posted
                            if (firstPost) {
                                let res = await fetch("http://localhost:3000/workout", {
                                    method: 'POST',
                                    mode: 'cors',
                                    headers: { "Content-Type": "application/json; charset=utf-8" },
                                    body: JSON.stringify({
                                        user_id: this.$cookies.get("user_id")
                                    })
                                });
                                res = await res.json();
                                this.$cookies.set("workout_id", res, "12h", null, null, null, "Strict");
                                firstPost = false;
                            }
                            // post the set
                            url = set['postPath'];
                            let res = await fetch(url, {
                                method: 'POST',
                                mode: 'cors',
                                headers: { "Content-Type": "application/json; charset=utf-8" },
                                body: JSON.stringify({
                                    reps: set['reps'],
                                    setNumber: set['adjSet'],
                                    progression: set['progression'],
                                    workout_id: this.$cookies.get("workout_id")
                                })
                            });
                            // if post successful, delete post url (so we don't try to re-post)
                            if (res.status === 200) delete set['postPath'];
                        }
                    }
                }
                // overwrite session storage without postPath on the sets (since they've been posted now)
                window.sessionStorage['workoutSummary'] = JSON.stringify(session);
            }
        },
    },
    data() {
        return {
            newUserNickname: undefined,
            newUserId: undefined,
            loginString: undefined,
            errorMsg: undefined,
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
</style>
