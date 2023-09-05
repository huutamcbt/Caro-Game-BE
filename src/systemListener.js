module.exports = function(wsServer) {
    // This listener will catch the press Ctrl-C event 
    process.on('SIGINT', () => {
        console.log("Exit all play rooms");
        // Close all client connection and web socket server when press Ctrl-C 
        wsServer.clients.forEach(client => {
            if(client.readyState = WebSocket.OPEN) {
                client.close();
            }
        });
    
        wsServer.close();
        process.exit();
    });
}
