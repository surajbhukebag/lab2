var mysql = require('mysql');

module.exports = new ConnectionManager();

function ConnectionManager() {
    this.pool = [];
    if (!this.poolCreated) {
        for (var i = 0; i < 10; i++) {
        	console.log("Creating connection ------------------------------------------------------------------------------------")
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'dropbox',
                port: 3306
            });
            this.pool.push(connection);
        }
        this.poolCreated = true;
    }
    console.log(this.poolCreated)
}

ConnectionManager.prototype.getConnection = function(done) {
	console.log("getConnection : ------------------------------------------- "+this.pool.length);
    if (this.pool.length > 0) {    	
        done(null,this.pool.pop());
        console.log("g0tConnection : ---------------------------- "+this.pool.length);
    } else {
       	var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'dropbox',
                port: 3306
            });
        this.pool.push(connection);
        done(null,this.pool.pop());
    }
}

ConnectionManager.prototype.release = function(connection) {
	console.log("old size : "+this.pool.length);
    this.pool.push(connection);
    console.log("new size : "+this.pool.length);
}