const mongoose = require('mongoose');
const Useer = require('./users');

const Post = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    body:{
        type: String,
        require: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }

});