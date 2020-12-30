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
        default: null
    },
    city:{
        type: String,
        default: null
    },
    gender:{
        type: String,
        default: null
    },
    birthdate:{
        type: Date,
        default: null
    },
    about:{
        type: String,
        min: 50,
        max: 150,
        default: null
    },
    school:[{
        type: String,
        default: null

    }],
    university:[{
        type: String,
        default: null

    }],
    work:[{
        type: String,
        default: null
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