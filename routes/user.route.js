const users = require('../controllers/user.controller');

module.exports = app => {
  // Create a new User
  app.post('/users', users.create);

  // Retrieve a single User with userid
  app.get('/users/:userid', users.findOne);

  // Update a User with userid
  app.put('/users/:userid', users.update);

  // Delete a User with userid
  app.delete('/users/:userid', users.delete);

  // get all User in database
  app.get('/all', users.getAll);
};
