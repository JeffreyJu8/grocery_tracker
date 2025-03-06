// record user response with http
// add the user response to data.txt with fs
// use fs to read data.json
// 


const {logger} = require('./util/logger');
const http = require('http');
const fs = require('fs');

const PORT = 3000;

fs.readFile('data.txt', 'utf8', (err, data) => {
    if(err){
        console.error(err);
        return;
    }
    console.log(data);
});

const server = http.createServer((req, res) => {
    let body = "";

    req
        .on('data', (chunk) => {
            body += chunk;
        })
        .on("end", () => {
            body = body.length > 0 ? JSON.parse(body) : {};

            const contentType = {"Content-Type": "application/json"};

            if (req.url.startsWith("/items")){
                logger.info(req.url.split('/'));
                let index = parseInt(req.url.split("/")[2]);

                switch(req.method){
                    case "POST":
                        const {name, price, quantity, purchased} = body;
                        if (!name || !price || !quantity || purchased == undefined){
                            res.writeHead(400, contentType);
                            res.end(
                                JSON.stringify({
                                    message: "Please provide a valid name, price, quantity, and whether you have purchased it!"
                                })
                            )
                        }
                        else{

                            const content = JSON.stringify({
                                    message: "Item Added to List!",
                                    name,
                                    price,
                                    quantity,
                                    purchased
                            });


                            fs.writeFile('data.txt', content, 'utf8', (err) => {
                                if(err){
                                    console.error(err);
                                    return;
                                }

                                console.log('File has been written');
                                res.writeHead(201, contentType);
                                res.end(content);
                            });

                            break;
                            
                        }
                }
            }
        })
});

if (fs.existsSync('data.txt')){
    console.log("File exists");
}else{
    console.log("File does not exist")
}

server.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});