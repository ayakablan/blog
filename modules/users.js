const mongoose = require('mongoose');

const User = mongoose.Schema({
    name:{
        type: String,
        require: true,
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
    }]

});
module.exports = mongoose.model('User',User);