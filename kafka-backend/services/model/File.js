var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/dropbox");

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    name: String,
    path: String,
    isDirectory: Boolean,
    createdBy: String,
    dateCreated: Number,
    isStarred: Boolean,
    link: String
});

var File = mongoose.model('File', fileSchema);

module.exports = File;