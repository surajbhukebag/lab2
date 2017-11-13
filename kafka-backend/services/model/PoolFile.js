var pool =  new require('./../mysql/customConnectionPool');

pool.getConnection(function(err, mongoose) {

	var Schema = mongoose.Schema;

	var fileSchema = new Schema({
	    name: String,
	    path: String,
	    isDirectory: Boolean,
	    createdBy: String,
	    dateCreated: Number,
	    isStarred: Boolean,
	    link: String
	});

	var File = mongoose.model('File', fileSchema);

	pool.release(mongoose);

	module.exports = File;

});



