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
        var idUser = imageFile.name.split('_')[0]
        var idImg = number + 1
        var imgPath = "./uploadImg/" + idUser + "_" + idImg + ".jpg";
        console.log(imgPath);

        var image = new Image({
            idUser: idUser || "Unid User",
            idImg: idImg,
            imgPath: imgPath
        });

        imageFile.mv(imgPath, (err, image) => {
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

// get number to assign idImg
exports.number = (req, res) =>{
    Image.findOne().sort({createdAt: -1}).exec(function(err, image){
        if (err) return res.status(500).send({
            message: err.message || 'Some error occured while get number Image'
        });        
        res.send(image.idImg);
    });
}

// get Imge last of User by idUser
exports.findOne = (req, res) => {
    var idUser = req.params.idUser;
    console.log(idUser);
    Image.findOne({idUser: idUser}).sort({createdAt: -1}).exec(function(err, image) {
        if (err) return res.status(500).send({
            message: err.message || 'Some error occured while get image by idUser'
        });
        imageName = image.idUser + '_' + image.idImg + '.jpg';
        base64str = base64_encode(image.imgPath)
        res.send({
            imageName: imageName,
            base64str: base64str
        })
    })

    // Image.find({idUser: idUser}).sort({createdAt: -1}).then(data => {
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
     
    // Image.findOne({idUser: idUser}).then(data => {
    //     data.sort({createdAt: -1}).then(data => {
    //         imageName = image.idUser + '_' + image.idImg + '.jpg';
    //         base64str = base64_encode(image.imgPath)
    //         res.send({
    //             imageName: imageName,
    //             base64str: base64str
    //         })
    //     }).catch(err => {
    //         res.status(500).send({
    //             message: err.message || 'Some error occured while get image by idUser'
    //         })
    //     })
    // }).catch(err => {
    //     res.status(500).send({
    //         message: "User is not exist"
    //     })
    // });
}

exports.delete = (req, res) => {
    var idImg = req.params.idImg;
    Image.findOneAndRemove({idImg: idImg})
    .then(image => {
        if(!image) {
            return res.status(404).send({
                message: "Image not found with idImg" + idImg
            });
        }

        try {
            fs.unlinkSync(image.imgPath);
            return res.status(200).send({
                message: "Successfully deleted " + image.idUser + "_" + image.idImg + "jpg"
            })
        } catch (err) {
            throw err
        }
    })
}

// get number Image to ser idImg
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