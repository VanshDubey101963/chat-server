const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL).catch(e => { console.log(e) })
module.exports = mongoose