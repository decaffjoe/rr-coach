<template>
    <div>
        <Navbar />
        <p id="justFinished">If you just finished your workout, your stats will be saved automatically once you sign up or login!</p>
        <h1>New? All you need is an id</h1>
        <p id="nickname">(Optional) nickname: </p>
        <input v-model="newUserNickname" type="text">
        <BaseButton @click="createUser" id="createID" :text="'Create id'" />
        <p v-show="createError" class="error">{{ createError }}</p>
        <br>
        <p id="yourID">Your ID:</p>
        <input v-model="newUserId" class="idField" type="text">
        <router-link to="/"><BaseButton v-show="isSuccessful" :text="'Got it'" /></router-link>
        <p>*No passwords, email, or anything else- so hold on to your id somewhere safe!</p>
        <section id="login">
            <h2>Returning users please login here</h2>
            <input @keypress.enter="logInUser" v-model="loginString" class="idField" type="text">
            <BaseButton v-on:click="logInUser" id="loginBtn" :text="'Login'" />
            <p v-show="loginError" class="error">{{ loginError }}</p>
        </section>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import BaseButton from "../components/BaseButton.vue";
export default {
    name: "Login",
    components: { Navbar, BaseButton },
    methods: {
        makeCookies(user_id, user_nickname="") {
            //                                    expiry   path  domain secure sameSite
            this.$cookies.set("user_id", user_id, Infinity, null, null, null, "Strict");
            this.$cookies.set("user_nickname", user_nickname, Infinity, null, null, null, "Strict");
            // set progression variant cookies
            for (let ex of this.$store.state.allExercises) {
                if (!this.$cookies.isKey(`${ex}Variant`)) {
                    this.$cookies.set(`${ex}Variant`, 0, Infinity, null, null, null, "Strict");
                }
            }
        },
        async logInUser() {
            try {
                if (this.loginString) {
                    // verify entered user id exists
                    let nickname = await fetch(`http://localhost:3000/user?user_id=${this.loginString}`);
                    // save user_id & nickname as cookies
                    if (nickname.status === 200) {
                        this.loginError = undefined;
                        nickname = await nickname.json();
                        this.makeCookies(this.loginString, nickname);
                        // redirect to home page
                        this.$router.push('/');
                    } else {
                        this.loginError = "Uh oh, that didn't work. Try copy & pasting directly.";
                    }
                } else this.loginError = "Please enter an id";
                // post existing workout data (if they worked out first)
                this.postExistingWorkout();
            } catch (error) {
                console.log(error);
            }
        },
        async createUser() {
            if (this.newUserId) return this.createError = "It looks like you've already created an id!";
            if (this.loginString) return this.createError = "Trying to login? Please see the returning users field below.";
            this.createError = undefined;
            try {
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
                    this.isSuccessful = true;
                    this.newUserId = await res.json();
                    this.makeCookies(this.newUserId, this.newUserNickname);
                }
                // post existing workout data (if they worked out first)
                this.postExistingWorkout();
            } catch(error) { console.log(error); }
        },
        // post existing workout data (if they worked out first, then logged in/created account)
        async postExistingWorkout() {
            if (window.sessionStorage['workoutSummary']) {
                console.log('step 1');
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                // if no pullups/squats/dips/hinges were done, assume empty/user didn't workout
                if (!(session['pullup'] || session['squat'] || session['dip'] || session['hinge'])) return;
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
                                    setNumber: set['setNumber'],
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
            loginError: undefined,
            createError: undefined,
            isSuccessful: undefined,
        }
    }
}
</script>

<style scoped>
div {
    text-align: center;
}
#justFinished {
    color: white;
    background-color: darkolivegreen;
    font-size: 0.9em;
    margin: 0;
    padding: 0.7vh 0;
}
h1,h2 {
    margin-top: 2em;
}
input {
    border-radius: 50px;
    border: 2px solid black;
    padding: 0.3em 0.6em;
    font-size: 1.2em;
    outline: none;
    margin: 0 0.3em;
}
#nickname {
    display: inline-block;
}
#yourID {
    display: inline-block;
}
#yourID + .idField {
    border-color: var(--main);
    background-color: white;
    color: var(--main);
}
.idField {
    width: 400px;
}
.error {
    color: red;
}
#login {
    color: var(--main);
    background-color: white;
    padding-top: 2vh;
    margin-top: 8vh;
}
h2 {
    margin: 0 auto;
}
#loginBtn {
    color: white;
    background-color: var(--main);
    border: 3px solid var(--main);
}
</style>
