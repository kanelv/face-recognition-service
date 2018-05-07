const Image = require('../models/image.model');
const fs = require('fs');

// Create and Save a new Image
exports.create = (req, res) => {
    console.error("Hey! This is your image");

    if (!req.files) {
        return res.status(400).send({
            message: "No files ware uploaded"
        });
    } else { 
        console.log(req.files); 
    }
    
    var imageFile = req.files.img;
    getNumber().then( number => {
        var UserId = imageFile.name.split('_')[0]
        var ImgId = number + 1
        var ImgPath = "./uploadImg/" + UserId + "_" + ImgId + ".jpg";
        console.log(ImgPath);

        var image = new Image({
            UserId: UserId || "Unid User",
            ImgId: ImgId,
            ImgPath: ImgPath
        });

        imageFile.mv(ImgPath, (err, image) => {
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

// get number to assign ImgId
exports.number = (req, res) =>{
    Image.findOne().sort({createdAt: -1}).exec(function(err, image){
        if (err) return res.status(500).send({
            message: err.message || 'Some error occured while get number Image'
        });        
        res.send(image.ImgId);
    });
}

// get Imge last of User by UserId
exports.findOne = (req, res) => {
    var UserId = req.params.UserId;
    console.log(UserId);
    Image.findOne({UserId: UserId}).sort({createdAt: -1}).exec(function(err, image) {
        if (err) return res.status(500).send({
            message: err.message || 'Some error occured while get image by UserId'
        });
        imageName = image.UserId + '_' + image.ImgId + '.jpg';
        base64str = base64_encode(image.ImgPath)
        res.send({
            imageName: imageName,
            base64str: base64str
        })
    })

    // Image.find({UserId: UserId}).sort({createdAt: -1}).then(data => {
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
     
    // Image.findOne({UserId: UserId}).then(data => {
    //     data.sort({createdAt: -1}).then(data => {
    //         imageName = image.UserId + '_' + image.ImgId + '.jpg';
    //         base64str = base64_encode(image.ImgPath)
    //         res.send({
    //             imageName: imageName,
    //             base64str: base64str
    //         })
    //     }).catch(err => {
    //         res.status(500).send({
    //             message: err.message || 'Some error occured while get image by UserId'
    //         })
    //     })
    // }).catch(err => {
    //     res.status(500).send({
    //         message: "User is not exist"
    //     })
    // });
}

exports.delete = (req, res) => {
    var ImgId = req.params.ImgId;
    Image.findOneAndRemove({ImgId: ImgId})
    .then(image => {
        if(!image) {
            return res.status(404).send({
                message: "Image not found with ImgId" + ImgId
            });
        }

        try {
            fs.unlinkSync(image.ImgPath);
            return res.status(200).send({
                message: "Successfully deleted " + image.UserId + "_" + image.ImgId + "jpg"
            })
        } catch (err) {
            throw err
        }
    })
}

// get number Image to ser ImgId
function getNumber() {
    return new Promise((resolve, reject) => {
        Image.count().exec(function(err, number) {
            if (err) reject(err);
            else resolve(number);
        })
    })
}

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}