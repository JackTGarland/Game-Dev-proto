let socket = io();
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
let playerImage = new Image();
var connection = false;
var username; // Super insecure change at later date.

// store current movement input of player
let movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

canvas.width = 800;
canvas.height = 600;

// manage player inputs 
document.addEventListener("keydown", function (event) {
    var canActive = $(canvas).hasClass("active");
    if (canActive == true) {
        switch (event.keyCode) {
            case 65: // A
                movement.left = true;
                break;
            case 87: // W
                movement.up = true;
                break;
            case 68: // D
                movement.right = true;
                break;
            case 83: // S
                movement.down = true;
                break;
        }
    }
});

document.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
        case 65:
            movement.left = false; // A
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
    }
});

// update the server about our current position
/* this needs to be reworked.
In current state when someone tries to connect it sends movement to the sever but a player is not created and thus the values are undefined and crashs
Can make it so we send movement to the backend when movement is used? This can cause's hacks though, but thats late devlopment problems.
Can only invoke this function after a player has connected.
*/

setInterval(function () {
    socket.emit("movement", movement);
}, 1000 / 60);

socket.on("disconnect", function () {
    alert("disconnected!");
});

// update canvas on left/right state from server
socket.on("state", function (players) {
    context.clearRect(0, 0, 800, 600);

    for (var id in players) {
        var player = players[id];

        if (player.faceLeft) {
            playerImage.src = player.iconLeft;
        } else {
            playerImage.src = player.iconRight;
        }
        playerImage.onload = context.drawImage(playerImage, player.x, player.y, player.width, player.height);


    }

});

socket.emit("new player");

//sets the canvas as the active window and reaplaces any other window.
canvas.addEventListener("click", function () {
    var currentActive = document.getElementsByClassName("active");
    if (currentActive.length > 0) {
        currentActive[0].className = currentActive[0].className.replace("active", "");
    }
    canvas.className += " active";
    console.log("canvas is active");
});

chatboxWraper.addEventListener("click", function () {
    var currentActive = document.getElementsByClassName("active");
    if (currentActive.length > 0) {
        currentActive[0].className = currentActive[0].className.replace("active", "");
    }
    chatOut.className += " active";
    console.log("chatOut is active");
});

// Push user details to user
function loginform() {
    username = document.getElementById("login-username").value;
    let password = document.getElementById("password").value;
    if (username != "" && password != "") {
        let loginDetails = {
            "username": username,
            "password": password
        }

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/login");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log("request done!");
                if (xhr.status === 200) { // Successful Requestt
                    let res = xhr.responseText;
                    console.log(res);
                    document.getElementById("fadedBack").className = "hidden"
                    document.getElementById("formWrapper").className = "hidden"
                } else if (xhr.status === 400) { // Incorrect login details
                    document.getElementById("wrong").className = "visable";
                } else {
                    M.toast({
                        html: "Failed to communicate to server to obtain login data!"
                    })
                }
            }
        }

        xhr.setRequestHeader("user", JSON.stringify(loginDetails));
        xhr.send();


        /* socket.emit('login', username, password, function(results){
        //     console.log(results);
        //     if(results == null){
        //         document.getElementById("wrong").className = "visable";
        //     }else{
        //         document.getElementById("fadedBack").className = "hidden"
        //         document.getElementById("formWrapper").className = "hidden"
        //         //socket.emit("new player");
        //     };
            }); */
    } else {
        document.getElementById("wrong").className = "visable";
    };
};

function register() {
    username = document.getElementById("login-username").value;
    let password = document.getElementById("password").value;
    if (username == "" || password == "") {
        M.toast({
            html: "Ensure both a username and password is entered!"
        })
    }

    var loginDetails = {
        "username": username,
        "password": password
    }
    console.log(loginDetails);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/register");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let res = xhr.responseText;
                console.log(res);
                M.toast({html: "User " + loginDetails.username + " created!"});
            } else {
                M.toast({html: "Problem is creating user " + loginDetails.username });
            }
        }

    }
    xhr.send(JSON.stringify(loginDetails));
};

function invtest(){
    socket.emit('getInv', username);
};
socket.on('inventory', function(inventory){
    console.log(inventory);
});


$(document).ready(function () {
    $(".modal").modal();
    let loginModal = document.getElementById("loginModal");
    let loginModalInstance = M.Modal.getInstance(loginModal);
    loginModalInstance.open();
});
