const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const signup = require('./routes/signup');

require('dotenv').config();

const port = process.env.PORT;


server.listen(port, () =>{
    console.log(`server running at ${port}`)
});

module.exports = {io}

require('./socket/socket')