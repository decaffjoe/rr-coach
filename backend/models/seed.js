module.exports = async function name() {
    try {
        const db = require('./dbconfig');
        const User = require('./User'),
            Workout = require('./Workout'),
            Pullup = require('./Pullup');

        // reset tables, connect models
        await db.sync({ force: true });
        console.log('All models synced up nicely!');

        // create user instances (rows in the Users table!)
        const jose = await User.create({ nickname: 'jose' });
        const bob = await User.create({ nickname: 'bob' });

        // create workout instances (rows in the Workouts table!)
        // four workouts for jose
        await Workout.create({ user_id: jose.user_id });
        await Workout.create({ user_id: jose.user_id });
        await Workout.create({ user_id: jose.user_id });
        await Workout.create({ user_id: jose.user_id });
        // one workout for bob
        const bob_workout = await Workout.create({ user_id: bob.user_id });

        // bob does two sets of pullups
        await Pullup.create({ workout_id: bob_workout.workout_id, set: 1, progression: 3, reps: 6 });
        // limit the fields that can be set, useful for forms
        await Pullup.create({ workout_id: bob_workout.workout_id, set: 2, progression: 3, reps: 8 }, { fields: ['workout_id', 'progression', 'reps', 'set'] });

        // find jose's most recent workout
        let idk = await Workout.findAll({ where: { user_id: jose.user_id } });
        let joseMostRecentWorkoutId = idk[idk.length - 1].toJSON().workout_id

    } catch (err) {
        console.log(err);
    }
}