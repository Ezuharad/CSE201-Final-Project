//instance of Is it player1's turn, true is black turn, and false is white turn.
var player1 = true;
//instance of chessBoard status
var chessBoard = [];

/**
 * Create a Nested Array to record the chessBoard status, all values will set as 0 at the first.
 * 0 means no piece here, 
 * 1 means a black preview piece here, 
 * 2 means a white preview piece here,
 * 3 means a black piece here,
 * 4 means a white piece here.
 */
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}
//instance of x, y coordinate of the current preview piece
let preX = null;
let preY = null;

let chess = null;
let context = null;

 // Regularly call server for updated pieces
setInterval(pullPiece, 500);

/**
 * This function will be called whenever a player clicks the board to place a piece.
 * Calls
 * @param {*} e 
 */
function clickToPlacePiece(e) {
	let x = e.offsetX;
	let y = e.offsetY;

	let i = Math.floor(x / 30);
	let j = Math.floor(y / 30);

	// If not piece already here
	if (chessBoard[i][j] == 0) {
		//clean the useless preview pieces before place a new one
		cleanPre(preX, preY);
		//place a new preview piece
		preStep(i, j, player1);
		//set the x, y coordinate of the current preview piece
		preX = i;
		preY = j;
	}
	else if(chessBoard[i][j] == 1 || chessBoard[i][j] == 2){
		pushPiece(i, j); // Push piece to server
		cleanPre(preX, preY); // clean the useless preview piece
		placePiece(i, j);
	}
}

/**
 * This function will call preStep() and oneStep() to place preview pieces and real pieces on the game board.
 * Called by clickToPlacePiece()
 * 
 * @param i is the row of the piece to be placed
 * @param j is the column of the piece to be placed
 */
function placePiece(i, j) {
	if(chessBoard[i][j] > 2) {
		return;
	}
	if (player1) {  //If there is already a black preview piece here
		//place a black piece here
		oneStep(i, j, player1);
		//Win judgement
		if (WinJudge(i, j, player1)) {
			//This part just use to test the function
			alert("Black Win!");
		}
		//turn changes
		player1 = false;
	} //If there is already a white preview piece here
	else {
		//place a white piece here
		oneStep(i, j, player1);
		//Win judgement
		if (WinJudge(i, j, player1)) {
			//This part just use to tese the function
			alert("White Win!");
		}
		//turn changes
		player1 = true;
	}
}

/**
 * Pulls a piece from the nodejs server using ajax. Called every half second by the 
 * client.
 */
function pullPiece() {
	let xhttp = new XMLHttpRequest();
	let url = '/pullPiece';  // The GET url
	xhttp.open('GET', url, true);
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			// Unpackage the parameters
			let pos = this.responseText.split('|');
			
			// Log that the piece was pulled
			console.log('Piece pulled: ' + this.responseText);

			// Place the piece for the user to see
			placePiece(pos[0], pos[1]);
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
	let params = '/' + i + '|' + j;  // Parameters are packaged by the client in x|y format
	xhttp.open('POST', url + params, true);
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200) {
		}
	}
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
	for (var i = 0; i < 15; i++) {
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
 * @param {*} player1 is which player's turn
 */
function preStep(i, j, player1) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 11, 0, 2 * Math.PI); // draw a preview piece
	context.closePath();
	if (player1) { // set the stroke color
		context.strokeStyle = "#8e8e8e";
	} else {
		context.strokeStyle = "#f9f9f9";
	}

	context.stroke(); //stroke the preview piece
	//set the board status to 1 or 2 depend on which player's turn
	if (player1) {
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
 * @param {*} player1 is which player's turn
 */
function oneStep(i, j, player1) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); // draw a real piece
	context.closePath();
	//use gradient to make pieces looks better
	let gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j *
		30 - 2, 0);
	if (player1) {
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
 * @param {*} player1 is which player's turn
 */
function WinJudge(x, y, player1) {
	//count the win 
	var count = 1;
	//istance of which color is judged now
	var color = 3;
	if (!player1) {
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
	for (let i = -1; i >= -4 && x + i >= 0 && j + i >= 0; i--) {
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
