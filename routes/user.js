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
    const users = await User.find();
    const posts = await Post.find();
    try {
        //detele user's posts
        for(var i=0; i<posts.length; i++)
            if(user._id.equals(posts[i].author))
                await Post.deleteOne({_id: posts[i]._id});

        //delete the user from other users followers list
        for(var i=0; i<users.length; i++){
            users[i].followers.pop(user);
            users[i].save();
        }

        //delete the user's likes from the posts 
        for(var i=0; i<posts.length; i++){
            posts[i].likes.pop(user);
            posts[i].save();
        }

        //delete user
        await User.deleteOne({_id: req.user});
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

//follow
router.post('/follow/:userID', verify, async (req,res) => {
    const mainUser = await User.findOne({_id: req.user});
    const followedUser = await User.findById(req.params.userID);
    try{
        if (!mainUser._id.equals(followedUser._id)){
            User.exists({"_id": mainUser, "following": followedUser}, async function(err, result) {
                if (err) {
                    res.send(err);
                  } else {
                    if(!result){
                        mainUser.following.push(followedUser);
                        followedUser.followers.push(mainUser);
                        await mainUser.save();
                        await followedUser.save();
                        res.json(mainUser);
                    }
                    else{
                        res.json("user is already followed");   
                    }
                }
            });
        }   
        else
            res.send("can't follow yourself");

    } catch(error) {
        res.send({message:error});
    }
});

//unfollow
router.post('/unfollow/:userID', verify, async (req,res) => {
    const mainUser = await User.findOne({_id: req.user});
    const followedUser = await User.findById(req.params.userID);
    try{
        if (!mainUser._id.equals(followedUser._id)){
            User.exists({"_id": mainUser, "following": followedUser}, async function(err, result) {
                if (err) {
                    res.send(err);
                  } else {
                    if(result){
                        mainUser.following.pop(followedUser);
                        followedUser.followers.pop(mainUser);
                        await mainUser.save();
                        await followedUser.save();
                        res.json(mainUser);
                    }
                    else{
                        res.json("User is not followed by you");   
                    }
                }
            });
        }   
        else{
            res.send("can't unfollow yourself");
        }
    }catch(err) {
        res.send({message:error})
    }
});

//upload profile picture
router.post('/upload-photo', verify, async (req,res) => {
    
});

//logging out
router.get('/logout', verify, async (req,res) => {
    if(req.user.session) {
        delete req.user.session;
    }
    res.send('logged out');    
});

module.exports = router;