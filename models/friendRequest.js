const mongoose = require('mongoose')


const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    }
})

const friendRequest = new mongoose.model("friendrequests", requestSchema);
module.exports = { friendRequest };