const express = require('express');
const router = express.Router();
const User = require('../modules/users');
const Post = require('../modules/posts');
const verify = require('../verifyToken');
const e = require('express');

//get all posts
router.get('/home', async (req,res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.send({message:error})
    }
});

//delete all posts
router.delete('/admin/delete-posts', verify, async (req,res) => {
    try {
        const posts = await Post.remove({});
        res.json(posts);
    } catch (error) {
        res.send({message:error})
    }
});

//get a post
router.get('/:postId', async (req,res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (error) {
        res.send({message:error})
    }
});

//add post
router.post('/addpost', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});
    const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        author: user._id,
        hidden: false
    });
    try {
        user.posts.push(newPost);
        await user.save();
        const savedpost = await newPost.save();
        res.send(savedpost);
    } catch (error) {
        res.send({message:error});
    }
});

//edit post 
router.patch('/:postId/editpost', verify, async (req,res) => { 
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId).populate('author');
    try {
        if(user._id.equals(post.author._id)){
            if (req.body.title != "")
                editedpost = await Post.updateOne(
                    {_id: req.params.postId}, 
                    {$set:{title: req.body.title}}
                );
            if (req.body.body != "")
                editedpost = await Post.updateOne(
                    {_id: req.params.postId}, 
                    {$set:{body: req.body.body}}
                );
            res.send(editedpost);
            }
        else{
            res.send('error');
        }
        }catch (error) {
        res.send({message:error});
    }
});

//detele post
router.delete('/:postId/delete', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    try {
        if(user._id.equals(post.author._id))
            Post.exists({"_id": post}, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    if(result){
                        user.posts.pop(post);
                        user.save();
                        Post.deleteOne({_id: req.params.postId});
                        res.json('done');
                    }
                }            
            });
        else
            res.json("post does not exists");    
    } catch (error) {
        res.send({message:error});
    }

});


module.exports = router;