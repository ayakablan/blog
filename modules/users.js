const mongoose = require('mongoose');
const Post = require('./posts');
const Comment = require('./comments');
const Image = require('./images');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        max: 255
    },
    email:{
        type: String,
        require: true,
        max: 255,
        min: 8
    },
    password:{
        type: String,
        require: true,
        max: 255,
    },
    country:{
        type: String,
    },
    city:{
        type: String,
    },
    gender:{
        type: String,
    },
    birthdate:{
        type: Date,
    },
    about:{
        type: String,
        min: 50,
        max: 150
    },
    school:[{
        type: String,
    }],
    university:[{
        type: String,
    }],
    work:[{
        type: String,
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        require: true
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        require: true
    }],
    picture:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
   
});
module.exports = mongoose.model('User',userSchema);