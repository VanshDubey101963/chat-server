const express = require('express');
const router = express.Router();
const { fetchUsers , fetchFriendRequests , fetchCurrentUser} = require("../controllers/user")

router.get('/fetchUsers', fetchUsers);
router.get('/fetchRequests', fetchFriendRequests);
router.get('/fetchCurrentUser', fetchCurrentUser)

module.exports = router;