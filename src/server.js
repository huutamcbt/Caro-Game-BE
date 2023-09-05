const WebSocket = require('ws');
const url = require('url');
const systemLis = require('./systemListener');
const { createEmptyBoard, resetBoardGame,
    writeBoardGame, printBoard,
    checkWin, isFullBoard } = require('./board');
const { addUserToRoom, removeUserFromRoom } = require('./room');

// Get all user information
const users = require("./users.json");

// Room array to manage user room
const rooms = [];

// Create server variable with specific port and host name
const wsServer = new WebSocket.Server({
    host: 'localhost',
    port: '5000',
    path: '/ws'
});

systemLis(wsServer);
// Server start wait the connection from a client
wsServer.on("connection", (ws, req) => {
    const param = url.parse(req.url, true).query;
    // Get the username parameter in authentication variable
    const username = param.username;

    // Add username to socket instance
    ws.username = username;

    // Get the password parameter in authentication variable
    const password = param.password;

    // Check if the authentication variable is valid then continue to process, otherwise close the socket connection
    if (checkAuthentication(username, password)) {

        // Print the notification when client connect to server
        console.log("User connected");

        // Send the notification to client when it has just connected
        ws.send("Hello client");

        const roomId = addUserToRoom(ws, rooms);

        // Add roomId to the corresponding socket
        ws.roomId = roomId;

        // Send room id for user
        ws.send(`Your room id is: ${ws.roomId}`)

        // Check if the room is full then system start a game in that room
        if (rooms[roomId].quantity === 2) {
            sendStartedNotification(roomId);
        }

        // Event listener for all client
        ws.on("message", (msg) => {
            let clientData;
            try {
                console.log(msg.toString());
                // Convert user data to json
                clientData = JSON.parse(msg.toString()).data;

                // Add the coordinates to socket coordinates
                ws.coordinates = clientData.coordinates;

                // Add the user message to socket message
                ws.message = clientData.message;

                // Add value of caro
                ws.value = clientData.value
              
                // Check  the code field and navigate the process to corresponding case
                switch (clientData.action) {
                    case "chat":
                        // Send the message to all clients
                        broadcastMessageInRoom(ws, rooms[roomId]);
                        break;
                    case "play":
                        // Write the current position to board
                        writeBoardGame(rooms[roomId].board, ws);
                        printBoard(rooms[roomId]);
                        // Send the current coordinate of user to the competitor 
                        broadcastStepInRoom(ws, rooms[roomId]);

                        // When the user won, send the notification to all user in room
                        if (checkWin(rooms[roomId].board, clientData.coordinates)) {
                            sendTheWinnerNotification(rooms[roomId], ws);
                        } else {
                            // When the board is full, the game will end.
                            if (isFullBoard(board)) {
                                sendDrawnGame(rooms[roomId]);
                            }
                        }
                        break;
                    case "exit":
                        // Close the socket if receive the exit action from user
                        ws.close();
                        break;
                    default:
                }

            } catch (error) {

            }
        });

        // This event is fired when client close the socket connection
        ws.on("close", () => {
            try {
                removeUserFromRoom(ws, rooms[roomId]);
                console.log(rooms[roomId].users);
                const message = username + " left the chat room\n";
                process.stdout.write(message);
                console.log(`The connection is closed`);
            } catch (error) {

            }
        });

        ws.on("error", () => {
           
            console.log("A client is disconnected");
        });
    } else {
        ws.close();
    }
});

// This listener is fired when the ws Server is closed
wsServer.on("close", () => {
    console.log("The web socket Server is closed. All users can't access to it");
});

// This function exit if 
function broadcastMessageInRoom(socket, room) {
    // Check the total of the client connection
    if (wsServer.clients.size == 0) {
        process.stdout.write("Everyone left the chat room");
        return;
    }

    room.users.forEach(user => {
        // Loop through the connection array and check the status
        // If it still open server will send the message to it
        if (user.readyState == WebSocket.OPEN) {
            if (user != socket) {
                user.send(`[Chat] ${socket.username}: ${socket.message.toString()}`)
            }
        }
    })
}

function sendStartedNotification(roomId) {
    rooms[roomId].users.forEach(user => {
        user.send("The room is full");
        user.send("Start Game");
    })
}

function sendTheWinnerNotification(room, socket) {
    room.users.forEach(user => {
        user.send(`${socket.username} is the winner`)
    });
}

function sendDrawnGame(room) {
    room.user.forEach(user => {
        user.send("All positions of board is filled");
        user.send("The game was drawn");
    })
}

// This function send a notification for the partner about the current coordinates in caro
function broadcastStepInRoom(socket, room) {
    // Check the total of the client connection
    if (wsServer.clients.size == 0) {
        process.stdout.write("Everyone left the chat room");
        return;
    }

    room.users.forEach(user => {
        // Loop through the connection array and check the status
        // If it still open server will send the message to it
        if (user.readyState == WebSocket.OPEN) {
            if (user != socket) {
                user.send(`The coordinates of ${socket.username} is : [${socket.coordinates.xAxis},${socket.coordinates.yAxis}]`);
            }
        }
    })
}

// Check an authentication from user inputs
function checkAuthentication(_username, _password) {
    // Loop through all user account. If user input match with one of these accounts, the function will return true
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === _username && users[i].password === _password) {
            return true
        }
    }

    return false;
}
