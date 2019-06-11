// Manages User login and creation
const con = require('./sqlConnect');// this is where the connection is made.
//const test = 
exports.login = function(username, password, callback) {
    con.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(err, results, fields){
        if (err)throw(err);
        callback(results);
    });
};

exports.registerOLD = function(registerData, callback){
    let insertData = {
        username: registerData.username,
        password: registerData.password
    }
    con.query('INSERT INTO user VALUES ?', insertData, function(err, result){
        if (err) throw(err);
        characterData = {
            user_id: result.insertId,
            pos_x: 0,
            pos_y: 0
        }
        con.query("INSERT INTO character VALUES ?", characterData, function(err, result){
            if(err) throw(err)
            callback();
        });
    });
};

exports.register = function(registerData, callback) {
    con.query('SELECT * FROM user WHERE username = ?',[registerData.username], function(err, results){
        if (err){
            console.log(err);
        }else{
            if(results != null){
                callback("UAK"); //Username already taken
            }else{ //TODO March 20th: Insert register user, update player pos
                con.query("INSERT INTO user (username, password) SET ?", registerData, function(err, results){
                    if(err) throw err;
                    let playerID = results.insertId;
                    console.log("New User created:");
                    console.log(results);
                    con.query("INSERT INTO player (userid, name, pos_x, pos_y, str, dex, con, int, wis, cha) VALUES ?",
                    [playerID, "testname", 200, 200, 10, 10, 10, 10, 10, 10],
                    function(err, results){
                        if(err) throw err;
                    })
                    callback("NRA"); //New record added
                });

            }
        }
    })
};
exports.getpid = function(username, callback){
    con.query('SELECT pid FROM player, user WHERE username = ?', [username], function(err, results, fields){
        if (err)throw(err);
        callback(results);
    })
};
/*
Here we are exporting checkLogin so that it can be used by other files.
We are passing in username and password.
We call for a connection from the pool by using pool.query, we then have the query we want to exacute.
if there is an error it will throw it, otherwise it will return us the results.
*/