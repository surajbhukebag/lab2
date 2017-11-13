var pool = new require('./../mysql/customConnectionPool');

pool.getConnection(function(err, mongoose) {
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

});