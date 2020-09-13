<template>
    <div id="top">
        <Navbar />
        <p id="justFinished">If you just finished your workout, your stats will be saved automatically once you sign up or login!</p>
        <div>
            <h1>New? Just generate an ID</h1>
            <p id="nickname">(Optional) nickname:</p>
            <input @keypress.enter="createUser" v-model="newUserNickname" type="text">
            <BaseButton v-on:click="createUser" id="createID" :text="'Create id'" />
            <p v-show="createError" class="error">{{ createError }}</p>
            <br>
            <p class="idField" type="text">{{ newUserId }}</p>
            <p id="yourID">Your Generated ID</p>
            <p>*No passwords, email, or anything else- so hold on to your ID somewhere safe!</p>
            <router-link class="router-link" to="/"><BaseButton id="gotIt" v-show="isSuccessful" :text="'Got it!'" /></router-link>
        </div>
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
                    let nickname = await fetch(`${process.env.VUE_APP_API}/user?user_id=${this.loginString}`);
                    // save user_id & nickname as cookies
                    if (nickname.status === 200) {
                        this.loginError = undefined;
                        nickname = await nickname.json();
                        this.makeCookies(this.loginString, nickname);
                        // redirect to home page
                        this.$router.push('/');
                    } else {
                        this.loginError = "Uh oh, that didn't work. Try copy & pasting your id directly.";
                    }
                } else this.loginError = "Please enter an id";
                // post existing workout data (if they worked out first)
                await this.postExistingWorkout();
            } catch (error) {
                console.log(error);
            }
        },
        async createUser() {
            if (this.newUserId) return this.createError = "It looks like you've already created an id!";
            if (this.loginString) return this.createError = "Trying to login? Please see the returning users field below.";
            if (this.newUserNickname && this.newUserNickname.length > 6) return this.createError = "Nickname must be 6 characters or less.";
            this.createError = undefined;
            try {
                // create user in db
                let res;
                if (this.newUserNickname) {
                    res = await fetch(`${process.env.VUE_APP_API}/user`, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({
                            nickname: this.newUserNickname,
                        }),
                    });
                } else res = await fetch(`${process.env.VUE_APP_API}/user`, { method: 'POST', mode: 'cors', });
                // create cookie in client with user info
                if (res.status === 200) {
                    this.isSuccessful = true;
                    this.newUserId = await res.json();
                    this.makeCookies(this.newUserId, this.newUserNickname);
                }
                // post existing workout data (if they worked out first)
                await this.postExistingWorkout();
            } catch(error) { console.log(error); }
        },
        // post existing workout data (if user worked out first, then logged in/created account)
        async postExistingWorkout() {
            if (window.sessionStorage['workoutSummary']) {
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                // if no pullups/squats/dips/hinges were done, assume empty/user didn't workout
                if (!(session['pullup'] || session['squat'] || session['dip'] || session['hinge'])) return;
                let section, set, url, firstPost = true;
                // iterate over exercise categories
                for (section in session) {
                    // iterate over the sets in each category
                    for (set of session[section]) {
                        // if set hasn't been posted yet
                        if (set['postPath']) {
                            // get a workout_id the first time we find a set that needs to be posted
                            if (firstPost) {
                                let res = await fetch(`${process.env.VUE_APP_API}/workout`, {
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
#top {
    text-align: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
#justFinished {
    color: white;
    background-color: darkolivegreen;
    font-size: 0.9em;
    margin: 0;
    padding: 0.7vh 0;
    margin-top: var(--nav-spacing);
}
h1 {
    font-size: 1.8em;
    margin: 1.5em auto 1em;
}
input, p.idField {
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
p.idField {
    height: 2vh;
}
#createID {
    display: block;
    margin: 2vh auto 0;
    color: white;
    background-color: var(--accent);
    border: 3px solid var(--accent);
}
#nickname {
    display: inline-block;
}
.idField {
    width: 75%;
    font-size: 0.9em;
    font-weight: bold;
}
br + .idField {
    margin-top: 2em;
    border-color: var(--main);
    background-color: white;
    color: var(--main);
    border: 2px solid var(--main);
    border-radius: 0;
    text-align: center;
}
#yourID {
    margin-top: 0.2em;
}
.error {
    color: red;
}
.router-link {
    text-decoration: none;
}
#gotIt {
    display: block;
    margin: 5vh auto 0;
    font-size: 1.5rem;
    color: white;
    background-color: var(--main);
}
#login {
    color: var(--main);
    background-color: var(--silver);
    padding: 3vh 0;
    margin-top: 8vh;
    flex-grow: 1;
}
h2 {
    margin: 0 auto;
    font-size: 1.6em;
}
#login input {
    color: white;
    background-color: var(--main);
    border: 2px solid var(--main);
    margin: 2vh auto;
}
#loginBtn {
    color: white;
    background-color: var(--main);
    border: 3px solid var(--main);
}
@media (min-width: 900px) {
    #justFinished {
        font-size: 1.0em;
    }
    p {
        font-size: 1.1em;
    }
    .idField {
        font-size: 1.1em;
        width: 40%;
    }
    #login {
        padding-top: 5vh;
    }
}
</style>
