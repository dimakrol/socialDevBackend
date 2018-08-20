const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secretOrKey} = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User model
const User = require('../../models/Users');

/**
 * @route GET api/users/test
 * @desc Test users route
 * @access Public
 */
router.get('/test', (req, res) => res.json({a: 'test users'}));

/**
 * @route POST api/users/register
 * @desc Register user
 * @access Public
 */
router.post('/register', ({body}, res) => {
    const {errors, isValid} = validateRegisterInput(body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: body.email})
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors)
            } else {
                const avatar = gravatar.url(body.email, {
                    s: '200', //size
                    r: 'pg', //rating,
                    d: 'mm', //Default
                });

                const newUser = new User({
                    name: body.name,
                    email: body.email,
                    avatar,
                    password: body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
});

/**
 * @route POST api/users/login
 * @desc Login user / Return JWT Token
 * @access Public
 */
router.post('/login', ({body}, res) => {
    const {errors, isValid} = validateLoginInput(body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = body.email;
    const password = body.password;

    // find user by email
    User.findOne({email})
        .then(user => {
            // Check user exists
            if (!user) {
                errors.email = 'User not found';
                res.status(404).json(errors);
            }

            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // user matched

                        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

                        // Sign Token
                        jwt.sign(
                            payload,
                            secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                })
                            });
                        // res.json({msg: 'Success'})
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors)
                    }
                })
        })
});

/**
 * @route GET api/users/current
 * @desc Return current user
 * @access Private
 */
router.get('/current', passport.authenticate('jwt', { session: false}), ({user}, res) => {
    res.json({
        name: user.name,
        email: user.email
    })
});

module.exports = router;