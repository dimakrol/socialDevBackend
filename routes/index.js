const users = require('./api/users');
const profile = require('./api/profile');
const posts = require('./api/posts');

module.exports = (app) => {
    //api routes
    app.use('/api/users', f, users);
    app.use('/api/profile', profile);
    app.use('/api/posts', posts);
};

function f(req, res, next) {
    console.log('additional middleware');
    next()
}