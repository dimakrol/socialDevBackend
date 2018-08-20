const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load User model
const User = require('../../models/Users');

/**
 * @route GET api/users/test
 * @desc Test users route
 * @access Public
 */
router.get('/test', (req, res) => res.json({a: 'test users'}));

/**
 * @route GET api/users/register
 * @desc Register user
 * @access Public
 */
router.post('/register', ({body}, res) => {
    User.findOne({ email: body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'Email already exists'})
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

module.exports = router;