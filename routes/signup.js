const express = require('express');
const router = express.Router();
const {checkUser} = require('../middlewares/user')
const {registerUser} = require('../controllers/user')

router.post('/', checkUser, registerUser);

module.exports = router;