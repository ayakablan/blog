const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(bodyParser.json()); 

//connect to DB
mongoose.connect(
    process.env.DB_Connection,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('connected to DB!') 
);
app.get('/', async (req,res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

//Import routes
const authroutes = require('./routes/auth');  
const userroutes = require('./routes/user');  
const postroutes = require('./routes/post');  
const commentroutes = require('./routes/commet');  
const pictureroutes = require('./picture');  

//Middlewares
app.use('/api/auth', authroutes);
app.use('/api/users', userroutes);
app.use('/api/posts', postroutes);
app.use('/api/post/comments', commentroutes);
app.use('/api/user/profile-pic', pictureroutes);

app.listen(3000, () => {
    console.log('sever is up and ruuning!')
});