const express = require('express'),
    router = express.Router();

const Workout = require('../models/Workout');

// Get all workouts (per user_id)
router.get('/', async function (req, res) {
    try {

        const workouts = await Workout.findAll({ where: { user_id: req.query.user_id }, attributes: ['workout_id', 'createdAt'] });
        return res.json(workouts);

    } catch (error) {

        return res.status(400).json('Please submit a valid user id!');

    }
});

// Create new workout (per user_id)
router.post('/', async function (req, res) {
    try {

        let newWorkout = await Workout.create(req.body, { fields: ['user_id'] });
        newWorkout = newWorkout.toJSON();
        // client already has user_id, no need to return timestamps either
        delete newWorkout.user_id, delete newWorkout.updatedAt, delete newWorkout.createdAt;
        return res.json(newWorkout.workout_id);

    } catch (error) {

        return res.status(400).json('Please submit a valid user_id');

    }
});

module.exports = router;
