require('dotenv').config();
require('./connection/connection')
const express = require('express');
const cors = require('cors');
const {Server} = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin: process.env.CLIENT_URL,
        methods: ['GET','POST']
    }
});

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
}));
app.use(express.json())
app.use('/signup', require('./routes/signup'));

server.listen(process.env.PORT, () =>{
    console.log(`server running at ${process.env.PORT}`)
});

module.exports = {io}

require('./socket/socket')