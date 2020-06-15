const express = require('express'),
    router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const { allExercises } = require('../models/Exercises');

// Create new user
router.post('/user', async function (req, res) {
    try {
        let newUser = await User.create(req.body, { fields: ['nickname'] });
        newUser = newUser.toJSON();
        // no need to return timestamp information (timestamps still in db anyways)
        delete newUser.updatedAt, delete newUser.createdAt;
        return res.json(newUser);
    } catch (error) {
        return res.status(400).json('Bad POST request!');
    }

});

// Create new workout (per user_id)
router.post('/workout', async function (req, res) {
    try {
        let newWorkout = await Workout.create(req.body, { fields: ['user_id'] });
        newWorkout = newWorkout.toJSON();
        // client already has user_id, no need to return timestamps either
        delete newWorkout.user_id, delete newWorkout.updatedAt, delete newWorkout.createdAt;
        return res.json(newWorkout);
    } catch (error) {
        return res.status(400).json('Bad POST request!');
    }
});

// Exercise-specific routes e.g. '/pullupSet'
for (let [key, val] of Object.entries(allExercises)) {

    // Create row for one exercise set (progression, reps, workout_id, setNumber)
    // Route name example '/pullupSet'
    router.post(`/${key.toLowerCase()}Set`, async function (req, res) {
        try {
            // GET request must specify "workout_id" and "setNumber"
            await val.create(req.body, {
                fields: ['workout_id', 'progression', 'reps', 'setNumber']
            });
            return res.status(200).json('Success');
        } catch (error) {
            return res.status(400).json('Bad POST request!');
        }
    });

}

module.exports = router;