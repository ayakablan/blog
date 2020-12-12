const express = require('express');
const router = express.Router();
const User = require('../modules/users');
const post = require('../modules/posts');

//get all users
router.get('/', async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.send({message:error})
    }
});

router.delete('/', async (req,res) => {
    try {
        const users = await User.remove({});
        res.json(users);
    } catch (error) {
        res.send({message:error})
    }
});

module.exports = router;

