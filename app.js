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
const authroute = require('./routes/auth');  
const usersroute = require('./routes/user');  
const postsroute = require('./routes/post');  

//Middleware
app.use('/api/auth', authroute);
app.use('/api/user', usersroute);
app.use('/api/posts', postsroute);


app.listen(3000, () => {
    console.log('sever is up and ruuning!')
});