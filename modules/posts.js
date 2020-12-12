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
        body: String, 
        date: Date 
    }],
    date:{ 
        type: Date,
        default: Date.now 
    },
    hidden:{
        type: Boolean
    },
    meta: {
      votes: Number,
      favs:  Number
    }

});

module.exports = mongoose.model('Post', postSchema);