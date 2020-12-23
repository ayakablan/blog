const express = require('express');
const app = express();
const mongoose = require('mongoose');
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

//Import route 
const authroutes = require('./routes/auth');  
const userroutes = require('./routes/user');  
const postroutes = require('./routes/post');  
const commentroutes = require('./routes/commet');  

//Middleware
app.use('/api/auth', authroutes);
app.use('/api/user', userroutes);
app.use('/api/posts', postroutes);
app.use('/api/post/comment', commentroutes);


app.listen(3000, () => {
    console.log('sever is up and ruuning!')
});