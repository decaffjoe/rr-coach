const express = require('express'),
    router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const { Pullup } = require('../models/Exercises');

// Add Pullups set
router.post('/pullupSet', async function postPullupSet(req, res) {
    try {
        await Pullup.create(req.body, {
            fields: ['workout_id', 'progression', 'reps', 'setNumber']
        });
        return res.status(200).json('Success');
    } catch (error) {
        return res.status(400).json('Bad POST request!');
    }
});

module.exports = router;