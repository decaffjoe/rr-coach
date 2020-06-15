const express = require('express'),
    router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const { Pullup, Squat, Dip, Hinge, Row, Pushup, AntiExtension, AntiRotation, Extension, allExercises } = require('../models/Exercises');
// allExercises is the 'string: class' truth object of all exercise models

// Get user nickname from user_id
router.get('/nickname', async function getNickname(req, res) {
    try {
        const user = await User.findOne({ where: { user_id: req.query.user_id } })
        return res.json(user.toJSON().nickname);
    } catch (error) {
        console.log(error);
        return res.status(400).json('Please submit a valid user id!');
    }
});

// Get all sets from all exercises, using workout_id
router.get('/workoutSummary', async function getWorkoutSummary(req, res) {
    try {
        const summary = {};
        // GET request must specify "workout_id" as query string parameter
        for (let [key, val] of Object.entries(allExercises)) {
            summary[key.toLowerCase()] = await val.findAll({ where: { workout_id: req.query.workout_id }, attributes: ['progression', 'setNumber', 'reps'] });
        }
        return res.json(summary);
    } catch (error) {
        console.log(error);
        return res.status(400).json('Please submit a valid workout id!');
    }
});

// Create individual exercise routes
for (let [key, val] of Object.entries(allExercises)) {

    // Get all sets from one exercise, using workout_id
    // Route name example "/pullupSummary"
    router.get(`/${key.toLowerCase()}Summary`, async function (req, res) {
        try {
            // GET request must specify "workout_id" as query string parameter
            const setData = await val.findAll({ where: { workout_id: req.query.workout_id }, attributes: ['progression', 'setNumber', 'reps'] });

            return res.json(setData);
        } catch (error) {
            console.log(error);
            return res.status(400).json('Please submit a valid workout id!');
        }
    });

}

module.exports = router;