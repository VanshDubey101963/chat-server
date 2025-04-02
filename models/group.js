const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({
    members: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        }
    ],

    avatar: {
        type: String,
    },

    description: {
        type: String
    }
    

})

const group = mongoose.model("groups", groupSchema)

module.exports = group