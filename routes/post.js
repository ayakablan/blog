const express = require('express');
const router = express.Router();
const User = require('../modules/users');
const Post = require('../modules/posts');
const verify = require('../verifyToken');

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
            res.send('you have no privilage to edit');
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
                    else
                        res.json('post does not exists');
                }            
            });
        else
            res.json("you have no privilage to delete");    
    } catch (error) {
        res.send({message:error});
    }

});

//post visibilty
router.post('/:postId/visibilty', verify, async (req,res) => {
    const post = await Post.findById(req.params.postId);
    try {
        post.hidden = !post.hidden;
        await post.save();
        res.send(post);
    } catch (error) {
        res.send({message:error});
    }
});

//add expression
router.post('/:postId/like', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    try{
        Post.exists({"_id": post}, async function(err, result) {
            if (err) {
                res.send(err);
            } else {
                if(result){
                    post.likes = user;
                    await post.save();
                    res.json(post.likes);
                }
                else{
                    res.send('already added the expression');
                }
            }            
        }); 
    }catch(error){
        res.send({message:error});
    }

});

//remove expression
router.post('/:postId/unlike', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    try{
        Post.exists({"_id": post}, async function(err, result) {
            if (err) {
                res.send(err);
            } else {
                if(result){
                    await post.likes.pop(user);
                    await post.save();
                    res.send(post.likes);
                }
                else{
                    res.send('no expression to remove');
                }
            }            
        });
    }catch(error){
        res.send({message:error});
    }

});


module.exports = router;