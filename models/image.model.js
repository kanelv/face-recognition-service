const mongoose = require('mongoose');

const ImgSchema = mongoose.Schema(
  {
    userid: String,
    imgid: String,
    imgpath: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Image', ImgSchema);
