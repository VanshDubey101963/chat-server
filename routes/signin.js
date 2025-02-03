const express = require('express');
const router = express.Router();
const { checkLoginUser, checkToken } = require('../middlewares/user')
const { loginUser, getUser } = require('../controllers/user')


router.post('/', checkLoginUser, loginUser);
router.get('/protectedData', checkToken, getUser);

module.exports = router;