var mySQL = require("mysql");
var config = require("../config.json");


function Database()
{
	//console.log("creating new instance of Database");
	this.pool = mySQL.createPool(config.database);
	
	this.query = function(sql, values, cb)
	{
		this.pool.getConnection(function(err, conn) {
			if(err) {
				console.error("Database: Can't connect to database");
				return cb(err);
			}
			
			//console.log("Database: connected - id=" + conn.threadId);
			
			conn.query(sql, values, function(err, result) {
				//console.log("Database: releasing connection - id=" + conn.threadId);
				conn.removeListener("error", onError);
				conn.release();
				
				cb(err, result);
			});
			
			conn.on("error", onError);
			
			function onError(err) {
				console.error("Database: Connection error");
				conn.removeListener("error", onError);
				conn.release();
				return cb(err);
			}
		});
	}
}


module.exports = new Database();
