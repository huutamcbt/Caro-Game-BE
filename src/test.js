const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const originalValue = hash.update('Abc@12', 'utf-8');
const hashValue = originalValue.digest('hex');

const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:5000/ws?username=Neymar&&password=49ee009fa35a8efa4c093ed01ba29f04b841955d76dd404729095336c2c343ba');
const info = {
    "data": {
        "message": "Hello server"
    }
}

// Connection opened
socket.addEventListener("open", (event) => {
    console.log("Connect")
    socket.send(JSON.stringify(info));
});

// // Listen for messages
// socket.addEventListener("message", (event) => {
//     console.log("Message from server ", event.data);
// });