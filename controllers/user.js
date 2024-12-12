const user = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req,res) => {
    const { username, email , password } = req.body.user;

    await user.create({
        username: username,
        email: email,
        password: password
    }).then(
        console.log("user created")
    )

    res.status(200).send({
        message: "You're all set! Log in now to begin your Highnest journey."
    })
}

const loginUser = (req, res) => {
    const { username, password } = req.body.user;

    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign({
        username: username,
        password: password
    }, secretKey , {expiresIn: '7d'});

    res.status(200).send({
        token: token,
        message: "Login Successful"
    })
}

const getUser = (req,res) => {
    console.log("reached here")
    const user = req.user;

    res.json({
        user: user
    })
}

module.exports = {registerUser, loginUser , getUser }