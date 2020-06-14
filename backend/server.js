// IMPORTS
const express = require('express');
const app = express();

// DATABASE TESTING
const seedDB = require('./models/seed');
seedDB().then(() => console.log('ayy lmao db testing is done!'))
    .catch(err => console.log(err));

// ROUTES
app.get('/', (req, res) => {
    const User = require('./models/User'),
        Workout = require('./models/Workout'),
        Pullup = require('./models/Pullup');

    (async function any() {
        try {
            // find user 'bob'
            const bob = await User.findOne({ where: { nickname: 'bob' } });
            // find one of bob's workouts
            const bobsWorkout = await Workout.findOne({ where: { user_id: bob.user_id } });
            // find all of bob's pullup sets from that workout
            const bobsPullups = await Pullup.findAll({ where: { workout_id: bobsWorkout.workout_id } });
            // send back bob's pullups data
            res.json(bobsPullups);
        } catch (err) {
            console.log(err);
            res.json({ error: 'oh shit something just exploded in the browser' });
        }
    })();
});

// SERVER START
app.listen(3000, () => console.log('server started on http://localhost:3000/'));