const {createEmptyBoard, resetBoardGame} = require('./board');

function removeUserFromRoom(socket, room) {
    // Get index of user socket in array
    const index = room.users.indexOf(socket);
    if(index > -1) {
        room.users.splice(index);
    }
    if(room.quantity > 0) {
        room.quantity--;
    }
    resetBoardGame(room.board);
}

function addUserToRoom(socket, rooms) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].quantity < 2) {
            rooms[i].users.push(socket);
            rooms[i].quantity++;
            return i;
        }
    }
    const newboard = createEmptyBoard();
    resetBoardGame(newboard);
    const newroom = {
        users: [],
        board: newboard,
        quantity: 1
    }

    // Add user socket to the corresponding room
    newroom.users.push(socket);
    // Add room to room array
    rooms.push(newroom);
   
    return rooms.length - 1;
}

module.exports = {
    addUserToRoom,
    removeUserFromRoom
}