const express = require('express');
const fs = require('fs');
const http = require('http');

const app = express();

const dataDir = '/home/node/app/data/';
const PORT = 9999

// Grant access to public directory
app.use(express.static('public'));

/**
 * pullPiece GET route. Sends the user the data in the data directory.
 * Throws an error and shuts down the server if an error ocurrs while 
 * reading the file.
 */
app.get('/pullPiece', (req, res) => {
    fs.readFile(dataDir + '10000.txt', 'utf8', function(error, data) {
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
const reg = /[0-9]?[0-9]|[0-9]?[0-9]|[0-9]{5}/;

/**
 * pushPiece POST route. Updates data in the data directory.
 * Throws an error and shuts down the server if an error ocurrs 
 * while reading the file.
 */
app.post('/pushPiece/:pos', (req, res)  => {
    let pos = req.params.pos;
    if(pos == null) {
        console.log('A null piece was received in pushPiece');
        return;
    }
    if(!pos.match(reg)) {
        console.log('A malformed piece was received in pushPiece');
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
            throw error;
        }
    })

    console.log('Pushed piece to ' + logText[0] + ' ' + logText[1] + ' for game ' + logText[2]);
    res.send(null);
})

app.get('startGame', (req, res) => {
    let gameId = 10000 + Math.max(89999 * Math.random())
    res.send(gameId);
})

// Start the app on the specified port
app.listen(PORT, function(error) {
    if(error) {
        console.log(error);
    }
    console.log('Express.js running on port ' + PORT);
})
