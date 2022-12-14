import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

// ui state
const state = {
	allExercises: [
		"pullup",
		"squat",
		"dip",
		"hinge",
		"row",
		"pushup",
		"antiextension",
		"antirotation",
		"extension",
	],
	pullupProgression: [
		{
			name: "Scapular Pulls",
			url: "https://www.youtube.com/embed/FgYoc4O-cio?start=81",
			desc: "Elbows should stay straight.Your back will arch more as you get stronger.These should be performed with a pause at the top. Squeeze your shoulders, hold it for 3-5s then release into a dead hang under control.If you can't pull out of the dead hang at all, consider using bands or your feet to assist you until you gain the necessary strength",
		},
		{
			name: "Arch Hangs",
			url: "https://www.youtube.com/embed/C995b3KLXS4?start=7",
			desc: "Elbows should stay straight.Hold it for time/reps.Progress towards a 90 degree in your shoulder",
		},
		{
			name: "Pullup Negatives",
			url: "https://player.vimeo.com/video/76666801",
			desc: "Jump to the top of the pullup position, then slowly (as slowly as you can), lower yourself until your arms are straight.Build up to 10sec negatives!",
		},
		{
			name: "Pullups",
			url: "https://www.youtube.com/embed/eGo4IYlbE5g",
			desc: "See general form cues",
		},
		{
			name: "Weighted Pullups",
			url: "",
			desc: "Like the fourth exercise in this progression, except with extra weight!.Some ways to add weight:.Put a dumbbell between your feet.Cross your feet and put a dumbbell between your calves.Use a belt and chain and add weight plates.Use a backpack full of something heavy.Leverage by putting priority on one of your arms.Use a weighted vest",
		},
	],
	squatProgression: [
		{
			name: "Assisted Squat",
			url: "https://www.youtube.com/embed/OuR_Fp7AB0c",
			desc: "Grab something in front of you and use your hands to assist in the squat.Reduce assistance over time",
		},
		{
			name: "Squat",
			url: "https://www.youtube.com/embed/zJBLDJMJiDE",
			desc: "See general form cues",
		},
		{
			name: "Split Squat",
			url: "https://www.getstrong.fit/images/GobletSplitSquat.jpg",
			desc: "Pretend the dumbbell doesn't exist.Remain in the split stance throughout the set.Unlike a lunge, you don't return to a feet-together stance",
		},
		{
			name: "Bulgarian Split Squat",
			url: "https://www.youtube.com/embed/kkdmHTASZg8?start=75",
			desc: "Pretend the barbell doesn't exist.You can progress this further by elevating both your legs",
		},
		{
			name: "Beginner Shrimp Squat",
			url: "https://www.youtube.com/embed/TKt0-c83GSc?start=189",
			desc: "Make sure your knee and toes leave the floor at the same time",
		},
		{
			name: "Intermediate Shrimp Squat",
			url: "",
			desc: "In this variation, the knee touches the ground but the toes DO NOT",
		},
		{
			name: "Advanced Shrimp Squat",
			url: "",
			desc: "In this variation, you hold your heel as you descend.Only the knee touches the floor",
		},
		{
			name: "Weighted Shrimp Squats",
			url: "",
			desc: "",
		},
	],
	dipProgression: [
		{
			name: "Parallel Bar Support Hold",
			url: "https://antranik.org/wp-content/uploads/2014/01/antranik-holding-support-hold-on-parallel-bars.jpg",
			desc: "Work up to 3 sets of 1 minute holds for this progression.If you can't hold yourself up at all, consider using bands or your feet to assist you until you gain the necessary strength",
		},
		{
			name: "Negative Dips",
			url: "https://www.youtube.com/embed/T3Scqw1BbCc",
			desc: "This exercise is only the descent.To get to the starting position you can jump or use a box or anything",
		},
		{
			name: "Parallel Bar Dips",
			url: "https://www.youtube.com/embed/2z8JmcrW-As",
			desc: "See general form cues",
		},
		{
			name: "Weighted Dips",
			url: "",
			desc: "See general form cues.You can do this progression in place of ring dips.We recommend to add weight to parallel bar dips first instead of rings dips",
		},
	],
	hingeProgression: [
		{
			name: "Romanian Deadlift",
			url: "https://gfycat.com/ifr/BlueUltimateBaiji",
			desc: "Stand up straight.Brace and squeeze your butt to flatten your low back (neutral spine to maybe slightly arched).Send your butt back and lean your torso forward to avoid falling over.You can place the hands on your chest and abdomen for feedback or let them hang by your sides.Note: The GIF is 'robotic' for demonstration purposes, your execution should be smooth",
		},
		{
			name: "Single Legged Deadlift",
			url: "https://www.youtube.com/embed/iDV8r5u6En0",
			desc: "Please ignore the barbell.If you lack the balance to perform these with a leg in the air, you can use an arm to brace yourself against a surface or you can straddle your legs to help with balance",
		},
		{
			name: "Banded Nordic Curl Negatives",
			url: "https://www.youtube.com/embed/HUXS3S2xSX4",
			desc: "Anchor your feet under something sturdy.You want to be anchored about a fist's distance away from your ankle.Squeeze your butt to keep your hips extended.Slowly lower your torso, avoiding piking at the hips.Do a little push-up when you reach the bottom to get back to the top and 'skip' the concentric",
		},
		{
			name: "Banded Nordic Curl",
			url: "https://www.youtube.com/embed/HUXS3S2xSX4",
			desc: "Anchor your feet under something sturdy.You want to be anchored about a fist's distance away from your ankle.Squeeze your butt to keep your hips extended.Slowly lower your torso, avoiding piking at the hips.Note: Repeat these two progressions with weaker bands until you can move on",
		},
		{
			name: "Nordic Curls",
			url: "https://www.youtube.com/embed/d8AAPcYxPo8",
			desc: "Anchor your feet under something sturdy.You want to be anchored about a fist's distance away from your ankle.Squeeze your butt to keep your hips extended.Slowly lower your torso, avoiding piking at the hips",
		},
	],
	rowProgression: [
		{
			name: "Vertical Rows",
			url: "https://www.youtube.com/embed/rloXYB8M3vU",
			desc: "Perform a row, but with the body position vertical",
		},
		{
			name: "Incline Rows",
			url: "https://www.youtube.com/embed/LR2EnFWpVao",
			desc: "Perform a row, but with the body position somewhere between vertical and horizontal.Go closer to horizontal to make it harder",
		},
		{
			name: "Horizontal Rows",
			url: "https://www.youtube.com/embed/dvkIaarnf0g",
			desc: "See general form cues",
		},
		{
			name: "Wide Rows",
			url: "https://www.youtube.com/embed/1yMRvsuk9Xg",
			desc: "It's okay to flare your elbows on this one.On a bar: take a wide grip (150% of shoulder width) and perform rows like this.On rings: while performing a row, bring out the elbows to the side up to a 90 degree angle",
		},
		{
			name: "Weighted Inverted Rows",
			url: "https://www.youtube.com/embed/3cYR6pis5zc",
			desc: "These can be done with a weight plate on your chest/belly (uncomfortable and unreliable), or with a weight vest (minimal setup, but limited weight), or with a dip belt hanging from your waist or chest (This method can be loaded the most, however you need to elevate your entire body so that the plates don't touch the floor at the bottom).Alternatively, you can do Barbell or Dumbbell rows.",
		},
	],
	pushupProgression: [
		{
			name: "Vertical Pushup",
			url: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https://static.onecms.io/wp-content/uploads/sites/23/2010/04/06/wall-push-up_300.jpg",
			desc: "Standing next to a wall, put your hands on the wall and perform a pushup",
		},
		{
			name: "Incline Pushup",
			url: "https://www.youtube.com/embed/4dF1DOWzf20?start=236",
			desc: "Finding some raised object, put your hands on said object and perform a pushup.Lower the height to increase the difficulty",
		},
		{
			name: "Full Pushup",
			url: "https://www.youtube.com/embed/IODxDxX7oi4",
			desc: "See general form cues",
		},
		{
			name: "Diamond Pushup",
			url: "https://www.youtube.com/embed/_4EGPVJuqfA",
			desc: "Put your hands close together so the thumbs and index fingers touch, then perform a pushup.If this is too difficult or feels uncomfortable, put your hands just a bit closer than in a normal pushup.Work on moving the hands closer together over time until you reach diamond pushups",
		},
		{
			name: "Pseudo Planche Pushups",
			url: "https://www.youtube.com/embed/Cdmg0CfMZeo",
			desc: "Putting your hands sideways, lean forward with a straight body until your shoulders are in front of your hands.Perform a pushup while maintaining forward lean.Protract the shoulderblades at the top.Increase forward lean to make more difficult.Decrease forward lean to make easier.You won't run out of resistance anytime soon if you keep increasing your forward lean",
		},
	],
	antiextensionProgression: [
		{
			name: "Plank",
			url: "https://www.youtube.com/embed/44ScXWFaVBs?start=10",
			desc: "Work up to a 30s hold then move on to your ring rollouts.You're only doing the planks, don't do every drill in the video",
		},
		{
			name: "Ring Ab Rollouts",
			url: "https://www.youtube.com/embed/LBUfnmugKLw",
			desc: "Elbows should stay straight.Remain in a hollow body position (ribs down, butt tucked).Keep your hands as close as your overhead mobility will allow.Higher ring position will make this easier.Elevating the feet will make it harder",
		},
	],
	antirotationProgression: [
		{
			name: "Banded Pallof Press",
			url: "https://www.youtube.com/embed/AH_QZLm_0-s",
			desc: "These are performed under control with a short pause when your arms are fully extended",
		},
	],
	extensionProgression: [
		{
			name: "Reverse Hyperextension",
			url: "https://www.youtube.com/embed/ZeRsNzFcQLQ",
			desc: "Keep your butt tucked",
		},
	],
	pullupForm: [
		"Body slightly hollow with straight legs throughout the whole exercise. Don't cross your legs.",
		"If you cannot get straight legs, it's preferable to keep the feet in front of the body rather than behind.",
		"Arms straight at the bottom. Don't think about anything else, just straight arms. The rest will happen automatically.",
		"Strive for chest to bar at the top. For this the forearms have to deviate from vertical, which may be a bit hard on the elbows, so build up to it slowly.",
		"Keep the neck in a neutral position: avoid craning it to get your chin over the bar.",
		"It's natural for your legs to come forward: this keeps your center of mass under the bar. Just make sure you're not violently swinging them upwards.",
	],
	squatForm: [
		"Stand up straight at the top",
		"Go as low as you can, preferably until the hips are below the knees",
		"Dig your big toe and heel into the ground",
		"Keep your knee in-line with your toes",
		"Don't let the knees come inward on either the descend or the ascend; think about pushing the knees out",
	],
	dipForm: [
		"Straight or slightly hollow body. No bending at the hips!",
		"Lock out the arms and depress the shoulder blades at the top",
		"Go as far down as you can",
		"Elbows in",
	],
	hingeForm: [],
	rowForm: [
		"Straight body",
		"Elbows in",
		"Arms straight at the bottom",
		"Rings/bar to chest and shoulder blades fully retracted (pinched together) at the top",
		"Don't let your shoulders shrug up",
	],
	pushupForm: [
		"Body in a straight line from head to toe: don't let the hips sag!",
		"Lock out the arms and protract the shoulderblades at the top",
		"Go down until chest nearly touches the ground",
		"Keep the elbows in, don't let them flare out",
		"Don't shrug up your shoulders to your ears, focus on depressing the shoulderblades",
	],
	antiextensionForm: [],
	antirotationForm: [],
	extensionForm: [],
};

