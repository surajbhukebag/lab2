var pool = new require('./../mysql/customConnectionPool');

pool.getConnection(function(err, mongoose) {

    var Schema = mongoose.Schema;

    var fileLinkSchema = new Schema({
        linkString: String,
        fileId: String,
        createdBy: String,
        dateCreated: Number
    });

    var FileLink = mongoose.model('FileLink', fileLinkSchema);

    module.exports = FileLink;

});