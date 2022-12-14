// Game ID for identifying game instance
let gameId;
getGameID();
//True is black turn, and false is white turn.
let blackPiece = true;
// True if it is our turn, false otherwise
let myTurn = true;
//instance of chessBoard status
let chessBoard = [];
let prevVal = false;

/**
 * Create a Nested Array to record the chessBoard status, all values will set as 0 at the first.
 * 0 means no piece here, 
 * 1 means a black preview piece here, 
 * 2 means a white preview piece here,
 * 3 means a black piece here,
 * 4 means a white piece here.
 */
for (let i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (let j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}
//instance of x, y coordinate of the current preview piece
let preX = null;
let preY = null;

let chess = null;
let context = null;

// Regularly call server for updated pieces
let pullInterval = setInterval(pullPiece, 500);

/**
 * This function will be called whenever a player clicks the board to place a piece.
 * Calls
 * @param {*} e 
 */
function clickToPlacePiece(e) {
	if(!myTurn) {  // Return if it is not the players turn
		return;
	}
	let x = e.offsetX;
	let y = e.offsetY;

	let i = Math.floor(x / 30);
	let j = Math.floor(y / 30);

	// If not piece already here
	if (chessBoard[i][j] == 0) {
		//clean the useless preview pieces before place a new one
		cleanPre(preX, preY);
		//place a new preview piece
		preStep(i, j);
		//set the x, y coordinate of the current preview piece
		preX = i;
		preY = j;
		if(!setTimeState){
			updateCountdown();
			setTimeState = true;
		}
	}
	else if(chessBoard[i][j] == 1 || chessBoard[i][j] == 2){
		pushPiece(i, j); // Push piece to server
		cleanPre(preX, preY); // clean the useless preview piece
		placePiece(i, j);
		prevVal = [i, j];
		timeState = false;
		myTurn = false;
	}
}

/**
 * This function causes the loser to lose the game
*/
function loseGame() {
	let xhttp = new XMLHttpRequest();
	let url = '/pushPiece';  // The POST url
	let params = '/w|' + gameId;  // Parameters are packaged by the client in w|gameID format
	xhttp.open('POST', url + params, true);
	xhttp.send(params); // Send the xhttp object with the parameters
	
	clearInterval(pullInterval);  // Prvent showing winscreen
	
	xhttp.onreadystatechange = function() {  // Once the server responds, send the user to shadow realm
		if(this.readyState == 4 && this.status == 200) {
			window.location.href = "loser.html";
		}
	}
}

/**
 * This function will cause the caller to win
 */
function winGame() {
	setTimeout(function() {	window.location.href = "winner.html";}, 2000);
}

/**
 * This function will call preStep() and oneStep() to place preview pieces and real pieces on the game board.
 * Called by clickToPlacePiece()
 * 
 * @param i is the row of the piece to be placed
 * @param j is the column of the piece to be placed
 */
function placePiece(i, j) {
	if (blackPiece) {  //If there is already a black preview piece here
		//place a black piece here
		oneStep(i, j);
	} //If there is already a white preview piece here
	else {
		//place a white piece here
		oneStep(i, j);
	}
	if(WinJudge(i, j)) {  // Win judgement
		if(myTurn) {
			winGame();
		}
		else {
			window.location.href = "loser.html";
		}
	}
	if(blackPiece) {
		blackPiece = false;  // Swap color
	}
	else {
		blackPiece = true;  // Swap color
	}

}

// Regex matching for pullPiece
const pullPieceRegex = /[0-9]?[0-9]\|[0-9]?[0-9]\|[1-9][0-9]{4}/;

/**
 * Pulls a piece from the nodejs server using ajax. Called every half second by the 
 * client.
 */
function pullPiece() {
	let xhttp = new XMLHttpRequest();
	let url = '/pullPiece';  // The GET url
	let params = '/' + gameId;
	xhttp.open('GET', url + params, true);
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			// Unpackage the parameters
			if(this.responseText == null) {  // Do nothing if the response does not exist
				return;
			}
			if(!this.responseText.match(pullPieceRegex)) {  // Do nothing if the response is malformed
				if(this.responseText.match(/w/)) {  // Win game if response is 'w'
					winGame();
					return;
				}
			}

			let pos = this.responseText.split('|');
			if(pos && pos[1]){
				if(!prevVal || (prevVal && (prevVal[0]+''+prevVal[1]) != (pos[0]+''+pos[1]))){
					prevVal = [pos[0], pos[1]];
					timeState = true;
					updateCountdown();
					setTimeState = true;
				}
			}
			if(pos[0] > 14 || pos[1] > 14 || pos[0] < 0 || pos[1] < 0) {  // Verify indices
				return;
			}
			if(chessBoard.length && chessBoard[pos[0]][pos[1]] > 2) {  // Do nothing if the piece already exists
				return;
			}

			// Log that the piece was pulled
			console.log('Piece pulled: ' + this.responseText);

			// Place the piece for the user to see
			placePiece(pos[0], pos[1]);
			myTurn = true;
		}
	}
	xhttp.send();
}

