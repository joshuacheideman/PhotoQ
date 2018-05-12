sql = require('sqlite3').verbose();
fs = require('fs');
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
        var splitImg = imgList[i].split("/");
        var photoname = splitImg[splitImg.length-1];
        var replace = replace_cmd + i+", \""+photoname+"\",\"\" , \"\")";
        db.run(replace,DataCallback);
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
        if(index==imgList.length-1)
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