<template>
    <div>
        <Navbar />
        <h1>Workout Summary</h1>
        <p v-if="!this.$cookies.isKey('user_id')">Want to save your training stats for next time? Create an account or login using the button above. (Don't worry, we'll save these stats automatically)</p>
        <p>Workout from:</p>
        <select v-model="prevWorkoutId" v-if="this.$cookies.isKey('user_id')">
            <option v-for="workout of workoutHistory" :key="workout.createdAt" :value="workout.workout_id">{{ new Date(workout.createdAt).toDateString() }}</option>
        </select>
        <button @click="getPreviousWorkoutSummary">Get Summary</button>
        <div>
            <p>Exercise | Set | Reps </p>
            <ul>Pullups
                <li v-for="set of pullups" :key="set.id">{{ pullupProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Squats
                <li v-for="set of squats" :key="set.id">{{ squatProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Dips
                <li v-for="set of dips" :key="set.id">{{ dipProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Hinges
                <li v-for="set of hinges" :key="set.id">{{ hingeProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Rows
                <li v-for="set of rows" :key="set.id">{{ rowProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Pushups
                <li v-for="set of pushups" :key="set.id">{{ pushupProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Anti-Extensions
                <li v-for="set of antiExtensions" :key="set.id">{{ antiExtenstionProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Anti-Rotations
                <li v-for="set of antiRotations" :key="set.id">{{ antiRotationProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
            <ul>Extensions
                <li v-for="set of extensions" :key="set.id">{{ extensionProgression[set.progression].name }} {{ set.setNumber }} {{ set.reps }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
    name: "Summary",
    components: { Navbar, },
    async created() {
        // get user's previous workouts by date, if logged in
        if (this.$cookies.isKey("user_id")) {
            let url = `http://localhost:3000/workout?user_id=${this.$cookies.get("user_id")}`;
            try {
                let res = await fetch(url);
                this.workoutHistory = await res.json();
            } catch (error) {
                console.log(error);
            }
        }
    },
    methods: {
        async getPreviousWorkoutSummary() {
            let url = `http://localhost:3000/exercise/allSummary?workout_id=${this.prevWorkoutId}`;
            try {
                let res = await fetch(url);
                if (res.status === 200) {
                    res = await res.json();
                    this.summary = res;
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    computed: {
        pullups() {
            if (this.summary['pullup']) return this.summary['pullup'];
            else return [];
        },
        squats() {
            if (this.summary['squat']) return this.summary['squat'];
            else return [];
        },
        dips() {
            if (this.summary['dip']) return this.summary['dip'];
            else return [];
        },
        hinges() {
            if (this.summary['hinge']) return this.summary['hinge'];
            else return [];
        },
        rows() {
            if (this.summary['row']) return this.summary['row'];
            else return [];
        },
        pushups() {
            if (this.summary['pushup']) return this.summary['pushup'];
            else return [];
        },
        antiExtensions() {
            if (this.summary['antiextension']) return this.summary['antiextension'];
            else return [];
        },
        antiRotations() {
            if (this.summary['antirotation']) return this.summary['antirotation'];
            else return [];
        },
        extensions() {
            if (this.summary['extension']) return this.summary['extension'];
            else return [];
        },
    },
    data() {
        return {
            prevWorkoutId: undefined,
            workoutHistory: undefined,
            summary: JSON.parse(window.sessionStorage['workoutSummary']),
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
}
</script>

<style scoped>
div {
    text-align: center;
}
</style>
