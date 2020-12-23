const mongoose = require('mongoose');
const User = require('./users');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    comments:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    date:{ 
        type: Date,
        default: Date.now 
    },
    hidden:{
        type: Boolean
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]

});

module.exports = mongoose.model('Post', postSchema);