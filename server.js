const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport')

const users  = require('./routes/api/users');
const profile = require('./routes/api/profile')


const app = express();

//DB Config
const db = require('./config/keys').mongoURI;

//  Connect to MongoDB
mongoose
.connect(db)
.then(()=>console.log("MongoDB database connection established successfully"))
.catch(err => console.log(err))

// use BodyParser middleware allow json 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

// passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);

app.get('/', (req, res)=> res.send('Hello world'));

const port = process.env.PORT || 5000;

app.listen(port, () =>console.log(`Sever on running on port ${port}`));

