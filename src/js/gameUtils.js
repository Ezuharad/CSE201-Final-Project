/**
 * charToInt. Returns the character corresponding the the passed integer 
 * (i.e. 0 -> A, 1 -> B, etc.).
 * @param {*} number The integer to be referred to. Should not exceed 14
 * @returns The char corresponding to the passed integer
 */
 function charToInt(number) {
    return "ABCDEFGHIJKLMNO".charAt(number);  // This is a little scuffed
}
/**
 * generateBoard. Creates a string of HTML markup text for the game board.
 * @returns A string of HTML markup text for the game board
 */
function generateBoard() {
    let returnVal = "";
    for(let i = 0; i < 15; i++)
    {
        returnVal += "<div>";
        for(let j = 0; j < 15; j++)
        {
            returnVal += "<div id= " + charToInt(i) + j + "></div>";
        }
        returnVal += "</div>";
    }

    return returnVal;
}
/**
 * placePiece. Will place a piece on the board, then allow the user to send 
 * their piece to the server. THIS IS UNFINISHED CODE
 */
function placePiece() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById("game-board").innerHTML = generateBoard();
    }
    xhttp.open("GET", "gameState.txt", true);
    xhttp.send();
}
