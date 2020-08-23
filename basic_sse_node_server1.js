const http = require("http");
const fs = require("fs");

const port = parseInt( process.argv[2] || 1234);

http.createServer(function(request, response){
    if(request.url != "/basic_sse.php") {
        fs.readFile("basic_sse.html", function(err, file) {
            response.writeHead(200, {
                "Content-Type" : "text/html"
            });
            response.end(file);
        });
        return;
    }

    response.writeHead(200, {'Content-Type': "text/event-stream"})

    const timer = setInterval(function() {
        var content = "data:" + 
            new Date().toISOString() + "\n\n";
            const b = response.write(content);
            if(!b) console.log("Data queud (content=" + content + ")")
            else console.log("Flushed! (content=" + content + ")");
            response.write(content);
    }, 1000);

    request.connection.on("close", function() {
        response.end();
        clearInterval(timer);
        console.log("Client closed connection. Aborting.")
    })

    
}).listen(port);