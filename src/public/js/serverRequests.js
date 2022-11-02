// Regex matching for pullPiece
const reg = /[0-9]?[0-9]|[0-9]?[0-9]/;

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
			if(this.responseText == null) {  // Do nothing if the response does not exist
				return;
			}
			if(!this.responseText.match(reg)) {  // Do nothing if the response is malformed
				return;
			}

			let pos = this.responseText.split('|');
			if(pos[0] > 14 || pos[1] > 14 || pos[0] < 0 || pos[1] < 0) {  // Verify indices
				return;
			}
			if(chessBoard[pos[0]][pos[1]] > 2) {  // Do nothing if the piece already exists
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
	let params = '/' + i + '|' + j + '|' + gameId;  // Parameters are packaged by the client in x|y format
	xhttp.open('POST', url + params, true);
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200) {
		}
	}
	xhttp.send(params); // Send the xhttp object with the parameters
}
