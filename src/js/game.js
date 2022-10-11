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

/**
 * This function will automatically called when the user clicks.
 * The clicked position will be catched, and
 * This function will call preStep() and oneStep() to place preview pieces and real pieces on the game board.
 * 
 * @param {Object} e is the Point clicked by the player's mouse 
 */
function placePiece(e) {
	//catch the click position
	let x = e.offsetX;
	let y = e.offsetY;
	/**
	 * Transfer the click position to the x, y coordinate of the game board. 
	 * Inaccurate clicks automatically move to the nearest game board coordinates	
	*/
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
		
	} //If there is already a black preview piece here
	else if (chessBoard[i][j] == 1) {
		//clean the useless preview piece
		cleanPre(preX, preY);
		//place a black piece here
		oneStep(i, j, player1);
		//turn changes
		player1 = false;
	} //If there is already a black preview piece here
	else if (chessBoard[i][j] == 2) {
		//clean the useless preview piece
		cleanPre(preX, preY);
		//place a white piece here
		oneStep(i, j, player1);
		//turn changes
		player1 = true;
	}
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
	if(player1) { // set the stroke color
		context.strokeStyle = "#8e8e8e";
	} else {
		context.strokeStyle = "#f9f9f9";
	}

	context.stroke();//stroke the preview piece
	//set the board status to 1 or 2 depend on which player's turn
	if (player1) {
		chessBoard[i][j] = 1; //if the turn is black, set the board status to 1
	} else {
		chessBoard[i][j] = 2;//if the turn is white, set the board status to 2
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
