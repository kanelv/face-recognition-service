import { create, findOne, update, deleteOne, getAll }  from "../controllers/user.controller.js";

export const userRoute = app => {
  // Create a new User
  app.post('/users', create);

  // Retrieve a single User with userid
  app.get('/users/:userid', findOne);

  // Update a User with userid
  app.put('/users/:userid', update);

  // Delete a User with userid
  app.delete('/users/:userid', deleteOne);

  // get all User in database
  app.get('/all', getAll);
};