// // update components with ui state
// // using local computed arrow funcs for now...
const getters = {
	newUserId: (state) => state.newUserId,
	progressions: (state) => {
		return {
			pullupProgression: state.pullupProgression,
			squatProgression: state.squatProgression,
			dipProgression: state.dipProgression,
			hingeProgression: state.hingeProgression,
			rowProgression: state.rowProgression,
			pushupProgression: state.pushupProgression,
			antiextensionProgression: state.antiextensionProgression,
			antirotationProgression: state.antirotationProgression,
			extensionProgression: state.extensionProgression,
		};
	},
	generalFormCues: (state) => {
		return {
			pullupForm: state.pullupForm,
			squatForm: state.squatForm,
			dipForm: state.dipForm,
			hingeForm: state.hingeForm,
			rowForm: state.rowForm,
			pushupForm: state.pushupForm,
			antiextensionForm: state.antiextensionForm,
			antirotationForm: state.antirotationForm,
			extensionForm: state.extensionForm,
		};
	},
};

// // get/modify backend state
// const actions = {
// };

// // backend state -> ui state
// const mutations = {
//    createUser: (state, userId) => {
//        return state.newUserId = userId;
//    },
// };

export default new Vuex.Store({
	state,
	getters,
	// actions,
	// mutations
});
