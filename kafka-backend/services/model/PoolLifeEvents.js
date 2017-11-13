var pool = new require('./../mysql/customConnectionPool');

pool.getConnection(function(err, mongoose) {

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

});