#!/usr/bin/env node
require('dotenv').config();
const http = require('http');
const io = require('socket.io');

const server = http.createServer((req, res) => {
    if (req.url == '/test') {
        res.write('works')
        res.end()
    }
});

const socketServer = io(server, {
	cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

socketServer.on('connection', (socket) => {
    console.log('client connected');
    socket.on('send', (data) => {
        socketServer.emit('message', data);
        console.log(data);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
