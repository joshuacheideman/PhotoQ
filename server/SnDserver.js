var static = require('node-static');
var http = require('http');
var fs = require('fs');

var imgList = [];

loadImageList();


//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

function dynamicQuery(url, response) {
    if (url.startsWith("/query/")) {
        url = url.replace("/", "");
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write("<h1>Hello!</h1>");
        response.write("<p>You asked for <code>" + url + "</code></p>");
        response.end();
    }
    else if (url.startsWith("/query?num=")) {
        var numsplit = url.split("=");
        var num = numsplit[1];
        if (!isNaN(num) && (num >= 0 && num <= 988))//get the image 
        {
            response.writeHead(200, { "Content-Type": "text/plain" });
            var urlResponse = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/"+imgList[num];
            urlResponse = urlResponse.replace(/ /g, "%20");
            response.write(urlResponse);
            response.end();
        }
        else //do a bad query response
        {
            response.writeHead(400, { "Content-Type": "text/plain" });
            response.write("Bad Query");
            response.end();
        }
    }
}

function loadImageList() {
    var data = fs.readFileSync('photoList.json');
    if (!data) {
        console.log("cannot read photoList.json");
    } else {
        listObj = JSON.parse(data);
        imgList = listObj.photoURLs;
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
