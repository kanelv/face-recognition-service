const mongoose = require("mongoose");

const ImgSchema = mongoose.Schema({
    idUser: String,
    idImg: String,
    imgPath: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', ImgSchema);