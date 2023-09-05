function createEmptyBoard() {
    const board = new Array(10);
    for (let i = 0; i < board.length; i++)
        board[i] = new Array(10);
    return board;
}

function resetBoardGame(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = " ";
        }
    }
}

function writeBoardGame(board, socket) {
    const xAxis = socket.coordinates.xAxis;
    const yAxis = socket.coordinates.yAxis;
    board[xAxis][yAxis] = socket.value;
}

function checkWin(board, coordinates) {
    let xAxis =  coordinates.xAxis;
    let yAxis = coordinates.yAxis;
    console.log(checkFirstDiagonal(board, xAxis, yAxis));
    if( checkRow(board, xAxis, yAxis) == true || 
        checkColumn(board, xAxis, yAxis) == true || 
        checkFirstDiagonal(board, xAxis, yAxis) == true || 
        checkSecondDiagonal(board, xAxis, yAxis) == true)
    {
        return true;
    }
    else return false;
}

function checkRow(board, xAxis, yAxis) {
    try {
        let count = 0;
        let x = xAxis;
        while(x < board.length && board[x][yAxis] === board[xAxis][yAxis]) {
            count++;
            x++;
        }
        x = xAxis - 1;
        while(x > -1 && board[x][yAxis] === board[xAxis][yAxis]) {
            count++;
            x--;
        }
        if(count > 4)
            return true;
        return false;
    } catch (error) {
      
    }
}

function checkColumn(board, xAxis, yAxis) {
    try {
        let count =  0;
        let y = yAxis;
        while(y < board.length && board[xAxis][y] === board[xAxis][yAxis]) {
            count++;
            y++;
        }
        y = yAxis - 1;
        while(y > -1 && board[xAxis][y] === board[xAxis][yAxis]) {
            count++;
            y--;
        }
        if(count > 4)
            return true;
        return false;
    } catch (error) {
       
    }
}

function checkFirstDiagonal(board, xAxis, yAxis) {
    try {
        let count = 0;
        let x = xAxis;
        let y = yAxis;
        while( x < board.length && y < board.length && board[x][y] === board[xAxis][yAxis]) {
            count++;
            x++;
            y++;
        }
        x = xAxis - 1;
        y = yAxis - 1;
        while(x > -1 && y > -1 && board[x][y] === board[xAxis][yAxis]) {
            count++;
            x--;
            y--;
        }
        if(count > 4)
            return true
        return false
    } catch (error) {
       
    }
}
function checkSecondDiagonal(board, xAxis, yAxis) {
    try {
        let count = 0;
        let x = xAxis;
        let y = yAxis;
        while(x < board.length && y > -1 && board[x][y] === board[xAxis][yAxis]) {
            count++;
            x++;
            y--;
        }
        x = xAxis - 1;
        y = yAxis + 1;
        while( x > -1 && y < board.length && board[x][y] === board[xAxis][yAxis]) {
            count++;
            x--;
            y++;
        }
        if(count > 4)
            return true;
        return false;
    } catch (error) {
       
    }
}

function isFullBoard(board) {
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            if(board[i][j] != 'X' && board[i][j] != 'O') {
                return false;
            }
        }
    }
    return true;
}

function printBoard(room) {
    console.log(`Room of ${room.users[0].username} and ${room.users[1].username}`)
    for(let i = 0; i< room.board.length; i++) {
        for(let j = 0; j< room.board[i].length; j++) {
            process.stdout.write(room.board[i][j] + "  ");
        }
        process.stdout.write("\n\n");
    }
    console.log("-----------------------------------------------");
}

module.exports = {
    createEmptyBoard,
    resetBoardGame,
    writeBoardGame,
    printBoard,
    checkWin,
    isFullBoard
}