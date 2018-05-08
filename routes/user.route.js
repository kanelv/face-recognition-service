module.exports = (app) => {
    const users = require('../controllers/user.controller');

    // Create a new User
    app.post('/users', users.create);

    // Retrieve a single User with userid
    app.get('/users/:userid', users.findOne);

    // Update a User with userid
    app.put('/users/:userid', users.update);

    // Delete a User with userid
    app.delete('/users/:UserId', users.delete);
}