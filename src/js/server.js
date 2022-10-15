const fs = require("fs");
const http = require("http");
const PORT = 9999

let gethtml = (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    fs.readFile("." + req.url, null, function(error, data) {
        if(error) {
            res.writeHead(404);
            res.write("Page not found!")
        } else {
            res.write(data);
        }
        res.end();
    });
}

http.createServer(gethtml).listen(PORT);