/**
 * Pushes the passed piece to the nodejs server. Called when a player finishes 
 * placing a piece.
 * @param {*} i The x coordinate of the placed piece
 * @param {*} j The y coordinate of the placed piece
 */
function pushPiece(i, j) {
	let xhttp = new XMLHttpRequest();
	let url = '/pushPiece';  // The POST url
	let params = '/' + i + '|' + j + '|' + gameId;  // Parameters are packaged by the client in x|y|gameID format
	xhttp.open('POST', url + params, true);
	//xhttp.onreadystatechange = function() {
	//	if(xhttp.readyState == 4 && xhttp.status == 200) {
	//	}
	//}
	xhttp.send(params); // Send the xhttp object with the parameters
}

/**
 * This function will draw a 15*15 blank game board by black lines
 */
function drawChessBoard() {
	//necessary instances for drawing stuffs on canvas.
	chess = document.getElementById("chess");
	context = chess.getContext('2d');

	context.beginPath();
	context.strokeStyle = '#000000';
	for (let i = 0; i < 15; i++) {
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}
/**
 * preStep() function will place a red circle preview piece on the game board to let players can clearly see the position that
 * they want to place a piece. Black preview piece and White preview piece do not have visual differences. 
 * The board status will be changed based on the turn.
 * 
 * @param {*} i is the value of the x-coordinate
 * @param {*} j is the value of the y-coordinate
 */
function preStep(i, j) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 11, 0, 2 * Math.PI); // draw a preview piece
	context.closePath();
	if (blackPiece) { // set the stroke color
		context.strokeStyle = "#8e8e8e";
	} else {
		context.strokeStyle = "#f9f9f9";
	}

	context.stroke(); //stroke the preview piece
	//set the board status to 1 or 2 depend on which player's turn
	if (blackPiece) {
		chessBoard[i][j] = 1; //if the turn is black, set the board status to 1
	} else {
		chessBoard[i][j] = 2; //if the turn is white, set the board status to 2
	}
}

/**
 * oneStep() function will place a real piece on the game board
 * The piece's color and changed board status are based on the turn.
 * 
 * @param {*} i is the value of the x-coordinate
 * @param {*} j is the value of the y-coordinate
 */
function oneStep(i, j) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); // draw a real piece
	context.closePath();
	//use gradient to make pieces looks better
	let gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j *
		30 - 2, 0);
	if (blackPiece) {
		//gradient for black pieces
		gradient.addColorStop(0, '#0a0a0a');
		gradient.addColorStop(1, '#8e8e8e');
		//set the board status to 3
		chessBoard[i][j] = 3;
	} else {
		//gradient for white pieces
		gradient.addColorStop(0, '#d1d1d1');
		gradient.addColorStop(1, '#f9f9f9');
		//set the board status to 4
		chessBoard[i][j] = 4;
	}
	context.fillStyle = gradient; //change the fill color
	context.fill(); //fill the real piece
}

const startGameRegex = /[1-9][0-9]{4}/;

/**
 * getGameID() gets the gameID for the current game.
 */
function getGameID() {
	let xhttp = new XMLHttpRequest();
	let url = '/startGame';  // The GET url
	xhttp.open('GET', url, true);
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			// Unpackage the parameters
			if(this.responseText == null) {  // Do nothing if the response does not exist
				throw 'No gameID was received from the server!'
			}
			if(!this.responseText.match(startGameRegex)) {  // Do nothing if the response is malformed
				throw 'A malformed gameID was received from the server!';
			}

			console.log('Received gameID :' + this.responseText);

			gameId = this.responseText;
			document.title = gameId;
		}
	}
	xhttp.send();
}

/**
 * cleanPre() function will clean up the current preview piece, and set the board status to 0.
 * 
 * @param {*} X is the value of the current preview piece x-coordinate
 * @param {*} Y is the value of the current preview piece y-coordinate
 */
