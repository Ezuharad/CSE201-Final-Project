const express = require('express');
const fs = require('fs');
const http = require('http');

const app = express();

const dataDir = '/home/node/app/data/state.txt';
const PORT = 9999

// Grant access to public directory
app.use(express.static('public'));

app.get('/pullPiece', (req, res) => {
    let returnData;

    fs.readFile(dataDir, 'utf8', function(error, data) {
        if(error) {
            res.sendStatus(500);
            console.log('An error ocurred in pullPiece:');
            console.log(error);
            throw error;
        }
        console.log('Pulled piece ' + data + '.');
        returnData = data;
    })
    res.send(returnData);
})

// Pushpiece function
app.post('/pushPiece/:pos', (req, res) => {
    let pos = req.params.pos.split('|');
    let i = pos[0];
    let j = pos[1];
    fs.writeFile(dataDir, i + ' ' + j, error => {
        if(error) {
            res.sendStatus(500);
            console.log('An error ocurred in pushPiece:');
            console.log(error);
            throw error;
        }
    })

    console.log('Piece placed at ' + i + ', ' + j);
    res.send('Hello!');
})

// Start app
app.listen(PORT, function(error) {
    if(error) {
        console.log(error);
    }
    console.log('Express.js running on port ' + PORT);
})
