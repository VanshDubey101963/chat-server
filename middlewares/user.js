const user = require('../models/user');
const jwt = require('jsonwebtoken');

const checkUser = async (req, res, next) => {
    const { username, email } = req.body.user;


    const registeredUser = await user.find({
        $or: [
            {username: username} , 
            {email: email}
        ]
    })

    if(registeredUser.length > 0)
    {

        res.status(400).send({
            message: 'User already exists! Please try logging in instead.',
        })
        return;
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailPattern.test(email))
    {
        res.status(400).send({
            message: 'Invalid email address! Please enter a valid email.'
        })
        return;
    }

    next();
}

const checkLoginUser = async (req, res, next) => {
    const { username , password }= req.body.user;
    const isuser = await user.find({
        username: username,
        password: password
    })

    if(isuser.length == 0)
    {
        res.status(400).send({
            message: "We couldn't find an account with that email. Please try again."
        })
        return;
    }

    next();

}

const checkToken = (req,res,next) => {
    const token = req.headers['authorization'].split(' ')[1];
    const secretKey = process.env.SECRET_KEY;

    jwt.verify(token , secretKey, (err, userID)=>{
        if(err)
        {
            res.status(401).send({
                message: "Unauthorized user!",
            })

            return;
        }

        req.userID = userID;

        
        next();
    });
   
}

module.exports = { checkUser, checkLoginUser, checkToken }