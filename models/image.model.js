import * as mongoose from 'mongoose';

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

export default mongoose.model('Image', ImgSchema);
