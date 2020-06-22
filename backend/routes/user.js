const express = require('express'),
    router = express.Router();

const User = require('../models/User');

// Verify that user_id exists, return nickname if so
router.get('/', async function (req, res) {
    try {

        const user = await User.findOne({ where: { user_id: req.query.user_id } })
        return res.json(user.toJSON().nickname);

    } catch (error) {

        return res.status(400).json('Please submit a valid user id!');

    }
});

// Create new user
router.post('/', async function (req, res) {
    try {
        let newUser = await User.create(req.body, { fields: ['nickname'] });
        newUser = newUser.toJSON();
        // no need to return timestamp information (timestamps still in db anyways)
        delete newUser.updatedAt, delete newUser.createdAt, delete newUser.nickname;
        return res.json(newUser.user_id);

    } catch (error) {

        return res.status(400).json('Bad POST request!');

    }

});

module.exports = router;
