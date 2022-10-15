const express = require("express")();
const PORT = 9999

express.get("/", (req, res) => res.send("Hello, World!"));

express.listen(PORT, ()=>console.log("Listening on port 9999"));
