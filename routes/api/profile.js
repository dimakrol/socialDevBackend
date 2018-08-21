const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Model
const User = require('../../models/Users');

/**
 * @route GET api/profile/test
 * @desc Test profile route
 * @access Public
 */
router.get('/test', (req, res) => res.json({a: 'test profile'}));

/**
 * @route GET api/profile
 * @desc Get current user profile
 * @access Private|Public
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .then(profile => {

            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @route Post api/profile
 * @desc Create or Edit user profile
 * @access Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), ({body, user}, res) => {
    const errors = {};
    // Get fields
    const profileFields = {};
    profileFields.user = user.id;
    if(body.handle) profileFields.handle = body.handle;
    if(body.company) profileFields.company = body.company;
    if(body.website) profileFields.website = body.website;
    if(body.location) profileFields.location = body.location;
    if(body.bio) profileFields.bio = body.bio;
    if(body.status) profileFields.status = body.status;
    if(body.githubusername) profileFields.githubusername = body.githubusername;
    //skills - split into array
    if(typeof body.skills !== 'undefined') {
        profileFields.skills = body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if(body.youtube) profileFields.social.youtube = body.youtube;
    if(body.twitter) profileFields.social.twitter = body.twitter;
    if(body.facebook) profileFields.social.facebook = body.facebook;
    if(body.linkedin) profileFields.social.linkedin = body.linkedin;
    if(body.instagram) profileFields.social.instagram = body.instagram;

    Profile.findOne({ user: user.id})
        .then(profile => {
            if(profile) {
                //update
                Profile.findOneAndUpdate(
                    {user: user.id},
                    {$set: profileFields},
                    {new: true}
                    ).then(profile => res.json(profile))
            } else {
                //create
                //check if handle exists
                Profile.findOne({ handle: profileFields.handle})
                    .then(profile => {
                        if(profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        // Save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
            }
        })

});

module.exports = router;