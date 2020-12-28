const express = require('express');
const router = express.Router();
const User = require('../modules/users');
const Post = require('../modules/posts');
const Comment = require('../modules/comments');
const verify = require('../verifyToken');

//view the comment
router.get('/:postId/:commentID',verify, async (req,res) => { 
    const post = await Post.findById(req.params.postId);
    const comment = await Comment.findById(req.params.commentID);
    try {
        if((post._id.equals(comment.post._id)) ){       
            res.send(comment);
        }
        else{
            res.send('error');
        }
    }catch (error) {
            res.send({message:error});
    }
});

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
router.patch('/:postId/:commentID/edit', verify, async (req,res) => { 
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
router.delete('/:postId/:commentID/delete', verify, async (req,res) => {
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
router.post('/:postId/:commentID/like', verify, async (req,res) => {
    const user = await User.findOne({_id: req.user});    
    const post = await Post.findById(req.params.postId);
    const comment = await Comment.findById(req.params.commentID);
    try{
        if( post._id.equals(comment.post._id) ){
            Comment.exists({"_id": comment, "likes": user}, async function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    if(!result){
                        comment.likes.push(user);
                        await comment.save();
                        res.json(comment.likes);
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
        if( post._id.equals(comment.post._id) ){
            Comment.exists({"_id": comment, "likes": user}, async function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    if(result){
                        comment.likes.pop(user);
                        await comment.save();
                        res.json(comment.likes);
                    }
                    else{
                        res.send('no expression to remove');
                    }
                }            
            });
        }
    }catch(error){
        res.send({message:error});
    }

});

module.exports = router;

