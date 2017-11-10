var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/dropbox");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, required: true, unique : true},
    password: {type : String, required : true},
    personalInfo: {contactNumber: String, dob: Number},
    educationInfo: {college: String, sdate: Number, edate: Number, major: String, gpa: Number},
    userInterests: [{name: String, comment: String}]
});

var User = mongoose.model('User', userSchema);

module.exports = User;