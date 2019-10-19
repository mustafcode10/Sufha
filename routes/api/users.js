const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../model/User');

// Route   GET api/users/test
// @desc   tests users route
// @access Public
router.get('/test', (req, res)=>res.json({msg: 'user works'}));

// Route   Get api/users/registar
// @decs   registar user
// @access Public
router.post('/registar', (req, res)=> {
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
                
            })
           }
       } )
})






module.exports = router;