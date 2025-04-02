require('dotenv').config();
require('./connection/connection')
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const user = require('./models/user');
const { friendRequest } = require('./models/friendRequest');
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

server.listen(process.env.PORT, () => { });

io.on('connection', async (socket) => {
    const userID = socket.handshake.query["userID"];
    const socketID = socket.id;


    if (userID) {
        try {
            await user.findByIdAndUpdate(userID, { socketID: socketID, isOnline: true });
            const currentUser = await user.find({ _id: userID }).populate('friends');

            currentUser[0].friends.map(e => {
                io.to(e.socketID).emit("is_online", {
                    _id: userID
                })
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    socket.on("friend_request", async (data) => {
        try {
            const to = await user.findById(data.to).select("socketID friends");
            const from = await user.findById(data.from).select("socketID");

            const isFriendRequest = await friendRequest.find({
                sender: data.from,
                recipient: data.to
            })


            if (to.friends.includes(data.from) || isFriendRequest.length > 0 || !to || !from) {
                return;
            }

            await friendRequest.create({
                sender: data.from,
                recipient: data.to,
            })

            io.to(to.socketID).emit("new_friend_request", {
                from: data.from,
            })

            io.to(from.socketID).emit("sent_friend_request", {
                message: "Friend request sent successfully"
            })
        } catch (error) {
            console.log(error)
        }


    })

    socket.on("request_accepted", async (data) => {
        try {
            const to = await user.findById(data.to)
            const from = await user.findById(data.from);

            if (!to.friends.includes(from._id)) {
                to.friends.push(from._id);
            }

            if (!from.friends.includes(to._id)) {
                from.friends.push(to._id);
            }

            await to.save({ new: true, validateModifiedOnly: true });
            await from.save({ new: true, validateModifiedOnly: true });

            await friendRequest.deleteOne({
                sender: from._id,
                recipient: to._id,
            });

            io.to(to.socketID).emit("friends_now", {
                message: "friend made successfully"
            })

            io.to(from.socketID).emit("friends_now", {
                message: "friend made successfully"
            })

        } catch (error) {
            console.log(error)
        }

    })

    socket.on("request_declined", async (data) => {
        try {
            const to = await data.findById(data.to).select('_id');
            const from = await data.findById(data.from).select('_id');

            await friendRequest.deleteOne({
                sender: from,
                reciever: to,
            })

            socket.to(to.socketID).emit("friends_rejected", {
                message: "Can't be friends"
            })

            socket.from(from.socketID).emit("friends_rejected", {
                message: "Can't be Friends"
            })
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('disconnect', async () => {

        try {

            const onlineUsers = await user.find({ _id: userID }).populate('friends');
            await user.findByIdAndUpdate(userID, { isOnline: false });

            onlineUsers[0].friends.map(e => {
                io.to(e.socketID).emit("is_offline", {
                    _id: userID
                })
            })

        } catch (error) {
            console.log(error)
        }
    })

})

module.exports = { io }

require('./socket/socket')