var mongoose = require('mongoose');

//mongoose.connect("mongodb://localhost:27017/dropbox");

var Schema = mongoose.Schema;

var lifeEventsSchema = new Schema({
    userId: String,
    fileCount: Number,
    fodlerCount: Number,
    downloadCount: Number,
    shareLinkCount: Number,
    shareFileFolderCount: Number
});

var LifeEvents = mongoose.model('LifeEvents', lifeEventsSchema);

module.exports = LifeEvents;