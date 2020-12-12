const mongoose = require('mongoose');

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
    }]

});
module.exports = mongoose.model('User',userSchema);