const Image = require('../models/image.model');

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
}