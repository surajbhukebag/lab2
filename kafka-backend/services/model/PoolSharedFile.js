var pool = new require('./../mysql/customConnectionPool');

pool.getConnection(function(err, mongoose) {
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

});