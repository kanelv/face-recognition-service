import * as mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    userid: String,
    fullname: String,
    email: String,
    class: String,
    address: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', UserSchema);
