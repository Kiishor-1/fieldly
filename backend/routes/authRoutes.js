const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const userValidator = require('../middlewares/userValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', userValidator, register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

module.exports = router;