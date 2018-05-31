//Node module for working with a request to an API or other fellow-server
var APIrequest = require('request');
var sql = require('sqlite3').verbose();
var dbFile = "PhotoQ.db";
var db = new sql.Database(dbFile);
var fs = require('fs');
var data = fs.readFileSync("photoList.json");

if(!data){
	console.log("Could not read file");
}
else{
	var listObj = JSON.parse(data);
	imgList=listObj.photoURLs;
}
//Will get stringified and put into the body of an HTTP request,below
let i = 0;
	APIrequestObject = {
	"requests":[
	  {
		"image":{
		  "source":{"imageUri":imgList[i]}
		  },
		"features":[{"type": "LABEL_DETECTION","maxResults":6},{"type": "LANDMARK_DETECTION","maxResults":1}]
		}
	]
	}
//URL containing the API key
url= 'https://vision.googleapis.com/v1/images:annotate?key=MY_KEY"
//function to send off request to the API
        function annotateImage() {
	//The code that makes a request to the API
	//Uses the Node request module which packs up and sends off
	//an HTTP message containing the request to the API server
	APIrequest(
		{//HTTP header stuff
	   	url: url,
	   	method: "POST",
	   	headers: {"content-type": "application/json"},
	   	//will turn the given object into JSON
	   	json:APIrequestObject
	},
		//callback function for API request
		APIcallback
	);
	//callback function,called when data is received from API
	function APIcallback(err,APIresponse,body){
		if((err)||(APIresponse.statusCode!=200)){
			console.log("Got API error");
			console.log(body);
		} else{
			APIresponseJSON = body.responses[0];
			//console.log(APIresponseJSON);
			var update_cmd="UPDATE photoTags SET ";
			if(APIresponseJSON.landmarkAnnotations)
			{
				console.log(APIresponseJSON.landmarkAnnotations[0].description);
				if(!(APIresponseJSON.landmarkAnnotations[0].description===undefined))
				{
				update_cmd=update_cmd+"landmark = \""+APIresponseJSON.landmarkAnnotations[0].description.replace(/"/g,"")+"\"";
				}
				else{
					update_cmd=update_cmd+"landmark=\" \"";
				}
			}
			else{
				update_cmd=update_cmd+"landmark= \" \"";
			}
			update_cmd = update_cmd+",";
			if(APIresponseJSON.labelAnnotations)
			{
				update_cmd=update_cmd+"tags = \""+APIresponseJSON.labelAnnotations.map(a => a.description)+"\"";
			}
			else
			{
				update_cmd=update_cmd+"tags = \" \" ";
			}            
			update_cmd=update_cmd+" WHERE idNum = "+ i;
			console.log(update_cmd);
			db.run(update_cmd,DataCallback);
		}	
	} //end callback function
}//end annotateImage

	//Do it!
	annotateImage();
var index=0;
function DataCallback(err)
{
	if(err)
	{
		console.log(err);
	}
	else
	{
		if(index<imgList.length)
		{
			index++;
			i++;
			console.log(i);
			if(i<imgList.length)
			{
			APIrequestObject = {
				"requests":[
	  			{
					"image":{
		  				"source":{"imageUri":imgList[i]}
		  				},
					"features":[{"type": "LABEL_DETECTION","maxResults":6},{"type": "LANDMARK_DETECTION","maxResults":1}]
				}
	]
	}
			annotateImage();
			}
		}
		if(index==imgList.length)
		{
			dumpDB();
			db.close();
		}
	}
}
function dumpDB()
{
	db.all('SELECT * FROM photoTags',dataCallback);
		function dataCallback(err,data){
			console.log(data);
		}
}
