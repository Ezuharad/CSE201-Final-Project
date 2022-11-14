const express = require('express');
const fs = require('fs');
const http = require('http');

const app = express();

const dataDir = '/home/node/app/data/';
const PORT = 9999

// Grant access to public directory
app.use(express.static('public'));

const gameIDReg = /[1-9][0-9]{4}/
/**
 * pullPiece GET route. Sends the user the data in the data directory.
 * Throws an error and shuts down the server if an error ocurrs while 
 * reading the file.
 */
app.get('/pullPiece/:gameID', (req, res) => {
    let gameID = req.params.gameID;
    if(!gameID.match(gameIDReg)) {
        return;
    }
    fs.readFile(dataDir + gameID + '.txt', 'utf8', function(error, data) {
        if(error) {
            res.sendStatus(500);
            console.log('An error ocurred in pullPiece:');
            console.log(error);
            throw error;
        }
        res.send(data);
    })
})

// Regex matching for pushPiece
const pushPieceReg = /[0-1]?[0-9]\|[0-1]?[0-9]\|[1-9][0-9]{4}/;

/**
 * pushPiece POST route. Updates data in the data directory.
 * Throws an error and shuts down the server if an error ocurrs 
 * while reading the file.
 */
app.post('/pushPiece/:pos', (req, res)  => {
    let pos = req.params.pos;
    console.log(pos);
    if(pos == null) {
        console.log('A null piece was received in pushPiece');
        return;
    }
    if(!pos.match(pushPieceReg) && !pos.match(/w\|[1-8][0-9]{4}/)) {
        console.log('A malformed piece was received in pushPiece');
        return;
    }

    if(!pos.match(pushPieceReg)) {
        let logText = pos.split('|');
        console.log('A player has won game ' + logText[1]);

        fs.writeFile(dataDir + logText[1] + '.txt', 'w', error => {
            if(error) {
                res.sendStatus(500);
                console.log('An error ocurred in pushPiece:');
                console.log(error);
            }
        })
        res.send(null);
        return;
    }
    
    let logText = pos.split('|');
    if(logText[0] > 14 || logText[1] > 14 || logText[0] < 0 || logText[1] < 0) {
        console.log('A malformed piece was received in pushPiece');
        return;
    }

    fs.writeFile(dataDir + logText[2] + '.txt', pos, error => {  // Write a unique file for each game instance
        if(error) {
            res.sendStatus(500);
            console.log('An error ocurred in pushPiece:');
            console.log(error);
        }
    })

    console.log('Pushed piece to ' + logText[0] + ' ' + logText[1] + ' for game ' + logText[2]);
    res.send(null);
})

let nextID = 10000
let needsPartner = true;

/**
 * startGame GET route. Gives the client a gameID, and writes a new file in the Data directory 
 * so that pullPiece() doesn't cause issues.
 */
app.get('/startGame', (req, res) => {
    if(nextID == 99999) {  // Prevent an overflow error
        return;
    }
    res.send(200, nextID);
    
    if(needsPartner) {  // Send a new ID for every other player
        fs.writeFile(dataDir + nextID + '.txt', '', error => {
            if(error) {
                res.sendStatus(500);
                console.log('An error ocurred in startGame:');
                console.log(error);
                throw error;
            }
        });
        needsPartner = false;
    }
    else {
        nextID += 1;
        needsPartner = true;
    }
})

// Start the app on the specified port
app.listen(PORT, function(error) {
    if(error) {
        console.log(error);
    }
    console.log('Express.js running on port ' + PORT);
})
