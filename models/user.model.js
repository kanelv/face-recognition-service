const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', UserSchema);
