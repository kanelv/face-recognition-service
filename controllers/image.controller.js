const Image = require('../models/image.model');
const User = require('../models/user.model')
const fs = require('fs');

var listResult = [];
module.exports.listResult = listResult;

var imageUpdate = [];

// Create and Save a new Image
exports.create = (req, res) => {
    console.error("Hey! This is your image");

    if (!req.files) {
        return res.status(400).send({
            message: "No files were uploaded"
        });
    } else {
        console.log(req.files);
    }

    var imageFile = req.files.img;

    var userid = imageFile.name.split('_')[0];

    // new user
    new Promise((resolve, reject) => {
        // save image
        getNumber().then(number => {
            var imgid = (number + 1).toString();
            var imgpath = "./uploadImg/" + userid + "_" + imgid + ".jpg";
            console.log(imgpath);

            var image = new Image({
                userid: userid || "Unid User",
                imgid: imgid,
                imgpath: imgpath
            });

            imageFile.mv(imgpath, (err, image) => {
                if (err) return res.status(500).send(err);
                console.log('save file here');
            });
            image.save().then(data => {
                var imageName = image.userid + '_' + image.imgid + '.jpg';
                var base64str = base64_encode(image.imgpath);
                var createdAt = image.createdAt;
                return {
                    imageName: imageName,
                    base64str: base64str,
                    createdAt: createdAt
                };                
            }).then(image => {
                console.log("That is image");
                // console.log(image);
                // check userid existed
                User.findOne({ userid: userid }).then(data => {

                    console.log(userid);
                    if (!data) {
                        var fullname = "No Name";
                        var email = "example" + userid + "@dn.com";
                        var classA = "No Class";
                        var address = "No address";

                        var UserData = new User({
                            userid: userid,
                            fullname: fullname,
                            email: email,
                            class: classA,
                            address: address
                        });

                        UserData.save().then(data => {
                            console.log("create new user");
                            var fullname = data.fullname;
                            var email = data.email;
                            var classA = data.class;
                            var address = data.address;
                            var user = {
                                fullname: fullname,
                                email: email,
                                class: classA,
                                address: address
                            };
                            resolve({
                                image: image,
                                user: user
                            });
                        }).catch(err => {
                            return res.status(500).send({
                                message: err.message || "Some error occured while creating the User"
                            });
                        });
                    } else {
                        var fullname = data.fullname;
                        var email = data.email;
                        var classA = data.class;
                        var address = data.address;
                        var user = {
                            fullname: fullname,
                            email: email,
                            class: classA,
                            address: address
                        };
                        console.log(image);

                        // add userid into imageUpdate
                        imageUpdate.push(userid);
                        resolve({
                            image: image,
                            user: user
                        });
                    }
                }).catch(err => {
                    return res.status(500).send({
                        message: err.message || "Some error occured while creating the User"
                    });
                });
            }).catch(err => {
                return res.status(500).send({
                    message: err.message || "Some error occured while creating the User"
                });
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating the Image on Database"
            });
        });
    }).then(data => {
        // Process in to listResult array
        imageUpdate = Array.from(new Set(imageUpdate));
        console.log(imageUpdate);
        listResult[userid] = data;        
        res.status(200).send({
            message: "add image successfull"
        });
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Some error occured while creating the User"
        });
    });
}

// list all
exports.listAll = (req, res) => {

    var userids = [];
    console.log(req.params);
    if(!req.params.userids){
        userids = [];
    } else {
        userids = req.params.userids.split(',');
    }    

    new Promise((resolve, reject) => {        

        console.log(userids);
        if(imageUpdate.length > 0) {            
            console.log(array_diff(userids, imageUpdate));            
            resolve(array_diff(userids, imageUpdate));
        } else {
            resolve(userids);
        }
        if (userids == undefined) {
            reject({
                message: "userids cannot empty"
            })
        }
    }).then(data => {        
        for (var k in listResult) {
            if(!data.includes(k)) {                
                res.write(JSON.stringify(listResult[k]) + ",");
            }
        }
    }).then(() => {
        // res.write("}")
        res.end();
    }).catch(err => {
        throw err;
    });
}

// get number to assign imgid
exports.number = (req, res) => {
    Image.findOne().sort({ createdAt: -1 }).exec(function (err, image) {
        if (err) return res.status(500).send({
            message: err.message || 'Some error occured while get number Image'
        });
        res.send(image.imgid);
    });
}

// get Imge last of User by userid
exports.findOne = (req, res) => {
    var userid = req.params.userid;
    console.log(userid);

    new Promise((resolve, reject) => {

        // find image and covert base64
        Image.findOne({ userid: userid }).sort({ createdAt: -1 }).exec(function (err, image) {
            if (err) reject(err)
            else {
                var imageName = image.userid + '_' + image.imgid + '.jpg';
                var base64str = base64_encode(image.imgpath);
                var createdAt = image.createdAt;
                var img = {
                    imageName: imageName,
                    base64str: base64str,
                    createdAt: createdAt
                };
                resolve(img);
            }
        });
    }).then(img => {
        // find user and response
        User.findOne({ userid: userid }).exec(function (err, data) {
            if (err) res.status(500).send({
                message: err.message || 'Some error occured while get image by userid'
            });
            else
                var fullname = data.fullname;
            var email = data.email;
            var classA = data.class;
            var address = data.address;
            res.status(200).send({
                img: img,
                user: {
                    fullname: fullname,
                    email: email,
                    class: classA,
                    address: address
                }
            });
        });
    }).catch(err => {
        throw err;
        res.status(500).send({
            message: err.message
        });
    });
}

exports.delete = (req, res) => {
    var imgid = req.params.imgid;
    Image.findOneAndRemove({ imgid: imgid })
        .then(image => {
            if (!image) {
                return res.status(404).send({
                    message: "Image not found with imgid" + imgid
                });
            }

            try {
                fs.unlinkSync(image.imgpath);
                return res.status(200).send({
                    message: "Successfully deleted " + image.userid + "_" + image.imgid + ".jpg"
                })
            } catch (err) {
                throw err
            }
        }).catch( err => {
            throw err;
        });
}

// get date of all image by userid
exports.getDates = (req, res) => {
    var userid = req.params.userid;
    var dates = []
    console.log("get images dates have " + userid);
    Image.find({userid: userid}).then(images => {
        if(images.length == 0){
            return res.status(400).send({
                message: "Nothing images dependence userid"
            });
        } else {
            images.forEach( image => {
                let date = image.createdAt.toJSON()
                dates.push(date);                
            })
            res.status(200).send({
                dates: dates
            });                       
        }    
    }).catch( err => {
        throw err;
    });
}

// get number Image to set imgid
function getNumber() {
    return new Promise((resolve, reject) => {
        Image.findOne().sort({ createdAt: -1 }).exec(function (err, image) {
            if (err) reject(err);
            else if (!image)
                resolve(0)
            else
                resolve(parseInt(image.imgid));
        })
    })
}

// cover image to base64 string
function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

// get the difference between two arrays right
function array_diff(a1, a2) {
	var a = [], diff = [];
	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;				
    }

	for (var i = 0; i < a2.length; i++) {        
		if(a[a2[i]])
            delete a[a2[i]];
            delete a2[i];        
	}
	
	for (var k in a) {
		diff.push(k);
    }
    
	return diff;
}