const express = require('express');
const router = express.Router();
const User = require('../modules/users');
const Image = require('../modules/images');
const verify = require('../verifyToken');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
 
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
 
const upload = multer({ storage: storage });

//upload the image
router.post('/upload', upload.single('image') ,verify, async (req, res) => {
    const user = await User.findOne({_id: req.user});    
    const newPic = new Image({
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        owner: user
    });
    user.picture.push(newPic);
    await user.save();
    const savedpic = await newPic.save();
    console.log(savedpic);
});

module.exports = router;