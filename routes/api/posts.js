const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
//Validation
const validatePostInput = require('../../validation/post');

/**
 * @route GET api/posts/test
 * @desc Test post route
 * @access Public
 */
router.get('/test', (req, res) => res.json({a: 'test posts'}));

/**
 * @route Get api/posts/
 * @desc Get posts
 * @access Public
 */
router.get('/', (req, res) => {
   Post.find()
       .sort({date: -1})
       .then(posts => res.json(posts))
       .catch(err => res.status(404).json({nopostsfound: 'No posts found with that id'}))
});

/**
 * @route Get api/posts/:id
 * @desc Get post by id
 * @access Public
 */
router.get('/:id', ({params}, res) => {
    Post.findById(params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound: 'No post found with that id'}))
});

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

/**
 * @route Delete api/posts/:id
 * @desc Delete post
 * @access Private
 */
router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    ({params, user}, res) => {
        Profile.findOne({ user: user.id })
            .then(profile => {
                Post.findById(params.id)
                    .then(post => {
                        //check for post owner
                        if(post.user.toString() !== user.id) {
                            return res.status(401).json({notauthorized: 'User not authorized'})
                        }

                        post.remove().then(() => res.json({success: true}))
                    })
                    .catch(err => res.status(404).json({ postnotfound: 'no post found'}))
            })
    });

module.exports = router;