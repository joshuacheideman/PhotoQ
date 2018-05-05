var static = require('node-static');
var http = require('http');
 
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('.');

// like a callback
function handler (request, response) {
    var url = request.url;
    if (!url.startsWith("/public/"))
    {
        url = url.replace("/","");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("<h1>Hello!</h1>");
        response.write("<p>You asked for <code>" + url + "</code></p>");
        response.end();
    }
    else
    {
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
