const User = require('../models/user.model');
const Image = require('../models/image.model');
var listResult = require('./image.controller').listResult;
const del = require('del');
// Create new User
exports.create = (req, res) => {
    console.error("Hey! This is new user");

    if(!req.body.fullname){
        return res.status(400).send({
            message: "User content can not be empty"
        });
    } else {        
        console.log(req.body.userid)
        console.log(req.body.fullname)
        console.log(req.body.email)
        console.log(req.body.class)
        console.log(req.body.address)
    }
    var userid = req.body.userid;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var classA = req.body.class;
    var address = req.body.address;
    
    var UserData =  new User({
        userid: userid,
        fullname: fullname,
        email: email,
        class: classA,
        address: address
    });

    UserData.save().then(data => {
        res.send(data);
    }).catch(err => {                
            return res.status(500).send({
                message: err.message || "Some error occured while creating the User"
            });        
    });
}

//  Find a single User with the specified userid in the request
exports.findOne = (req, res) => {
    console.log("Okay")
    var userid = req.params.userid    
    User.findOne({userid: userid})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with UserId " + userid
            });
        }
        res.status(200).send(user);
    }).catch(err => {
        return res.status(500).send({
            message: "Error retrieving user with id " + userid
        });
    })
}

// Update a User with the specified userid in the request and data update
exports.update = (req, res) => {
    
    if(!req.body.fullname) {
        return res.status(400).send({
            message: "User fullname can not be empty"
        });
    }
    var userid = req.params.userid;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var classA = req.body.class;
    var address = req.body.address;
    
    User.findOneAndUpdate({userid: userid}, {
        userid: userid,
        fullname: fullname,
        email: email,
        class: classA,
        address: address
    }).then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with userid " + userid
            })
        } else {
            if(!listResult[userid]){
                listResult[userid] = {user:{
                    fullname: fullname,
                    email: email,
                    class: classA,
                    address: address    
                }}
            } else {
                listResult[userid].user.fullname = fullname;
                listResult[userid].user.email = email;
                listResult[userid].user.class = classA;
                listResult[userid].user.address = address;
            }
        };
        console.log(listResult[userid])
        res.status(200).send({
            message: "Update successfull"
        });
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Error updating user with userid " + userid
        });
    });
}

// Delete a User with the specified userid in the request
exports.delete = (req, res) => {
    var userid = req.params.userid;
    
    if(listResult[userid]){
        delete listResult[userid];
    }

    User.findOneAndRemove({userid: userid})
    .then(user => {
        if(!user) {
            return res.status(400).send({
                message: "User not found with userid " + userid
            });
        }
        Image.remove({userid: userid})
        .then(() => {
            del(["./uploadImg/"+ userid + "_*.jpg"])
            .then(paths => {
                if(!paths){
                    return res.status(400).send({
                        message: "Can not found image to delete by userid: " + userid
                    });
                }
                return res.status(200).send({
                    message: "Successfully deleted have " + userid        
                });            
            }).catch(err => {
                return res.status(500).send({
                    message: err.message || "Error delete image with userid " + userid
                });
            });
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Error remove image with userid " + userid
            });
        });
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Error removing user with userid " + userid
        });
    })
}

exports.getAll = (req, res) => {        

    User.find({}, {
        _id: 0,
        userid: 1,
        fullname: 1,
        email: 1,
        class: 1,
        address: 1
    }).then(users => {
        console.log(users);
        if(users.length == 0){
            return res.status(400).send({
                message: "Nothing images dependence userid"
            });
        } else {
            res.status(200).send({
                user: users
            });
        }
    }).catch(err => {
        throw err;
    })
}