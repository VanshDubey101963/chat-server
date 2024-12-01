const user = require("../models/user");

const registerUser = async (req,res) => {
    const username = req.body.user.username;
    const email = req.body.user.email;
    const password = req.body.user.password;

    await user.create({
        username: username,
        email: email,
        password: password
    }).then(
        console.log("user created")
    )
}

module.exports = {registerUser}