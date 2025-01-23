require('dotenv').config();
require('./connection/connection')
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const user = require('./models/user');
const { friendRequest } = require('./models/friendRequest');
const { default: mongoose } = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
}));
app.use(express.json())
app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));
app.use('/users', require('./routes/users'))

server.listen(process.env.PORT, () => {
    console.log(`server running at ${process.env.PORT}`)
});

io.on('connection', async (socket) => {
    const userID = socket.handshake.query["userID"];
    const socketID = socket.id;

    if (userID) {
        await user.findByIdAndUpdate(userID, { socketID: socketID });
    }


    socket.on("friend_request", async (data) => {
        const to = await data.findById(data.to);


        await friendRequest.create({
            sender: data.from,
            recipient: to._id,
        })

        io.to(to.socketID).emit("new_friend_request", {
            from: data.from,
        })
    })

    socket.on("request_accepted", async (data) => {
        const to = await data.findById(data.to)
        const from = await data.findById(data.from);

        to.friends.push(from._id);
        from.friends.push(to._id);

        await to.save({ new: true, validateModifiedOnly: true });
        await from.save({ new: true, validateModifiedOnly: true });

        await friendRequest.deleteOne({
            sender: from._id,
            reciever: to._id,
        });

    })

    socket.on("request_declined", async (data) => {
        const to = await data.findById(data.to).select('_id');
        const from = await data.findById(data.from).select('_id');

        await friendRequest.deleteOne({
            sender: from,
            reciever: to,
        })
    })

})

module.exports = { io }

require('./socket/socket')