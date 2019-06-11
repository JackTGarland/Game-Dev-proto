// Module imports
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");
const mysql = require('mysql');
const bodyParser = require("body-parser");
const user = require('./js/user');
const con = require("./js/sqlConnect");
const inventory = require("./js/inv");
const World = require("./js/world.js");
const Item = require("./js/item.js");

// Object creation
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// Setup express
app.set("port", 1337);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({extended:true, limit: '50mb'}));

// Store all connected players
var players = {};

// socket.io connection manager TODO: Move to seperate folder (How the FUCK do we split a MMO up nicely?)
io.on("connection", function (socket) {
    // create a new player
    socket.on("new player", function () {
        players[socket.id] = {
            x: 300,
            y: 300,
            velX: 0,
            velY: 0,
            maxSpeed: 4,
            friction: 0.88,
            faceLeft: true,
            width: 64,
            height: 64,
            iconLeft: "../img/char.png",
            iconRight: "../img/char-right.png"
        }
    });

    // alter player position
    socket.on("movement", function (movement) {
        let player = players[socket.id];
        if(typeof player === 'undefined'){
            // If the player is undefined then it won't try to move them and cause the sever to crash. 
            console.log("PLAYER UNDEFINED") // THERE IS NO SPOON
        }
        else{
            let playerInverseSpeed = (player.maxSpeed * -1) // currently crashsing the server if running to long or to many refreshes. (maxspeed undefined)

            if (movement.left) {
                if (player.velX > playerInverseSpeed) {
                    player.velX--;
                    player.faceLeft = true;
                }
            }

            if (movement.right) {
                if (player.velX < player.maxSpeed) {
                    player.velX++;
                    player.faceLeft = false;
                }
            }

            if (movement.up) {
                if (player.velY > playerInverseSpeed) {
                    player.velY--
                }
            }

            if (movement.down) {
                if (player.velY < player.maxSpeed) {
                    player.velY++;
            }
            }
            player.velY *= player.friction;
            player.y += player.velY;

            player.velX *= player.friction;
            player.x += player.velX;
        };
    });

    // remove player from players array
    socket.on("disconnect", function (player) {
        delete players[socket.id];
    });

    // update state of players every 16ms
    setInterval(function () {
        socket.emit("state", players);
    }, 1000 / 60);

    //chat functions
    socket.on("chat message", function(msg){
        //add username when database and login implmented

    });

    socket.on("getInv", function(username, callback){
        inventory.getinv(username, callback);
        socket.emit("inventory", callback);
    });

});

app.get("/login", function(req,res){
    let loginDetails = JSON.parse(req.headers.user);

    user.login(loginDetails.username, loginDetails.password, function(results){
        if(results.length === 0){
            res.sendStatus(400).send(); // Bad request, no login found
        } else {
            console.log("the results are :", results[0].username);
            //console.log(util.inspect(results, false, null, true));
            res.send(results[0].username);
        }
    });
    
});

app.get("/spawntest", function(req, res){
    let itemID = req.query.item;
    console.log("Test");
    let a = ["apple"];
    console.log(World.spawnItem(itemID, 100, 100, a, function(newA){
        console.log(newA);
        res.send(newA);
    }));

   
});

app.post("/register", function(req, res){
    let registerDetails = req.body;
    user.register(registerDetails, function(){
        console.log("Sucessfully Registered!")
    });
});

server.listen(1337, function () {
    console.log("Server running on port 1337 boss!");
});