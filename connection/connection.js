const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL).then( () => {
    console.log("Mongo connection successfull")
}).catch(e => {
    console.log("error connecting to mongodb")
})

module.exports = mongoose