// Character array to store the boardstate. Uses 'B' for black stones, and 
// 'W' for white stones
let boardState = new Array(15);

// Indices keep track of the highlighted element per requirement 0.6
let outlinedIndex1 = -1;
let outlinedIndex2 = -1;

/**
 * charToInt. Returns the integer corresponding to the passed character 
 * (i.e. A -> 0, B -> 1, etc.).
 * @param {*} letter The character to be referred to. Should be a capital 
 * alphabetic character
 * @returns The integer corresponding to the passed character
 */
function charToInt(letter) {
    return letter.charCodeAt(0) - 65; // This will return the number code
}
/**
 * intToChar. Returns the character corresponding to the passed integer 
 * (i.e. 0 -> A, 1 -> B, etc.).
 * @param {*} number The integer to be referred to. Should be between 0 and 25
 * @returns The char corresponding to the passed integer
 */
function intToChar(number) {
    if(25 < number || 0 > number) {
        return '-';
    }
    // This is a little scuffed. There are better ways to do this
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(number);
}
/**
 * generateBoard. Creates a string of HTML markup text for the game board, 
 * then inserts it into the board div. Additionally initialized the 
 * boardState variable.
 */
function generateBoard() {
    // Initialize our board HTML
    let boardHTML = "";
    for(let i = 0; 15 > i; i++) {
        // Initialize boardstate variable
        boardState[i] = new Array(15);
        
        // Create HTML markup
        boardHTML += "<div>";
        for(let j = 0; j < 15; j++) {
            boardHTML += "<div id=" + intToChar(i) + intToChar(j); // Unique div IDs
            boardHTML += " class=intersection"; // CSS styling
            boardHTML += " onClick=placePiece(this.id)"; // placePiece function
            boardHTML += "></div>"; // Close HTML tag
        }
        boardHTML += "</div>";
    }

    // Set the game board div to our new HTML markup
    document.getElementById("game-board").innerHTML = boardHTML;
}
/**
 * placePiece. Will place a piece on the board, then allow the user to send 
 * their piece to the server. !!!THIS IS UNFINISHED CODE!!!
 * 
 * Called when the user clicks an intersection div. On the first click, the user 
 * will see an outlined stone indicating that the piece will be place if they click 
 * again. If the user clicks the same intersection their placement will be finalized.
 */
function placePiece(elementID) {
    const intersection = document.getElementById(elementID);
    const clickedIndex1 = charToInt(elementID.charAt(0)); // Get an array index
    const clickedIndex2 = charToInt(elementID.charAt(1)); // Get other index
    
    // Check to see if a piece already exists in the intersection
    if(boardState[clickedIndex1][clickedIndex2] == 'B' || 
    boardState[clickedIndex1][clickedIndex2] == 'W') {
        return;
    }

    // Check to see if the clicked element has already been clicked
    if(clickedIndex1 == outlinedIndex1 && clickedIndex2 == outlinedIndex2) {
        //TODO Add some kind of logic to allow for different player pieces
        boardState[clickedIndex1][clickedIndex2] = 'B';
        intersection.innerHTML = "Piece placed";

        outlinedIndex1 = -1;
        outlinedIndex2 = -1;
    }
    // If it has not been clicked, mark it as outlined element
    else {
        // Case for already outlined index
        if(-1 < outlinedIndex1) {
            let outlinedID = intToChar(outlinedIndex1) + 
            intToChar(outlinedIndex2);
            document.getElementById(outlinedID).innerHTML = "";
        }
        outlinedIndex1 = clickedIndex1;
        outlinedIndex2 = clickedIndex2;

        intersection.innerHTML = "Certain?";
    }

    // AJAX Code to send our piece to the server
    // const xhttp = new XMLHttpRequest();
    // xhttp.open("GET", "gameState.txt", true);
    // xhttp.send();
}
