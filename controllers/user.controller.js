import * as del from 'del';
import * as User from '../models/user.model.js';
import * as Image from '../models/image.model.js';
import * as ImageController from './image.controller.js';

const listResult = ImageController.listResult;

// Create new User
export const create = (req, res) => {
  if (!req.body.fullname) {
    res.status(400).send({
      message: 'User content can not be empty'
    });
  }

  const UserData = new User({
    userid: req.body.userid,
    fullname: req.body.fullname,
    email: req.body.email,
    class: req.body.class,
    address: req.body.address
  });

  UserData.save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occured while creating the User'
      });
    });
};

//  Find a single User with the specified userid in the request
export const findOne = (req, res) => {
  //   console.log('Okay');
  User.findOne({ userid: req.params.userid })
    .then(user => {
      if (!user) {
        res.status(404).send({
          message: `User not found with UserId ${req.params.userid}`
        });
      }
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving user with id ${err}`
      });
    });
};

// Update a User with the specified userid in the request and data update
export const update = (req, res) => {
  if (!req.body.fullname) {
    res.status(400).send({
      message: 'User fullname can not be empty'
    });
  }
  User.findOneAndUpdate(
    { userid: req.params.userid },
    {
      userid: req.params.userid,
      fullname: req.body.fullname,
      email: req.body.email,
      class: req.body.class,
      address: req.body.address
    }
  )
    .then(user => {
      if (!user) {
        res.status(404).send({
          message: `User not found with userid ${req.params.userid}`
        });
      }
      if (!listResult[req.params.userid]) {
        listResult[req.params.userid] = {
          user: {
            fullname: req.body.fullname,
            email: req.body.email,
            class: req.body.class,
            address: req.body.address
          }
        };
      } else {
        listResult[req.params.userid].user.fullname = req.body.fullname;
        listResult[req.params.userid].user.email = req.body.email;
        listResult[req.params.userid].user.class = req.body.class;
        listResult[req.params.userid].user.address = req.body.address;
      }
      // console.log(listResult[userid]);
      res.status(200).send({
        message: 'Update successfull'
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Error updating user with userid ${req.params.userid}`
      });
    });
};

// Delete a User with the specified userid in the request
export const deleteOne = (req, res) => {
  if (listResult[req.params.userid]) {
    delete listResult[req.params.userid];
  }

  User.findOneAndRemove({ userid: req.params.userid })
    .then(user => {
      if (!user) {
        res.status(400).send({
          message: `User not found with userid ${req.params.userid}`
        });
      }
      Image.remove({ userid: req.params.userid })
        .then(() => {
          del([`./uploadImg/${req.params.userid}_*.jpg`])
            .then(paths => {
              if (!paths) {
                res.status(400).send({
                  message: `Can not found image to delete by userid: ${
                    req.params.userid
                  }`
                });
              }
              res.status(200).send({
                message: `Successfully deleted have ${req.params.userid}`
              });
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message ||
                  `Error delete image with userid ${req.params.userid}`
              });
            });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message ||
              `Error remove image with userid ${req.params.userid}`
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Error removing user with userid ${req.params.userid}`
      });
    });
};

export const getAll = (req, res) => {
  User.find(
    {},
    {
      _id: 0,
      userid: 1,
      fullname: 1,
      email: 1,
      class: 1,
      address: 1
    }
  )
    .then(users => {
      if (users.length === 0) {
        res.status(400).send({
          message: 'Nothing images dependence userid'
        });
      } else {
        res.status(200).send({
          user: users
        });
      }
    })
    .catch(err => {
      throw err;
    });
};
