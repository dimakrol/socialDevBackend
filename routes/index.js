const users = require('./api/users');

const profile = require('./api/profile');

const posts = require('./api/posts');


module.exports = (app) => {
    //api routes
    //here we can set additional middleware
    app.use('/api/users', users);
    app.use('/api/profile', profile);
    app.use('/api/posts', posts);
};

// function f(req, res, next) {
//     console.log('additional middleware');
//     next()
// }