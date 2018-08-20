const users = require('./api/users');
const profile = require('./api/profile');
const posts = require('./api/posts');

module.exports = (app) => {
    //api routes
    app.use('/api/users', users);
    app.use('/api/profile', profile);
    app.use('/api/posts', posts);
};