var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/dropbox");

var Schema = mongoose.Schema;

var fileLinkSchema = new Schema({
    linkString: String,
    fileId: String,
    createdBy: String,
    dateCreated: Number
});

var FileLink = mongoose.model('FileLink', fileLinkSchema);

module.exports = FileLink;