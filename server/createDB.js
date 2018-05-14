sql = require('sqlite3').verbose();
var dbFile = "PhotoQ.db";
var db = new sql.Database(dbFile);
var drop_cmd = "DROP TABLE IF EXISTS photoTags";
db.run(drop_cmd,DropCallback);

function DropCallback(err)
{
	if(err)
	{
		console.log(err);
	}
	else
	{
		var create_cmd = "CREATE TABLE photoTags(idNum INTEGER UNIQUE NOT NULL PRIMARY KEY,fileName TEXT,width INTEGER, height INTEGER, landmark TEXT,tags TEXT)";
		db.run(create_cmd,CreateCallback);
	}
}
function CreateCallback(err)
{
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log("Created database");
		db.close();
	}
}
