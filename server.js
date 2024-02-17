const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");

const PORT = process.env.PORT || 5000; // Use the port defined in the environment or fallback to 5000

const io = socket(server);

server.listen(PORT, () => console.log(`SERVER IS running on port ${PORT}`));

// Rest of your socket.io server code...
