<template>
    <div>
        <router-link to="/"><button>Home</button></router-link>
        <button @click="skipCurrentSection('prev')">Previous Section</button>
        <button @click="skipCurrentSection('next')">Next Section</button>
        <router-link to="/summary"><button>Workout Summary</button></router-link>
        <h1>{{ currentSection }}</h1>
        <hr>
        <button @click="decrementSetNum" class="set">Previous set</button>
        <p class="set"><span>{{ currentSetNum }}</span> / <span>{{ currentMaxSets }}</span></p>
        <button @click="incrementSetNum" class="set">Next set</button>
        <hr>
        <h2>{{ currentVariant.name }}</h2>
        <button @click="easierVariant" v-if="currentSection !== 'Warmups' && currentVariant.num > 0">Easier Variant</button>
        <button @click="tougherVariant" v-if="currentSection !== 'Warmups' && currentVariant.num < currentVariant.max">Tougher Variant</button>
        <p>Rep Goal: {{ currentRepGoal }}</p>
        <p id="completed" v-if="currentSection !== 'Warmups'">Completed: </p>
        <input @keypress.enter="postSet" v-model="repsDone" type="text" v-if="currentSection !== 'Warmups'">
        <p>The goal of this exercise is to train the body into becoming very strong and immensely handsome etc... etc...</p>
    </div>
</template>

