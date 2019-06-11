const con = require('./sqlConnect');// this is where the connection is made.
//const test = 
exports.checkLogin = function(username, password, callback) {
    

    con.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(err, results, fields){
        if (err)throw(err);
        callback(null, results);
    });
    
};
exports.getInv = function(username, callback){

    con.query('SELECT ')
};
exports.createUser = function(username, password, callback) {

    con.query('SELECT * FROM user WHERE username = ?',[username], function(err, results){
        if (err){
            console.log(err);
        }else{
            if(results != null){
                callback("UAK"); //Username already taken
            }else{
                con.query("INSERT INTO user (username, password) VALUES ('?' , '?')",[username, password], function(err, results){
                    if(err) console.log(err);
                    console.log("new record added");
                    console.log(results);
                    callback("NRA"); //New record added
                });

            }
        }
    })
}
/*
Here we are exporting checkLogin so that it can be used by other files.
We are passing in username and password.
We call for a connection from the pool by using pool.query, we then have the query we want to exacute.
if there is an error it will throw it, otherwise it will return us the results.
*/