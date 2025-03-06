// Import the readline module for handling user input in the console
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout // Write to standard output (console)
});

const grocery_item = () => ({
    name: "",
    quantity: 0,
    price: 0.0,
    bought: false
});

// const grocery_list = [grocery_item()];
// console.log(grocery_list);

let grocery_list = [];

rl.on('line', (line) => {
    console.log(line);
});

rl.once('close', () => {
     // end of input
     console.log("Goodbye");
 });


const removeItem = () => {
    rl.question('Would you like to remove an item from the grocery list? (Y/N) ', (remove) => {
        console.log(remove);

        if(remove.toLocaleLowerCase() == 'y'){
            rl.question('What is the name of the item you would like to remove? ', (remove_item) => {
                console.log(remove_item);

                // remove the item from the list
                let removeIndex = grocery_list.findIndex(function(word) {return word.name == remove_item});
                delete grocery_list[removeIndex];

                removeItem();
            });
        }

        else{
            rl.question('Would you like to add another item? (Y/N) ', (add) => {
                console.log(add);

                if(add.toLocaleLowerCase() == 'y'){
                    askQuestions();
                }

                else{
                    console.log("Final Grocery List: ", grocery_list);
                    rl.close();
                }
            });
        }
    });
}


const askQuestions = () => {
    const item = grocery_item();
    grocery_list.push(item);

    rl.question('Enter name: ', (name) => {
        console.log(name);

        item.name = name;

        rl.question('Enter Quantity: ', (quantity) => {
            console.log(quantity);

            item.quantity = quantity;

            rl.question('Enter Price: ', (price) =>{
                console.log(price);

                item.price = price;

                rl.question('Bought? (Y/N) ', (bought) => {
                    console.log(bought);

                    item.bought = bought;

                    removeItem();
                });
            });
        });
    });
}

askQuestions();






