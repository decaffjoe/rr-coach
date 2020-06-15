const express = require('express'),
    router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const { allExercises } = require('../models/Exercises');

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