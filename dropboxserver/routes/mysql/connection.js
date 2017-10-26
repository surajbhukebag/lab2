var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'dropbox',
	    port	 : 3306
	});
	return connection;
}
exports.getConnection = getConnection;
/*var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'dropbox',
    port     : 3306
});

module.exports.pool = pool;*/


