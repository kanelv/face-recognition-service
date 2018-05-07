module.exports = (app) => {
    const users = require('../controllers/user.controller');

    // Create a new User
    app.post('/users', users.create);

    // Retrieve a single User with idUser
    app.get('/users/:UserId', users.findOne);

    // Update a User with UserId
    app.put('/users/:UserId', users.update);

    // Delete a User with UserId
    app.delete('/users/:UserId', users.delete);
}