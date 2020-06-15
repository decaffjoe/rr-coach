const express = require('express'),
    router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const { Pullup, Squat, Dip, Hinge, Row, Pushup, AntiExtension, AntiRotation, Extension, allExercises } = require('../models/Exercises');

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

// Get all rows from all exercises from workout_id
router.get('/workoutSummary', async function getWorkoutSummary(req, res) {
    try {
        const summary = {};
        // allExercises is the 'string: class' truth object of all exercise models
        for (let [key, val] of Object.entries(allExercises)) {
            summary[key] = await val.findAll({ where: { workout_id: req.query.workout_id }, attributes: ['progression', 'setNumber', 'reps'] });
        }
        return res.json(summary);
    } catch (error) {
        console.log(error);
        return res.status(400).json('Please submit a valid workout id!');
    }
});

module.exports = router;