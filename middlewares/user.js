const user = require('../models/user')

const checkUser = async (req, res, next) => {
    const username = req.body.user.username;
    const email = req.body.user.email;


    const registeredUser = await user.find({
        $or: [
            {username: username} , 
            {email: email}
        ]
    })

    if(registeredUser.length != 0)
    {
        res.status(400).send({
            message: 'user already exists',
        })
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailPattern.test(email))
    {
        res.status(400).send({
            message: 'invalid email'
        })
    }

    next();
}

module.exports = {checkUser}