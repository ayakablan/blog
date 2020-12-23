const express = require('express');
const router = express.Router();
const User = require('../modules/users');
const Post = require('../modules/posts');
const Comment = require('../modules/comments');
const verify = require('../verifyToken');

//add comment
router.post('/:postId/comment', verify, async (req,res) => {
    try {
        const user = await User.findOne({_id: req.user});    
        const post = await Post.findById(req.params.postId);
        const newComment = new Comment({
            comment: req.body.comment,
            writer: user._id,
            post: post._id
        });
            user.comments = newComment;
            await user.save();
            post.comments = newComment;
            await post.save();
            await newComment.save();
            res.send(newComment);

    } catch (error) {
        res.send({message:error})
    }
});

//edit comment
router.patch('/:postId/:commentID/editcomment', verify, async (req,res) => { 
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    const comment = await Comment.findById(req.params.commentID);
    try {
        if( (user._id.equals(comment.writer._id)) && (post._id.equals(comment.post._id)) ){
            if (req.body.comment != "")
                editedcomment = await Comment.updateOne(
                    {_id: req.params.commentID}, 
                    {$set:{comment: req.body.comment}}
                );
            res.send(editedcomment);
            }
            else{
                res.send('you have no privilage to edit');
        }
    }catch (error) {
            res.send({message:error});
    }
});


//delete comment
router.delete('/:postId/:commentID/delete-comment', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    const comment = await Comment.findById(req.params.commentID);
    try {
        await user.comments.pop(comment);
        await post.comments.pop(comment);
        await Comment.deleteOne(comment);
        res.send(comment);
    } catch (error) {
        res.send({message:error});
    }
});


//add expression
router.post('/:postd/:commentID/like', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    const comment = await Comment.findById(req.params.commentID);
    try{
        if( post._id.equals(comment.post._id) ){
            User.exists({"_id": user, "likes": comment}, async function(err, result) {
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
        }    
    }catch(error){
        res.send({message:error});
    }

});

//remove expression
router.post('/:postId/:commentID/unlike', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    const comment = await Comment.findById(req.params.commentID);
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

