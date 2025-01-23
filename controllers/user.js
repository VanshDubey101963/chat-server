const { friendRequest } = require("../models/friendRequest");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { username, email, password } = req.body.user;

    await user.create({
        username: username,
        email: email,
        password: password
    })

    res.status(200).send({
        message: "You're all set! Log in now to begin your Highnest journey."
    })

}

const loginUser = async (req, res) => {
    const {username , password} = req.body.user;

    const secretKey = process.env.SECRET_KEY;

    const userID = await user.find({username: username}).select("_id");
    
    const token = jwt.sign({
        _id : userID,
    }, secretKey, { expiresIn: '7d' });

    res.status(200).send({
        token: token,
        message: "Login Successful"
    })
}

const fetchUsers = async (req,res) => {
    const userID = req.headers['authorization'].split(' ')[1];

    const users = await user.find({ _id: { $ne: userID } });
  
    res.status(200).send({
        users: users,
        message: "users fetched successfully"
    })
}

const fetchFriendRequests = async (req,res) => {
    const userID = req.headers['authorization'].split(' ')[1];
    
    const friendRequests = await friendRequest.find({recipient: userID});

    res.status(200).send({
        friendRequests: friendRequests,
        message: "requests fetched successful"
    })
}

 const fetchCurrentUser = async (req, res) => {
    const userID = req.headers['authorization'].split(' ')[1];

    const currentUser = await user.findById(userID)

    res.status(200).send({
        currentUser: currentUser,
        message: "current user fetched successful"
    })
 }

const getUser = (req,res) => {
    const userID = req.userID;

    res.json({
        userID: userID
    })
}

module.exports = {
    loginUser,
    registerUser,
    fetchFriendRequests,
    fetchUsers,
    getUser,
    fetchCurrentUser
}