function cleanPre(X, Y) {
	//if the current preview piece exists
	if (X != null && Y != null) {
		//set the board status to 0
		chessBoard[X][Y] = 0;
		//Clears the area where the preview piece is located
		context.clearRect((X) * 30, (Y) * 30, 30, 30);
		context.beginPath();
		context.strokeStyle = '#000000'; //set the stroke color
		//Redraw the horzontal line in different situations
		//on the left side
		if (X == 0) {
			context.moveTo(X * 30 + 15, Y * 30 + 15);
			context.lineTo((X + 1) * 30, Y * 30 + 15);
		}
		//on the right side
		else if (X == 14) {
			context.moveTo(X * 30, Y * 30 + 15);
			context.lineTo((X + 1) * 30 - 15, Y * 30 + 15);
		}
		//normal
		else {
			context.moveTo(X * 30, Y * 30 + 15);
			context.lineTo((X + 1) * 30, Y * 30 + 15);
		}
		//Redraw the vertical line in different situations
		//on the top side
		if (Y == 0) {
			context.moveTo(15 + X * 30, Y * 30 + 15);
			context.lineTo(15 + X * 30, Y * 30 + 30);
		}
		//on the botton side
		else if (Y == 14) {
			context.moveTo(15 + X * 30, Y * 30);
			context.lineTo(15 + X * 30, Y * 30 + 15);
		}
		//normal
		else {
			context.moveTo(15 + X * 30, Y * 30);
			context.lineTo(15 + X * 30, Y * 30 + 30);
		}
		context.stroke();
		//set the x, y coordinate of the current preview piece to null
		preX = null;
		preY = null;
	}
}
/**
 * WinJudge function will determine win based on the coordinates of the last piece placement.
 * With five pieces of the same color on any horizontal, vertical, or diagonal line, the corresponding color wins
 * 
 * @param {*} x is the value of the current preview piece x-coordinate
 * @param {*} y is the value of the current preview piece y-coordinate
 */
function WinJudge(x, y) {
	//count the win 
	let count = 1;
	//istance of which color is judged now
	let color = 3;
	if (!blackPiece) {
		color = 4;
	}
	//horizontal line judge
	//count the pieces of the same color to the left of the last piece
	for (let i = x - 1; i >= x - 4 && i >= 0; i--) {
		if (color == chessBoard[i][y]) {
			count++;
		} else {
			break;
		}
	}
	//count the pieces of the same color to the right of the last piece
	for (let i = x + 1; i <= x + 4 && i <= 14; i++) {
		if (color == chessBoard[i][y]) {
			count++;
		} else {
			break;
		}
	}
	//return true if the count greater or equal than 5
	if (count >= 5) {
		return true;
	}


	//vertical line judge
	count = 1;
	//count the pieces of the same color to the top of the last piece
	for (let j = y - 1; j >= y - 4 && j >= 0; j--) {
		if (color == chessBoard[x][j]) {
			count++;
		} else {
			break;
		}
	}
	//count the pieces of the same color to the bottom of the last piece
	for (let j = y + 1; j <= y + 4 && j <= 14; j++) {
		if (color == chessBoard[x][j]) {
			count++;
		} else {
			break;
		}
	}
	//return true if the count greater or equal than 5
	if (count >= 5) {
		return true;
	}
	//main-diagonal judge(top left to bottom right)
	count = 1;
	//count the pieces of the same color to the top left of the last piece
	for (let i = -1; i >= -4 && x + i >= 0 && y + i >= 0; i--) {
		if (color == chessBoard[x + i][y + i]) {
			count++;
		} else {
			break;
		}
	}
	//count the pieces of the same color to the bottom right of the last piece
	for (let i = 1; i <= 4 && x + i <= 14 && y + i <= 14; i++) {
		if (color == chessBoard[x + i][y + i]) {
			count++;
		} else {
			break;
		}
	}
	if (count >= 5) {
		return true;
	}
	//antidiagonal judge(top right to bottom left)
	count = 1;
	//count the pieces of the same color to the top right of the last piece
	for (let i = 1; i <= 4 && x + i <= 14 && y - i >= 0; i++) {
		if (color == chessBoard[x + i][y - i]) {
			count++;
		} else {
			break;
		}
	}
	//count the pieces of the same color to the bottom left of the last piece
	for (let i = 1; i <= 4 && x - i >= 0 && y + i <= 14; i++) {
		if (color == chessBoard[x - i][y + i]) {
			count++;
		} else {
			break;
		}
	}
	if (count >= 5) {
		return true;
	}
	//return false if the count less than 5
	return false;
}
