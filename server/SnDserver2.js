var static = require('node-static');
var http = require('http');
http.globalAgent.maxSockets = 1;
var fs = require('fs');
var sql = require("sqlite3").verbose();
var dbFile = "PhotoQ.db";
var db = new sql.Database(dbFile);
var tagTable = {};   // global
var results;
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');
var auto = require("./makeTagTable");

function dynamicQuery(url, response) {
    console.log("INSIDE")
    if (url.startsWith("/query?keyList=")) {
        var keysplit = url.split("=");
        var keylist = decodeURIComponent(keysplit[1]);
        console.log("INSDIE2")
        var photoIndexes = keylist.split("+");
        var selectstr = "SELECT * FROM photoTags WHERE ";
        var keystr = "";
        for (let i = 0; i < photoIndexes.length; i++) {
            if (photoIndexes[i] && /^[a-z]/.test(photoIndexes[i]))//get the image 
            {
                console.log("HELLO")
                if (i >= 0 && i < photoIndexes.length - 1) {
                    var label = decodeURIComponent(photoIndexes[i])
                    keystr = keystr + "( LOWER(photoTags.landmark)LIKE \"%" + label + "%\" OR tags LIKE \"%" + label + "%\") AND";
                    console.log("FIRST")
                    console.log(keystr)
                }
                if (photoIndexes[i] && i == photoIndexes.length - 1) {
                    var label = decodeURIComponent(photoIndexes[i]);
                    keystr = keystr + "(LOWER(photoTags.landmark) LIKE \"%" + label + "%\" OR tags LIKE \"%" + label + "%\")";
                    console.log("SECOND")
                    console.log(keystr)
                    selectstr = selectstr + keystr;
                    response.writeHead(200, { "Content-Type": "text/plain" });
                    db.all(selectstr, dataCallback);
                    function dataCallback(err, arrayData) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            let responseData = [];
                            console.log(arrayData)
                            for (let i = 0; i < arrayData.length; i++) {
                                var id = arrayData[i].idNum;
                                var src = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + arrayData[i].fileName;
                                var width = arrayData[i].width;
                                var height = arrayData[i].height;
                                var tags = arrayData[i].tags;
                                var landmarks = arrayData[i].landmark;
                                responseData.push({ id: id, src: src, width: width, height: height, tags: tags, landmarks: landmarks });
                            }
                            if (responseData.length == 0) {
                                responseData.push({ message: message = "There were no photos satisfying this query." });
                                response.writeHead(401,{ "Content-Type": "text/plain" });
                            }
                            else {
                                responseData.forEach(function (obj) { obj.message = "These are all of the photos satisfying this query\n" });
                            }
                            response.write(JSON.stringify(responseData));
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
                console.log("BAD")
                response.writeHead(400, { "Content-Type": "text/plain" });
                response.write("Bad Query");
                response.end();
                break;
            }
        }
    }
    if (url.startsWith("/query?tag=")) {
        var tagsplit = url.split("=");
        var tag = decodeURIComponent(tagsplit[1]);
        console.log(tag);
        var split_props = tag.split(",");
        console.log(split_props)
        var idNum = split_props.splice(0,1);
        var selectstr = "SELECT tags FROM photoTags WHERE idNum=" + idNum;
        response.writeHead(200, { "Content-Type": "text/plain" });
        db.all(selectstr, dataCallback);
        function dataCallback(err, arrayData) {
            if (err) {
                console.log(err);
            }
            else {
                let responseData = []
                var arrayDataObj = arrayData[0];
                var tags = arrayDataObj.tags;

                // Update Tag with SET
                var updateStr = "UPDATE photoTags SET tags='" + split_props.join() + "' WHERE idNum='" + idNum + "'";
                console.log(updateStr);
                db.all(updateStr);
            }
        }
    }
    if(url.startsWith("/query?autocomplete="))
    {
        var tagsplit = url.split("=");
        var tag = decodeURIComponent(tagsplit[1]);
        response.writeHead(200, { "Content-Type": "text/plain" });
            auto.makeTagTable(tagTableCallback);
            function tagTableCallback(data) {
            tagTable = data;
            response.write(JSON.stringify(tagTable));
            response.end();
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
