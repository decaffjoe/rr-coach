const express = require('express'),
    router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const { Pullup } = require('../models/Exercises');

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
        const workout = await Workout.findOne({ where: { workout_id: req.query.workout_id } });
        const workout_id = workout.toJSON().workout_id;
        const pullups = await Pullup.findAll({ where: { workout_id: workout_id }, attributes: ['progression', 'set', 'reps'] });
        return res.send(pullups);
    } catch (error) {
        console.log(error);
        return res.status(400).json('Please submit a valid workout id!');
    }
});

module.exports = router;