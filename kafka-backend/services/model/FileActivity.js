var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/dropbox");

var Schema = mongoose.Schema;

var fileactivitySchema = new Schema({
    userId: String,
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

var FileActivity = mongoose.model('FileActivity', fileactivitySchema);

module.exports = FileActivity;