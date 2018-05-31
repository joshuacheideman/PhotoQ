var static = require('node-static');
var http = require('http');
http.globalAgent.maxSockets = 1;
var fs = require('fs');
var sql = require("sqlite3").verbose();
var dbFile = "PhotoQ.db";
var db = new sql.Database(dbFile);

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

function dynamicQuery(url, response) {

    if (url.startsWith("/query?keyList=")) {
        var keysplit = url.split("=");
        var keylist = decodeURIComponent(keysplit[1]);
        var photoIndexes = keylist.split("+");
        var selectstr = "SELECT * FROM photoTags WHERE ";
	var keystr = ""; 
        for (let i = 0 ; i<photoIndexes.length;i++){

        if (photoIndexes[i]&&/^[a-z]/.test(photoIndexes[i]))//get the image 
        {
	    if(i>=0&&i<photoIndexes.length-1)
	    {
		var label = decodeURIComponent(photoIndexes[i]);
            keystr = "(landmark = \""+ label+"\" OR tags LIKE \"%"+label+"%\") AND";
	    }
	    if (photoIndexes[i]&&i==photoIndexes.length-1)
	    {
		console.log(photoIndexes[i]);
		var label = decodeURIComponent(photoIndexes[i]);
		keystr = "(landmark = \""+ label+"\" OR tags LIKE \"%"+label+"%\")"; 
		selectstr = selectstr + keystr;
            	response.writeHead(200, { "Content-Type": "text/plain" });
                db.all(selectstr,dataCallback);
            	function dataCallback(err,arrayData)
            	{
                	if(err)
                	{
                    		console.log(err);
                	}	   
                	else
                	{
				let responseData=[];
				for(let i =0;i<arrayData.length;i++)
				{
					var src ="http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" +arrayData[i].fileName;
					var width = arrayData[i].width;
					var height = arrayData[i].height;
					responseData.push({src:src,width:width,height:height});
				}
				if(responseData.length==0)
				{
					response.write("There were no photos satisfying this query.");
				}
				else{
                        	response.write("These are all of the photos satisfying this query\n"+JSON.stringify(responseData));
				}    
                        	response.end();
                	}
            	}
        }
	/*
        else if(i==photoIndexes.length-1||photoIndexes[i]=="")
        {
            response.writeHead(400, { "Content-Type": "text/plain" });
            response.write("Bad Query");
            response.end();
            break;
        } 
	*/   
        }
        else //do a bad query response
        {
            response.writeHead(400, { "Content-Type": "text/plain" });
            response.write("Bad Query");
            response.end();
            break;
        }
    }
    }
}


// like a callback
function handler(request, response) {
    var url = request.url;
    if (url.startsWith("/query")) {
        dynamicQuery(url, response);
    }
    else {
        request.addListener('end', function () {
            //
            // Serve files!
            //
            // file.serve(request, response);
            file.serve(request, response, function (e, res) {
                if (e && (e.status === 404)) { // If the file wasn't found
                    file.serveFile('./not-found.html', 404, {}, request, response);
                }
            });
        }).resume();
    }
}

var server = http.createServer(handler);

// fill in YOUR port number!
server.listen("50600");
