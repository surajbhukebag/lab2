var mongoose = require('mongoose');

let pool = [];
let poolCreated = false;
module.exports = new ConnectionManager();

function ConnectionManager() {

    if (!poolCreated) {
        for (var i = 0; i < 10; i++) {
        	console.log("Creating connection ------------------------------------------------------------------------------------")
            pool.push(mongoose.connect("mongodb://localhost:27017/dropbox"));
        }
        poolCreated = true;
    }
    console.log(poolCreated)
}

ConnectionManager.prototype.getConnection = function(done) {
	console.log("getConnection : ------------------------------------------- "+pool.length);
    if (pool.length > 0) {    	
        done(null,pool.pop());
        console.log("g0tConnection : ---------------------------- "+pool.length);
    } else {
       	let waitForConnection = setInterval(function() {
            if(!pool.isEmpty()) {
                clearInterval(waitForConnection);
                done(null,pool.pop());
            }
        }, 100);
    }
}

ConnectionManager.prototype.release = function(connection) {
	console.log("old size : "+pool.length);
    pool.push(connection);
    console.log("new size : "+pool.length);
}