let chessBoard = {
    boardState: [],
    constructor() {
        for (let i = 0; i < 15; i++) {
            boardState[i] = [];
            for (let j = 0; j < 15; j++) {
                boardState[i][j] = 0;
            }
        }
    },

    getPiece : function(i, j) {
        if(i < 0 || i > 14 || j < 0 || j > 14) {
            return; //?
        }
        return this.boardState[i][j];
    },

    setPiece : function(i, j, color) {
        if(i < 0 || i > 14 || j < 0 || j > 14) {
            return false;
        }
        if(this.boardState[i][j] != 0) {
            return false;
        }
        this.boardState[i][j] = color;
        return true;
    }
}
