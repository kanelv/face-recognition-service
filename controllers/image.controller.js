const Image = require('../models/image.model');
const fs = require('fs');

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
    getNumber().then( number => {
        var userid  = imageFile.name.split('_')[0]
        var imgid   = (number + 1).toString();
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
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating the Image on Database"
            });
        });
    });
}

// get number to assign imgid
exports.number = (req, res) =>{
    Image.findOne().sort({createdAt: -1}).exec(function(err, image){
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
    Image.findOne({userid: userid}).sort({createdAt: -1}).exec(function(err, image) {
        if (err) return res.status(500).send({
            message: err.message || 'Some error occured while get image by userid'
        });
        imageName = image.userid + '_' + image.imgid + '.jpg';
        base64str = base64_encode(image.imgpath)
        res.send({
            imageName: imageName,
            base64str: base64str
        })
    })

    // Image.find({userid: userid}).sort({createdAt: -1}).then(data => {
    //     console.log(data);
    //     res.send({
    //         notify: "successful"
    //     })
    // }).catch(err => {
    //     console.log(err);
    //     res.send({
    //         notify: "Error dcm"
    //     })
    // })
     
    // Image.findOne({userid: userid}).then(data => {
    //     data.sort({createdAt: -1}).then(data => {
    //         imageName = image.userid + '_' + image.imgid + '.jpg';
    //         base64str = base64_encode(image.imgpath)
    //         res.send({
    //             imageName: imageName,
    //             base64str: base64str
    //         })
    //     }).catch(err => {
    //         res.status(500).send({
    //             message: err.message || 'Some error occured while get image by userid'
    //         })
    //     })
    // }).catch(err => {
    //     res.status(500).send({
    //         message: "User is not exist"
    //     })
    // });
}

exports.delete = (req, res) => {
    var imgid = req.params.imgid;
    Image.findOneAndRemove({imgid: imgid})
    .then(image => {
        if(!image) {
            return res.status(404).send({
                message: "Image not found with imgid" + imgid
            });
        }

        try {
            fs.unlinkSync(image.imgpath);
            return res.status(200).send({
                message: "Successfully deleted " + image.userid + "_" + image.imgid + "jpg"
            })
        } catch (err) {
            throw err
        }
    })
}

// get number Image to ser imgid
function getNumber() {
    return new Promise((resolve, reject) => {
        Image.findOne().sort({createdAt: -1}).exec(function(err, image) {
            if (err) reject(err);
            else if(!image)
                resolve(0)
                else
                resolve(parseInt(image.imgid));
        })
    })
}

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}