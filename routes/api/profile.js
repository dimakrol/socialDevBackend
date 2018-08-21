const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Model
const User = require('../../models/Users');
//Load Profile Validator
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');

/**
 * @route GET api/profile/test
 * @desc Test profile route
 * @access Public
 */
router.get('/test', (req, res) => res.json({a: 'test profile'}));

/**
 * @route GET api/profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
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
 * @route GET api/profile/all
 * @desc Get all profiles
 * @access Public
 */
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noprofiles = 'There are no profiles';
                return res.status(404).json(errors)
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({noprofiles: 'There are no profiles'}))

});

/**
 * @route GET api/profile/handle/:handle
 * @desc Get profile by handle
 * @access Public
 */
router.get('/handle/:handle', ({params}, res) => {
    const errors = {};
    Profile.findOne({ handle: params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
});

/**
 * @route GET api/profile/user/:user_id
 * @desc Get profile by user id
 * @access Public
 */
router.get('/user/:user_id', ({params}, res) => {
    const errors = {};
    Profile.findOne({ user: params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'}))
});

/**
 * @route Post api/profile
 * @desc Create or Edit user profile
 * @access Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), ({body, user}, res) => {
    const {errors, isValid} = validateProfileInput(body);

    //Check Validation
    if (!isValid) {
        //Return errors
        return res.status(400).json(errors);
    }

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

/**
 * @route Post api/profile/experience
 * @desc Add experience to profile
 * @access Private
 */
router.post('/experience',
    passport.authenticate('jwt', { session: false }),
    ({user, body}, res) => {
    const {errors, isValid} = validateExperienceInput(body);

    //Check Validation
    if (!isValid) {
        //Return errors
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: user.id })
        .then(profile => {
            const newExp = {
                title: body.title,
                company: body.company,
                location: body.location,
                from: body.from,
                to: body.to,
                current: body.current,
                description: body.description
            };

            // Add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        })
});

module.exports = router;