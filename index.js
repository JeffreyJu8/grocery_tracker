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
                        else{
                            const item = { name, price, quantity, purchased };

                            console.log("item: ", item);

                            fs.readFile('data.txt', 'utf8', (err, data) => {
                                let items = [];

                                try{
                                    items = JSON.parse(data);
                                    if (!Array.isArray(items)) {
                                        items = [];
                                    }
                                }
                                catch (e){
                                    items = [];
                                }
                                

                                console.log("items: ", items);

                                items.push(item);

                                fs.writeFile('data.txt', JSON.stringify(items, null, 2), 'utf8', (err) => {
                                    if(err){
                                        console.error('Error Reading', err);
                                        return;
                                    }

                                    console.log('Item added to grocery list');
                                    res.writeHead(201, contentType);
                                    res.end(JSON.stringify(item));
                                })
                            });

                            break;
                            
                        }
                    
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

                        fs.readFile('data.txt', 'utf8', (err, data) => {
                            if(err){
                                console.error(err);
                                res.writeHead(500, contentType);
                                res.end(JSON.stringify({ error: "Error reading data file" }));
                                return;
                            }

                            // console.log(data);
                            let items = [];

                            try{
                                items = JSON.parse(data);
                                if (!Array.isArray(items)) {
                                    items = [];
                                }
                            }
                            catch (e){
                                items = [];
                            }

                            let modifyIndex = items.findIndex((item) => item.name === itemName);
                            if (modifyIndex === -1) {
                                res.writeHead(404, contentType);
                                res.end(JSON.stringify({ message: "Item not found" }));
                                return;
                            }
                        
                            // Update item
                            items[modifyIndex] = { name, price, quantity, purchased };
                        
                            // Save back to file
                            fs.writeFile('data.txt', JSON.stringify(items, null, 2), 'utf8', (err) => {
                                if (err) {
                                    console.error('Error updating file:', err);
                                    return;
                                }
                                console.log('Item Updated!');
                                res.writeHead(200, contentType);
                                res.end(JSON.stringify(items[modifyIndex]));
                            });
                        });


                        break;

                    case "DELETE":
                        const urlparts = req.url.split("/"); 
                        let deletingItemName = urlparts[2];
    
                        // Log extracted item
                        logger.info(`Updating item: ${deletingItemName}`);

                        fs.readFile('data.txt', 'utf8', (err, data) => {
                            if(err){
                                console.error(err);
                                res.writeHead(500, contentType);
                                res.end(JSON.stringify({ error: "Error reading data file" }));
                                return;
                            }

                            // console.log(data);
                            let items = [];

                            try{
                                items = JSON.parse(data);
                                if (!Array.isArray(items)) {
                                    items = [];
                                }
                            }
                            catch (e){
                                items = [];
                            }

                            let deletingIndex = items.findIndex((item) => item.name === deletingItemName);
                            if (deletingIndex === -1) {
                                res.writeHead(404, contentType);
                                res.end(JSON.stringify({ message: "Item not found" }));
                                return;
                            }
                            
                            deletedItem = items[deletingIndex];
                            // Delete item
                            items.splice(deletingIndex, 1);
                        
                            // Save back to file
                            fs.writeFile('data.txt', JSON.stringify(items, null, 2), 'utf8', (err) => {
                                if (err) {
                                    console.error('Error updating file:', err);
                                    return;
                                }
                                console.log('Item Deleted!');
                                res.writeHead(200, contentType);
                                res.end(JSON.stringify(deletedItem));
                            });
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