const User = require('../models/user.model');

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
        console.log(req.body.address)
    }
    var userid = req.body.userid;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var address = req.body.address;
    
    var UserData =  new User({
        userid: userid,
        fullname: fullname,
        email: email,
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

    User.findOneAndUpdate({userid: userid}, {
        userid: userid,
        fullname: req.body.fullname,
        email: req.body.email,
        address: req.body.address
    }).then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with userid " + userid
            })
        }
        res.send(user);
    }).catch(err => {
        return res.status(500).send({
            message: "Error updating user with userid " + userid
        });
    });
}

// Delete a User with the specified userid in the request
exports.delete = (req, res) => {

}
