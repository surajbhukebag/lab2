var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/dropbox");

var Schema = mongoose.Schema;

var sharedFileSchema = new Schema({
    sharedBy: String,
    sharedWith: String,
    file: {
    	id: String,
        name: String,
        path: String,
        isDirectory: Boolean,
        createdBy: String,
        dateCreated: Number,
        isStarred: Boolean,
        link: String
    },
    dateCreated: Number
});

var SharedFile = mongoose.model('SharedFile', sharedFileSchema);

module.exports = SharedFile;