const express = require('express'),
    router = express.Router();

const { allExercises } = require('../models/Exercises');
// allExercises is the 'string: class' truth object of all exercise models

// Exercise-specific routes
for (let [key, val] of Object.entries(allExercises)) {

    // Get a specific set (by exercise & workout_id)
    // Route name example '/pullupSet'
    router.get(`/${key.toLowerCase()}Set`, async function (req, res) {
        try {

            // GET request must specify "workout_id" and "setNumber"
            const setData = await val.findAll({ where: { workout_id: req.query.workout_id, setNumber: req.query.setNumber }, attributes: ['progression', 'reps'] });
            return res.json(setData);

        } catch (error) {

            return res.status(400).json('Please submit a valid workout_id and setNumber');

        }
    });

    // Create a new set (progression, reps, workout_id, setNumber)
    // Route name example '/pullupSet'
    router.post(`/${key.toLowerCase()}Set`, async function (req, res) {
        try {
            let set = await val.create(req.body, {
                fields: ['workout_id', 'progression', 'reps', 'setNumber']
            });
            return res.status(200).json(set['id']);

        } catch (error) {

            return res.status(400).json('Bad POST request!');

        }
    });

    // Update an existing set (progression, reps, workout_id, setNumber)
    // Route name example '/pullupSet'
    router.put(`/${key.toLowerCase()}Set`, async function (req, res) {
        try {
            await val.update(req.body, {
                where: { id: req.body['db_id'] },
                fields: ['progression', 'reps']
            });
            return res.status(200).json('Success');

        } catch (error) {

            return res.status(400).json('Bad PUT request!');

        }
    });

    // Get all sets for one exercise, using workout_id
    // Route name example '/pullupSummary'
    router.get(`/${key.toLowerCase()}Summary`, async function (req, res) {
        try {

            // GET request must specify "workout_id" as query string parameter
            const setData = await val.findAll({ where: { workout_id: req.query.workout_id }, attributes: ['progression', 'setNumber', 'reps'] });
            return res.json(setData);

        } catch (error) {

            return res.status(400).json('Please submit a valid workout id!');

        }
    });
}

// Get all sets from all exercises per workout_id
router.get('/allSummary', async function (req, res) {
    try {

        const summary = {};
        // GET request must specify "workout_id" as query string parameter
        for (let [key, val] of Object.entries(allExercises)) {
            summary[key.toLowerCase()] = await val.findAll({ where: { workout_id: req.query.workout_id }, attributes: ['progression', 'setNumber', 'reps'] });
        }
        return res.json(summary);

    } catch (error) {

        return res.status(400).json('Please submit a valid workout id!');

    }
});

module.exports = router;
