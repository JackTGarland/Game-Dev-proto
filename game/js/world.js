const Item = require("./item");
const con = require("./sqlConnect");

// Spawns an item into the world given an valid item ID and world coordinates
// HEAVILY WIP
function spawnItem(itemID, x, y, worldItems, callback){
    Item.getItem(3, function(item){
        console.log("Got Item!!");
        item.xPos = x;
        item.yPos = y; 
        worldItems.push(item);
        callback(worldItems);
    });
}

exports.spawnItem = spawnItem;