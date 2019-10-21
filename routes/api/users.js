const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const User = require('../../model/User');

// Route   GET api/users/test
// @desc   tests users route
// @access Public
router.get('/test', (req, res)=>res.json({msg: 'user works'}));

// Route   Get api/users/register
// @decs   registar user
// @access Public
router.post('/register', (req, res)=> {
    User.findOne({
        email: req.body.email })
       .then(user => {
           if(user){
            return res.status(400).json({email: 'Email  already exists'})
           } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // size
                r: 'pg', // rating 
                d: 'mm' // default picture
            });

            const newUser = new User({
                name: req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password  
            });


            // generate salt with hash 
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt,  (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err, console.log(err))
                });
            })




           }
       } )
})



// Route   POST api/users/login
// @decs   login user / returning jwt token
// @access Public
    


router.post('/login', (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;

    // Find User by email
    User.findOne({email}).then( user =>{

    // Check by user
        if(!user){
        return res.status(404).json({email: 'User not found'})
     }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
        if(isMatch){
            // res.json({msg: 'success'})
            // User Matched

            // Create payload Jwt 
            const payload = {id: user.id, name: user.name, avatar: user.avatar}

            // sign token
            jwt.sign(
                payload, 
                keys.secretOrKey,
                 {expiresIn: 3600}, 
                 (err, token)=> {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })

            })
            
        }else {
            return res.status(400).json({password: 'password incorrect'})
        }
    })
    })

})

// Route   GET api/users/current
// @decs   return current user
// @access Private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    // res.json({msg: 'sussess authentiacte'})
    // res.json(req.user)
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    })
})



module.exports = router;