<script>
export default {
    name: "Pairs",
    computed: {
        allSections() { return Object.keys(this.sections) },
        currentMaxSets() { return this.sections[this.currentSection]['maxSets'] },
        currentRepGoal() { return this.sections[this.currentSection]['reps'][this.currentSetNum - 1] },
        currentExercise() { return this.sections[this.currentSection]['exercises'][this.currentSetNum - 1] },
        currentVariant() {
            if (this.currentExercise === 'Pullups') {
                return { ...this.pullupProgression[this.pullupVariant], num: this.pullupVariant, max: this.pullupProgression.length - 1 };
            } else if (this.currentExercise === 'Squats') {
                return { ...this.squatProgression[this.squatVariant], num: this.squatVariant, max: this.squatProgression.length - 1 };
            } else if (this.currentExercise === 'Dips') {
                return { ...this.dipProgression[this.dipVariant], num: this.dipVariant, max: this.dipProgression.length - 1 };
            } else if (this.currentExercise === 'Hinges') {
                return { ...this.hingeProgression[this.hingeVariant], num: this.hingeVariant, max: this.hingeProgression.length - 1 };
            } else if (this.currentExercise === 'Rows') {
                return { ...this.rowProgression[this.rowVariant], num: this.rowVariant, max: this.rowProgression.length - 1 };
            } else if (this.currentExercise === 'Pushups') {
                return { ...this.pushupProgression[this.pushupVariant], num: this.pushupVariant, max: this.pushupProgression.length - 1 };
            } else if (this.currentExercise === 'Anti-Extensions') {
                return { ...this.antiExtenstionProgression[this.antiExtensionVariant], num: this.antiExtensionVariant, max: this.antiExtenstionProgression.length - 1 };
            } else if (this.currentExercise === 'Anti-Rotations') {
                return { ...this.antiRotationProgression[this.antiRotationVariant], num: this.antiRotationVariant, max: this.antiRotationProgression.length - 1 };
            } else if (this.currentExercise === 'Extensions') {
                return { ...this.extensionProgression[this.extensionVariant], num: this.extensionVariant, max: this.extensionProgression.length - 1 };
            } else return { name: this.currentExercise };
        }
    },
    components: {  },
    methods: {
        async incrementSetNum(directClick=true) {
            // if 'next set' button pressed directly, post reps before moving to next set
            if (directClick) await this.postSet(false);
            ++this.currentSetNum;
            // check if value forces next exercise
            if (this.currentSetNum > this.currentMaxSets) {
                // if not last exercise, change set number to 1
                if (!this.skipCurrentSection('next')) {
                    this.currentSetNum = 1;
                } else this.currentSetNum = this.currentMaxSets;
            }
        },
        decrementSetNum() {
            --this.currentSetNum;
            // check if value forces previous exercise
            if (this.currentSetNum < 1) {
                // if not first exercise, change set number to max of prev
                if (!this.skipCurrentSection('prev')) {
                    this.currentSetNum = this.currentMaxSets;
                } else this.currentSetNum = 1;
            }
        },
        skipCurrentSection(direction) {
            let i = this.allSections.indexOf(this.currentSection);
            // if skipping to next pair
            if (direction === 'next') {
                // if there is a next exercise
                if (i < this.allSections.length - 1) this.currentSection = this.allSections[i + 1];
                // if at extremity (last exercise)
                else return true;
            } else if (direction === 'prev') {
                // go back to previous exercise
                // if there is a previous exercise
                if (i > 0) this.currentSection = this.allSections[i - 1];
                // if at extremity (first exercise)
                else return true;
            }
            // always start at first set
            this.currentSetNum = 1;
            return false;
        },
        easierVariant() {
            if (this.currentExercise === 'Pullups') {
                if (this.pullupVariant > 0) return --this.pullupVariant;
                else return;
            }
            else if (this.currentExercise === 'Squats') {
                if (this.squatVariant > 0) return --this.squatVariant;
                else return;
            }
            else if (this.currentExercise === 'Dips') {
                if (this.dipVariant > 0) return --this.dipVariant;
                else return;
            }
            else if (this.currentExercise === 'Hinges') {
                if (this.hingeVariant > 0) return --this.hingeVariant;
                else return;
            }
            else if (this.currentExercise === 'Rows') {
                if (this.rowVariant > 0) return --this.rowVariant;
                else return;
            }
            else if (this.currentExercise === 'Pushups') {
                if (this.pushupVariant > 0) return --this.pushupVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Extensions') {
                if (this.antiExtensionVariant > 0) return --this.antiExtensionVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Rotations') {
                if (this.antiRotationVariant > 0) return --this.antiRotationVariant;
                else return;
            }
            else if (this.currentExercise === 'Extensions') {
                if (this.extensionVariant > 0) return --this.extensionVariant;
                else return;
            }
            else return;
        },
        tougherVariant() {
            if (this.currentExercise === 'Pullups') {
                if (this.pullupVariant < this.pullupProgression.length - 1) return ++this.pullupVariant;
                else return;
            }
            else if (this.currentExercise === 'Squats') {
                if (this.squatVariant < this.squatProgression.length - 1) return ++this.squatVariant;
                else return;
            }
            else if (this.currentExercise === 'Dips') {
                if (this.dipVariant < this.dipProgression.length - 1) return ++this.dipVariant;
                else return;
            }
            else if (this.currentExercise === 'Hinges') {
                if (this.hingeVariant < this.hingeProgression.length - 1) return ++this.hingeVariant;
                else return;
            }
            else if (this.currentExercise === 'Rows') {
                if (this.rowVariant < this.rowProgression.length - 1) return ++this.rowVariant;
                else return;
            }
            else if (this.currentExercise === 'Pushups') {
                if (this.pushupVariant < this.pushupProgression.length - 1) return ++this.pushupVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Extensions') {
                if (this.antiExtensionVariant < this.antiExtensionProgression.length - 1) return ++this.antiExtensionVariant;
                else return;
            }
            else if (this.currentExercise === 'Anti-Rotations') {
                if (this.antiRotationVariant < this.antiRotationProgression.length - 1) return ++this.antiRotationVariant;
                else return;
            }
            else if (this.currentExercise === 'Extensions') {
                if (this.extensionVariant < this.extensionProgression.length - 1) return ++this.extensionVariant;
                else return;
            }
            else return;
        },
        async postSet(directClick=true) {
            // reps gotta be inputted first eh
            if (this.repsDone) {
                // create the post url and real (adjusted) set number
                let url, adjSet, currentPath;
                if (this.currentSection === 'Core') {
                    // determine exercise
                    if ([1, 4, 7].includes(this.currentSetNum)) {
                        currentPath = this.sections[this.currentSection]['path1'];
                    } else if ([2, 5, 8].includes(this.currentSetNum)) {
                        currentPath = this.sections[this.currentSection]['path2'];
                    } else currentPath = this.sections[this.currentSection]['path3'];
                    // set number
                    if ([1, 2, 3].includes(this.currentSetNum)) adjSet = 1;
                    else if ([4, 5, 6].includes(this.currentSetNum)) adjSet = 2;
                    else adjSet = 3;
                } else {
                    // determine exercise
                    if (this.currentSetNum % 2 !== 0) {
                        currentPath = this.sections[this.currentSection]['path1'];
                    } else currentPath = this.sections[this.currentSection]['path2'];
                    // set number
                    if (this.currentSetNum === 1 || this.currentSetNum === 2) adjSet = 1;
                    else if (this.currentSetNum === 3 || this.currentSetNum === 4) adjSet = 2;
                    else adjSet = 3;
                }
                // set url
                url = `http://localhost:3000/exercise/${currentPath}Set`;
                let hasPosted = false;
                // make the post request if user is logged in
                if (this.$cookies.isKey("workout_id")) {
                    let res = await fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({
                            reps: parseInt(this.repsDone),
                            setNumber: adjSet,
                            progression: this.currentVariant.num,
                            workout_id: this.$cookies.get("workout_id")
                        })
                    });
                    if (res.status === 200) { hasPosted = true; window.sessionStorage['hasPosted'] = 1; }
                }
                // create set object to store in sessionStorage
                let newSet = {
                    reps: parseInt(this.repsDone),
                    setNumber: adjSet,
                    progression: this.currentVariant.num,
                    currentPath,
                    id: window.sessionStorage['idCounter']
                };
                // add post url if we're not posting right now
                if (!hasPosted) newSet['postPath'] = url;
                // read current sessionStorage
                let session = JSON.parse(window.sessionStorage['workoutSummary']);
                if (!session[this.currentSection]) session[this.currentSection] = [];
                // update sessionStorage with newSet included
                session[this.currentSection].push(newSet);
                window.sessionStorage['workoutSummary'] = JSON.stringify(session);
                // update counter
                window.sessionStorage['idCounter']++;
                // go to next set automatically if 'enter' pressed in input
                if (directClick) this.incrementSetNum(false);
            }
        },
    },
    async created() {
        try {
            // init sessionStorage if not active
            if (!window.sessionStorage['workoutSummary']) window.sessionStorage['workoutSummary'] = "{}";
            if (!window.sessionStorage['idCounter']) window.sessionStorage['idCounter'] = 0;
            // get a new workout_id (if user is logged in without existing workout_id)
            if (this.$cookies.isKey("user_id") && !this.$cookies.isKey("workout_id")) {
                let url = "http://localhost:3000/workout";
                let res = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify({
                        user_id: this.$cookies.get("user_id")
                    })
                });
                res = await res.json();
                //                                  expiry path domain secure sameSite
                this.$cookies.set("workout_id", res, "12h", null, null, null, "Strict");
            }
        } catch (error) {
            console.log(error);
        }
    },
    data() {
        return {
            repsDone: undefined,
            currentSetNum: 1,
            currentSection: 'Warmups',
            sections: {
                'Warmups': {
                    maxSets: 8,
                    exercises: ["Yuri's Shoulder Band Warmup", "Squat Sky Reaches", "GMB Wrist Prep", "Deadbugs", "Arch Hangs", "Support Hold", "Easier Squat Progression", "Easier Hinge Progression"],
                    reps: ["5 - 10", "5 - 10", "10+", "30s", "10", "30s", "10", "10"],
                },
                'Pullups & Squats': {
                    maxSets: 6,
                    exercises: ["Pullups", "Squats", "Pullups", "Squats", "Pullups", "Squats"],
                    reps: ["5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8"],
                    path1: 'pullup',
                    path2: 'squat',
                },
                'Dips & Hinges': {
                    maxSets: 6,
                    exercises: ["Dips", "Hinges", "Dips", "Hinges", "Dips", "Hinges"],
                    reps: ["5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8"],
                    path1: 'dip',
                    path2: 'hinge',
                },
                'Rows & Pushups': {
                    maxSets: 6,
                    exercises: ["Rows", "Pushups", "Rows", "Pushups", "Rows", "Pushups"],
                    reps: ["5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8", "5 - 8"],
                    path1: 'row',
                    path2: 'pushup',
                },
                'Core': {
                    maxSets: 9,
                    exercises: ["Anti-Extensions", "Anti-Rotations", "Extensions", "Anti-Extensions", "Anti-Rotations", "Extensions", "Anti-Extensions", "Anti-Rotations", "Extensions"],
                    reps: ["8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12", "8 - 12"],
                    path1: 'antiextension',
                    path2: 'antirotation',
                    path3: 'extension',
                }
            },
            pullupVariant: 0,
            squatVariant: 0,
            dipVariant: 0,
            hingeVariant: 0,
            rowVariant: 0,
            pushupVariant: 0,
            antiExtensionVariant: 0,
            antiRotationVariant: 0,
            extensionVariant: 0,
            pullupProgression: [
                {
                    name: "Scapular Pulls",
                    url: "https://www.youtube.com/watch?v=FgYoc4O-cio&feature=youtu.be&t=1m21s",
                    desc: "Elbows should stay straight.Your back will arch more as you get stronger.These should be performed with a pause at the top. Squeeze your shoulders, hold it for 3-5s then release into a dead hang under control.If you can't pull out of the dead hang at all, consider using bands or your feet to assist you until you gain the necessary strength"
                },
                {
                    name: "Arch Hangs",
                    url: "https://www.youtube.com/watch?v=C995b3KLXS4&feature=youtu.be&t=7s",
                    desc: "Elbows should stay straight.Hold it for time/reps.Progress towards a 90 degree in your shoulder"
                },
                {
                    name: "Pullup Negatives",
                    url: "https://vimeo.com/76666801",
                    desc: "Jump to the top of the pullup position, then slowly (as slowly as you can), lower yourself until your arms are straight.Build up to 10sec negatives!",
                },
                {
                    name: "Pullups",
                    url: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
                    desc: "See general form cues"
                },
                {
                    name: "Weighted Pullups",
                    url: "",
                    desc: "Like the fourth exercise in this progression, except with extra weight!.Some ways to add weight:.Put a dumbbell between your feet.Cross your feet and put a dumbbell between your calves.Use a belt and chain and add weight plates.Use a backpack full of something heavy.Leverage by putting priority on one of your arms.Use a weighted vest"
                }
            ],
            squatProgression: [
                {
                    name: "Assisted Squat",
                    url: "https://www.youtube.com/watch?v=OuR_Fp7AB0c",
                    desc: "Grab something in front of you and use your hands to assist in the squat.Reduce assistance over time"
                },
                {
                    name: "Squat",
                    url: "https://www.youtube.com/watch?v=zJBLDJMJiDE",
                    desc: "See general form cues"
                },
                {
                    name: "Split Squat",
                    url: "https://www.getstrong.fit/images/GobletSplitSquat.jpg",
                    desc: "Pretend the dumbbell doesn't exist.Remain in the split stance throughout the set.Unlike a lunge, you don't return to a feet-together stance"
                },
                {
                    name: "Bulgarian Split Squat",
                    url: "https://www.youtube.com/watch?v=kkdmHTASZg8&feature=youtu.be&t=1m15s",
                    desc: "Pretend the barbell doesn't exist.You can progress this further by elevating both your legs"
                },
                {
                    name: "Beginner Shrimp Squat",
                    url: "https://www.youtube.com/watch?v=TKt0-c83GSc&feature=youtu.be&t=3m9s",
                    desc: "Make sure your knee and toes leave the floor at the same time"
                },
                {
                    name: "Intermediate Shrimp Squat",
                    url: "",
                    desc: "In this variation, the knee touches the ground but the toes DO NOT"
                },
                {
                    name: "Advanced Shrimp Squat",
                    url: "",
                    desc: "In this variation, you hold your heel as you descend.Only the knee touches the floor"
                },
                {
                    name: "Weighted Shrimp Squats",
                    url: "",
                    desc: ""
                }
            ],
            dipProgression: [
                {
                    name: "Parallel Bar Support Hold",
                    url: "https://antranik.org/wp-content/uploads/2014/01/antranik-holding-support-hold-on-parallel-bars.jpg",
                    desc: "Work up to 3 sets of 1 minute holds for this progression.If you can't hold yourself up at all, consider using bands or your feet to assist you until you gain the necessary strength"
                },
                {
                    name: "Negative Dips",
                    url: "https://www.youtube.com/watch?v=T3Scqw1BbCc",
                    desc: "This exercise is only the descent.To get to the starting position you can jump or use a box or anything"
                },
                {
                    name: "Parallel Bar Dips",
                    url: "https://www.youtube.com/watch?v=2z8JmcrW-As",
                    desc: "See general form cues"
                },
                {
                    name: "Weighted Dips",
                    url: "",
                    desc: "See general form cues.You can do this progression in place of ring dips.We recommend to add weight to parallel bar dips first instead of rings dips"
                },
            ],
            hingeProgression: [
                {
                    name: "Romanian Deadlift",
                    url: "https://gfycat.com/blueultimatebaiji",
                    desc: "Stand up straight.Brace and squeeze your butt to flatten your low back (neutral spine to maybe slightly arched).Send your butt back and lean your torso forward to avoid falling over.You can place the hands on your chest and abdomen for feedback or let them hang by your sides.Note: The GIF is 'robotic' for demonstration purposes, your execution should be smooth"
                },
                {
                    name: "Single Legged Deadlift",
                    url: "https://www.youtube.com/watch?v=iDV8r5u6En0",
                    desc: "Please ignore the barbell.If you lack the balance to perform these with a leg in the air, you can use an arm to brace yourself against a surface or you can straddle your legs to help with balance"
                },
                {
                    name: "Banded Nordic Curl Negatives",
                    url: "https://www.youtube.com/watch?v=HUXS3S2xSX4",
                    desc: "Anchor your feet under something sturdy.You want to be anchored about a fist's distance away from your ankle.Squeeze your butt to keep your hips extended.Slowly lower your torso, avoiding piking at the hips.Do a little push-up when you reach the bottom to get back to the top and 'skip' the concentric"
                },
                {
                    name: "Banded Nordic Curl",
                    url: "https://www.youtube.com/watch?v=HUXS3S2xSX4",
                    desc: "Anchor your feet under something sturdy.You want to be anchored about a fist's distance away from your ankle.Squeeze your butt to keep your hips extended.Slowly lower your torso, avoiding piking at the hips.Note: Repeat these two progressions with weaker bands until you can move on"
                },
                {
                    name: "Nordic Curls",
                    url: "https://www.youtube.com/watch?v=d8AAPcYxPo8",
                    desc: "Anchor your feet under something sturdy.You want to be anchored about a fist's distance away from your ankle.Squeeze your butt to keep your hips extended.Slowly lower your torso, avoiding piking at the hips"
                },
            ],
            rowProgression: [
                {
                    name: "Vertical Rows",
                    url: "https://www.youtube.com/watch?v=rloXYB8M3vU&feature=youtu.be",
                    desc: "Perform a row, but with the body position vertical"
                },
                {
                    name: "Incline Rows",
                    url: "https://www.youtube.com/watch?v=LR2EnFWpVao",
                    desc: "Perform a row, but with the body position somewhere between vertical and horizontal.Go closer to horizontal to make it harder"
                },
                {
                    name: "Horizontal Rows",
                    url: "https://www.youtube.com/watch?v=dvkIaarnf0g",
                    desc: "See general form cues"
                },
                {
                    name: "Wide Rows",
                    url: "https://www.youtube.com/watch?v=1yMRvsuk9Xg",
                    desc: "It's okay to flare your elbows on this one.On a bar: take a wide grip (150% of shoulder width) and perform rows like this.On rings: while performing a row, bring out the elbows to the side up to a 90 degree angle"
                },
                {
                    name: "Weighted Inverted Rows",
                    url: "https://www.youtube.com/watch?v=3cYR6pis5zc",
                    desc: "These can be done with a weight plate on your chest/belly (uncomfortable and unreliable), or with a weight vest (minimal setup, but limited weight), or with a dip belt hanging from your waist or chest (This method can be loaded the most, however you need to elevate your entire body so that the plates don't touch the floor at the bottom).Alternatively, you can do Barbell or Dumbbell rows."
                },
            ],
            pushupProgression: [
                {
                    name: "Vertical Pushup",
                    url: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https://static.onecms.io/wp-content/uploads/sites/23/2010/04/06/wall-push-up_300.jpg",
                    desc: "Standing next to a wall, put your hands on the wall and perform a pushup"
                },
                {
                    name: "Incline Pushup",
                    url: "https://www.youtube.com/watch?v=4dF1DOWzf20&feature=youtu.be&t=3m56s",
                    desc: "Finding some raised object, put your hands on said object and perform a pushup.Lower the height to increase the difficulty"
                },
                {
                    name: "Full Pushup",
                    url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
                    desc: "See general form cues"
                },
                {
                    name: "Diamond Pushup",
                    url: "https://www.youtube.com/watch?v=_4EGPVJuqfA",
                    desc: "Put your hands close together so the thumbs and index fingers touch, then perform a pushup.If this is too difficult or feels uncomfortable, put your hands just a bit closer than in a normal pushup.Work on moving the hands closer together over time until you reach diamond pushups"
                },
                {
                    name: "Pseudo Planche Pushups",
                    url: "https://www.youtube.com/watch?v=Cdmg0CfMZeo",
                    desc: "Putting your hands sideways, lean forward with a straight body until your shoulders are in front of your hands.Perform a pushup while maintaining forward lean.Protract the shoulderblades at the top.Increase forward lean to make more difficult.Decrease forward lean to make easier.You won't run out of resistance anytime soon if you keep increasing your forward lean"
                },
            ],
            antiExtenstionProgression: [
                {
                    name: "Plank",
                    url: "https://www.youtube.com/watch?v=44ScXWFaVBs&feature=youtu.be&t=10s",
                    desc: "Work up to a 30s hold then move on to your ring rollouts.You're only doing the planks, don't do every drill in the video"
                },
                {
                    name: "Ring Ab Rollouts",
                    url: "https://www.youtube.com/watch?v=LBUfnmugKLw",
                    desc: "Elbows should stay straight.Remain in a hollow body position (ribs down, butt tucked).Keep your hands as close as your overhead mobility will allow.Higher ring position will make this easier.Elevating the feet will make it harder"
                },
            ],
            antiRotationProgression: [
                {
                    name: "Banded Pallof Press",
                    url: "https://www.youtube.com/watch?v=AH_QZLm_0-s",
                    desc: "These are performed under control with a short pause when your arms are fully extended"
                },
            ],
            extensionProgression: [
                {
                    name: "Reverse Hyperextension",
                    url: "https://www.youtube.com/watch?v=ZeRsNzFcQLQ&",
                    desc: "Keep your butt tucked"
                },
            ],
        }
    }
};
</script>

<style scoped>
#completed {
    display: inline;
}
div {
    text-align: center;
}
button {
    background-color: brown;
}
.set {
    display: inline-block;
}
</style>
