const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')

// load Validation
const validateProfileInput = require('../../validator/profile')

// Load Profile model
const Profile = require('../../model/Profile');
// Load User 
const User = require('../../model/User');


router.get('/test', (req, res)=>res.json({msg: "profile works"}))

// Route   GET api/profile by id but id inside payload 
// @decs   get current users profile 
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=> {
    const errors = {}
    Profile.findOne({user: req.user.id})
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'There is no profile for this user, Create profile'
            return res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// Route   POST api/profile 
// @decs   Create and Update profile
// @access Private

router.post('/', passport.authenticate('jwt', {session: false}),(req, res)=>{
    
    const {errors, isValid} = validateProfileInput(req.body)
    // Check validation
    if(!isValid){
        return res.status(404).json(errors)
    }


    // Get Fields
    const ProfileFields = {};
    ProfileFields.user = req.user.id
    if(req.body.handle) ProfileFields.handle = req.body.handle;
    if(req.body.status) ProfileFields.status = req.body.status;
    if(req.body.bio) ProfileFields.bio = req.body.bio;
    if(req.body.location) ProfileFields.location = req.body.location;
    
    // Skills fields Split into arrays
    if(typeof req.body.skills === 'undefined')  {
        ProfileFields.skills = req.body.skills.split(',') }
   

  

    Profile.findOne({user: req.user.id})
    .then(profile => {
        // update 
        if(profile){
            Profile.findOneAndUpdate(
                {user: req.user.id},
                 {$set: profileFields},
                 {new: true}
                 ).then(profile => res.json(profile))
            
        } else{
            // Create 
            // Check if the handle exists
            Profile.findOne({handle: ProfileFields.handle}).then(profile =>{
                if(profile){
                    errors.handle = 'that handle is already exists'
                    res.json(errors)
                }
                // save profile
                new Profile(profileFields).save().then(profile =>res.json(profile))
            })

        }
    })






})




 

module.exports = router;