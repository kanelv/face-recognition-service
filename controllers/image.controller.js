const Image = require('../models/image.model');
var fs = require('fs');

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

    let imageFile = req.files.img;
    let name = imageFile.name;
    console.log(name);
    var [idUser, idImg] = imageFile.name.split('_');
    idImg = idImg.split('.')[0]
    console.log(idUser);
    var imgPath = "./uploadImg/" + name;
    console.log(imgPath);

    const image = new Image({
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
},

// get number to assign idImg
exports.number = (req, res) =>{
    Image.findOne().sort({createdAt: -1}).exec(function(err, image){
        if (err) return res.status(500).send({
            message: err.message || 'Some error occured while get number Image'
        });        
        res.send(image.idImg);
    });
}

// get Imge by idUser
exports.getImagebyIdUser = (req, res) => {
    var idUser = req.params.idUser;
    Image.findOne({idUser: idUser}).sort({createdAt: -1}).exec(function(err, image){
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
}

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}