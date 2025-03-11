const groceryService = require('./service/groceryService');
const uuid = require('uuid');
const {logger} = require('./util/logger');
const http = require('http');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let body = "";

    req
        .on('data', (chunk) => {
            body += chunk.toString();
        })
        .on("end", async () => {
            body = body.length > 0 ? JSON.parse(body) : {};

            const {name, price, quantity, bought} = body;

            const contentType = {"Content-Type": "application/json"};

            if (req.url.startsWith("/items")){
                logger.info(req.url.split('/'));
                let index = parseInt(req.url.split("/")[2]);
            }
    
            switch(req.method){
                case "GET":
                    console.log("Get Request Received");
    
                    try{
                        const data = await groceryService.getList();
                        console.log("data: ", data)
                        const stringifiedData = JSON.stringify(data);
                        // console.log("stringifiedData", stringifiedData);
                        res.writeHead(200, contentType);
                        // const content = JSON.stringify({data: parsedData});
                        res.end(stringifiedData);
                    }
                    catch(err){
                        console.log(err);
                        return;
                    }
                break;
                    
                case "POST":
                    console.log("POST Request Received");

                    if (!name || !price || !quantity || bought === undefined){
                        res.writeHead(400, contentType);
                        res.end(
                            JSON.stringify({
                                message: "Please provide a valid name, price, quantity, and whether you have purchased it!"
                            })
                        )
                        return;
                    }

                    const item = { name, price, quantity, bought};
                    console.log("Item: ", item);
                    const data = await groceryService.postItem(item);
                    console.log("data: ", data);

                    res.writeHead(200, contentType);
                    res.end(JSON.stringify(data));

                    break;
                
                case "PUT":
                    const updateItem = { name, price, quantity, bought};
                    const update = await groceryService.updateItem(updateItem);
                    res.writeHead(200, contentType);
                    res.end(JSON.stringify(update));

                    break;
                
                case "DELETE":
                    // name
                    const parts = req.url.split("/"); 
                    let itemName = parts[2];

                    const target = await groceryService.deleteItem(itemName);
                    console.log("Deleting: ", target);

                    res.writeHead(200, contentType);
                    res.end(JSON.stringify(target));

                    break;
            }
        })

})
// groceryService.postItem("apple", "2", "1", "false")
//     .then(data => console.log(data))
//     .catch(err => console.log(err));

server.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});