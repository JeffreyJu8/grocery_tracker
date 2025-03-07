const {logger} = require('./util/logger');
const http = require('http');
const fs = require('fs');

const PORT = 3000;

let grocery_list = []

fs.readFile('data.txt', 'utf8', (err, data) => {
    if(err){
        console.error(err);
        return;
    }

    try{
        grocery_list = JSON.parse(data);
        if(!Array.isArray(grocery_list)){
            grocery_list = [];
        }
    }
    catch(e){
        grocery_list = [];
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

            const {name, price, quantity, purchased} = body;

            const contentType = {"Content-Type": "application/json"};

            if (req.url.startsWith("/items")){
                logger.info(req.url.split('/'));
                let index = parseInt(req.url.split("/")[2]);

                switch(req.method){

                    case "GET":
                        fs.readFile('data.txt', 'utf8', (err, data) => {
                            if(err){
                                console.error(err);
                                res.writeHead(500, contentType);
                                res.end(JSON.stringify({ error: "Internal Server Error" }));
                                return;
                            }
                            // console.log(data);
                            const parsedData = JSON.parse(data);
                            res.writeHead(200, contentType);
                            const content = JSON.stringify({data:parsedData});
                            res.end(content);
                        });

                        break;

                    case "POST":
                        if (!name || !price || !quantity || purchased === undefined){
                            res.writeHead(400, contentType);
                            res.end(
                                JSON.stringify({
                                    message: "Please provide a valid name, price, quantity, and whether you have purchased it!"
                                })
                            )
                            return;
                        }

                        const item = { name, price, quantity, purchased };

                        console.log("item: ", item);
                        

                        grocery_list.push(item);

                        console.log("grocery list after appending: ", grocery_list);

                        fs.appendFile('data.txt', JSON.stringify(item, null, 2) + '\n', 'utf8', (err) => {
                            if(err){
                                console.error('Error Reading', err);
                                return;
                            }

                            console.log('Item added to grocery list');
                            res.writeHead(201, contentType);
                            res.end(JSON.stringify(item));
                        })

                        break;
                    
                    case "PUT":
                        // name
                        const parts = req.url.split("/"); 
                        let itemName = parts[2];
    
                        // Log extracted item
                        logger.info(`Updating item: ${itemName}`);

                        // Validate input
                        if (!name || !price || !quantity || purchased === undefined) {
                            res.writeHead(400, contentType);
                            res.end(JSON.stringify({ message: "Invalid request data" }));
                            return;
                        }


                        let modifyIndex = grocery_list.findIndex((item) => item.name === itemName);
                        if (modifyIndex === -1) {
                            res.writeHead(404, contentType);
                            res.end(JSON.stringify({ message: "Item not found" }));
                            return;
                        }
                    
                        // Update item
                        grocery_list[modifyIndex] = { name, price, quantity, purchased };
                    
                        // Save back to file
                        fs.writeFile('data.txt', JSON.stringify(grocery_list, null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error('Error updating file:', err);
                                return;
                            }
                            console.log('Item Updated!');
                            res.writeHead(200, contentType);
                            res.end(JSON.stringify(grocery_list[modifyIndex]));
                        });

                        break;

                    case "DELETE":
                        const urlparts = req.url.split("/"); 
                        let deletingItemName = urlparts[2];
    
                        // Log extracted item
                        logger.info(`Updating item: ${deletingItemName}`);

                        let deletingIndex = grocery_list.findIndex((item) => item.name === deletingItemName);
                        if (deletingIndex === -1) {
                            res.writeHead(404, contentType);
                            res.end(JSON.stringify({ message: "Item not found" }));
                            return;
                        }
                        
                        deletedItem = grocery_list[deletingIndex];
                        // Delete item
                        grocery_list.splice(deletingIndex, 1);
                    
                        // Save back to file
                        fs.writeFile('data.txt', JSON.stringify(grocery_list, null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error('Error updating file:', err);
                                return;
                            }
                            console.log('Item Deleted!');
                            res.writeHead(200, contentType);
                            res.end(JSON.stringify(deletedItem));
                        });

                        break;
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