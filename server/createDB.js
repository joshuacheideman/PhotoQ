sql = require('sqlite3').verbose();
var dbFile = "PhotoQ.db";
var db = new sql.Database(dbFile);
create_cmd = "CREATE TABLE photoTags(idNum INTEGER UNIQUE NOT NULL PRIMARY KEY,fileName TEXT,landmark TEXT,tags TEXT)";
db.run(create_cmd,CreateCallback);
function CreateCallback(err)
{
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log("Created database");
	}
}
