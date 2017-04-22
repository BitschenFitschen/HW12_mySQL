//Dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "IlovePickles9!", 
    database: "Bamazon"
});

//Functions
function displayAll() {
    
    connection.query('SELECT * FROM bamazon.products', function(error, response) {
        if (error) { console.log(error) };
        
        var theDisplayTable = new Table({
          
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
        });
      
        for (i = 0; i < response.length; i++) {
           
            theDisplayTable.push(
                [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
            );
        }
        
        console.log(theDisplayTable.toString());
        inquireForPurchase();
    });
}; 

function inquireForPurchase() {
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the item number of the item you wish to purchase?"
        }, {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to buy?"
        },

    ]).then(function(answers) {
        var quantityDesired = answers.Quantity;
        var IDDesired = answers.ID;
        purchaseFromDatabase(IDDesired, quantityDesired);
    });

}; 

function purchaseFromDatabase(ID, quantityNeeded) {
    
    connection.query('SELECT * FROM bamazon.products WHERE item_id = ' + ID, function(error, response) {
        if (error) { console.log(error) };

       
        if (quantityNeeded <= response[0].stock_quantity) {
          
            var totalCost = response[0].price * quantityNeeded;
          
            console.log("We have what you need! I'll have your order right out!");
            console.log("Your total cost for " + quantityNeeded + " " + response[0].product_name + " is " + totalCost + ". Thank you for your Business!");
            
            connection.query('UPDATE Products SET stock_quantity = stock_quantity - ' + quantityNeeded + ' WHERE item_iD = ' + ID);
        } else {
            console.log("Our apologies. We don't have enough " + response[0].product_name + " to fulfill your order.");
        };
        displayAll();
    });

};

displayAll();