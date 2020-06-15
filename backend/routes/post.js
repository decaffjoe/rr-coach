const express = require('express'),
    router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const { Pullup } = require('../models/Exercises');

// Add Pullups set
router.post('/pullupSet', async function postPullupSet(req, res) {
    try {
        const { progression, reps, setNumber, workout_id } = req.body;
        const pullupSet = await Pullup.create({ progression, reps, setNumber, workout_id });
        return res.status(200).json('Success');
    } catch (error) {
        return res.status(400).json('Bad POST request!');
    }
});

module.exports = router;