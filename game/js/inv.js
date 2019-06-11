const con = require('./sqlConnect');// this is where the connection is made.
const playerid = require('./user');// this is to get the player id from the user.

exports.getinv = function (username, callback) {
    playerid.getpid(username, function(results){ // gets the player ID
        con.query('SELECT iid AND quantity FROM inventory WHERE pid = ? AND quantity > 0', [results], function(err, invresults, fields){
            /*uses the player id to get the item ID number and how much of that item is in the players inventory
            Also won't return null entries.*/
            if (err)throw(err);
            let itemid = results.iid;
            let itemname = [itemid.length];
            for (i=0; i<=itemid.length; i++) {
                con.query('SELECT name FROM item WHERE id = ?', [itemid[i]], function(err, itemresults, fields){
                    if (err)throw(err);
                    itemname[i] = itemresults;
                    /*uesing the Item ID's from the previus function we get the name of the item's returned in results, and then we also return how much of 
                    each item with invresults */
                })
            }
            callback(itemname, invresults);
        })
    })
};
