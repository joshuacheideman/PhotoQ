url = require('url');
http = require('http');
sql = require('sqlite3').verbose();
fs = require('fs');
var sizeOf = require('image-size');
var dbFile = "PhotoQ.db";
var db = new sql.Database(dbFile);
var data = fs.readFileSync("6whs.json");
if(!data) {
    console.log("cannot read 6whs.json");
}
else {
    var listObj = JSON.parse(data);
    imgList = listObj.photoURLs;
}
replace_cmd = "INSERT OR REPLACE INTO photoTags VALUES(";
    
    for(let i = 0;i<imgList.length;i++)
    {
	var options = url.parse(imgList[i]);
	http.get(options,function (response){
		var chunks=[];
		response.on('data',function(chunk){
			chunks.push(chunk);
		}).on('end',function() {
			var splitImg = imgList[i].split("/");
			var photoname = splitImg[splitImg.length-1];
			var buffer = Buffer.concat(chunks);
			var dimensions = sizeOf(buffer);
		        var replace = replace_cmd + i+", \""+photoname+"\","+dimensions.width+","+dimensions.height+",\"\" , \"\")";
			//console.log(replace);
		        db.run(replace,DataCallback);
		});
	});
    }
    

var index = 0;
function DataCallback(err)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        if(index<imgList.length)
            index++;
        if(index==imgList.length)
        {
            dumpDB();
            db.close();
        }
    }
}

function dumpDB() {
    db.all ( 'SELECT * FROM photoTags', dataCallback);
        function dataCallback( err, data ) {
          console.log(data) 
        }
  }
