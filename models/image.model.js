const mongoose = require("mongoose");

const ImgSchema = mongoose.Schema({
    UserId: String,
    ImgId: String,
    ImgPath: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', ImgSchema);