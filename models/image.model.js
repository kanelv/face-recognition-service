const mongoose = require("mongoose");
console.log('models here');
const ImgSchema = mongoose.Schema({
    idUser: String,
    idImg: String,
    imgPath: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', ImgSchema);