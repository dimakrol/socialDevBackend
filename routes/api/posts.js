const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
//Validation
const validatePostInput = require('../../validation/post');

/**
 * @route GET api/posts/test
 * @desc Test post route
 * @access Public
 */
router.get('/test', (req, res) => res.json({a: 'test posts'}));

/**
 * @route Post api/posts
 * @desc Create post
 * @access Private
 */
router.post('/',
    passport.authenticate('jwt', { session: false }),
    ({body, user}, res) => {

        const {errors, isValid} = validatePostInput(body);

        //Check Validation
        if (!isValid) {
            //Return errors
            return res.status(400).json(errors);
        }

        const newPost = new Post({
            text: body.text,
            name: body.name,
            avatar: body.avatar,
            user: user.id
        });

        newPost.save()
            .then(post => res.json(post))
        });

module.exports = router;