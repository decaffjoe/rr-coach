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

        // no nicknames longer than 6 characters
        if (req.body['nickname'] && req.body['nickname'].length > 6) return res.status(400).json('Invalid nickname');
        let newUser = await User.create(req.body, { fields: ['nickname'] });
        newUser = newUser.toJSON();
        // only need to send back user_id (not deleted from db, only the response)
        delete newUser.updatedAt, delete newUser.createdAt, delete newUser.nickname;
        return res.json(newUser.user_id);

    } catch (error) {

        return res.status(400).json('Bad POST request!');

    }

});

// Update user nickname
router.put('/', async function (req, res) {
    try {

        await User.update(req.body, {
            where: { user_id: req.body['user_id'] },
            fields: ['nickname'],
        });
        return res.status(200).json('Success');

    } catch (error) {

        return res.status(400).json('Bad POST request!');

    }

});

module.exports = router;
