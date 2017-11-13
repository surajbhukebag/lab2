var pool = new require('./../mysql/customConnectionPool');

pool.getConnection(function(err, mongoose) {

    var Schema = mongoose.Schema;

    var groupSchema = new Schema({
        name: String,
        createdBy: String,
        members: { type: Array, "default": [] },
        files: [{ fileId: String }]
    });

    var Group = mongoose.model('Group', groupSchema);

    module.exports = Group;

});