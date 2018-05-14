var static = require('node-static');
var http = require('http');
var fs = require('fs');
var sql = require("sqlite3").verbose();
var dbFile = "PhotoQ.db";
var db = new sql.Database(dbFile);

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');
var index = 0;

function dynamicQuery(url, response) {

    if (url.startsWith("/query?numList=")) {
        var numsplit = url.split("=");
        var numlist = numsplit[1];
        var photoIndexes = numlist.split("+");
        for (var i = 0 ; i<photoIndexes.length;i++){

        if (!isNaN(photoIndexes[i]) && (photoIndexes[i] >= 0 && photoIndexes[i] <= 988))//get the image 
        {
            response.writeHead(200, { "Content-Type": "text/plain" });
            var selectstr = "SELECT fileName FROM photoTags WHERE idNum = " + photoIndexes[i];
            db.get(selectstr,dataCallback);
            function dataCallback(err,rowData)
            {
                if(err)
                {
                    console.log(err);
                }   
                else
                {
                     var urlResponse = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/"+rowData.fileName+"\n";
                     response.write(urlResponse);
                     index++;
                     if(index==photoIndexes.length)
                     {
                        response.end();
                     }
                }
            }
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
