const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String
    },

    socketID: {
        type: String
    },

    isOnline: {
        type: Boolean,
        default: false,
    },

    friends: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'users'
        }
    ],

});

const user = mongoose.model('users', userSchema);

module.exports = user