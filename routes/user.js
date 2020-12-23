const express = require('express');
const router = express.Router();
const User = require('../modules/users');
const Post = require('../modules/posts');
const verify = require('../verifyToken');
const passport = require('passport');


//get all users
router.get('/admin/view-users', verify, async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.send({message:error})
    }
});

//delete all users
router.delete('/admin/delete-users', verify, async (req,res) => {
    try {
        const users = await User.remove({});
        res.json(users);
    } catch (error) {
        res.send({message:error})
    }
});

//view profile
router.get('/profile', verify, async (req,res) => {
    try {
        const user = await User.findOne({_id: req.user});    
        res.json(user);
    } catch (error) {
        res.send({message:error})
    }
});

//edit profile---------------------------------------------
router.patch('/edit-profile', verify , async (req,res) => {
    try {
        const user = await User.findOne({_id: req.user});

    } catch (error) {
        res.send({message:error});
    }
});

//delete user account
router.delete('/delete-account', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const posts = await Post.find();
    var total = posts.length;
    var validate = 0;
    try {
        for(var i=0; i<posts.length; i++)
            if(user._id.equals(posts[i].author)){
                await Post.deleteOne({_id: posts[i]._id});
                validate += 1;
            }
        var newtotlal = posts.length;
        var difference = total - validate;
        if(newtotlal == difference){
            await User.deleteOne({_id: req.user});
        }
        res.send(user);
    } catch (error) {
        res.send({message:error});
    }
});

//view user posts
router.get('/my-posts',verify, async (req,res) => {
    try {
        const user = await User.findOne({_id: req.user}).populate('posts');
        res.json(user.posts);
    } catch (error) {
        res.send({message:error})
    }
});

//view user specific post
router.get('/my-posts/:postId',verify, async (req,res,next) => {
    try {
        const user = await User.findOne({_id: req.user}).populate('posts');
        for (i=0; i<user.posts.length; i++)
            if(user.posts[i].equals(req.params.postId)){
                res.send(user.posts[i]);
            }
        next();
    } catch (error) {
        res.send({message:error})
    }
});

router.get('/logout', verify, async(req,res) => {
    req.logout();
    res.send("logged out");
});


module.exports = router;