const { friendRequest } = require("../models/friendRequest");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body.user;

        await user.create({
            username: username,
            email: email,
            password: password
        })

        res.status(200).send({
            message: "You're all set! Log in now to begin your Highnest journey."
        })
    } catch (error) {
        console.log(error)
    }


}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body.user;

        const secretKey = process.env.SECRET_KEY;

        const userID = await user.find({ username: username, password: password }).select("_id");

        const token = jwt.sign({
            _id: userID,
        }, secretKey, { expiresIn: '7d' });

        res.status(200).send({
            token: token,
            message: "Login Successful"
        })
    } catch (error) {

    }

}

const fetchUsers = async (req, res) => {

    try {
        const userID = req.headers['authorization'].split(' ')[1];

        const users = await user.find({ _id: { $ne: userID } });

        res.status(200).send({
            users: users,
            message: "users fetched successfully"
        })
    } catch (error) {

    }

}

const fetchFriendRequests = async (req, res) => {
    try {
        const userID = req.headers['authorization'].split(' ')[1];

        const friendRequests = await friendRequest.find({ recipient: userID })
            .populate('sender', 'username _id')
            .populate('recipient', 'username _id')

        res.status(200).send({
            friendRequests: friendRequests,
            message: "requests fetched successful"
        })
    } catch (error) {

    }
}

const fetchCurrentUser = async (req, res) => {
    try {
        const userID = req.headers['authorization'].split(' ')[1];

        const currentUser = await user.findById(userID).populate('friends')

        res.status(200).send({
            currentUser: currentUser,
            message: "current user fetched successful"
        })
    } catch (error) {

    }

}

const getUser = (req, res) => {
    try {
        const userID = req.userID;

        res.json({
            userID: userID
        })
    } catch (error) {

    }
}

module.exports = {
    loginUser,
    registerUser,
    fetchFriendRequests,
    fetchUsers,
    getUser,
    fetchCurrentUser
}