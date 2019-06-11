// Load module
var mysql = require('mysql');
// Initialize pool
var pool = mysql.createPool({
    host: "localhost",
    user: "username",
    password: "password",
    database : 'JSRPG',
    debug    :  false,
    connectionLimit: 50 //how many connections that can be used at at one time.
});

pool.getConnection((err, connection) => {

    if (err) { //this will give us what the error is but won't crash the sever. 
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
    }
}
    console.log("new connection");
    //if (connection) connection.release() // releases the connection when its done.
return

});
module.exports = pool;