const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const AWS = require("aws-sdk");
require("dotenv").config();

// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
// })

const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const documentClient = DynamoDBDocumentClient.from(client);

async function postItem(item){
    const command = new PutCommand({
        TableName: 'Grocery_List',
        Item: {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            bought: item.bought
        }
    });

    try{
        await documentClient.send(command);
        return item;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function getList(){
    const command = new ScanCommand({
        TableName: "Grocery_List"
    });

    try{
        const data = await documentClient.send(command);
        return data.Items;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function deleteItem(item_name){
    const command = new DeleteCommand({
        TableName: "Grocery_List",
        Key: {name: item_name}
    });

    try{
        await documentClient.send(command);
        return item_name;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function getItem(item_name){
    const command = new GetCommand({
        TableName: "Grocery_List",
        Key: {name: item_name}
    })

    try{
        const item = await documentClient.send(command);
        return item.Item;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

async function updateItem(item){
    console.log("DAO Item: ", item);
    console.log("DAO Item bought", item.bought);
    const command = new UpdateCommand({
        TableName: "Grocery_List",
        Key: {name: item.name},
        UpdateExpression:
        'SET price = :price, quantity = :quantity, bought = :bought',
        ExpressionAttributeValues: {
            ":price": item.price,
            ":quantity": item.quantity,
            ":bought": item.bought
        },
        ReturnValues: "ALL_NEW"
    });

    try{
        const item = await documentClient.send(command);
        return item.Attributes;
    }
    catch(err){
        console.error(err);
        return null;
    }
}


module.exports = { getList, postItem, deleteItem, getItem, updateItem };