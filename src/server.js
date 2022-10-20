const express = require('express');
const fs = require('fs');
const http = require('http');

const app = express();

const dataDir = '/home/node/app/data/state.txt';
const PORT = 9999

// Grant access to public directory
app.use(express.static('public'));

/**
 * pullPiece GET route. Sends the user the data in the data directory.
 * Throws an error and shuts down the server if an error ocurrs while 
 * reading the file.
 */
app.get('/pullPiece', (req, res) => {
    fs.readFile(dataDir, 'utf8', function(error, data) {
        if(error) {
            res.sendStatus(500);
            console.log('An error ocurred in pullPiece:');
            console.log(error);
            throw error;
        }
        res.send(data);
    })
})

/**
 * pushPiece POST route. Updates data in the data directory.
 * Throws an error and shuts down the server if an error ocurrs 
 * while reading the file.
 */
app.post('/pushPiece/:pos', (req, res) => {
    let pos = req.params.pos;
    fs.writeFile(dataDir, pos, error => {
        if(error) {
            res.sendStatus(500);
            console.log('An error ocurred in pushPiece:');
            console.log(error);
            throw error;
        }
    })
    pos = pos.split('|');

    console.log('Pushed piece to ' + pos[0] + ' ' + pos[1]);
    res.send(null);
})

// Start the app on the specified port
app.listen(PORT, function(error) {
    if(error) {
        console.log(error);
    }
    console.log('Express.js running on port ' + PORT);
})
