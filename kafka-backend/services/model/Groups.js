var mongoose = require('mongoose');

//mongoose.connect("mongodb://localhost:27017/dropbox");

var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name: String,
    createdBy: String,
    members: { type : Array , "default" : [] },
    files: [{fileId: String}]
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;