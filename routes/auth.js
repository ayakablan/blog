const router = require('express').Router();
const User = require('../modules/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

router.post('/signup', async (req,res) => {
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailexist = await User.findOne({email: req.body.email});
    if (emailexist) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedpassword
    });
    try {
       const newuser = await user.save();
       res.send({user: user._id});
    } catch (error) {
        res.send({message:error});
    }
});

router.post('/login', async (req,res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email does not exists');

    const validpass = await bcrypt.compare(req.body.password, user.password);
    if (!validpass) return res.status(400).send('Invalid password');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth_token', token).send(token);
    
});

module.exports = router; 