const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    idUser: String,
    fullName: String,
    email: String,
    address: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);