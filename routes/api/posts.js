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
 * todo need to check if we need profile
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

/**
 * @route Post api/posts/like/:postId
 * @desc Like post
 * @access Private
 */
router.post('/like/:id',
    passport.authenticate('jwt', { session: false }),
    ({params, user}, res) => {
        Post.findById(params.id)
            .then(post => {
                if (post.likes.filter(like => like.user.toString() === user.id).length > 0) {
                    return res.status(400).json({alreadyliked: 'User already liked this post'})
                }

                //add user id to likes array
                post.likes.unshift({user: user.id});

                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postnotfound: 'no post found'}))
    });

/**
 * @route Post api/posts/unlike/:postId
 * @desc Unlike post
 * @access Private
 */
router.post('/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    ({params, user}, res) => {
        Post.findById(params.id)
            .then(post => {
                if (post.likes.filter(like => like.user.toString() === user.id).length === 0) {
                    return res.status(400).json({notliked: 'You have not yet liked this post'})
                }

                // Get remove
                const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(user.id);

                // Splice out of array
                post.likes.splice(removeIndex, 1);
                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postnotfound: 'no post found'}))
    });

/**
 * @route Post api/posts/comment/:postId
 * @desc Add comment to post
 * @access Private
 */
router.post('/comment/:id',
    passport.authenticate('jwt', { session: false }),
    ({params, user, body}, res) => {
    const {errors, isValid} = validatePostInput(body);

    //Check Validation
    if (!isValid) {
        //Return errors
        return res.status(400).json(errors);
    }

    Post.findById(params.id)
        .then(post => {
            const newComment = {
                text: body.text,
                name: body.name,
                avatar: body.avatar,
                user: user.id
            };

            // Add to comments array
            post.comments.unshift(newComment);

            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}))
});

/**
 * @route Delete api/posts/comment/:postId/:commentId
 * @desc Remove comment from post
 * @access Private
 */
router.delete('/comment/:postId/:commentId',
    passport.authenticate('jwt', { session: false }),
    ({params, user, body}, res) => {

        Post.findById(params.postId)
            .then(post => {

                // Add to comments array
                const removeIndex = post.comments.findIndex(comment => comment.id.toString() === params.commentId);
                if (removeIndex < 0) {
                    res.status(404).json({ commentnotfound: 'Comment does not exists'});
                    return;
                }

                // Splice out of array
                post.comments.splice(removeIndex, 1);
                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postnotfound: 'No post found'}))
    });

module.exports = router;