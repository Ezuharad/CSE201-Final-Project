let preX = null;
let preY = null;

let chess = null;
let context = null;

export {cleanPre};
export {drawChessBoard};
export {drawOutline};
export {oneStep};
export {setPre};

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
 * drawOutline() function will place a red circle preview piece on the game board to let players can clearly see the position that
 * they want to place a piece. Black preview piece and White preview piece do not have visual differences. 
 * The board status will be changed based on the turn.
 * 
 * @param {*} i is the value of the x-coordinate
 * @param {*} j is the value of the y-coordinate
 */
 function drawOutline(i, j) {
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

function setPre(x, y) {
    if(x < 0 || x > 14 || y < 0 || y > 14) {
        return;
    }
    preX = x;
    preY = y;
}

/**
 * cleanPre() function will clean up the current preview piece, and set the board status to 0.
 */
 function cleanPre() {
	//if the current preview piece exists
	if (preX != null && preY != null) {
		//set the board status to 0
		chessBoard[preX][preY] = 0;
		//Clears the area where the preview piece is located
		context.clearRect((preX) * 30, (preY) * 30, 30, 30);
		context.beginPath();
		context.strokeStyle = '#000000'; //set the stroke color
		//Redraw the horzontal line in different situations
		//on the left side
		if (preX == 0) {
			context.moveTo(preX * 30 + 15, preY * 30 + 15);
			context.lineTo((preX + 1) * 30, preY * 30 + 15);
		}
		//on the right side
		else if (preX == 14) {
			context.moveTo(preX * 30, preY * 30 + 15);
			context.lineTo((preX + 1) * 30 - 15, preY * 30 + 15);
		}
		//normal
		else {
			context.moveTo(preX * 30, preY * 30 + 15);
			context.lineTo((preX + 1) * 30, preY * 30 + 15);
		}
		//Redraw the vertical line in different situations
		//on the top side
		if (preY == 0) {
			context.moveTo(15 + preX * 30, preY * 30 + 15);
			context.lineTo(15 + preX * 30, preY * 30 + 30);
		}
		//on the botton side
		else if (preY == 14) {
			context.moveTo(15 + preX * 30, preY * 30);
			context.lineTo(15 + preX * 30, preY * 30 + 15);
		}
		//normal
		else {
			context.moveTo(15 + preX * 30, preY * 30);
			context.lineTo(15 + preX * 30, preY * 30 + 30);
		}
		context.stroke();
		//set the x, y coordinate of the current preview piece to null
		preX = null;
		preY = null;
	}
}