const groceryDao = require("../repository/groceryDAO");


async function postItem({name, price, quantity, bought}){
    const result = await groceryDao.postItem({name, price, quantity, bought});

    if(!result){
        return {message: "Failed to add item"};
    }

    return { message: "Item added successfully", item: result };
}

async function getList(){
    const result = await groceryDao.getList();

    if(!result){
        return {message: "Failed to get list"};
    }
    else{
        return {Grocery_List: result};
    }
}

async function deleteItem(item_name){
    const result = await groceryDao.deleteItem(item_name);

    if(!result){
        return {message: "Failed to find item"};
    }
    else{
        return ("Deleted Item: ", result);
    }
}

async function getItem(item_name){
    const result = await groceryDao.getItem(item_name);

    if(!result){
        return {message: "Could not find target item!"};
    }
    else{
        return ("Getting Item: ", result);
    }
}

async function updateItem(item_name){
    const result = await groceryDao.updateItem(item_name);

    if(!result){
        return {message: "Could not find target item!"};
    }
    else{
        return ("Update Item: ", result);
    }
}


module.exports = { getList, postItem, deleteItem, getItem, updateItem };