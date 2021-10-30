var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');


var userSchema = new Schema({
    name: { type: String },
    emails: { type: String, unique: true },
    username: { type: String, minlength: 5},
    photo: { type: String },

},{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);