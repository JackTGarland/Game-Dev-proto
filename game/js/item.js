const con = require("./sqlConnect");

// Please use this format for items!!

let exampleItem = {
    name: "ItemName",
    image: "/img/sword/sword.png",
    type: "weapon",
    // If a part of the world item list then ensure X and Y pos are included!!
    xPos: 100,
    yPos: 100
}

// Polymorphic function (Accepts item name or ID)
// Returns an item from the database with the assiociated details
function getItem(itemID, callback) {
    let itemDetails = {};
    let queryString = "";

    if(typeof itemID == "number"){
        queryString = "SELECT * FROM item WHERE id = ?"
    } else if (typeof itemID == "string"){
        queryString = "SELECT * FROM item WHERE name = ?"
    }
        con.query(queryString, [itemID], function(err, results) {
            if (err) throw err;
            
            // Check if we actually got some results
            if(results.length > 0){
                itemDetails.name = results[0].name;
                itemDetails.image = results[0].image_url;
    
                let itemType = results[0].type;
                con.query("SELECT * FROM item_type WHERE tid = ?", [itemType], function(err, results){
                    if (err) throw err;
    
                    if(results.length > 0){
                        itemDetails.type = results[0].name;
                        let itemTable = results[0].table_name;
                        console.log(itemDetails);
                        callback(itemDetails);
                    }
                });
    
            }
        });
    
    
}

exports.getItem = getItem;