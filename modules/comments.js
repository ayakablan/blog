const mongoose = require('mongoose');
const User = require('./users');
const Post = require('./posts');

const commentSchema = new mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    date:{ 
        type: Date,
        default: Date.now,
        required: true
    },
    writer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }, 
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        require: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
},
    {timestamps: true}
);

module.exports = mongoose.model('Comment', commentSchema);