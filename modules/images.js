var mongoose = require('mongoose');
const User = require('./users');

const imageSchema = new mongoose.Schema({
    img:
    {
        data: Buffer,
        contentType: String
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {timestamps: true}
);
  
module.exports = mongoose.model('Image', imageSchema);